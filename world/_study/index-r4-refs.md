# Round 4 reference study: folio-2025, folio-2019, Messenger

Source: fresh clones of github.com/brunosimon/folio-2025 (HEAD 2026-04-07) and folio-2019, read file by file.
Paths below are relative to each repo. Numbers are verbatim from source.

## TL;DR for the builder (most useful first)

1. **Bruno 2025's touch control is NOT a screen-space stick.** It is a ring drawn *on the ground around the car* (`sources/Game/Inputs/Nipple.js`). You touch anywhere; the touch is raycast to the ground plane at car height; the angle from car to touch point vs the *car's heading* gives steering, distance from car gives throttle. Because it is car-relative in world space, it is correct no matter where the camera is. (Details in 1.2.)
2. **Throttle curve on touch is cubic:** `accelerating = progress^3` (Player.js). Gentle near the car, full at the ring edge.
3. **Steering is binary on keyboard (-1/0/+1) times a fixed wheel angle `steeringAmplitude = 0.5` rad** (~29 deg). No speed-dependent steering in code; the raycast-vehicle tyre friction (`frictionSlip 0.9`, `sideFrictionStiffness 3`) makes high speed naturally understeer/drift.
4. **Top speed is a soft cap:** `engineForce = input * 300 / (1 + max(0, speed - topSpeed))`; `topSpeed 5`, boost `40` (boost = Shift, x3 force). Coasting applies `idleBrake 0.06 * 35`; pressing opposite direction above 0.5 m/s brakes with `0.4 * 35` and zero engine force, only then reverses.
5. **Camera never rotates with the car.** Fixed isometric angle (`phi = 0.27 PI`, `theta = 0.25 PI`, FOV 25), follows a smoothed focus point with `lerp(delta*10)`; radius 15..30 by zoom ratio; zooms OUT by up to 40% of range as speed goes 5 -> 40 (smoothstep). Keyboard "up" is always car-forward; touch is car-relative; nothing depends on camera heading.
6. **Auto flip-back:** if upside-down (ratio > 0.3) for 3 s, apply up impulse `5*mass` + torque; repeat until upright. "Stuck" (<0.5 m travelled in 3 s while throttling) shows an on-screen "unstuck" button that respawns at the nearest respawn behind a fade overlay.
7. **Jump = suspensions**: Space sets all 4 suspensions to `high` (rest length 1.63, stiffness 40) vs `low` (0.88, 20). On touch, a *tap inside the inner ring (on the car)* is a jump (200 ms high suspension).
8. **Engine sound**: one looping idle sample; `volume = max(0.05, |accel|*0.5*(1+boost)*0.8)` eased up x10 / down x2.5; `rate = remapClamp(|accel|*0.5*(1+boost), 0,1, 0.6,1.1)` eased x5. Pitch follows *throttle*, not speed. A second "spin/wind" loop follows speed: `vol = clamp(speed*0.1)*0.3`, `rate 1..2`.


9. **Why a camera-relative stick fails with a chasing camera**: both references avoid it. Bruno 2019 maps the stick to a world heading using a *constant* camera yaw (`+0.18 PI`), and 2025 maps the touch car-relative, because their cameras never yaw. Messenger's camera does yaw, but it auto-centres slowly behind the walker. If the camera yaw chases the car quickly, the stick's world direction changes every frame and the car circles. Fix it with the car-relative ring (item 1), or latch the camera yaw at touch start.
10. **Settings in the references are tiny.** Bruno 2025's Options are Audio (toggle), Quality (High/Low), "I'm stuck! -> Respawn", "Reset" (props), plus status pills, laid out as a label/button table with tooltips inside a tabbed menu (Home, Options, Controls with 3 input tabs, Achievements, Circuit). Achievement toasts are top-centre cards that bounce in with `cubic-bezier(0.4,1.6,0.65,1)` over 0.6 s, stay 4 s with a shrinking 2px bar, and come with confetti and a chime.
11. Props (2019): brick walls on a grid with 1.05 x 0.45 spacing and +-0.2 rad jitter, brick mass 0.5; 10 bowling pins (mass 0.1) and a ball (mass 1); everything asleep until hit, plus a "reset" floor pad. Konami code rains 3^n lemons (with a swipe version on touch).
12. Messenger: the touch joystick floats where the finger lands; the camera up is the surface normal and it auto-centres behind the walker; NPCs walk, talk in speech bubbles, have name tags and floating markers and 3D sound; players talk to each other only in emojis.

---

# 1. folio-2025 (github.com/brunosimon/folio-2025)

Stack: three/webgpu + TSL, Rapier (`createVehicleController`, a raycast vehicle), gsap. World units are metres. Vehicle local forward is **+X**, side is +Z.

## 1.1 Vehicle physics and feel (`sources/Game/Physics/PhysicsVehicle.js`)

```js
this.steeringAmplitude = 0.5      // rad of front-wheel angle at full input (~29 deg)
this.engineForceAmplitude = 300
this.boostMultiplier = 2           // force x (1 + boost*2) = x3 when boosting
this.topSpeed = 5                  // m/s soft cap (18 km/h!) -- world is small, camera is close
this.topSpeedBoost = 40
this.brakeAmplitude = 35
this.idleBrake = 0.06              // coasting drag when no throttle
this.reverseBrake = 0.4            // brake used when pressing opposite of travel
suspensionsHeights   = { low: 0.88, mid: 1.23, high: 1.63 }   // rest length
suspensionsStiffness = { low: 20,   mid: 30,   high: 40 }
```
Chassis: cuboid half-extents 1.3 x 0.4 x 0.85, mass 2.5, **centre of mass lowered to y = -0.5** (keeps it from rolling), friction 0.4, plus a massless bumper box 1.5 x 0.5 x 0.9 for pushing props.
Wheels: offset x 0.90, z 0.75, radius 0.4, `frictionSlip 0.9`, `sideFrictionStiffness 3`, `maxSuspensionForce 150`, `maxSuspensionTravel 2`, `suspensionCompression 10`, `suspensionRelaxation 2.7`. All 4 wheels driven, only front 2 steer.

Per tick (pre-physics):
```js
const topSpeed = lerp(this.topSpeed, this.topSpeedBoost, player.boosting)
const overflowSpeed = Math.max(0, this.speed - topSpeed)
let engineForce = (player.accelerating * (1 + player.boosting * this.boostMultiplier))
                  * this.engineForceAmplitude / (1 + overflowSpeed) * dt
let brake = player.braking
if(!player.braking && Math.abs(player.accelerating) < 0.1) brake = this.idleBrake
// pressing against the direction of travel: brake first, no engine, then reverse once slow
if(this.speed > 0.5 && ((acc > 0 && !goingForward) || (acc < 0 && goingForward))) {
    brake = this.reverseBrake; engineForce = 0
}
brake *= this.brakeAmplitude * dt
const steer = player.steering * this.steeringAmplitude      // no speed scaling
```
`goingForward = direction.dot(forward) > 0.5`. Speed is measured from position delta / dt.
- Ice: on frozen water frictionSlip lerps 0.9 -> 0.04 (so drift = lower frictionSlip).
- Physics step: fixed 1/60 on low quality, else `min(1/60, deltaAverage)`.
- Brake key (B / Ctrl) zeroes throttle and sets braking = 1.

**Stop/start hysteresis**: `stop` event below 0.04 m/s, `start` above 0.7 (used for sounds/particles).

**Upside-down + auto flip** (`setUpsideDown`, `setFlip`, `Player.setUnstuck`): `upsideDownRatio = up.dot(-Y)*0.5+0.5`; >0.3 = upside down. After **3 s** still upside down -> `flip.jump()`:
```js
impulse = (0, 1, 0) * 5 * mass
if upside down: torqueImpulse = (0.8*mass, 0, 0) in local frame
else (on side): torqueImpulse = (sidewardDot*0.4*mass, 0, -forwardDot*0.8*mass) local
```
then re-test every 3 s until upright.
**Stuck**: rolling window of 3 s while |throttle| > 0.5; if distance < 0.5 m -> show an on-screen **"Unstuck"** button (`InteractiveButtons`), which calls `respawn()`.
**Respawn** (`Player.respawn`, `Respawns.js`): fade overlay in, `moveTo` the **closest named respawn** (placed in a GLB, y = 4 so it drops in), zero lin/ang velocity, fade out. Key R / gamepad Select. Also in the menu as "I'm stuck! [Respawn]".
**Flip trick detection**: while all 4 wheels off ground accumulate roll/pitch; on landing with |pitch| < 1 and |roll| > 5 rad -> 'frontFlip'/'backFlip' achievement.

**Jump / hydraulics**: Space = all four suspensions `high` for as long as held; numpad keys / 1-4 raise single corners to `mid` ("Lowrider"). Honk (H) briefly kicks one random wheel to `mid` for 0.15 s -- the car *bounces* when honking.

## 1.2 Input (`sources/Game/Inputs/*`, `Player.setInputs`)

Actions are named, grouped by category (`wandering`, `racing`, `cinematic`, `menu`) and filtered by mode:
| action | keys | gamepad |
|---|---|---|
| forward | ArrowUp, W | d-pad up, R2 |
| backward | ArrowDown, S | d-pad down, L2 |
| left/right | Arrow/A/D | d-pad, left stick X (`safeX`, deadzoned) |
| boost | Shift L/R | Circle/B |
| brake | B, Ctrl L | Square/X |
| jump (suspensions) | Space, Numpad5 | Triangle/Y |
| respawn | R | Select |
| interact | Enter, E, F | Cross/A |
| honk | H | L3 |
| map | M | |
| mute | L | |
| zoom | mouse wheel | R3 toggles near/far |
Gamepad right stick pans the camera focus (`20 m/s`), which snaps back on any drive input (magnet, see 1.3). Gamepad triggers are analog -> `action.value`, so throttle is analog on pads.

**Keyboard steering is digital**: `steering = (+1 left) + (-1 right)`; physically smoothed only by the tyre model. **Left stick overrides only when no key steer.**

**Touch ("nipple", `Inputs/Nipple.js`)** -- the key idea:
- A ring mesh lies on the ground centred on the car (inner radius **2 m**, outer **4.5 m**), rotated with the car's heading. Visible only while touching.
- One finger anywhere: raycast from camera through the finger to a horizontal plane at car height. `targetAngle = atan2(hit.z - car.z, hit.x - car.x)`, `progress = clamp((dist - 2) / (4.5 - 2), 0, 1)`.
- `forwardAmplitude = 1.5 PI` (270 deg!): if the finger is within +-135 deg of the car's nose it's **forward**, else **reverse** (only the rear 90 deg wedge reverses).
- Player: 
```js
accelerating = progress ** 3
const n = |smallestAngle(carAngle, targetAngle)| / ((2PI - forwardAmplitude)/2)   // /(PI/4)
steering = -min(n, 1) * sign(smallestAngle)      // full lock once finger is 45 deg off the nose
if(!forward) { accelerating *= -1; steering *= -1 }
```
  So: **the finger points where you want to go, but in world space relative to the car**, and steering saturates at 45 deg off-heading. The car turns toward the finger and stops turning once it faces it (self-correcting; no oscillation because the camera doesn't rotate).
- Tap inside the inner 2 m radius (on the car) = jump (suspensions high for 200 ms, ring animates up 1 m in 0.1 s then back in 0.6 s).
- Two fingers = camera pan/zoom (nipple deactivates on 2nd touch). Camera re-tracks the car after the finger is held 5 frames (avoid stealing a pinch).
- Ring shader: fill alpha 0.75, outline 0.35; the outer edge is only drawn over the forward 270 deg arc; the progress fill is a wedge from the nose to the finger angle; brightness x1.5 at full throttle.
- Contextual big DOM buttons appear only when relevant: **Interact**, **Unstuck**, previous/next/open/close (`.js-touch-buttons`). No permanent on-screen pedals.

Controls help lives in the menu "Controls" tab with three tabs: *Mouse Keyboard*, *Mobile Tablet*, *Gamepad* (gamepad shows Xbox letters or PlayStation shapes depending on detected pad). Touch tab text: "One finger - Move the car", "Two fingers - Move camera / zoom", "Tap (on the car) - Jump".

## 1.3 Camera (`sources/Game/View.js`)
- PerspectiveCamera **FOV 25**, near 0.1, far 200 (long lens = toy/diorama look).
- Spherical offset from focus point: `phi = 0.27 PI` (0.31 PI on low quality), **`theta = 0.25 PI` fixed** -- the camera never yaws with the car.
- Radius = `lerp(15, 30 + 9*ratioOverflow, 1 - zoomRatio)`; base zoomRatio 0.6; mouse wheel changes it by 0.05/notch, clamped 0..1; `ratioOverflow = max(1, (16/9)/aspect) - 1` pushes the camera back on portrait phones.
- **Speed zoom-out**: `zoomRatio += -0.4 * smoothstep(focusSpeed, 5, 40)`, then `smoothedRatio = lerp(smoothed, ratio, dt*10)` (high quality only).
- Follow: `smoothed = smoothed.lerp(focus, dt*10)` (about 100 ms lag). When the user pans (drag/right stick), tracking stops; a "magnet" pulls it back: `pos += dist*0.25 * delta * dt` (stronger when further). Any drive action sets `isTracking = true` again.
- **Camera roll kick** (spring): `roll.velocity = -roll*100*dt; speed += velocity; roll += speed*dt; speed *= 1 - 4*dt`; `kick(strength)` sets speed = +-strength -- used for explosions/impacts. Cheap juice.
- Speed lines (screen-space) at strength 1 when boosting and speed > 15.

## 1.4 Options / menu (`sources/Game/Options.js`, `Menu.js`, `index.html`, `style/menu.styl`, `options.styl`)
- Menu trigger: 44x44 tab stuck to the **right edge, top 20px**, red radial gradient `#C21515 -> #46123B`, 3-line burger; on hover it slides out 4px; hidden (slides off right) whenever the menu/modal/cinematic is up.
- Menu = centered panel, `min(1000px, 100% - 120px)` x `min(600px, 100% - 120px)`; portrait: `min(600px, 100%-20px)` wide, 80vh. Left column (50%) is a **preview image** per section, right column is content; portrait stacks preview (30% height) on top. Dark gradient `#251f2b -> #1d1721`, white text, fade 0.3s. Closes on backdrop click, close button (shows "A" glyph when a pad is used), Escape; gamepad L1/R1 cycles sections.
- Left rail of **icon buttons**: Home, **Options (gear)**, Controls (gamepad), Achievements (medal), Circuit (wheel), Whispers, Behind the scene (?).
- **Options is tiny** -- a 2-column table, label left / small button right, each button has a hover tooltip:
  | Audio | icon toggle (on/off svg), tooltip "Toggles sound" |
  | Quality | text button `High`/`Low`, "Toggles some effects" |
  | I'm stuck! | `Respawn`, "Teleports you to the closest respawn" |
  | Reset | `Reset`, "Resets every object" |
  | Renderer | status pill WebGPU (green) / WebGL (red) |
  | Server | Online/Offline pill |
  No sensitivity slider, no camera setting: Bruno keeps it minimal. Quality `level 0` (high) vs `1` (low): low -> fixed 1/60 physics, camera phi 0.31 PI, no speed zoom, fewer effects.
- Fonts: **Amatic SC 700** for titles (2.5rem), Nunito 400/700/900 body at 20px (18px < 520px, 16px < 440px).

## 1.5 Achievements + toasts (`sources/data/achievements.js`, `Achievements.js`, `Notifications.js`, `style/notifications.styl`)
Kinds (38 total; `[group, title, description, targetCount, unique?]`) -- funny titles, one-line descriptions:
- Exploration: leave landing ("I'm going on an adventure!"), visit every area (13), view every project / lab item, go to sea ("Under the sea"), reach 15 m high ("Limit the sky"), waterfall ("Gamer instinct: What did you expect? A treasure?").
- Driving stunts: upside down ("Turtle"), front flip ("Teeth first"), back flip ("Flip of faith"), use hydraulics x4 ("Lowrider"), honk x10.
- Destruction: blow up 20 crates, bowling strike, knock latrine, tear statue down, sacrifice at altar, **"Clean your room": press Reset**.
- Time/distance: drive 1/10/100 km, spend a full day cycle ("Don't you have work to do?").
- Circuit: finish a race, finish < 30 s ("KA-CHOW!"), leaderboard.
- Weather: witness snow, rain, get hit by lightning.
- Secrets: Konami code ("Up up down down...", "You know the rest."), open debug UI, "Hacker: This one can't be achieved."
Unlock = achieve sound ("Money Reward 2.mp3") + **3 confetti bursts at the car** + toast.
Toast: top-centre, width `min(350px, 100% - 40px)`; dark gradient card, padding 12/20/15/15; title in Amatic SC 1.7rem **lime `#d5ff95`**, right side "check-icon N / N"; description 16px white; a **2px time bar on top that scales X from 1 to 0 over 4 s** (pauses on hover). Enters `translateY(-100%-20px) -> 0` over **0.6s cubic-bezier(0.4, 1.6, 0.65, 1)** (overshoot bounce); leaves by scaling to 0 with `cubic-bezier(0.42,0,0.47,-0.55)` 0.45s. One at a time, queue, dedupe by id. Click opens the achievements menu. Progress is also saved in localStorage (we can't; keep for the visit).

## 1.6 Circuit / time trial (`sources/Game/World/Areas/CircuitArea.js`)
- States PENDING -> STARTING -> RUNNING -> ENDING. Start from an interactive point (Interact button / Enter) or menu "Restart"; R restarts during a race.
- Restart: fade overlay; teleport to start; reset props; **force clear weather and golden hour** (dayCycle progress 0.85) so every run looks the same; show timer; lock player.
- Countdown: 3 beeps 2 s apart ("countdown1") with a starting-light mesh stepping, then "countdown2" and lights go green -> unlock player, start timer.
- Checkpoints: gates (segment a-b across the road, width = scale). Reached when the segment intersects a circle of **radius 2** around the car. Only the *target* gate counts; target gate is a mint `#32ffc1` animated diagonal-stripe plane fading upward (alpha = 1 - uv.y); reached gate flashes; confetti at both gate posts; checkpoint sound pitch rises with count (`play(reachedCount)`). Finish = start line after all gates (`reachedCount === count + 2`).
- Timer: a 3D canvas-texture label floating above the car at y 2.5, following it with `lerp(dt*5)`, format `MM:SS:mmm` (`utilities/time.js timeToRaceString`). Split timings stored per gate.
- Finish: fanfare + applause, 4 s later fade and return to the circuit respawn; end modal with time + Restart; podium.

## 1.7 Weather and day cycle (`sources/Game/Cycles/DayCycles.js`, `Weather.js`, `Wind.js`)
- **Day length 4 min** (`super('Day Cycles', 4 * 60)`). Keyframes by progress 0..1: day 0-0.15, dusk 0.25, night 0.35-0.6, dawn 0.8, day 0.9. Intervals: `night` 0.25-0.7, `deepNight` 0.35-0.6 (events fire on enter/leave -> lamps on, crickets fade in over 15 s, rooster at dawn).
- Presets (each lerped): 
  - day: light `#ffd2c2` x1.2, shadow `#6d3fff`, fog `#00ffff -> #9b89ff`
  - dusk: light `#ff8181` x1.2, shadow `#4e009c`, fog `#3e53ff -> #ff4ce4`
  - night: light `#3240ff` **x3.8**, shadow `#2f00db`, fog `#10266f -> #490a42`, fogNear -0.85
  - dawn: light `#ffa882` x1.2, shadow `#db004f`, fog `#f885ff -> #ff7d24`
  Note: shadows are *coloured* (purple), never black; night is blue-purple, not dark grey.
- Weather is **deterministic noise of day progress** (no randomness, no timers): `noise(x) = sin(x)*sin(1.678x)*sin(2.345x)`.
  `temperature = year + day + noise(p*0.4)*7.5`; `humidity = year + noise(p*0.36)*0.2`; `clouds = noise(p*0.44)`; `wind = noise(p*1)*0.5+0.5`; `rain = remapClamp(humidity, 0.65, 1, 0, 1) * clamp(clouds)`; snow when rain and temp < 0. `override.start({...}, duration)` lerps any property to a forced value (used by the circuit to force clear skies).
- Wind (`Wind.js`): `angle = 0.6 PI`, direction = (sin, cos); `strength = remapClamp(weather.wind, 0,1, 0.1,1)`; `localTime += dt * 0.1 * strength`. Offset for any vertex at world xz:
  ```
  p = xz * 0.5
  n1 = perlin(p*0.2 + dir*localTime) - 0.5
  n2 = perlin(p*0.1 + dir*localTime*0.2) - 0.5
  offset = dir * (n1 + n2) * strength
  ```
  Grass: `vertex.xz += offset * tipness * height * 2` (only the tip vertex moves). Tree/bush foliage: rotate the leaf-card UV by `|offset| * 2.2` (cheap flutter with no vertex motion).
- Grass (`World/Grass.js`): one triangle per blade, 280x280 = 78 400 blades in a square that **wraps around the camera focus** (mod on position), blade width 0.1, height 0.6, billboarded to face camera, height modulated by perlin(xz*0.0321)+0.5 and by a terrain "grass" channel.
- Tracks (`Tracks.js`): 40 m top-down ortho render target (512 px) centred on car; each wheel draws an additive ribbon (128 points, sampled every 0.2 m / 1/30 s, width 0.5, fades over the back half); a 1.5 m wide body track too. The terrain and snow shaders sample it to **darken ground / flatten grass / carve snow**: these are the skid marks.
- Wind lines (`World/WindLines.js`): a white streak spawned every 0.3-2 s at a random spot in view, animated along the wind angle for `duration = remapClamp(wind, 0,1, 8,2)` s.
- Leaves (`World/Leaves.js`): GPU particles on the ground pushed by the car: within 0.5-2 m, `push = (vehicleVel*100 + radialDir*20) * speed`, plus wind lift. Rain lines: 2048 streaks.
- Pole lights / lanterns switch on in the `night` interval.

## 1.8 Sound (`sources/Game/Audio.js`, `Player.setSounds`) -- Howler
Vehicle layers (all loops started at volume 0, eased every frame):
| layer | volume | rate |
|---|---|---|
| engine idle loop | `max(0.05, |acc|*0.5*(1+boost)*0.8)`, ease up x10, down x2.5 | `remapClamp(|acc|*0.5*(1+boost), 0,1, 0.6,1.1)`, ease x5 |
| spin/wind (speed) | `clamp(speed*0.1)*0.3` | `1 + clamp(speed*0.1)` (1..2) |
| wheels on pebbles | `inAir(0..1) * min(1, speed*0.1) * 0.25` | 1 |
| skid/brake pebbles | `clamp(max((1-|fwdRatio|)*0.6, braking) * speed * 0.15 * wheelsInContact/4) * 0.4`, up x20 down x5 | 0.8 |
| boost hum | `(0.5+|acc|*0.5)*boost*0.3` | `0.95 + |acc|*2` |
| honk | loop; vol 0.5 while H held else 0 | |
| spring squeaks on landing | when >1 wheel touches within 0.2 s: vol `0.05 + n*0.02`/`0.05+n*0.1`, rate random | |
Impacts: volume `remapClamp(force, 0,200, 0,1)` (default) or `pow(remapClamp(force, 5,20, 0,1), 2)` (bricks/pins); rate `0.9 + rand*0.2`; `antiSpam 0.1 s`; positional with `distanceFade 20`.
Ambience: bird tweets every 0.5-5.5 s (50% chance, day only, vol 0.2-0.5, rate 1-1.7, placed 30 m away diagonally); owl every 30-90 s at night; rooster at dawn; wolf; **crickets fade to 0.65 over 15 s at night**; rain loop `remapClamp(rain, 0.1,0.6, 0,1)`; wind loop `pow(remapClamp(wind, 0.3,1, 0,1), 3)*0.7`; waves by distance to world edge `pow(remapClamp(d, 0,40, 1,0.1), 2)*0.7`.
Mute key **L**; auto-mute on window blur, restore on focus. Achievement: "Money Reward" chime.

## 1.9 What makes 2025 feel alive (quick list)
Blinkers flash (0.8 s) while steering; stop lights on brake, white reverse lights when accelerating < 0; wheels visually steer with `+= (target - cur) * dt * 16`; visual suspension `+= (y - cur) * 25 * dt`; antenna spins and points to a target; boost trails; confetti on every success; interactive points on the ground that **pop open with `elastic.out(1.3,0.4)` 1.5 s when the car is within 2.5 m** and show the Enter key icon + label (hide with `back.in(4.5)` 0.6 s); honk bounces a wheel; camera roll kick on impacts; coloured shadows; day/night ambience changes; wind streaks; leaves scatter from the car; tracks in grass.

## 1.10 What to take for husam.world (folio-2025)
1. **Replace the camera-relative phone stick with Bruno's car-relative ground ring**: touch -> raycast to the local tangent plane at the car; `angle = signed angle between car forward and (hit - car)` on that plane; `throttle = clamp((d - r0)/(r1 - r0))^3` with r0 ~ 1.2x car length, r1 ~ 2.5x; `steer = clamp(angle / (PI/4), -1, 1)`; reverse only if |angle| > 135 deg. Draw the ring (inner circle + 270 deg outer arc + wedge fill) under the car in cream/ink. Tap on the car = hop. This keeps working while the camera chases.
2. Soft top speed `force / (1 + overspeed)`, `idleBrake` coasting, and "opposite input brakes first then reverses" (threshold 0.5 m/s). Boost on Shift x3 force as a fun extra.
3. Steering: digital key * fixed max angle, but *smooth the visual wheel* at `dt*16`; if we need speed-sensitivity (our planet is faster/smaller), do it in the settings slider rather than hidden.
4. Auto flip-back after 3 s upside down + an "Unstuck" contextual button after 3 s of <0.5 m progress; R = respawn to nearest landmark with a quick fade.
5. Camera: smoothed follow `lerp(dt*10)`, zoom range 15..30 equivalent scaled to our planet, **pull back up to 40% with speed** (smoothstep 5..40), more distance on portrait (`max(1, (16/9)/aspect) - 1`). Our camera may chase heading (sphere), but keep inputs independent of it.
6. Settings panel shape: small edge tab button -> panel with icon rail (Options / Controls / Achievements / Time trial), options as label+small-button rows with one-line tooltips. Include "I'm stuck! -> Respawn" and "Reset props" rows like Bruno.
7. Toasts: top-centre card, overshoot `cubic-bezier(0.4,1.6,0.65,1)` 0.6 s in, 4 s with a shrinking 2px time bar, queue one at a time, click opens the list; confetti + chime on unlock. Funny titles, one-line descriptions.
8. Achievements that fit: leave the start, visit all 10 landmarks, drive 1 km, honk 10x, first hop, flip ("Turtle" upside down), front/back flip, knock over N props, finish the road trial, beat a par time, see night, full day cycle, Konami, "Clean your room" (reset props).
9. Time trial along the road: gates with a mint striped fading plane on the *next* gate only, radius-2 segment test, rising-pitch ping per gate, 3-2-1 beeps 1 s apart (Bruno uses 2 s), floating `MM:SS:mmm` timer above the car, force clear weather/golden hour during a run, confetti at gate posts.
10. Day cycle of ~4 min with 4 colour presets (coloured shadows), `night` interval events to toggle headlights/street lights, crickets fade in over 15 s, birds by day. Weather from deterministic sin-product noise of day progress.
11. Wind = one shared offset function (two scrolling noise lookups) used by grass tips and tree sway; white wind-line streaks every 0.3-2 s.
12. Engine audio: one loop; pitch from *throttle* (0.6 -> 1.1) plus a speed-driven whoosh layer (rate 1 -> 2); skid layer when sliding sideways or braking; landing squeaks; auto-mute on blur; L to mute.

---

# 2. folio-2019 (github.com/brunosimon/folio-2019)
cannon-es RaycastVehicle, Z-up world, Howler. Files: `src/javascript/World/Physics.js`, `Controls.js`, `Camera.js`, `Sounds.js`, `Walls.js`, `Sections/PlaygroundSection.js`, `EasterEggs.js`, `Area.js`.

## 2.1 Physics constants (`World/Physics.js`)
```js
world.gravity = (0, 0, -3.25 * 4)          // -13 (stronger than real -> snappy, toy weight)
defaultContactMaterial: friction 0, restitution 0.2
floor-wheel: friction 0.3, restitution 0; floor-dummy(props): friction 0.05, restitution 0.3; dummy-dummy: 0.5/0.3
chassis 1.02 x 1.16 x 2.03, mass 40, visual offset z 0.41
wheels: front offset 0.635, back -0.475, width 0.39, radius 0.25
suspensionStiffness 50, restLength 0.1, frictionSlip 10, dampingRelaxation 1.8, dampingCompression 1.5,
maxSuspensionForce 100000, rollInfluence 0.01, maxSuspensionTravel 0.3, customSlidingRotationalSpeed -30, wheelMass 5
controlsSteeringSpeed = 0.005 * 3            // rad per ms of key hold  -> 15 rad/s ramp
controlsSteeringMax   = Math.PI * 0.17        // ~31 deg
controlsAcceleratinMaxSpeed      = 0.055*3/17 // per-tick distance cap (~0.0097 m/tick)
controlsAcceleratinMaxSpeedBoost = 0.11*3/17  // boost doubles top speed
controlsAcceleratingSpeed      = 16  -> engine force 17*16 = 272
controlsAcceleratingSpeedBoost = 28  -> 476
controlsBrakeStrength = 1.35; rear-wheel drive
```
- Top speed is a **hard gate**: engine force is applied only while `speed < max || going the other way`.
- **Keyboard steering ramps**: `steering += dt*0.015` per ms while held, returns to 0 at the same rate when released, clamped to 0.17 PI. (So ~20 ms to full lock: essentially instant but not a step.)
- **Coast drag**: with no up/down, impulse `-forward * |v| * 0.1` every physics step.
- Brake = Space/Ctrl (2019 has no jump key; jump only in debug: `impulse (0,0,150)` slightly off-centre).
- **Auto flip**: if `worldUp.dot(up) < 0.5` for **1 s** -> jump impulse 150 at an offset point (makes it rotate), then 1 s cooldown.
- Props: `allowSleep`, `sleepSpeedLimit 0.01`; car never sleeps.

## 2.2 Controls (`World/Controls.js`)
Keyboard: W/Up, S/Down, A/Left, D/Right, **Space or Ctrl = brake**, Shift = boost. All actions cleared on window blur.
Touch (all DOM, created in JS, fade in with staggered `transition: opacity 0.3s <delay>`):
- **Joystick** bottom-left: 170x170 container at `left 10px, bottom 10px`; 150px limit ring; 60px cursor. Cursor radius eased logarithmically: `r = d; if r > 20: r = 20 + log(d - 20) * 5; clamp 43`.
- **Joystick only steers, it never throttles.** Its screen angle is turned into a world heading: `angle = -atan2(dy, dx) + PI*0.18` (0.18 PI compensates the fixed camera yaw). Then
  ```js
  deltaAngle = wrap(joystickAngle - carAngle)       // -PI..PI
  steering = deltaAngle * (goingForward ? -1 : 1)   // stopped counts as forward
  clamp to +-0.17 PI
  ```
  i.e. "stick points the way" works *because the camera never rotates*.
- **Right column of 4 buttons** (each 95x70 hit area, 60x60 visible rounded square, `border 2px solid #fff`, radius 10px, opacity 0.25 -> 0.5 when pressed), stacked from the bottom: backward (15px), brake (85px), forward (155px), **boost (225px)**. Icons: triangle / double triangle PNGs. Boost button = forward + boost simultaneously. Each button tracks its own `touch.identifier` so steering + throttle multi-touch works; touching any button resets camera pan.
- Areas (e.g. project boards): enter a rectangle (`halfExtents`), floor shows "ENTER" key label popping up with `back.out(3)` 0.35s; E/F/Enter or **tap the area** (invisible plane mesh raycast) to interact.

## 2.3 Camera (`Camera.js`)
- PerspectiveCamera FOV 40, near 1, far 80. Fixed direction vector `(1.135, -1.45, 1.15)` normalized (a "projects" angle `(0.38, -1.4, 1.63)` is tweened with `gsap 2s power1.inOut` when entering the projects area).
- Follow: `targetEased += (target - targetEased) * 0.15` per frame (frame-dependent).
- Zoom: `distance = 14 + 15 * zoom` (zoom 0..1, default 0.5), wheel `+= deltaY*0.001`, pinch supported, eased 0.1.
- Pan: drag on the ground with a raycast, eased 0.1, reset when you touch a drive control.

## 2.4 Props and how they're spawned
`Walls.add({ object, shape })` lays out copies of one object on a grid:
- **Brick walls** (Playground): 3 walls: `rectangle` 5 wide x 6 high, `brick` (odd rows offset by half) 5x6, `triangle` 6 base. Spacing `offsetWidth (0, 1.05, 0)`, `offsetHeight (0, 0, 0.45)`; `randomRotation z 0.4` (bricks slightly askew so they look hand-stacked). Brick mass **0.5**, starts asleep.
- **Bowling**: pins in a `triangle` of 4 rows (10 pins), spacing 1 across / 0.65 deep, **pin mass 0.1**; ball mass **1** placed 20 m in front of the pins. A reset area (2x2) with a floor "RESET" label resets all bodies to origin on interact.
- Every prop: a GLB "base" mesh + a simplified "collision" GLB (boxes/cylinders/spheres named by type), fake blob shadow plane `(sizeX, sizeY, alpha 0.35)`, a sound name.
- Collision sounds (`Sounds.js`): `volume = clamp((v - velocityMin)*mult, volMin, volMax)^2`, rate random in [rateMin, rateMax], min 100 ms between plays. Brick: vMin 1, mult 0.75, vol 0.2-0.85, rate 0.5-0.75. Pin: vol 0.35-1, rate 0.1-0.85. Ball: rate 0.1-0.2. Car hit: vMin 2, vol 0.2-0.6, rate 0.35-0.55.
- **Engine sound**: one loop `low_off.mp3`; `progress = clamp(|speed|*2.5 + max(accel,0)*0.4)`, eased up 0.3 / down 0.15 per frame; `rate = 0.4 + 1.0*progress`, `volume = 0.4 + 0.6*progress`. (2019 pitch follows speed + throttle; 2025 follows throttle.)
- **Konami code** (`EasterEggs.js`): up up down down left right left right (+ b a on desktop); on touch, swipes > 30px are classified into 4 directions. Success spawns `3^count` **lemons** (mass 0.5) at random +-5 m around the car, 10 m up, 50 ms apart. A floor label near one lemon hints the code.
- Floor-painted instructions: control hints are textures on the ground near the start (arrow keys drawing / touch variant texture).

## 2.5 What to take for husam.world (folio-2019)
1. Gravity ~1.3x real and a lowered centre of mass: toy weight, quick landings.
2. Keyboard steer ramp `dt*15 rad/s` to a max ~0.17-0.2 PI and return-to-centre at the same rate (gentle vs 2025's instant).
3. Coast drag impulse `-v*0.1` when no throttle: stops the car drifting away from a landmark on a phone.
4. If we keep a screen stick, **make it steer only, with separate throttle/brake buttons**, OR go 2025's ground ring. The stick heading must be converted with the *current camera yaw* (2019's 0.18 PI constant) -- on our chasing camera that constant is the live camera heading projected on the tangent plane; that is the bug to fix.
5. Four stacked right-side buttons (boost/forward/brake/back), 60px, 2px white border, radius 10, 0.25 -> 0.5 opacity, multi-touch by identifier; staggered fade-in.
6. Props via one grid spawner: bricks (mass 0.5, 1.05 x 0.45 spacing, +-0.2 rad jitter), 10 bowling pins (mass 0.1) + ball (mass 1), all asleep until hit; a ground "reset" pad. Impact sounds with squared volume by impact speed and random pitch.
7. Konami code with a swipe fallback on touch, raining lemons (3^n) is a proven, harmless easter egg.
8. Auto-flip after 1 s (2019) vs 3 s (2025): 1.5-2 s feels right for a first-timer.

---

# 3. Messenger by Abeto (messenger.abeto.co)
**Access note:** messenger.abeto.co, awwwards.com, 80.lv, korben, wikipedia and HN are all blocked by this container's egress proxy (403 on CONNECT), and Firecrawl is out of credits. What follows comes from web-search snippets of the Awwwards case study, reviews and guides (Awwwards "Messenger - a Case Study by abeto", Aftermath, Tildes, Fortcade, a Blogopod how-to), from round 2's notes (`index-r2.md` section 2, taken from Firecrawl screenshots and the making-of), and from the open clone `github.com/Glowin/messager` (a fan clone, not Abeto's code).

## 3.1 Controls
- **Touch: a floating joystick.** "Wherever you put down your finger is the centre of a joystick. A circle appears under your finger, and the further you slide from that centre the bigger your movements." One finger drives everything. There are no fixed on-screen pads.
- **Desktop:** WASD or arrows to move, Space to jump, left click for action. You can also play with the mouse alone (click or hold to walk toward the pointer). Gamepads are supported.
- **Design rule from the case study:** "easily navigable for all audiences, even those unfamiliar with video games, so we had to *limit certain options and automate others, such as camera centering*." There are no tutorials or arrows: you "discover the what and the how at your own pace."
- Movement is character-relative to the camera, and that is only safe because the camera auto-centres behind the character. So a stick pointing "up" means "forward, the way I'm already looking."

## 3.2 Camera on a sphere
- Over-the-shoulder "smart camera" that **follows automatically** and re-centres behind the direction of travel. No manual orbit is needed.
- The case study lists the hard problems as "a camera that works at any angle", keeping text and trees upright on a curved surface, and central gravity.
- Recipe (from the clone, `src/camera.ts`, and the standard way to do this):
  ```js
  up = normalize(player.pos - planet.center)          // surface normal
  camera.up.copy(up)                                  // never world Y: no pole flips
  desired = player.pos + up*H - forward*D             // H=4, D=7, FOV 60 in the clone
  camera.position.lerp(desired, 0.1)                  // frame-based lag
  camera.lookAt(player.pos)
  ```
  Player motion on the sphere: rotate the position and the body about `axis = up x forward` by `speed*dt/R`, and turn about the local up. Re-snap to radius each frame. Clamp dt to 0.1.
- Auto-centring is what makes camera-relative input bearable. The yaw eases toward the heading only while moving, so a stick held "up" converges on straight ahead with no feedback loop. The feedback loop appears when the camera yaw follows the heading *faster* than the input is reinterpreted: the stick maps to a new world direction every frame and the car circles. Fix it with 2025's car-relative mapping (1.2), or by latching the camera yaw at touch start (Messenger-like: the joystick frame is fixed while the finger is down).

## 3.3 Characters, bubbles, ambient life
- NPCs are "regular people but memorable". They **chat through speech bubbles, walk around, and have their own 3D sound**; one NPC's guitar is spatialised so you can find him by ear. Each has a **name tag** and a **floating marker** when they have something for you.
- Other players appear live and talk only through **emojis** (an emoji wheel; the poop emoji is the famous one). There is no free text, which makes it safe and funny.
- There are 7 spots (neighbourhood, plaza, cemetery, beach, mountain temple, forest, factory), each with its own soundscape, "hidden details and environmental storytelling."
- The look is hand-drawn, with outlines everywhere, controllable in thickness and colour. **One 16x16 colour atlas** colours everything, so a mood or time-of-day swap is one texture swap. LOD preserves silhouettes.
- Tone: "total tranquility with a subtle sense of oddness". The pace is slow and there are no timers.

## 3.4 What to take for husam.world (Messenger)
1. **Floating joystick on touch**: it centres where the finger lands, shows a circle under the finger, and the deflection sets the magnitude. Combine this with 2025's car-relative interpretation, or latch the camera yaw at touch start so "up" means "the way the camera faced when I touched". Either way removes the circling bug.
2. Camera: `camera.up = surface normal` each frame. Place it behind the car's heading and above on the normal, lerp about 0.1 per frame or `1 - exp(-6*dt)`, and auto-recentre yaw only while moving. Pull back with speed (from 2025).
3. **Characters with speech bubbles**, 1 per landmark or fewer. A little figure that idles, turns to face the car when it comes within about 6 m, and pops a bubble (scale 0 to 1 with a back-out overshoot) holding a *teaser line* (never a fact). Show a name tag and a small floating marker (a bobbing diamond) only when there is something to say. Let a figure's sound or instrument be spatial so it can be found by ear.
4. Emoji-only communication as a model for a **honk-emote**: H honks and pops a tiny emoji bubble over the car. It is harmless, social and cheap.
5. Per-landmark ambience (a loop that fades in within about 15 m) and one colour atlas or palette uniform for the time of day.
6. Automate what beginners can't do: no required camera control, no tutorial text. The ground ring or joystick is the tutorial.
