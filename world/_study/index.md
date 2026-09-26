# Study: bruno-simon.com (folio 2019 source + the 2025 live site)

Sources read: the full `github.com/brunosimon/folio-2019` source (cloned: `src/javascript/*`, `src/shaders/*`,
matcap PNGs in `static/models/matcaps`), and bruno-simon.com (2025) via Firecrawl: raw HTML of the UI shell
and its compiled CSS (`/assets/index-*.css`). The 2025 canvas does not render in the scraper (WebGPU/WebGL
needs a GPU), so the 2025 notes are about its UI, controls and copy tone, not its 3D look.

## World conventions (2019)
- **Z is up.** `camera.up = (0,0,1)`, cannon gravity `(0, 0, -3.25*4 = -13)`. The floor is one infinite
  `CANNON.Plane` at z=0. `world.allowSleep = true`, `defaultContactMaterial.friction = 0`, restitution 0.2.
- Contact materials: floor/dummy friction 0.05 restitution 0.3; dummy/dummy friction 0.5; floor/wheel
  friction 0.3 restitution 0. `contactEquationStiffness: 1000` everywhere (soft, bouncy toy feel).
- Physics steps with the frame delta (`world.step(delta/1000)`), no fixed timestep.

## Camera
- `PerspectiveCamera(40, aspect, 1, 80)`. Fixed direction vector `(1.135, -1.45, 1.15)` (from target to
  camera), so the camera sits south-east and high, looking north-west at ~32 degrees below horizontal.
  World axes read as diagonals on screen: +X goes right-down, +Y goes right-up.
- Distance = `14 + 15 * zoom` with zoom 0.5 (21.5 units). Wheel changes zoom (0..1), eased 0.1 per frame.
  Pinch on touch does the same.
- Follow: `targetEased += (target - targetEased) * 0.15` per frame; target = car x,y (z stays 0).
- Drag pans (raycast onto a big invisible plane), eased 0.1, reset to 0 as soon as you press up/down.
- "projects" zone swaps the angle vector to `(0.38, -1.4, 1.63)` over 2s (`power1.inOut`).

## Car (RaycastVehicle)
- Chassis box 2.03 x 1.02 x 1.16, offset z 0.41, mass 40, starts at z=12 asleep and drops on reveal.
- 4 wheels: radius 0.25, front at +0.635, back at -0.475, half-track 0.39; suspension stiffness 50,
  rest length 0.1, frictionSlip 10, damping relax 1.8 / compress 1.5, rollInfluence 0.01,
  maxSuspensionTravel 0.3, customSlidingRotationalSpeed -30.
- Rear-wheel drive. Engine force `17 * 16 = 272` (boost `17 * 28 = 476`). Max speed 0.0097 units/ms
  (~9.7 u/s), boost doubles it. Speed is measured as position delta per ms.
- Steering eases at `0.015 rad per ms`, max `PI*0.17` (~31 degrees), auto-centres when released.
- When neither up nor down is held, an impulse opposite to travel of `|v| * 0.1` slows the car
  (that is the "coasting" feel). Brake = `setBrake(0.45*3)` on all wheels (Space or Ctrl).
- Upside-down watcher: if `worldUp·up < 0.5` for 1s, jump impulse (150 at a point offset 0.1 so it flips).
- **R** recreates the car. **H** honks and makes the car hop (impulse 150, rate-limited 400ms).
- Visual: chassis mesh follows body with offset z -0.28; **antenna on a spring** (speed from acceleration
  x 10, damping 0.035, pull back 0.02, rotation = local offset x 0.1); **back lights** brake (red, opacity
  0.5 → 1 when braking) and reverse (yellow, 0.5 → 1 when reversing).

## Materials: matcaps + fake bounce light
- Everything is `MatcapMaterial` (custom shader). 128px matcaps: soft ball, lit from the upper left,
  bottom rim warm. Sampled colours: orange centre (238,172,99), bottom (232,137,64); white (228,224,223)
  bottom (221,202,197). Low contrast, pastel, toy-like.
- Shader adds an **indirect bounce**: surfaces near the floor (z < 1.75) and facing down are mixed toward
  `#d04500` (the floor's orange): `strength = pow(clamp(1 - z/1.75) * 0.5, 2) * clamp((dot(N, -Z) + 0.6) * 1.5)`.
- **Reveal**: vertex shader sinks every vertex by `3.2 * pow(1 - clamp((progress - dist/30) * 5), 2)` and
  the fragment discards below z=0, so the world rises out of the floor in a ring spreading from the
  centre over 3 seconds. Floor shadows fade in 0.5s later.

## Floor, shadows, post
- Floor is not geometry: a full-screen quad at max depth with a 2x2 gradient texture (corners
  `#f5883c #ff9043 #fccf92 #f5aa58`). The camera never sees a horizon.
- Static objects have **baked floor-shadow textures** (from Blender) drawn in `#d04500`, not black.
- Dynamic objects get a plane that follows them, offset along a sun vector `(-2.5,-2.65,3.75)/z`,
  rotated to the object's yaw, alpha fading with height (maxDistance 3, power 2) and with tilt.
  Shadow shader = rounded rectangle with a sine falloff (`uFadeRadius 0.35`).
- Post: horizontal + vertical 9-tap blur weighted by `1 - sin(uv.y * PI)` (tilt-shift at top and
  bottom; disabled on touch), then a pink glow `#ffcfe0`, alpha 0.55, radius 0.7 from `(0, 0.25)`.
- `setPixelRatio(2)`, clear colour black, `alpha: true`.

## Areas (the interaction pads)
- A rectangle on the floor: a thin white **border** (alpha 0.5) and a **fence** (four vertical walls with
  animated diagonal white stripes, `mod((x + y - t*0.00035 + z)/0.5*0.5, 1)`), hidden below the floor.
- Car inside the rectangle (simple AABB test) → fence rises 0.5 (`back.out(3)`, 0.35s) and a floating
  **key hint** (Enter-key icon + condensed "ENTER" label, alpha 0.5) pops up from z 1.5 to 2.5.
- Enter / E / F or a click on the pad → `interact`: fence dips then springs back, border flashes to 1,
  sound `uiArea`. Project boards open links in a new tab from this.

## The start
- The start pad sits at the origin. While loading, its border draws around by angle
  (`step(abs(atan(x,y)/PI), progress)`), with a pixel "LOADING" label; when ready, "START" fades in.
- Click / Enter on it → pad retracts, then 600ms later the reveal: world rises, shadows fade in, the
  car wakes and **drops from z=12**, engine volume fades up, the "reveal" sound plays, touch controls fade in.

## The name
- "BRUNO SIMON" is ten separate physics objects (mass 1.5, sound "brick"), plus "CREATIVE DEVELOPER"
  as two more slabs. You knock them over. Shadow per letter `1.5 x 1.5`, offsetZ -0.6, alpha 0.4.
- The arrow-key instructions are four **physical key caps** you can push around, with a floor label.

## Props
- Brick walls built by a `Walls` helper (rows, offsets 1.05 x 0.45, half-brick stagger, random yaw).
- Bowling: pins in a triangle, a ball, a reset area. Cones, horns you can rain with K, a tiles path.
- Every dynamic body plays its sound on `collide` with volume from impact velocity (min velocity 1,
  `volume = clamp((v - min) * 0.75, 0.2, 0.85)^2`, random rate 0.5-0.75).

## Sounds (Howler, files)
- Engine loop: rate 0.4 → 1.4 and volume 0.4 → 1 driven by `|speed| * 2.5 + accel * 0.4`,
  eased 0.3 up / 0.15 down. Master 0.5. **M** mutes. Muted when the tab is hidden.
- One-shots: reveal, brick, bowling pin/ball, car hit (static bodies only), wood, screech (when
  local acceleration spikes, max once per 5s), ui area, horn (0.2% chance of the second horn).

## Controls
- Keyboard: arrows / WASD, Space or Ctrl brake, Shift boost, R reset, H horn, Enter/E/F interact.
- Touch (created on first `touchstart`): a **170px joystick bottom-left** (60px cursor ring inside a
  150px limit ring, white 2px borders, log-damped travel, max 43px). The joystick sets a *heading*: the car
  steers toward the joystick angle (+0.18 PI to match the camera). Right side: four 60px rounded squares
  stacked (boost, forward, brake, backward), 25% white borders, 50% while pressed.

## 2025 site (live)
- UI in Nunito + Amatic SC (+ Pally). Dark plum panels `radial-gradient(#251f2b, #1d1721)`, inset 1px
  white hairline at 35% opacity, 3px in from the edge. Accent pink `#ffceca`, success `#d5ff95`.
- Menu and **Map** triggers are tabs stuck to the right edge (44px, red `radial-gradient(#c21515,#46123b)`),
  sliding 4px left on hover. The map is a square modal with white diamond pins (rotated 45deg squares
  with a dark border) and black uppercase name tags that pop on hover with a springy
  `cubic-bezier(.49,2.2,.53,.75)`. Notifications drop in with `cubic-bezier(.4,1.6,.65,1)`.
- Controls: WASD/arrows, Shift boost, Ctrl/B brake, **Space jump**, Enter interact, M map, L mute,
  R respawn, H honk. Touch: one finger drives, two fingers move the camera, tap the car to jump; big
  "Interact" / "Unstuck" words at the bottom in Amatic SC 64px.
- Copy tone: short, warm, a little silly ("And don't break anything!", achievements like "Turtle: Get
  upside down"). A day cycle with weather; a respawn button for when you're stuck.

## What I'm taking (and changing) for Husam's world
- Same Z-up world, same camera vector and FOV, same eased follow and wheel zoom; distance grows on
  portrait screens so a phone still sees a whole landmark.
- Same RaycastVehicle numbers as the starting point, the coasting impulse, the auto-flip, H = honk + hop.
  Space brakes, and a quick double-tap of Space hops (the "brake / jump-ish" in the brief).
- Matcaps generated on a canvas at runtime (soft ball, upper-left light, warm lower rim), Bruno's
  indirect-bounce and rise-from-the-floor reveal in my own shader. Bounce colour follows the ground.
- Floor-baked shadows as soft rounded-rect planes tinted from the ground colour (not black), static ones
  placed along the sun vector for the visitor's local time, dynamic ones following bodies.
- Tilt-shift blur at top and bottom plus a corner glow, in one post pass (off on touch).
- Areas: white border, striped fence that springs up, floating Enter-key hint, Enter/E/F or click.
- Start pad with the border drawn by real build progress, "START" painted on the ground, then the
  reveal and the car drop; the **HUSAM SOKAR** letters fall one by one onto the Fresno pad.
- Physical W A S D key caps at the start, Food Bank crates, cones, debate hand-cards as bowling pins.
- A 2025-style right-edge **Map** tab and a map with diamond pins and springy name tags, but in Husam's
  own palette and type (California highway-sign lettering), not Bruno's plum and pink.
- Differences on purpose: the world is a floating slab (the earlier husam.world was a floating island),
  the ground is Central Valley gold rather than Bruno orange, and the light follows the visitor's clock.
