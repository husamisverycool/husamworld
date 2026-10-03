# Round 16, the island: phones

Husam, on his phone: "the phone version is very very slow and looks weird, can you ideate through inspiration how to go about doing this
much much better and be very ambitious on approaching this."

The sandbox has no phone and no GPU (Chromium on SwiftShader), so this round works from three things that can be checked here:
- how the references run on a phone (their shipped code);
- what our phone frame actually does (passes, pixels, programs compiled, shadow re-draws, physics ticks per frame, JS per frame under a
  throttled CPU);
- what it looks like at a phone's real pixel ratio.

Scripts: `SP/r16/` (`SP` = the session scratchpad named in the round 10 spec).

## What the references do on a phone

**Messenger** (abeto; its shipped bundle, `App3D-BLRWK1h9.js`). It is the one that is known to run smoothly on phones.
- **Canvas ratio:** `devicePixelRatio <= 2 ? min(dpr, 1.15) : min(dpr, 1.5)`. A 2x phone draws at 1.15 and a 3x phone at 1.5, never at
  the screen's own 2 or 3.
- **Adaptive ratio:** `adaptiveDPR` multiplies that ratio by 1 down to 0.6, in steps of 0.1. It steps down when the average fps over 4 s
  is under 30 and back up at 60 or more. It gives up after 4 flips.
- **Passes:** one scene pass and an SMAA pass. There is no bloom and no depth of field.
- **Lighter assets:** every iPhone counts as `lowMemoryDevice`, which loads a lighter planet (`planets/present/intro/low/planet.drc`),
  turns off the third terrain LOD and plays the mobile music file.

**Bruno Simon folio-2025** (`Quality.js`, `Rendering.js`, `View.js`, `Ligthing.js`, `PhysicsVehicle.js`). A phone is level 1:
- the canvas at `min(dpr, 2)`, with antialias on only under 2;
- bloom on 2 mips instead of 5, and no depth of field (`cheapDOF` is level 0 only);
- the water without its blur;
- shadow maps of 512 instead of 2048, with radius 2;
- a steeper camera (phi 0.27 PI), and no speed pull-back;
- physics stepped by each frame's own delta (`world.timestep = ticker.deltaScaled`), and the vehicle at a fixed 1/60. The world never
  shows a frame the physics didn't move.

## What our phone frame did (before this round)

1. **It stuttered whenever the phone wasn't at a perfect 60.** The physics steps at a fixed 1/60 s and the frame showed the newest step
   as it was. A frame that fell between steps showed the car, and the camera that follows it, standing still, then jumping two steps the
   next. Below 60 fps the pattern is 1, 1, 1, 2 at 50 fps and 1, 2, 1, 2 at 45. A 90 Hz Android was held to every other refresh
   (`capMs` 13.5 ms), a steady 45 with exactly that pattern. Measured with frames clocked by hand (`judder.js`: a point on the ground,
   its speed across the screen frame to frame; the mean frame-to-frame change relative to the mean speed):

   | Frame clock | Before | After |
   |---|---|---|
   | 60 Hz, exact | 0.013 | 0.014 |
   | 60 Hz, +-1 ms jitter (a real browser) | 0.043 | 0.020 |
   | 50 fps, +-1.5 ms | 0.060 | 0.026 |
   | 45 fps (a 90 Hz phone, before) | 0.079 | 0.015 |

2. **Smooth drew a 3x phone at 0.6 px per CSS px, and no phone tier anti-aliased.** The low tier's ratio was `1 x 0.8`, and Auto's floor
   0.6. An older phone, or one Auto stepped down, got a smeared picture. Every phone had antialias off and no multisampled target (round
   15: "Bruno: antialias only under 2"; but Bruno draws a phone at 2, and Messenger adds SMAA). So the grass, the kerbs and the lamp posts
   crawled.
3. **Balanced on a phone was 8 full-screen passes.** These were: the scene into a half-float target, a bright pass, 2 bloom mips (2 blur
   passes each) and the output. The bloom threshold is 1, so in daylight almost nothing reaches it; the passes cost bandwidth and gave
   back nothing you could see. Night lamps already have their own glow cards (`lampGlow`).
4. **Freezes that were not the frame rate:**
   - Shaders compiled mid-drive: the landmarks' tags (one variant each side) and the wheel tracks' stamp and fade, on first use, 4
     programs (`progs.js`).
   - On the title, the other tier's three big shaders and the post passes' variants were compiled once the letters stood, a second's
     freeze of the globe on a phone.
   - The map's picture (a render of the whole island and a GPU read-back) landed 1.6 s after the fonts, in the middle of the name popping
     in: a 1.9 s long task here.
5. **The landing was the heaviest moment.** The letters' shadows re-drew the whole island's map every third frame of the flight, and
   every frame while they tumbled after landing. A knocked-over prop re-drew the scenery's map every frame until it came to rest.

## What changed

- **Smooth motion at any frame rate** (Glenn Fiedler, "Fix your timestep"). The physics keeps its fixed 1/60 s step (our vehicle tuning
  depends on it), but what is drawn sits between the last two steps, blended by the accumulator's remainder (`IA`, `carLerp`). This
  covers the car's body and quaternion, the camera's focus, the tail lights, the touch ring, the shader uniforms that follow the car,
  every prop that is awake (`dynPrev`), and the prop batch. A cut (a respawn, a teleport) is not blended. This is what Bruno's
  per-frame delta buys, without changing a tuned vehicle.
- **Frame cadence.** A touch screen draws every refresh up to 90 Hz and every other one at 120. It rests at 30 when parked and idle, as
  before. A phone that can't hold more after every one of Auto's steps is held at an even 30 (`lock30`); with the blend, an even 30 reads
  as smooth where a ragged 40 to 50 read as stutter.
- **Messenger's phone canvas.** Every phone tier draws at `min(dpr, 1.15)` on a 2x screen and 1.5 on a 3x one (`phoneDpr`), straight to
  a multisampled canvas (antialias on for phones: MSAA resolves on-chip on a tiled phone GPU). Auto's floor on a phone is 0.85 px per CSS
  px, never 0.6: a lighter tier sheds work, not pixels.
- **One pass on a phone.** Balanced and Smooth have no post passes (Messenger). Pretty, picked from the menu, keeps bloom and depth of
  field.
- **No compiles mid-drive.** The tags' and the tracks' programs are compiled with the rest on the title. A phone skips compiling the other
  tiers on the title; a tier change waits for the car to be parked anyway.
- **The map's picture waits for a calm moment.** That is the title once its timing is done, or the car parked. Opening the map draws it at
  once if it isn't there yet.
- **The landing is lighter on a phone.** The flying letters' shadows follow them every sixth frame, the tumbling letters' and props' 15
  times a second (`fN % 4`).

## Checks

Before and after are the same scripts on `world/index.html` (round 15) and this round's file.

| Check | Before | After |
|---|---|---|
| Shader programs compiled during a drive (`progs.js`) | 4 | 0 (all on the title, behind its timing) |
| Graphics work per frame, phone Balanced (`cpuprof.js`; SwiftShader's frame time with a read-back, a stand-in for fill) | 274 to 280 ms | 221 to 228 ms |
| JS per frame, phone Balanced (V8 sampler) | 4.5 to 5.2 ms | 4.2 to 4.7 ms |

The regression suite all passes (`SP/r16/suite-2.txt`):
- the newcomer drives to the Capitol and goes in, on phone and desktop;
- all ten places are reached by driving;
- the camera checks, desktop and phone, show 0 anomalies;
- the map scrolls on a phone and its picture has 10 pins;
- every `#from-` return lands at its place;
- the tag ring works.

The phone newcomer drive takes 6.9 to 7.1 s, against 6.7 to 6.8 s before. `qa.js island` reports 0 issues and `audit.py` reports 0
problems.

Not measurable here: a real phone's frame rate. What should show on one:
- no stutter while driving at any frame rate;
- a sharp, anti-aliased picture on every phone;
- no freeze when the name pops in;
- no hitch the first time a sign or a skid mark appears.

## The laptop crash (3 October)

Husam on a laptop: "The 3D world hit a snag. So here is the map instead". It was a bug of this round. A comment added mid-line in
`fxSetup` commented out the rest of that line: the post passes' level, their number of mips and the depth of field. So setting up the
passes threw on every computer with a real graphics chip. Phones (no post passes below Pretty) and the software renderer (the low tier)
never reached that line, so every test here passed.

- **Fixed:** the same mistake in `propBatch` too, which was harmless.
- **The safety net (`safeFx`):** a failure setting up the post passes now turns them off and the world keeps drawing in one pass.
- **The new check (`SP/r16/fakegpu.js`):** the page loaded with a real chip's name spoofed. It loads, starts, drives, opens the menu and
  steps through every quality tier.
  - Laptops: "Apple GPU", Apple M2, M3 Pro, Intel UHD 620, Iris Xe, HD 4000, GeForce RTX 3060.
  - Phones: "Apple GPU", Adreno 610, Mali-G710.
  - Result: no errors, world up on each.
