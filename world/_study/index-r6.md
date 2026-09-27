# Study, round 6: THE WORLD (`index.html`), graphics and animation

Husam: "refine all the graphics to be even better and cleaner and better animated ... rely only on inspiration and think
ambitiously", and then, through the lead: "much room for improvement on design specifically": composition, palette,
silhouettes, the ground, the HUD, motion. Same planet, road, landmarks, look, title and red 3D name.

## Sources read this round
- **folio-2025** (clone in the scratchpad): `Materials/MeshDefaultMaterial.js`, `Ligthing.js`, `Fog.js`, `World/Foliage.js`,
  `World/Grass.js`, `World/VisualVehicle.js`, `World/Bubble.js`, `World/Intro.js`, `InteractivePoints.js`, `Reveal.js`,
  `View.js`, `Title.js`, `style/*.styl` (menu, notifications, tabs, interactive buttons).
- **folio-2019**: `World/Shadows.js`, `shaders/shadow/fragment.glsl`, `World/Car.js`.
- **Messenger** (messenger.abeto.co is blocked by the proxy, as are awwwards, dev.to and aftermath): the real site's shipped
  bundle and shaders, mirrored in `github.com/arafays/messenger-copy` (`reference/messenger.abeto.co/`: `App3D-*.js`,
  `shaders/port-outlines`, `shaders/port-waterMaterial`, the UI `.vert` shaders, the title screenshot); search snippets of
  the Awwwards case study (16x16 colour atlas, blob foliage swapped for stylised grass, shore ripples and deep gradients,
  vibrant colour blocks with clear outlines).
- Jesse Zhou: no technical write-up reachable (search only returns his course bio); his adaptive tiers were already taken in
  round 4 and stay.

## Frame-by-frame comparison, and what changed

| What I looked at | Reference, specifically | Before (round 5) | Now |
|---|---|---|---|
| Ground | Messenger: "stepped gradients" by distance (`smoothstep(.3, 0., step(.2, vDist - noise))`), colour blocks | the planet's colours were per face, so valley gold, green and fields met in zig-zag triangle edges; the ground was flat colour | colour is a smooth per-vertex field cut in the shader with `fwidth` anti-aliasing: curved, crisp patch edges, plus a lighter/darker mottle in two steps. Planet detail 22 to 28 |
| Grass | Bruno 2025 `Grass.js`: blades are the ground's own colour, only the tips change | dark tufts on light ground read as scratches (the noisiest thing on screen) | tufts start in the lit ground colour and only the tip lightens; far-side tufts are culled; phones draw 45% (was 60%) |
| Shadows | Bruno 2019 `Shadows.js`: a rounded patch under every object, `sineInOut` rim (`uFadeRadius .35`), alpha `((3 - z) / 3)^2`, offset by the sun vector times height, coloured (`#d04500`, not black); Messenger cuts shadows hard (`smoothstep(.2, .4)`) and derives the shadow colour from the lit one | nothing touched the ground: trees, houses, the car and props floated | one baked mesh of contact shadows (trees, houses, rocks, landmarks, lamps, locals) and an instanced set for the car and every prop, fading and spreading as they rise; pushed away from the light by height per vertex; purple from the day cycle's shadow colour; a narrow sine rim so edges read crisp. No shadow map: no acne, no flicker, one draw call each |
| Atmosphere | Messenger `addFog`: `1 - exp(-(density * d)^2)`, near/far fog colours `#93a2bf` / `#9ea7b8`; Bruno 2025 `Fog.js` fogs to the background gradient | the limb was a hard ink line against the sky | exp-squared fog to the sky colour starting at the car's distance, so the far hills and houses soften into the sky; from orbit it starts past the near face |
| Outlines | Messenger `port-outlines`: colour `#373f42`/`#363a3c` (blue-grey, not black), `uOutlineFade (5, 80)` so they fade with distance, thickness scaled `resolution.y / 1300` | 2.5 px everywhere, at the title a scribble of black rings round a hundred tiny paper objects | base width 0.0019 to 0.0016, thinning to half with distance, fogged like the surface, and on the unpainted paper planet a soft pencil (`mix(outline, paper, .38)`) so the red name reads first |
| Foliage in the way | Bruno 2025 `Foliage.js` `seeThrough`: foliage near the car's screen position fades (edges `3 / radius` to `15 / radius`) | a big pink almond or a cloud could cover the car on a phone | trees in front of the car near its spot on screen, and anything right in front of the lens, dissolve with a screen dither (worked out per vertex) |
| Clouds | (none in Bruno 2025; Messenger's clouds sit round the planet in the title) | they sailed through the play camera, filling a phone screen with white | they climb 22 units above the camera on the road and come back down for the title and map |
| Toon edge | Bruno 2025 core shadow is a soft `smoothstep`; Messenger keeps it crisp | a hard 0.06-wide step that stair-stepped | same crisp band, anti-aliased with `fwidth` |
| Water | Messenger `port-waterMaterial`: waves = `fract(noise * .7 + dist * 3 + time * .1)` gated to a band near the shore, white foam, `step`ped cyan bands by distance | a foam ring and stripes | stepped bands by distance to the bank (foam, a pale shallow band, three deeper steps), wave lines rolling toward the bank and broken up by noise, fogged |
| Lamp posts | Bruno 2025 pole lights: thin grey posts | heavy ink posts that read as a black "7" | slim grey post on a footing, lamp under a dark hood |
| Composition (phone) | Bruno 2025 `View.js` pulls back on portrait (`ratioOverflow`); Bruno 2019 tweens the camera to another angle in the projects area (`gsap 2s power1.inOut`) | a third of a phone screen was sky; parked at the Capitol, the building was off the left edge | on tall screens the camera tilts further down; near a landmark's lay-by the view leans toward the building and, on a phone, steps back a little, eased slowly |
| Car | Bruno 2025 `VisualVehicle`: wheels follow their suspension `+= (y - cur) * 25 * dt`, steer eased at `dt * 16`, blinkers 0.8 s on/off while steering, stop and reverse lights | wheels were glued to the body, so they pitched and rolled with it | wheels sit on the ground in the car's frame and the body rides over them on a heave spring: it stretches on a hop, compresses and squashes on landing, chatters off the road; wheels hang when airborne; amber blinkers while steering; white reversing lights |
| Title letters | Bruno 2025 `Intro.js` label: `elastic.out(0.5)`, 2 s, 1 s delay | letters appeared static | each letter pops in with an elastic scale in reading order, then bobs and tilts slightly out of step with its neighbours |
| Tags | Bruno 2025 `InteractivePoints`: open `elastic.out(1.3, 0.4)` 1.5 s, label `power2.out` 0.6 s after 0.2 s; close `power2.in` 0.6 s | a linear lerp | label slides with power2.out after 0.2 s, the tag springs from 55% with elastic.out, closes with power2.in |
| Bubbles | Bruno 2025 `Bubble.js`: show `back.out(3)` 0.5 s, hide to 0.01 over 0.3 s | back.out(2) 0.35 s, vanished instantly | back.out(3) 0.5 s in, shrinks away over 0.3 s |
| Locals | Messenger: locals talk with their whole body, blip as they type | a hop and a tiny bob | they breathe (scale), bob and nod with the blips while typing, and lean toward you |
| Notices | Bruno 2025 notifications: in `cubic-bezier(.4,1.6,.65,1)` 0.6 s, out `scale(0)` with `cubic-bezier(.42,0,.47,-.55)` 0.45 s | slid back the way they came | leave by winding up and shrinking to nothing, same curve and time |
| Settings pages | Bruno 2025 tabs: content out 0.15 s, in 0.15 s later | swapped instantly | the new page rises in over 0.3 s |
| Wind | Bruno 2025 `WindLines.js`: a white streak every 0.3-2 s, duration `remap(wind, 0, 1, 8, 2)` | wind only in grass and canopies | five pooled streaks spawned in view along the wind, more often and quicker as it blows harder; off in rain, dim at night, off on Low and in reduced motion |

| Landmark silhouettes | Messenger: each spot recognisable from its outline; Bruno 2025's areas each have one tall marker | the Plaza was a flat square and the Garage a grey crate | the Plaza has a clock tower at its back (square column, white clock head, pyramid roof); the Garage has a gable roof. Their tags moved up to match |
| Tags against the HUD | Bruno 2025 keeps interactive points in the open view | at the Capitol the tag slid under the plate | near the top of the screen a tag eases down its building until it clears the HUD band |
| Going in | Bruno 2025 `InteractivePoints` interact pulse (threshold to 0.6 in 0.1 s, back with `elastic.out(1.3, .6)`) | the tag stayed still | the tag springs again and the car dips on its springs as you go in, then the dive, split and wipe as before |
| Sticker card (phone) | Bruno 2025 notifications: a card sized to its content, top centre | a full-width bar under the plate | a compact card fitted to its words, centred |

## Bugs found while comparing
- Fireflies wrote alpha 1 with additive blending, so by day they punched **black dots** into the transparent canvas over the
  sky (the "black balls" beside the Garage's mechanic in every round-5 screenshot). They now write their glow as alpha.
- The plate slid up by 160% of its height, leaving its 5 px drop shadow as a black sliver at the top of the title screen.

## Performance (software GPU, SwiftShader; `r6-perf.js`, the car driving from the Capitol, quality pinned)
Mean fps over three alternating runs each (base = the file as it stood at the start of round 6):

| | base | round 6 |
|---|---|---|
| phone 390x844, High (DPR 1.5) | 10.1 | 9.9-10.0 (parity; a later 2-run check: 9.65 vs 9.75) |
| phone, Low (DPR 1) | 16.6 | 15.9 (about 5% slower driving; equal when parked) |
| desktop 1440x900, High | 4.37 | 4.27 |
| desktop, Low | 5.3 | 5.0 |

Page JavaScript per frame is unchanged (about 2.0-2.6 ms). The new look costs fragment work (fog, see-through, ground field, shadows); part of the remaining Low cost is simply more ground in frame on a phone (less free sky) and the lean toward
landmarks. It is paid back by welding the world into indexed meshes (105k to 34k vertices for the solids, 55k to 14k
for the roads, 40k to 7k for the planet), only the foliage using the discarding see-through material (so everything
else keeps early depth testing), skipping invisible draws (clouds above the play camera, stars and glows by day, idle
dust and confetti), culling everything past the horizon in the vertex shader (the world is one merged mesh, so it used to be rasterised in
full), culling far-side grass, fewer tufts on phones, fog moved per vertex, and the reveal's `acos` only running while the
reveal runs. MSAA on phones was measured (about 30% slower under SwiftShader) and left off; the toon band and ground
patches are anti-aliased in the shader instead.

## Tests (scratchpad `r6-*.js`)
`r6-shots.js` (before/after set: title, flight, start, road, lay-by, local, dusk, night, rain, settings, map, trial),
`r6-perf.js` (base vs new, phone 390x844 touch and 1440x900), `r6-prof.js` (per-layer cost), `r6-ab.js` (feature A/B),
`r6-quick.js` (one view). The round-5 newcomer test and the round-4 trial and function tests still run.
