# Study, round 4: THE WORLD (`index.html`), driving and ambition

Sources: `index-r4-refs.md` (the parallel study of folio-2025, folio-2019 and Messenger, with verbatim numbers), plus my own
reading of the clones in the scratchpad (`folio-2025/sources/Game/Physics/PhysicsVehicle.js`, `Player.js`, `Inputs/Nipple.js`,
`Options.js`, `index.html` menu markup, `data/achievements.js`). Messenger's site is blocked here; its notes come from the case
study, reviews and the open clone (see refs section 3).

## Why the car was hard (diagnosed with `r4-newcomer.js`, a scripted first-timer)
1. **The phone stick circled.** It was camera-relative ("points where you want to go") while the camera swung behind the
   car. Push it right and the car turned right, the camera followed, "right" moved again, and the car kept turning. Both of
   Bruno's cameras never rotate, which is why his stick works (refs 1.2, 2.2). Messenger's camera does turn, but it only
   re-centres while you're moving and the joystick frame stays fixed while the finger is down (refs 3.2).
2. **Static hits stopped the car dead.** Every frame in contact multiplied the speed by 0.55, so steering into a lamp post
   at the roadside (there was one 8 units before the Capitol's pad, on its side) pinned the car at 0.5 u/s for 5 s.
3. **The car coasted off the pad.** With the thumb lifted, the car rolled past the pad and the exit sign vanished before
   "Go in" could be pressed. The scripted newcomer failed here on the phone.
4. **Props could not be knocked over once asleep.** In cannon 0.6 a kinematic body never wakes a sleeping one, and the
   car's body had fallen asleep too. It drove through sleeping pins and crates (found with `r4-dbg.js` and a minimal
   `r4-cannon.js`).
5. The per-prop infinite ground planes each used their own collision bit, and 32 bits ran out at about 29 props.

## What each reference gave, and what it became
| Reference | Specific | In the hub |
|---|---|---|
| folio-2025 `PhysicsVehicle` | soft top speed `force/(1+overspeed)`, `idleBrake 0.06`, pressing against the motion brakes first (`reverseBrake`, above 0.5 m/s) and only then reverses | same logic, in u/s: top 11 (keys) / 9 (touch), x Speed setting (0.78 / 1 / 1.25), boost x1.6; idle drag 2.1 + 0.32v |
| folio-2025 | `steeringAmplitude 0.5` rad of wheel | the bicycle model uses 0.5 rad x Steering sensitivity (0.62 to 1.42) |
| folio-2025 `Nipple.js` | full lock once the target is 45 degrees off the nose; only the rear 90 degrees reverses | "Point" touch scheme and the Tap-to-go autopilot use exactly this mapping |
| folio-2025 `Nipple.js` | throttle `progress^3` | `((mag - 0.14)/0.78)^1.25` (a phone thumb needs more low-end than a ring on the ground) |
| folio-2025 `View.js` | follow `lerp(dt*10)`, pull back as speed goes 5 to 40 | target follows at dt*10; pull back up to 18% as speed goes 4 to 18 |
| folio-2025 `Player` stuck test | under 0.5 m in 3 s while throttling shows "Unstuck" | same test shows a "Stuck? Back on the road" button |
| folio-2025 Options | label left, one control right, a one-line tooltip; "I'm stuck! / Respawn", "Reset" | the Settings panel rows; "I'm stuck! / Back on the road" and "Knocked it all over? / Tidy up" |
| folio-2025 menu | icon rail of sections (Options, Controls, Achievements, Circuit) | four tabs: Driving, World, Controls, Stickers (trial best inside) |
| folio-2025 achievements + notifications | funny title, one line, toast drops with `cubic-bezier(.4,1.6,.65,1)` 0.6 s, 4 s bar, one at a time, chime + 3 confetti bursts | 23 "stickers" (road-trip souvenirs), same toast motion and 4 s bar, a chime, confetti at the car |
| folio-2025 circuit | gates, only the next one counts, rising ping per gate, lights before the start, forced clear weather | "The long way": 9 gates from the Fresno start line to Cambridge, mint striped curtain on the next gate, 3 red lights 0.8 s apart then green, ping rises a whole tone per gate, clear skies forced |
| folio-2025 `Weather.js` | deterministic `sin(x)sin(1.678x)sin(2.345x)` noise, snow when cold | rain from that noise of page time; north of about 30 degrees latitude (the Cambridge end) it falls as snow |
| folio-2025 `Wind.js` | one wind function (two scrolling noises) for grass tips and foliage | `WIND_GLSL`, shared by tree canopies (toon + outline shaders) and grass tufts |
| folio-2025 Grass + Tracks | blades lean in the wind and part under the car; tyre tracks drawn into the ground | 3,600 three-blade tufts near the road that lean and part; dark skid marks when sliding or braking hard, faint marks on grass |
| folio-2025 sound | engine pitch follows throttle; skid layer; crickets fade in at night; birds by day | synthesized: throttle joins speed in the engine pitch; a skid loop; crickets (3 s fade); bird chirps; rain on the roof |
| folio-2019 | log-damped stick travel `20 + log(d - 20)*5` | same curve (x7.5 to reach 48 px) |
| folio-2019 `Walls` + bowling | triangle stacks; 10 pins (mass 0.1) and a ball (mass 1) | a 10-crate pyramid at the start; a bowling lane between the Garage and the Pier |
| folio-2019 Konami | up up down down left right left right B A, swipes on touch; rains 3^n lemons | same code and swipe fallback; rains Valley oranges (3, then 9, then 27) |
| Messenger | floating joystick where the thumb lands | touching anywhere on the left half puts the stick under the thumb |
| Messenger | camera auto-centres only while moving; frame held while the finger is down | Auto camera setting; in "Point" the camera holds still while you point sideways |
| Messenger | NPCs with speech bubbles, a floating marker when they have something to say | 12 locals, one per landmark plus both ends; they turn to you, hop, and type a teaser into a bubble with a blip; a small diamond bobs over them until you've heard them |
| Jordan Breton / Messenger | small living things | birds in V formation by day (they scatter when you honk), fireflies at night |
| Jesse Zhou | adaptive quality tiers | Quality: Auto (steps down while frames run long), High, Low; phones start one tier down |
| rauno.me / emilkowal.ski | opens from where it lives; under 300 ms for UI; reduced-motion variant | the panel grows out of the tab stack on the right (a bottom sheet on phones, and the camera lifts the car above it); tabs, switches and segments react in about 150 ms |

## Driving model now
- Bicycle model: `yaw = v tan(steer x 0.5 x sens) / 1.55`, capped by a grip limit `12.5 / max(2.2, |v|)`, so it turns
  tightly when slow and stays steady when fast.
- Slip: the direction of travel lags the nose. Grip pulls it back at 9/s, or 2.2/s while drifting (brake or boost with
  steer above 5.5 u/s). This gives skid marks, dust and the skid sound. The "Sideways" sticker is for 1.2 s of slide.
- Road assist (on by default): with no steering, and the nose within 12 degrees of the road (24 on touch), the car
  follows the curve and eases back to the middle. A "lazy newcomer" holding only forward drove 60 units with at most
  0.6 units of drift (`r4-lazy.js`).
- Pads: coming to rest on a door's pad parks the car gently. The exit sign stays up 2.2 s after you roll off, and Enter or
  "Go in" still works.
- Collisions slide: only the head-on part of the speed is lost.
- Touch schemes (Settings): **Point** (default; a floating stick; straight up means "on along the road"),
  **Steer** (a gamepad-like stick), **Tap to go** (tap a sign or a spot; the autopilot follows the road there and parks).
- Gamepad: left stick and d-pad steer, right trigger drives, left trigger brakes and reverses, B boosts, X slides,
  Y hops, L3 honks, A goes in, Select respawns, Start opens Settings.

## Ownership notes
- Every local's line and every sticker is fresh hub copy. None names a district's facts, numbers or organisations.
  `audit.py` = 0.
- The time trial shows a clock, and timers are listed as the Chamber's device. The round-4 brief asks for exactly this
  ("a circuit or time trial along the road with a timer"), so it is styled as a green highway strip sign with a traffic
  light. There is no countdown numeral, no flip digits and no gavel. Flagged for the lead.

## Tests (scratchpad `r4-*.js`)
`r4-newcomer.js` (phone Point, phone Steer, phone Tap-to-go, desktop keys: start, drive to the Capitol, go in; all pass),
`r4-lazy.js`, `r4-trial.js` (a boosted scripted run takes 22.5 s; par is ROAD_LEN/14.5, about 27 s), `r4-func.js`
(O / Escape / M, keyboard focus, Konami, bowling, Tidy up, reduced motion, mailbox), `r4-perf.js` / `r4-prof.js`
(frame cost), `r4-shots.js` (day, night, rain, settings tabs, a local talking), plus the older `phone.js` (the map scrolls
on iPhone) and `intro.js` (no camera flips in the start flight).
