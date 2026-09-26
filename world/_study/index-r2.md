# Study, round 2: THE WORLD (`index.html`)

Round 1 (`index.md`) took the 2019 folio apart line by line. This round reads the **2025 folio source**, the
**Messenger** making-of plus its title screen, **Igloo Inc** and **Lusion** case studies (Abeto and Lusion are the
two studios behind the loaders and transitions everyone copies), **Jesse Zhou's** ramen shop (Three.js Journey
hall of fame), and **Slow Roads** as the "one road you drive" reference. Jordan Breton's floating-island folio
(FWA SOTD, Oct 2025) is noted for its station-to-station camera.

Sources: `github.com/brunosimon/folio-2025` (cloned: `sources/Game/*`), awwwards.com/messenger.html,
awwwards.com/igloo-inc-case-study.html, the Lusion SOTM case study, jesse-zhou.medium.com (ramen case study),
messenger.abeto.co and slowroads.io (Firecrawl screenshots + raw HTML), `github.com/Glowin/messager` (an open
Messenger clone, read for the spherical controller maths). Direct curl to the sites is blocked here; Firecrawl works.

---

## 1. bruno-simon.com, 2025 (source read)

**Engine loop** (readme): inputs → player pre-physics → vehicle → physics (Rapier) → objects → view → day/year
cycles → weather → zones → wind → lighting → interactive points → tracks → areas → foliage → fog → reveal.

**Camera** (`View.js`)
- `PerspectiveCamera(25°, aspect, 0.1, 200)`: a long lens. Spherical offset `phi = 0.27π` (0.31π on low quality),
  `theta = 0.25π`, radius lerped between 15 and 30 by zoom ratio; **non-ideal aspect adds up to +9** (portrait
  phones pull back instead of cropping).
- Zoom `baseRatio` 0.6 at load, eased to 0.3 in the reveal, wheel sensitivity 0.05.
- **Speed zoom**: `zoom.ratio += -0.4 * smoothstep(speed, 5, 40)`: the faster you go, the wider the view.
- Follow: `smoothed.lerp(target, delta*10)`. A "magnet" pulls the focus back to the car proportionally to distance
  (`0.25 * distance * delta`) after a pan.
- **Roll kick**: on hard impacts the camera rolls; spring with damping 4, pull 100, kick 1 (random sign).
- **Speed lines**: screen-space streaks converging on the car at high speed.

**Reveal** (`Reveal.js`, `World/Intro.js`)
- Loader = a **ring on the ground, radius 3.5**, filled by load progress (angle test in the shader).
- Ready: ring hides (`power4.in`, 1.5s), a grid shows, the reveal distance goes 0 → 3.5 with `back.out(1.7)` in 2s,
  the "press to start" label pops with `elastic.out(0.5)` 2s, plus an in-world sound button.
- Start: reveal distance 3.5 → 30 with `back.in(1.3)`, 2s (a glowing ring sweeping out across the world, colour
  from the time of day: `#5f7dff` day, `#ff86d9` dusk, `#b678ff` night, `#ff9d9d` dawn), zoom to 0 with `back.in(1.5)`.

**Day cycle** (`Cycles/DayCycles.js`): 4-minute loop, four presets. Each has light colour/intensity, **shadow
colour** (never black: `#6d3fff` day, `#4e009c` dusk, `#2f00db` night, `#db004f` dawn) and a **two-colour fog**
(day `#00ffff → #9b89ff`, dusk `#3e53ff → #ff4ce4`, night `#10266f → #490a42`, dawn `#f885ff → #ff7d24`).

**Fog** (`Fog.js`): the background is a **radial gradient in screen space** between fogColorA and fogColorB; the
fog blends every object into that same gradient, so the world dissolves into the sky with no horizon line.

**Interactive points** (`InteractivePoints.js`): a **diamond** (rotated square, dark `#251f2b` with a white inset
line; grows from its centre) plus a **label that slides out** from behind it (canvas text, Amatic SC 700, 64px
canvas, UV offset animated 1 → 0), plus an Enter key icon on hover. Paper-rustle sounds on reveal/conceal.
Areas: Landing (physical name bricks, a map kiosk, a controls kiosk, a bonfire whose embers drift with the wind),
Projects, Career, Lab, Social, Bowling, Circuit, Cookie, Toilet, Time machine, Achievements.

**Other 2025 details worth stealing**: tyre tracks drawn into a 512² top-down render target that follows the car
(40 units wide); the tab title animates while you drive (`Bruno` + a car glyph and trees scrolling by at
forward speed); respawn points; achievements ("Turtle: get upside down"); wind that bends grass and carries leaves.

**With Husam**: the diamond + sliding tag is the right way to label landmarks without writing paragraphs on the
ground (round 1's mistake: facts painted on the floor). The coloured-shadow presets and the reveal ring are the
"2025 polish" a flat-road direction needs.

## 2. Messenger (Abeto, 2025) — messenger.abeto.co

**What it is**: "It's a small planet, but someone's gotta make the deliveries." A 15-minute walk on a tiny round
planet; walk any direction and you come back to where you started (King Kai's planet).

**Title screen (screenshot)**: the whole planet floats centre-screen in a flat teal field `#65c1bc` with lighter
foam blobs `#6dcac0`/`#71d3c3`; the title is **three rows of chunky extruded block letters** (`MES / SEN / GER`,
off-white `#ebf0e2`, dark ink outlines) stacked *in front of* the planet; a single **yellow slab button**
`#f0d055` "BEGIN" with a darker bottom edge. Nothing else on screen.

**Making-of specifics**
- Challenges named: a camera that works at any angle, **keeping text and trees upright on a curved surface**,
  central gravity.
- World modelled as an **unwrapped cube**, then spherified (less distortion than deforming assets).
- Look: hand-drawn, imperfect, **outlines everywhere** with controllable thickness/colour.
- **Seven distinct spots** on the planet (neighbourhood, plaza, cemetery, beach, temple, forest, factory).
- **One 16×16 colour atlas** for every colour in the game: changing the lighting or mood of the whole world is
  one texture swap.
- Over-the-shoulder camera that **follows automatically**; **one finger on mobile**, mouse-only on desktop.
- No arrows, no tutorials: "discover the what and the how at your own pace".
- Per-area soundscapes; an NPC's guitar is spatialised so you can find him by ear.
- LOD that preserves silhouettes; strict memory budget for iOS Safari.

**Controller maths** (from the open clone): position lives on the sphere; moving forward = rotate the position
and the body about `axis = up × forward` by `speed*dt/R`; turning = rotate about the local up; re-snap to the
surface each frame; clamp `dt` to 0.1 so a background tab can't flip you.

**With Husam**: the road Fresno → Cambridge can *wrap the planet* (a spiral from one pole to the other), so the
shape of the world *is* the road idea the World owns. A tiny planet also answers "never feels bad in any
direction": there are no edges, no dead ends, and the next landmark is always over the horizon.

## 3. Igloo Inc (Abeto, 2024) — igloo.inc

- Only three sections, so the whole job is keeping a scroll *interesting*: a camera journey (previs first).
- **Intro rendered in real time** and flowing straight into the experience (no video, no cut).
- **Scene transitions: chromatic aberration + "tech" displacement + frost**, then kept as a motif in materials.
- UI drawn in WebGL: glitches and **text scrambles** (SDF offsets instead of DOM reflow).
- A procedural "ice growth" algorithm so every project block looks different ("they looked too similar when
  scrolling past": the same rule as Husam's "never repetitive").
- Links section: particles morph into a shape per link, colour by speed, glow while morphing, with sound.

**With Husam**: the transition into a district should be *one continuous real-time move* (not a CSS wipe that
cuts), with a short chromatic split as the frame breaks; every landmark must have its own silhouette.

## 4. Lusion (2019 SOTM; lusion.co)

- "You don't need to do everything real time": pre-baked cloth sims blended at runtime; matcaps + baked AO.
- Unifying many small visuals with **sound, overlaid objects and masks** so transitions feel seamless.
- Real-time reflection, analytical volumetric light, blurry 3D type; camera freedom kept tiny (~1.72°) so baked
  lighting stays convincing.
- The loader and page transitions are part of the scene, never a separate screen.

**With Husam**: bake what can be baked (matcap-like toon ramps, painted ground), and let sound + a mask carry
the cut between the world and a district.

## 5. Jesse Zhou's ramen shop (Three.js Journey selection)

- A night scene with **selective bloom** on neon, a subtle low-res **Reflector** floor, a points hologram.
- Camera moves between **hard-coded stations with GSAP** (`power1.inOut`), controls disabled for 1.5s.
- Screens are images with invisible raycast hitboxes.
- **Adaptive quality**: measures the device on load and drops reflections, bloom, video until ~45 fps.

**With Husam**: adaptive quality is the right way to honour the phone pixel-ratio/MSAA limits; the
"stations" camera is how the Map should fly between landmarks.

## 6. Slow Roads (topograph.io) — slowroads.io

- Title: a thin, very widely tracked lowercase wordmark with a soft glow, a white pill "begin" button, the live
  road behind it at dusk: burnt-orange sky `~#8a5a42` fading to grey-green hills, heavy atmospheric haze.
- Low **chase camera behind the car**, one road that forms ahead of you forever; no goals, no score.
- "Endless driving zen": the pleasure is the horizon and the light, not the tasks.

**With Husam**: the most literal "one road from Fresno to Cambridge": a chase-cam drive where landmarks come
up at the roadside like exits. Risk: linear, easy to feel repetitive, and the camera hides the map.

## 7. Jordan Breton (FWA SOTD 2 Oct 2025)

A contemplative floating island (grass, waterfall, fire, wind, butterflies); the camera moves from fixed point
to fixed point. Takeaway: wind and small living things make a world feel inhabited without text.

---

## What each would look like with Husam's content (only what the World owns)

| Reference | Husam version |
|---|---|
| Bruno 2025 | Flat Central Valley slab, one road; diamond tags with teasers; reveal ring in the visitor's time-of-day colour; name as physical bricks. |
| Messenger | A tiny planet; the road spirals from the Fresno pole to the Cambridge pole; nine landmarks on the surface; title = planet + blocky HUSAM SOKAR; yellow slab button. |
| Slow Roads | A chase-cam drive down one road at dusk; exits appear as green signs over the road; Cambridge at the end. |
| Igloo / Lusion | Continuous real-time intro and a masked, chromatic transition into each district; sound carries the cut. |
| Jesse Zhou | Adaptive quality tiers; a station-to-station camera for the Map. |

## Rules I'm carrying from the brief
- Teasers only on every label, sign and map line: a question, a pun, a mood. No numbers, organisations, bills,
  places a district owns. Round 1 broke this everywhere (bill numbers on the ground, "Coca-Cola" on the Pier sign).
- Keep: `#from-<page>` spawn, the every-visit intro, the visitor's clock, opt-in sound, the touch joystick, phone
  pixel-ratio and MSAA limits. Never style a bare `.touch` class (round 1's `<html class="touch">` bug).
