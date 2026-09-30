# Round 10, Brief B (world art): running checklist

Each element is marked done only once its side-by-side screenshot against folio-2025 (running locally, the same camera and moment)
proves it. Screens live in the session scratchpad (`r10-b-*`); the sheets are `r10-b-sheet-desktop.png` and `r10-b-sheet-phone.png`.
Legend: [ ] not started, [~] built and iterating, [x] done (proved by a side-by-side).

| # | Element (spec section) | State | What Bruno does (source) | Ours | Proof / notes |
|---|---|---|---|---|---|
| 1 | Ground: orange dirt, depth gradient, grass mat, slabs, asphalt (4.1) | [~] | `Terrain.js` gradient `#ffa94e`/`#5bc2b9`/`#13375f`, `Floor.js` slabs = R x noise, shadowNode = G | re-made in GLSL, our mask; dirt warms south to north | |
| 2 | Clean anti-aliased road / plaza edges (4.1) | [~] | - | road and slab edges stored as signed-distance ramps, cut with fwidth | |
| 3 | Grass: dense blades, wind, colour variation, parting (4.2) | [~] | `Grass.js` 280 x 280 blades wrapping the view footprint | port; 280 / 220 (180 phone) / 120 by tier; parting under the car; tracks erase it | |
| 4 | Trees and bushes: leaf-card clusters, autumn colours, sway, see-through (4.3) | [~] | `Foliage.js` 80 cards / cluster, SDF alpha 0.3, colour by N.L, see-through 3/R..15/R | port; our own leaf SDF (21 almond leaves per card); oak / almond / maple, bushes | |
| 5 | Water: channels, ponds, ripples, foam edges, depth colour (4.5) | [~] | `WaterSurface.js` shore line + ripple bands on the depth, ground gradient under | smooth channels (east one under the Bridge), 4 ponds, shore line, ripples | |
| 6 | Flowers (4.4) | [~] | `Flowers.js` 8-card clusters, heads sunk 0.75 m | port, white / lilac / butter | |
| 7 | Pebbles and rocks (4.4) | [~] | pale lilac low-poly pebbles | instanced, on dirt and shores | |
| 8 | Falling leaves (4.4) | [~] | `Leaves.js` 2^7..2^11 cards pushed by the car | CPU port, 1024 / 512 / 256, drift from crowns, burst on a tree hit | |
| 9 | Fences, lanterns, benches, crates, props (4.4) | [ ] | lanterns glow, benches, fences, crates everywhere | | |
| 10 | Birds with a real flight animation (4.6) | [~] | none (Messenger: white paper birds) | jointed wings, flap bursts and glides, banking, scatter on the horn | |
| 11 | Locals re-made, idle and talk animation (4.7) | [~] | none (Messenger NPCs) | Messenger proportions, blink, glance, talk bob and gesture, 4 walk loops | |
| 12 | Lighting and palette per time of day (4.8) | [~] | `MeshDefaultMaterial` + `DayCycles` presets | ported in linear space; bounce; waterline; our hues, his relationships | |
| 13 | Fog as the background (4.8) | [~] | `Fog.js` two-colour screen gradient, near/far from the footprint | ported; background quad = the fog | |
| 14 | No black outlines (4.9) | [x] | none | the island has no outline shells | |
| 15 | Bloom (4.9) | [~] | threshold 1, strength 0.25, 5 mips / 2 | inline UnrealBloom-style pass, float target | |
| 16 | Tilt-shift DOF (4.9) | [~] | `cheapDOF` 25-tap hash blur, smoothstep(0.2, 0.5, abs(y - 0.5)) | inline, from a half-size copy, top tier only (his mobile tier has none) | |
| 17 | Plazas as rich as his areas, told apart only visually (5.B6) | [ ] | | | |
| 18 | UI: square icon buttons top right (4.13) | [ ] | two small square buttons | | |
| 19 | Quality tiers, change only while parked; phone performance | [~] | `Quality.js` | 3 tiers; software GL starts low; a manual change waits for the car to stop | |
| 20 | Frame cost at 390x844 and 1440x900 vs Brief A | [ ] | | | |
| 21 | Tests, qa.js, audit.py, no console errors | [ ] | | | |
