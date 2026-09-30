# Round 15, the island: performance

Husam, on his own laptop, opening the preview (the claude.ai artifact frame): "its slow, is that normal? is there a way to not make it like
that?" No, it wasn't normal, and yes. This is what the frame cost, why, what changed, and the numbers before and after.

The target: a steady 60 fps on a mid-range laptop and a recent phone, 30 or more on an older phone, and no visible step down in looks.
The sandbox has no GPU (Chromium on SwiftShader), so its frame times say nothing about a real device. Everything here is measured
structurally (draw calls, triangles, render passes and their sizes, shadow-map work, JS milliseconds from V8's sampler) and the GPU cost is
reasoned from that. Scripts are in the scratchpad, `SP/r15/` (`SP` = the session scratchpad named in the round 10 spec).

## Causes, in order of how much they cost Husam

1. **Every laptop got the top tier, at full retina resolution, with 4x multisampling.** The start tier was "not a phone, so High". On a
   1440 x 900 laptop at 2x that meant drawing 2880 x 1800 into a 4x multisampled half-float target (8 bytes x 4 samples x 5.2 M px: 166 MB
   written before the post passes began), then depth of field, five bloom mips, and the output into a canvas that was itself 4x
   multisampled (for a single full-screen quad). 48 M samples written a frame. Integrated graphics (Intel Iris, the Apple M1/M2 in a MacBook
   Air) run out of fill and memory bandwidth long before this.
2. **The shadow maps were re-drawn in full every frame, and the "split" never split.** On Mid and High one 1024 or 2048 px map of *everything*
   (55 draw calls: every leaf-card cluster with its alpha-tested depth shader, the trees, the props) was drawn every frame. The Low tier had a
   split (a scenery map on demand plus a small live map round the car), but three r149 picks a shadow map's casters by the *view* camera's
   layers, not the shadow camera's (`WebGLShadowMap`, `object.layers.test(camera.layers)`), so the live map re-drew the scenery every frame
   too, and the car's and the locals' shadow-only casters (layer 2 alone) were in no map at all: the car has had no shadow since round 10.
3. **The title and the opening flight cost four times a frame of play.** Bent onto the globe, nothing was culled (the flat bounds lie):
   474 draw calls and 628 k triangles a frame on the title, 550 to 580 calls and 760 k triangles down the flight, and during the flight the
   whole island's 2048 px shadow map was re-drawn every other frame (105 to 140 shadow draws a frame) so the letters' shadows followed them
   down. That is the first thing anyone sees, and it is where the preview felt slowest.
4. **Physics: cannon's broadphase was quadratic.** cannon 0.6.2's sweep-and-prune `continue`s past every pair it doesn't need (static or
   asleep on both sides) instead of stopping, so each step looked at all n^2/2 pairs of ~335 bodies (245 static): 1.7 ms of a 2.9 ms step with
   one body awake. A slow frame then ran up to 4 catch-up steps, so a phone that slipped under 30 fps spent more of the next frame on physics.
5. **Auto never stepped down when it mattered.** It averaged 90 frames and acted only above 30 ms (under 33 fps), and only once the car was
   parked and untouched. At 35 to 45 fps while driving (the case that reads as "slow") it never did anything.
6. **Forced layouts.** Reading `window.innerWidth` after the frame had written styles (the tags, the bubble) made Chromium lay the page out
   on the spot, several times a frame (`phoneLand()` showed 1.8% self time in the CPU profile).
7. **Load:** the island's mask was painted on the main thread with noise over every texel, the open sea included (1.2 s phone, 4.4 s
   desktop on this machine), and a `Vector3` was allocated per texel in `landK`.

Not causes: allocations are 2.6 KB a frame (`SP/r15/alloc.js`), so GC is noise; birds, leaves, wind lines, tags are each under 0.3 ms.

## What changed

**Start tier from the device** (`deviceTier()`), after Bruno's `Quality.js` (phones low, else high), pmndrs' detect-gpu (the unmasked
renderer string against known GPUs) and drei's `PerformanceMonitor` (which Jesse Zhou's site uses to adapt while running):

| Device (renderer string, `SP/r15/verify.js`) | Tier |
|---|---|
| Software renderer (SwiftShader, llvmpipe) | Smooth |
| Intel HD 2000 to 4000, GMA, old GeForce/Radeon HD | Smooth |
| Intel UHD / Iris / Iris Xe, AMD Radeon(TM) Graphics (APU) | Balanced |
| Apple M1/M2/M3 (base) in Chrome, "Apple GPU" (Safari masks the name) on a Mac | Balanced |
| Apple M Pro/Max/Ultra, GeForce RTX / GTX 10xx+, Radeon RX/Pro, Arc | Pretty |
| Phone or tablet, recent (Apple GPU, Adreno 6xx+, Mali-G710) | Balanced |
| Phone, older (Adreno 610, Mali-G57, PowerVR, <= 3 GB, <= 4 cores on Android) | Smooth |

iOS Safari reports 4 (sometimes 8) cores whatever the phone, so cores are ignored on Apple. Then, while the title is up and the letters
have stood, the median of 45 frame times: over 24 ms starts a tier lower (a steady 30 Hz, what Safari holds a cross-origin frame to
before you touch it, is ignored).

**A pixel budget per tier.** Pretty draws at most 3.7 M device pixels (about 2560 x 1440), Balanced 2.2 M, Smooth 1.1 M (x 0.8); phones
cap at 1.5x. A 1440 x 900 laptop at 2x draws 1.69x on Pretty and 1.30x on Balanced, upscaled. Multisampling only below 1.5x, on the target
and on the canvas (Bruno: antialias only under a pixel ratio of 2).

**Shadows.** Every tier plays with the split, and it now splits: each light is drawn on its own with its shadow camera's layers as the test
(`shadowByLayers`). The scenery's map is re-drawn when the view has moved 3 m, the sun has turned or something in it moved (about 1 frame
in 6 at full speed, never when parked); the live map (the car, walking locals, birds, falling leaves, windsocks: 2 to 8 draws) every frame.
A prop batch re-made only because the view moved no longer forces a re-draw of its own. The second shadow light always exists (its sampling
switched by a uniform), so no tier change and no landing recompiles the world's shaders. Pretty keeps three's 17-tap filter; Balanced and
Smooth use the 4-tap bilinear one (the same one-texel soft edge). The car and the locals cast the shadows they were built to cast.

**The globe culls.** Each chunk's bounding sphere is bent in JS exactly as the shader bends it, tested against the view and the globe's
horizon; a chunk out of sight leaves the view camera's layer only, so the shadow maps still draw it and nothing pops (`cullBent`). The
flight re-draws the letters' shadows every third frame and only while they fly.

**Auto while driving, without a hitch** (`govern`, `SHED`). Frame times over 2 s against a 60 fps budget; over 20 ms (under 50 fps) steps
down, under 17.6 ms for a while steps back up (the wait doubles each time it bounces). None of the steps recompiles a shader:

| Step | Render scale | Lawn | Leaf cards | Shadow filter | DOF | Post passes |
|---|---|---|---|---|---|---|
| 0 | 1 | all | all | tier's | tier's | tier's |
| 1 | 0.85 | all | all | tier's | on | on |
| 2 | 0.85 | 70% | 75% | 4-tap | on | on |
| 3 | 0.72 | 70% | 75% | 4-tap | off | on |
| 4 | 0.72 | 55% | 60% | 4-tap | off | off |
| 5 | 0.6 | 55% | 60% | 4-tap | off | off |

The lawn is built in a shuffled order, so drawing the first k blades is an even thinning; the blades widen by the same rule a sparser
tier uses. The render scale re-sizes the canvas and the passes' targets only. A step that doesn't help (a screen held at 30 Hz, a battery
saver) is undone after three windows and Auto rests for a minute; a frame the CPU is busy for asks for the tier below instead (fewer leaves,
lawn and cards). A change of tier still waits for the car to stop, but it is hitch-free: every tier's variants (three materials' `LOWQ`,
the output pass's defines, every bloom blur, the depth programs of casters only the upper tiers switch on) are compiled once the title's
letters have stood (`precompileTiers`; three keeps every program a material has used). Unit test: `SP/r15/govtest.js`.

**CPU.** `fastSAP`: the same sweep, pair for pair and in the same order (checked on 2,520 steps of a drive through props, 0 differences:
`SP/r15/sapcheck.js`; the reach test's times and top speeds are identical to before), but a body at rest looks only at the awake bodies after
it. Physics 2.9 to 3.4 ms -> 1.3 to 1.5 ms a frame. Catch-up ticks: at most 4, and past 2 only while the frame has spent under 8 ms.
Locals well outside the view are posed 5 times a second with the time they missed. The viewport size is read once per resize. Rendering
pauses fully when the tab is hidden (as before: the loop stops, the audio suspends).

**Load.** The mask painter skips the noise over open water away from the plazas (provably no slabs and no grass there), keeps the value
noise's lattice hashes, and `landK`/`plazaK` stop allocating; the output is bit-identical (checksums of the mask and depth arrays,
`SP/r15/verify.js`). The WebGL test context is released. The map picture no longer re-sizes every pass's target. The signs are re-drawn
when the fonts arrive (a quicker build beat Bungee to it; a first-time visitor on a slow connection had the same bug).

**Menu.** Quality reads Auto / Smooth / Balanced / Pretty in the same cream-and-ink segmented control (`SP/r15/menu-cmp-phone.png`).

**The car is blue** (`#2f7de1`, palette 56), on the island, in the loader, in the switcher (`_shared/worldnav.js`, re-injected into the nine
districts) and in the favicon and its PNGs (re-rendered by the same pipeline, which reproduces the old PNGs pixel for pixel from the old SVG).
The antenna's red flag stays as the accent.

## Numbers

### A frame of play, driving (`SP/r15/prof.js`, 30 frames of the page's own `frame()` on a 60 Hz clock while the car drives itself)

Draw calls and triangles count every pass, shadow maps included (`renderer.info` with `autoReset` off: the r11 numbers counted only
the last pass of a post-processed frame). CPU is the per-frame update functions, timed in the page (sum of physics, locals, birds, tags,
view, car...); physics is inside it. JS is V8's own sampler over the whole frame, three.js's submission included (`SP/r15/cpuprof.js`,
60 frames, run alone). Measured at a pixel ratio of 1 (the harness's own); fill at the real device's ratio is the next table.

| Viewport, tier | Draw calls | Triangles | Shadow draws | CPU updates ms (physics) | JS ms/frame |
|---|---|---|---|---|---|
| 390 x 844, Smooth | 66 -> 58 | 85.9 k -> 85.1 k | 13 -> 5 | 4.50 (3.35) -> 2.33 (1.24) | 8.9 -> 6.4 |
| 390 x 844, Balanced | 119 -> 70 | 195 k -> 161 k | 54 -> 7 | 4.15 (2.91) -> 2.45 (1.29) | 10.9 -> 7.8 |
| 390 x 844, Pretty | 128 -> 82 | 302 k -> 250 k | 54 -> 8 | 4.08 (2.89) -> 3.11 (1.72) | |
| 1440 x 900, Smooth | 69 -> 60 | 119 k -> 119 k | 15 -> 6 | 4.44 (3.14) -> 2.45 (1.30) | |
| 1440 x 900, Balanced | 129 -> 89 | 249 k -> 224 k | 57 -> 19 | 4.52 (3.14) -> 2.77 (1.55) | |
| 1440 x 900, Pretty | 139 -> 94 | 345 k -> 294 k | 57 -> 12 | 4.55 (3.29) -> 2.69 (1.47) | 9.0 -> 7.6 |

(The scenery map's re-draws average in: 19 frames in 120 at 17 m/s, `SP/r15/shwhy.js`; none parked. Programs: 52/62/65 -> 38/48/51.)

### Fill, pixels x passes, at the device's own pixel ratio (`SP/r15/fill.py`, the passes as the code runs them)

"Samples" counts a 4x multisampled pass four times. The shadow column is the map drawn every frame (and what it holds).

| Device, tier | Buffer | Passes | Fill / frame | Samples / frame | Shadow every frame |
|---|---|---|---|---|---|
| phone 390 x 844 @3x, Smooth | 312 x 675 (0.8x) -> same | 1 -> 1 | 0.21 M -> 0.21 M | 0.21 M -> 0.21 M | 0.07 M, everything -> 0.07 M, 2 to 8 casters |
| phone @3x, Balanced (Auto on a recent phone) | 585 x 1266 (1.5x) -> same | 9 -> 8 | 2.36 M -> 2.17 M | 2.36 M -> 2.17 M | 1.05 M, everything -> 0.26 M, live only |
| phone @3x, Pretty | 585 x 1266 -> same | 18 -> 18 | 2.40 M -> 2.40 M | 2.40 M -> 2.40 M | 1.05 M, everything -> 1.05 M, live only |
| laptop 1440 x 900 @2x, Smooth | 1152 x 720 -> 1061 x 663 | 1 -> 1 | 0.83 M -> 0.70 M | 3.32 M -> 0.70 M | 0.07 M, everything -> 0.07 M, live only |
| laptop @2x, Balanced (Auto on built-in graphics, now) | 2160 x 1350 -> 1876 x 1173 | 9 -> 8 | 9.30 M -> 6.46 M | 18.0 M -> 6.46 M | 1.05 M, everything -> 0.26 M, live only |
| laptop @2x, Pretty (Auto on any laptop, before) | 2880 x 1800 -> 2433 x 1521 | 18 -> 18 | 16.8 M -> 12.0 M | 48.0 M -> 12.0 M | 4.19 M, everything -> 1.05 M, live only |

What Husam's laptop (built-in graphics) drew per frame: 48.0 M samples plus a 2048 px shadow map of everything; now 6.5 M plus a 512 px
map of a few live things, before Auto sheds anything. Every frame's shadow-sampling cost on Balanced drops from 17 taps to 4.

### The title and the opening flight (`SP/r15/titleprof.js`, at a pixel ratio of 1)

| Viewport, tier | Title: calls / triangles | Flight: calls / triangles / shadow draws a frame |
|---|---|---|
| 390 x 844, Smooth | 409 / 286 k -> 341 / 273 k | 428 / 308 k / 44 -> 333 / 286 k / 33 |
| 390 x 844, Balanced | 426 / 414 k -> 351 / 394 k | 508 / 502 k / 114 -> 391 / 453 k / 78 |
| 390 x 844, Pretty | 446 / 556 k -> 367 / 520 k | 517 / 677 k / 114 -> 401 / 604 k / 78 |
| 1440 x 900, Smooth | 444 / 364 k -> 389 / 354 k | 463 / 392 k / 46 -> 409 / 386 k / 34 |
| 1440 x 900, Balanced | 454 / 487 k -> 401 / 475 k | 552 / 592 k / 116 -> 460 / 552 k / 80 |
| 1440 x 900, Pretty | 474 / 628 k -> 411 / 599 k | 549 / 756 k / 116 -> 464 / 704 k / 80 |

The rest of the title's cost is fill, which the start tier and the pixel budget take care of (a laptop with built-in graphics now draws the
title at 1.3x with no depth of field and two bloom mips, where it drew 2x with 4x multisampling, DOF and five mips). The title's culling is
invisible: a fixed-pose render before and after differs only in the randomly placed fallen leaves (`SP/r15/title-diff.png`).

### Load (`SP/r15/ttff.js`; this machine's CPU, software GL)

| | DOMContentLoaded | First frame | Loader gone | Build (main) | of which the mask |
|---|---|---|---|---|---|
| 390 x 844 | 212 ms -> 214 ms | 2929 ms -> 2228 ms | 4482 ms -> 3931 ms | 2578 ms -> 1863 ms | 1189 ms -> 668 ms |
| 1440 x 900 | 194 ms -> 222 ms | 6155 ms -> 3817 ms | 9402 ms -> 6645 ms | 5666 ms -> 3398 ms | 4359 ms -> 2363 ms |

The page is 530 KB of HTML (the script is inline) plus three.js and cannon from `lib/`; DOMContentLoaded is at about 0.2 s, and the time
to the title is the build. The whole island is on the title's globe, so no chunk can be left for later; what could go was work that
changed nothing.

### Checks

- `SP/r15/sapcheck.js`: the new sweep gives cannon's pairs, same order, on 2,520 steps with up to 7 bodies awake: 0 differences.
- `SP/r15/verify.js`: the island mask and depth arrays have the same checksums before and after, phone and desktop; the start-tier table
  above; a change of tier after `precompileTiers()` compiles nothing new.
- `SP/r15/govtest.js`: GPU-bound 30 ms frames step down to step 3 and settle; a lighter scene steps back up and holds with hysteresis;
  a steady 60 steps all the way back; a 30 Hz screen tries two steps, sees no gain, undoes them and rests; CPU-bound asks for the lower tier.
- Before / after screenshots at the same spots and clock, Pretty on a 2x screen (`SP/r15/cmp-final-spawn.png`, `SP/r15/cmp-final-bill.png`):
  the same picture, the car now blue and casting its shadow; at full size (`SP/r15/crop-cmp-bill.png`) the 1.69x frame is a shade softer than
  2x with 4x multisampling, with no stair-steps. The menu (`SP/r15/menu-cmp-phone.png`): the same control, new words.
- The r10 suite as `SP/r14/tests.sh` runs it (`SP/r15/final-tests.txt`): phone newcomer 10 of 10 (8.2 to 9.6 s wall clock, 9.6 to 10.8
  before) and desktop (46.4 s, 88.7 before); all ten districts reached by driving with the same times and top speeds as before; camera
  anomalies 0 on desktop and phone; phone map; from-returns 9 of 9; tag ring; no console errors anywhere. `node world/_shared/qa.js island`
  0 issues; `python3 world/_shared/audit.py` 0 problems.

## Left as they are

- A real GPU's timings: nothing here ran on one. The governor is the answer to that uncertainty (it records each step it takes, with
  the frame and CPU times that caused it, in `gov.log`); the start tier's rules are a table that is easy to move.
- The title still draws about 400 calls (the whole island is in view); merging chunks for the globe would cut that, at a real cost in
  complexity.
- Grass has no distance LOD: its cost is its count (one triangle a blade), which Auto thins evenly.
- Static objects still recompute their matrices every frame (556 objects, about 0.3 ms).
