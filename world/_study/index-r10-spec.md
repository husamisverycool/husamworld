# Round 10 spec: rebuild the hub from the references, element by element

Husam: "the characters and landscape and sensitivity and designs of trees and stuff on the side and birds and literally
everything remained unchanged ... actually look at the sources of inspiration and truly, deeply, authentically understand exactly
what's happening ... how the world is shaped, every element of the world."

Nine rounds read the references. This round **ran** them, drove them, and measured them. Everything below is either a number
logged from the running app (60 Hz, deterministic), a constant read from the source that produced that number, or a screenshot you
can open. Where a number is "real" it is in real seconds; Bruno's game clock runs at **2x** (`Ticker.scale = 2`), so his own
units (`physicalVehicle.speed`, gravity, forces) are converted here.

Scratchpad (all captures and scripts): `/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/`
(called `SP/` below). Contact sheets that put the frames side by side: `SP/r10-sheet-*.png`.

---------------------------------------------------------------------------------------------------------------------------------

## 0. What ran, and how

| Reference | Ran? | How | Captures |
|---|---|---|---|
| **Bruno Simon folio-2025** (MIT, HEAD `41046b5`) | **Yes, fully.** Desktop 1440x900 and phone 390x844 with touch. | `npm i --legacy-peer-deps`, `vite` on :5173 with `.env.local` `VITE_GAME_PUBLIC=1` (exposes `window.game`). WebGPU is absent under SwiftShader, so three's `WebGPURenderer` fell back to its **WebGL2 backend** and rendered everything (bloom, DOF, grass, foliage, water). The harness stops the animation loop and steps `game.ticker.update()` at exactly 1/60 s, rendering only for screenshots, so the physics runs at a true 60 Hz. | `SP/r10-ref-b25-*.png` (70 frames), telemetry `SP/r10-ref-b25-tel.json` + readable `SP/r10-ref-b25-tel.txt`, drive logs `SP/r10-ref-b25-desk-log.json`, `SP/r10-ref-b25-phone-log.json`. Scripts `SP/r10-b25lib.js`, `r10-b25-desk.js`, `r10-b25-tel.js`, `r10-b25-phone.js`. |
| **Bruno Simon folio-2019** (MIT) | **Yes** (desktop drive; the phone got as far as the Start pad). | `vite` on :5174, `window.application`. | `SP/r10-ref-b19-*.png`, `SP/r10-sheet-b19.png`. Script `SP/r10-b19.js`. |
| **Messenger** (abeto; shipped bundle mirrored in github.com/arafays/messenger-copy) | **Partly: the real shipped build boots and renders its title planet; gameplay never finishes loading.** | messenger.abeto.co is blocked by the egress proxy (403 on CONNECT), so the page is served from the mirror by routing `https://messenger.abeto.co/*` to `reference/messenger.abeto.co/`. The mirror is missing: `libs/glyph/glyph.{js,wasm}` (abeto's proprietary text engine; stubbed, so all text is blank), `libs/draco/*` (supplied from three.js), the **player avatar** (`geometries/avatar/*`, stood in by the `fox` NPC), the collision `hitmesh_*` and `full-lod-*` files (stood in by `full_*`), `emojis/*.drc`, `planets/present/grass.drc` and `butterflies.drc`. With stand-ins the loader gets through everything except the grass/butterfly instancing ("Geometry does not have a instanceId attribute") and stays on "Loading" forever. So gameplay numbers for Messenger come from its **shipped bundle source** (`App3D-BLRWK1h9.js`, readable property names) and its art from the title planet. | `SP/r10-ref-msg-title-desk-*.png`, `-phone-*.png`, crop `SP/r10-ref-msg-title-crop.png`, the game's own share image `SP/r10-ref-msg-social.jpg`. Scripts `SP/r10-msglib.js`, `r10-msg-explore.js`, `r10-msg-title.js`, shims `SP/r10-msglibs/`. |
| **Ours** (`world/index.html` at `684847d`, round 9) | Yes | `python3 -m http.server 8820`, the round-9 hook (`r9-lib.js`). Free-camera close-ups use a patched copy `SP/r10-ours-fc.html` (adds a `window.__FC` camera override); `world/index.html` is untouched. | `SP/r10-ours-*.png`, `SP/r10-sheet-ours*.png`, `SP/r10-ours-desktop-log.json`. Scripts `SP/r10-ours.js`, `r10-ours-close.js`. |

The one-picture summary: open `SP/r10-sheet-b25-drive.png` next to `SP/r10-sheet-ours.png`. Bruno's world is a **diorama seen from a
fixed 3/4 angle**, carpeted in grass, full of loose objects, with the car large, side-on and physical. Ours is a **ball seen from
behind the car**, bare sand with a few tufts, the car a small rectangle seen from above.

---------------------------------------------------------------------------------------------------------------------------------

## 1. World shape: the decision

### Evidence
- **Bruno 2025 is a flat, bounded square island**, 192 x 192 m (`Terrain.size = 192`), sea all round, heightfield floor. Land is
  flat (y = 0); water channels and the sea are *dips* in the same floor (`y -= 1.5 * depth`, `Floor.js`), water surface at y = -0.3.
  See the map `SP/r10-ref-b25-ui-map.png`: a race circuit on the left third, paved plazas (the areas) linked by tiled paths in the
  middle, meandering water channels, 70 trees (24 oak, 26 birch, 20 cherry), bushes and flowers everywhere.
- **Everything in Bruno's look depends on flatness:** the fixed 3/4 camera (a sphere has no fixed "north-east" to look from); the
  grass (a 280 x 280 blade grid that wraps round the camera's view footprint on a plane); the one directional shadow map sized to the
  view footprint; fog computed from the view footprint's near and far edges; the heightfield physics under a real raycast vehicle
  (suspension, flips, jumps, crates flying). On our R = 32 ball, a camera at Bruno's 31 m / 34 deg would see the planet's limb a few
  metres past the car (the horizon from 1 m up on R = 32 is 8 m away).
- **Messenger is a sphere**, but it is a *walking* game on a planet dense with cliffs, houses and rock (`SP/r10-ref-msg-social.jpg`,
  `-title-crop.png`); its camera is a close chase camera (`relativeCameraPosition (0, 2, 5.75)`, phi clamped to 45..135 deg) that
  re-centres slowly behind the walker. Nothing in Messenger drives.
- **Driving is the product.** Husam's complaints are the driving, "what's surrounding the driving, what's surrounding the car, and
  what the world looks like". The reference for all four is Bruno 2025.
- Our planet: R = 32 (circumference 201 m, area 12,900 m^2), a 387 m road that spirals round it (so every stretch sees the next),
  10 stops. Bruno's island has ~22,000 m^2 of land at the same car size (both cars are 2.6 x 1.7 m).

### Recommendation: **change to a flat, bounded island (Bruno 2025), and keep the planet as the brand, not the ground.**
1. The drivable world becomes a flat island about **200 x 200 m** in the sea, shaped (outline, channels, paths) like Bruno's but
   laid out for our route. The road from Fresno to Cambridge becomes a long **loop** across the island (Bruno's circuit is the model:
   dark asphalt, red/white kerbs, `SP/r10-ref-b25-circuit-idle.png`), with each stop a paved **plaza** off it (Bruno's areas).
2. The **planet stays** where it already works: the loading screen, the favicon, the title (the island seen from far above, then
   the camera descends into Bruno's view, exactly as Bruno's intro ring expands), and the map's frame. The island may be drawn on a
   globe on the title screen (a round island on a small sea-globe, like Messenger's title planet) and then "unrolled" as the camera
   comes down; that keeps the tiny-planet identity Husam liked without making it the ground under the wheels.
3. Do **not** fake curvature in play (no "rolling log" bend). It breaks the fixed isometric read and the grass/shadow footprint.

### Trade-offs and what it costs
| Thing | Cost |
|---|---|
| Road | Rewrite `roadAt/roadTan/roadSide/nearestRoad` on a 2D Catmull-Rom spline (simpler than the sphere). The painted lane arrows, exit teasers and the time-trial gates move to 2D. |
| Landmarks | Each of the 10 buildings keeps its model; placement changes from a normal on the sphere to (x, z, rotY). All `moveOn`/`frameAt` sphere maths goes. Each gets a Bruno-style plaza (tiled slab ground, a diamond interactive point, a respawn). |
| Map | Much easier: a top-down orthographic render of the island (Bruno's `Map.js` is exactly this) with pins; clicking a pin **respawns** the car there (Bruno) or keeps our self-drive. The spherical map pose goes. |
| Switcher / `#from-<page>` return | Unchanged in logic; the return point becomes that plaza's respawn (x, z, rot). |
| Physics | Radial gravity and the kinematic car go; a real raycast vehicle on a flat heightfield comes in (section 2). This is the single biggest feel change and it is only easy on a plane. |
| Loading screen, favicon, title | Kept. The title's camera path changes (orbit the island, then descend). |
| Weather, day cycle, clouds | Clouds become a flat layer high above (or are dropped; Bruno has none), birds fly over the island. |
| Risk | This is a rebuild of ~70% of `index.html`. Split it as the two briefs in section 5, in that order. |

If Husam vetoes the change, section 6 lists the minimum to make the planet read like the references; it will still not feel like
Bruno, because the camera cannot be.

---------------------------------------------------------------------------------------------------------------------------------

## 2. Driving model and feel

### 2.1 What Bruno 2025 does (source `Physics/PhysicsVehicle.js`, `Player.js`; numbers from `SP/r10-ref-b25-tel.txt`)
It is a **Rapier `DynamicRayCastVehicleController`** (the Bullet/cannon raycast vehicle) on a heightfield, stepped with
`timestep = realDelta * 2`, gravity -9.81 (so, in real time, it falls like 39 m/s^2: snappy, toy-like).

| Constant | Value |
|---|---|
| Chassis colliders | main cuboid half-extents (1.3, 0.4, 0.85) at y -0.1, mass 2.5, centre of mass y -0.5; top (0.5, 0.15, 0.65) at y 0.4; bumper (1.5, 0.5, 0.9) at x 0.1, y -0.2 (hits props only); friction 0.4; never sleeps |
| Wheels | 4 at (+-0.90, 0, +-0.75), radius 0.4, direction (0,-1,0), axle (0,0,1); frictionSlip 0.9; sideFrictionStiffness 3; maxSuspensionForce 150; maxSuspensionTravel 2; suspensionCompression 10; relaxation 2.7 |
| Suspension rest length / stiffness | low 0.88 / 20 (normal), mid 1.23 / 30 (lowrider keys), high 1.63 / 40 (jump) |
| Engine | force per wheel = `accel * (1 + boost*2) * 300 / (1 + max(0, speed - top)) * dtScaled`, all four wheels; `top` = 5 (10 m/s real) or 40 boosting. The "top speed" is soft: past it the force divides, it does not stop. |
| Brakes | brake key: 35 * dtScaled per wheel; no input: idle brake 0.06 * 35; pressing against the direction of travel above 0.5: reverse brake 0.4 * 35 and no engine until slowed. |
| Steering | front wheels only, `steer = input * 0.5 rad` (28.6 deg). Keys give exactly -1/0/+1, **no ramp**; the visual wheel eases at `16 * dtScaled`. |

Measured (real m/s, real seconds; car on open flat ground):

| Manoeuvre | Bruno 2025 measured | Ours now (code) |
|---|---|---|
| 0 to ... (W) | 8.3 m/s @0.25 s, 13.8 @0.5, 15.9 @0.75, 17.6 @2.5, 19-21 @4-5 s (soft cap) | 14 m/s^2 tapered: ~3.5 @0.25, ~6.8 @0.5, 11 top @~1.5 s |
| Boost (Shift+W) | 13.7 @0.25, 23.7 @0.5, 29 @0.75, 33-37 m/s @1-2 s | x1.45 accel, top 17.6 |
| Coast (release) | 33 -> 15.5 in 1.0 s -> 4 in 1.5 s -> 0 at ~2.7 s; from 18 m/s stops in ~1 s | decel 2.1 + 0.32 v (11 -> 0 in ~2.6 s) |
| Brake (B) | 18 -> 4.5 m/s in 0.5 s, rear wheels lift (wc 2), nose dives | 26 m/s^2 |
| Reverse (S) | the same curve as forward: 7.7 @0.25, 14.9 @0.75, 20 m/s @2.75 s | -5.5 m/s cap |
| Full-lock turn | yaw **2.0-2.2 rad/s** at 12-13 m/s (speed bleeds 17.5 -> 12.5 in the turn), radius ~6 m, slip 4-8 deg; from rest already 1.4 rad/s at 0.25 s | eased wheel (10/s), yaw capped 12.5/v = **1.1 rad/s** at 11 m/s |
| Drift | no drift code: the rear steps out on its own when boosting into a turn or over a bump (slip 76-120 deg observed, the car can roll over at 30+ m/s) | scripted slide when brake/boost > 5.5 m/s |
| Jump (Space) | holding Space raises the rest length 0.88 -> 1.63: the chassis pops **~1.0 m** and is airborne **~0.5 s**; while held it rides 0.84 m higher on stiff springs; release drops it | double-tap Space: hop 1.06 m, 0.65 s |
| Lowrider | keys 1-4 / numpad lift single corners to 1.23 (tilting the car); H honks and bounces one random wheel for 0.15 s | H honks + hop 0.7 |
| Upside down | ratio > 0.3 for 3 s -> auto-flip: impulse 5 * mass up + a torque (repeats until upright) | n/a |
| Stuck | < 0.5 m travelled in 3 s while pushing -> "Unstuck" button (respawn) | same idea |
| Collisions | every prop is a rigid body: letters of the name, crates, bricks, fences, benches, lanterns, bowling pins; explosive crates blow up and throw the car (`SP/r10-ref-b25-straight-1p5s.png`, `hit-2s.png`); trees are fixed | kinematic push-out, props on cannon |

### 2.2 Keyboard and touch
- **Keys (Bruno):** W/Up, S/Down, A/Left, D/Right; Shift boost; B or Ctrl brake; Space jump (hold = high suspension); 1-4 and
  numpad lowrider corners; H honk; R respawn to the nearest respawn; E/Enter/F interact; mouse wheel zoom; mouse **drag pans the
  camera** (the focus point stops tracking the car; any driving key snaps tracking back).
- **Touch (Bruno, `Inputs/Nipple.js`, `SP/r10-ref-b25-phone-touch-*.png`):** there is no on-screen stick. Put a finger anywhere:
  it is ray-cast onto the ground plane at the car's height. A ring is drawn **on the ground round the car**: inner radius 2 m,
  outer 4.5 m (plus 0.1 edge, 0.2 outline). `progress = clamp((dist - 2) / 2.5, 0, 1)`, `accelerating = progress^3`.
  Steering = the angle between the car's heading and the finger's direction, divided by 135 deg, clamped to +-1. The forward cone is
  270 deg wide; a finger in the 90 deg behind the car means **reverse** (both throttle and steering flip). A tap that starts inside
  the inner 2 m circle is a **jump** (all four wheels 'high' for 200 ms). Two fingers pan and pinch-zoom. The ring shows a filled
  arc from the heading to the finger, brighter (x1.5) at full throttle.
- **Ours:** a floating left-thumb stick (or "Point"), keys with an eased wheel and a road assist.

### 2.3 The change (Brief A)
1. **Replace the kinematic car with a raycast vehicle using Bruno's numbers verbatim.** Vendor `@dimforge/rapier3d-compat@0.17.x`
   (Apache-2.0, WASM inlined, one file, no bundler) into `world/lib/` and port `PhysicsVehicle.updatePrePhysics/PostPhysics` with
   every constant in 2.1, stepping `world.timestep = min(dt, 1/30) * 2` with gravity (0, -9.81, 0). This reproduces the measured
   table exactly. (Fallback if the 1.5 MB is refused: cannon's `RaycastVehicle`, already in `lib/`, same Bullet model; keep the same
   numbers and the x2 time scale, tune `frictionSlip` until the full-lock turn measures 2.0-2.2 rad/s at 12-13 m/s.)
2. Keys map exactly as Bruno's (above). Keep our extras only where they don't conflict: M map, O settings, T trial, P plain page.
   **Space becomes jump (hold)**, B/Ctrl brake. Remove the road assist and the eased steering: keys are instant -1/0/+1.
3. **Touch: replace the stick with Bruno's ground ring** exactly as in 2.2 (same radii, cubic throttle, 135 deg steering
   normalisation, reverse cone, tap-to-jump inside 2 m). Keep "tap a sign to self-drive" (it is ours and it works).
4. Respawn, unstuck (3 s / 0.5 m) and auto-flip (3 s upside-down, impulse 5 * mass) as Bruno.
5. Props: every roadside object that is not a tree or a building is a rigid body you can knock over (our name letters already are;
   add crates, fences, benches, bins, cones, the exploding crate). Trees are fixed colliders (a trunk cylinder); hitting one rolls
   the camera (`roll.kick`, below) and sheds leaves.
6. Acceptance test (reuse `SP/r10-b25-tel.js`'s runs against ours): the twelve rows of the table in 2.1 within +-15%.

---------------------------------------------------------------------------------------------------------------------------------

## 3. Camera

### 3.1 Bruno 2025 (`View.js`; logged per frame)
- **The camera never turns with the car.** It sits on a fixed spherical offset from a smoothed focus point:
  `theta = 0.25 PI` (it is always to the +x +z side, looking toward -x -z), `phi = 0.31 PI` on high quality (**34.2 deg above the
  horizon**; 0.27 PI = 41.4 deg on low quality). Logged offset camera minus car: (18.13, 16.34, 18.13) at rest.
- **FOV 25 deg** vertical, near 0.1, far 200.
- **Distance** `radius = lerp(15, 30 + ratioOverflow * 9, 1 - zoom)`, where `ratioOverflow = max(1, (16/9) / aspect) - 1`: 31.0 m
  at 1440x900, **55.6 m on a 390x844 phone** (the portrait screen pulls it back so the same width of world fits). After the intro
  zoom = 0 (farthest). Wheel: `zoom -= wheelDelta * 0.05` clamped 0..1 (0 = 30 m, 1 = 15 m, `SP/r10-ref-b25-zoom-closest.png`).
- **Speed pull-back:** `zoom += -0.4 * smoothstep(focusSpeed, 5, 40)` (game units, i.e. 10..80 m/s real), eased at `dt * 10`:
  logged radius 31 at rest, 32-33 cruising, **37** boosting.
- **Follow:** focus = car x, z (y = 0 always, so a jump does not move the camera); smoothed `lerp(dt * 10)` per frame. Logged lag
  1.0-1.5 m at 13-18 m/s, 3.0 m at 35 m/s, 0 at rest within ~0.5 s.
- **Roll:** a spring on camera roll: `pull 100, damping 4`, `kick(1)` sets a random +-1 roll speed (explosions, big hits).
- **Speed lines:** 30 white screen-space spikes toward the car, shown when boosting above 15 game units (30 m/s real).
- Cinematic moves (areas) blend to a fixed pose over 1.5 s `power2.inOut`.

### 3.2 Ours
Chase camera behind the car: 12.5 up, 13 back (x zoom), about **44 deg** down, FOV 36, 25.5 m to the car at 1440x900 and 40.6 m on
a phone; heading turns toward the car's nose (<= 1.8 rad/s), up = planet normal. The car reads as a small rectangle from above
(`SP/r10-ours-desktop-idle.png`, about 70 x 110 px) against Bruno's side-on car of about 220 x 170 px (`SP/r10-ref-b25-idle.png`).

### 3.3 The change (Brief A)
Port `View.js` as is: fixed theta 0.25 PI, phi 0.31 PI (0.27 PI on the low quality tier), FOV 25, radius formula with the 16:9
overflow term (it is what makes a phone work), zoom 0..1 on the wheel and pinch, speed pull-back -0.4 over 5..40, focus lerp dt*10,
focus y = 0, roll spring, drag-to-pan with tracking restored by any drive key. Delete cam.h, cam.yaw, autoCam, the road-heading
follow and the "far/mid/near" setting (the wheel replaces it). Add the speed lines. Add the tilt-shift blur (section 4.9).

---------------------------------------------------------------------------------------------------------------------------------

## 4. World art, element by element

### 4.1 Terrain and ground
- **Bruno:** one plane mesh (terrain.glb, 128 subdivisions over 192 m) coloured by a data texture: R = paved slabs, G = grass,
  B = water depth. Ground colour = a 16 px gradient by depth: `#ffa94e` (dry, stop 0.1) -> `#5bc2b9` (shallow, 0.3) -> `#13375f`
  (deep, 0.9), mixed to grass `#b8b62e` by G, and to slabs by R (slab texture tiled, `#a87762` low, `#ffcf8b` high). Vertices sink
  `1.5 * B`. Normal forced straight up (flat shading, no slope shading). Wheel tracks are drawn into a 512 px, 40 m render target
  that follows the car and erases grass (G) under the tyres. See `SP/r10-ref-b25-bridge.png`, `grass-flowers-landing.png`.
- **Ours:** a faceted sphere, two sand yellows (`#e8c46e` valley, `#8cc46a` north), darker patches, a separate road mesh with paint.
- **Change (Brief B):** paint an island mask (our own layout) as a 512 x 512 RGB canvas at load (R paths/plazas, G grass, B depth);
  one 192 m plane with 128 x 128 segments; the same gradient and mixing, our palette (4.8). Road = a darker asphalt band in the same
  shader plus red/white kerb strips as geometry along the spline (Bruno's circuit). Tracks render target as Bruno.

### 4.2 Grass
- **Bruno (`World/Grass.js`):** **78,400 blades** (280 x 280), one triangle each: base width 0.2 (`bladeWidth 0.1` each side), height
  0.6 x (0.4..1.0 random) x (0.5..1.5 Perlin at 0.0321 / m) x grass mask. Every blade turns to face the camera. The grid covers the
  camera's view footprint (`optimalArea.radius * 2`) and wraps round the focus, so the whole screen is always full. Blade colour is
  the ground colour under it; the blade base is shaded (shadowNode = 1 - tip), the tip is lit, so the lawn reads as tips on a dark
  mat. Wind moves tips by `wind * tip * height * 2`. Blades hide where G < 0.5. On a phone the blades grow with the surface
  (`* (1 + overflow * 0.4)`). Look: `SP/r10-ref-b25-grass-flowers-landing.png`, every driving frame.
- **Ours:** 3,600 three-blade tufts within 7-16 m of the road, 0.38-0.52 tall, pale on bare sand (`SP/r10-ours-ground-grass.png`).
- **Change (Brief B):** port Grass.js to a GLSL `ShaderMaterial` on a non-indexed `BufferGeometry` (vec2 positions + one random per
  vertex; vertexIndex % 3 gives tip/left/right). Same counts on desktop; 180 x 180 on phones (32,400). Same shading rule.

### 4.3 Trees and bushes
- **Bruno (`World/Trees.js`, `Foliage.js`):** trunk and branches as a low-poly body mesh (instanced); the crown is **several
  foliage clusters**, each **80 quads of 0.8 x 0.8 m** scattered inside a unit sphere (`radius = 1 - rnd^3`), each quad's normals
  bent 85% toward the cluster's sphere normal, alpha-cut by a **leaf SDF texture** (threshold 0.3) that rotates with the wind.
  Clusters are billboarded toward the default camera angle with a random roll. Colour = mix(colourA, colourB) by
  `smoothstep(0, 1, N.L)`: oak `#b4b536 -> #d8cf3b`, birch `#ff4f2b -> #ff903f`, cherry `#ff6d6d -> #ff9990`; bushes use the oak
  pair. Shadows cast and received with the leaf mask. **See-through:** within 3/radius .. 15/radius of the car on screen, leaves fade
  to the threshold so the car is never hidden. Counts: 24 oak, 26 birch, 20 cherry trees, bushes in clumps. Look:
  `SP/r10-ref-b25-tree-oak.png`, `tree-birch.png`, `tree-cherry.png`.
- **Ours:** 193 trees made of faceted icospheres (green, pink) with an ink outline shell (`SP/r10-ours-tree.png`).
- **Change (Brief B):** build our own leaf SDF (a 64 x 64 canvas: 5-7 overlapping soft blobs, blurred, stored in R) and trunks
  (a tapered 6-sided cylinder plus 2-3 branches, made in code). Port Foliage exactly (80 quads, 0.8 m, the normal bend, the
  threshold, the colour-by-light, see-through). Three species in our palette: valley oak (Fresno) `#9fae3a -> #d8cf3b`, almond
  blossom (the pink we have) `#f08aa0 -> #ffc0c8`, New England maple (Cambridge end) `#e8552b -> #ff9a3f`. About 60-80 trees and
  40 bush clumps, placed by hand in clusters along channels and plaza edges (not scattered evenly). Drop the outline shell on foliage.

### 4.4 Flowers, rocks, props
- **Bruno:** flowers = instanced clusters of 8 small quads, white `#ffffff` base tinted, sunk 0.75 m so only heads show, shadow offset
  0.25 (`World/Flowers.js`); rocks are pale lilac low-poly pebbles; props are lanterns (emissive), benches, fences, bricks, crates,
  pole lights, road signs, an inflatable tube man; all dynamic. Falling **leaves**: 2^7..2^11 instanced quads (0.25 m, colours
  `#95513a -> #f56a3a`), pushed by the car (push 100, sideways 20), damping 1.5, gravity 9.8.
- **Ours:** boxes (brown), pale rocks, lamps, a few crates; no flowers; no falling leaves.
- **Change (Brief B):** add flowers in grass (white/lilac/yellow heads, 8-quad clusters), pebbles, and falling leaves in autumn
  tints (count by season, capped at 1024 on phones). Brief A owns the props' physics.

### 4.5 Water
- **Bruno:** water is the ground itself going deep (gradient to `#13375f`) under a flat surface at y = -0.3 with animated white
  **ripple lines along the shore** (`shoreEdge 0.17`, slope frequency 10, noise 0.1) and a white 0.013 m waterline on every object it
  cuts (`MeshDefaultMaterial.hasWater`). Ice in winter. `SP/r10-ref-b25-water-shore.png` is inside water; see `idle.png` top.
- **Ours:** blue patches on the planet and a pier.
- **Change (Brief B):** the sea round the island and 3-4 channels through it (one under a bridge: our "Bridge" stop gets a real
  bridge). Same depth gradient, a transparent surface with shore ripple lines, the white waterline in the shared material. The car
  in deep water: linear/angular damping 1 (Bruno `Physics.update`).

### 4.6 Birds
- **Bruno:** none visible; only bird tweets in the ambient sound (6 samples).
- **Messenger:** white paper-cut birds in loose flocks (`SP/r10-ref-msg-social.jpg`, upper left), `geometries/birds/1.drc, 2.drc`
  with curve paths `curve-1/2.drc` (they follow authored splines).
- **Ours:** 15 dark six-vertex birds in 3 flocks orbiting the planet.
- **Change (Brief B):** **white** birds (body + two wing quads, 0.5 m span) in 2-3 flocks of 6-10 following closed Catmull-Rom
  loops over the island at 12-18 m, flapping `sin(t * 13 + phase)`, scattering on honk (keep `scareBirds`). No outline, flat
  shaded, slightly emissive so they read against grass.

### 4.7 Characters
- **Bruno:** none in the world (the car is the character). **Messenger:** 19 NPC types (`npcs/present/*`: chef, diver, owl, fox,
  mountainman, musician ...) with skinned idle / talk / walk clips, speech bubbles, name tags. They stand or walk short loops.
- **Ours:** 12 blocky locals (capsule body, ball head, hat) that stand by the stops and talk.
- **Change (Brief B):** keep locals (they are ours and Messenger-like) but re-make them in Messenger's proportions: head ~1/3 of
  height, total ~1.5 m, rounded, simple faces (two dot eyes), muted clothes from the palette; give each a 2-frame idle (breathe:
  scale y 1 +- 0.02 at 0.5 Hz; look toward the car when within 8 m) and let 3-4 walk a short loop on a plaza. No outline shells; use
  the shared material.

### 4.8 Palette and lighting per time of day
- **Bruno (`Cycles/DayCycles.js`, `Ligthing.js`, `Materials/MeshDefaultMaterial.js`):** a single directional light, `phi 0.63,
  theta 0.72` (spherical), one 2048 px shadow map (512 on low) fitted to the view footprint, bias -0.001, normal bias 0.1. No
  ambient light. Shading = base colour x light colour x intensity, then mixed toward **base x shadowColour** by
  `max(coreShadow, dropShadow)` with `coreShadow = smoothstep(1, -0.25, N.L)` (a soft terminator), so shadows are **saturated
  purple**, never grey. Downward faces pick up the ground colour within 1.5 m of the ground (light bounce). Day length 240 s real.
  Presets (interpolated with smoothstep between stops day 0-0.15, dusk 0.25, night 0.35-0.6, dawn 0.8, day 0.9):

  | | light | intensity | shadow | fog A -> B (radial screen gradient) | fog near / far ratio |
  |---|---|---|---|---|---|
  | day | `#ffd2c2` | 1.2 | `#6d3fff` | `#00ffff -> #9b89ff` | 0.315 / 1.25 |
  | dusk | `#ff8181` | 1.2 | `#4e009c` | `#3e53ff -> #ff4ce4` | 0 / 1.25 |
  | night | `#3240ff` | 3.8 | `#2f00db` | `#10266f -> #490a42` | -0.85 / 1 |
  | dawn | `#ffa882` | 1.2 | `#db004f` | `#f885ff -> #ff7d24` | 0.3 / 1.25 |

  The **background is the fog gradient** (no sky dome; the camera looks down so the sky is never seen). Screens:
  `SP/r10-ref-b25-tod-{day,dusk,night,dawn}.png`. Weather adds rain lines, snow, lightning, wind lines, all from `Weather.js`
  properties (`weather-rain.png`, `weather-snow.png`).
- **Messenger:** a 16 x 16 px colour atlas holds every colour; muted sage, grey, dusty pink, teal sea `#6cc0bb`-ish; lighting mood
  changes by swapping the atlas (`lut.ktx2`).
- **Ours:** a pale-blue sky dome, cream/yellow sand, two-band toon with blue-violet shadows at 0.42 strength, an ink outline shell
  on everything. `SP/r10-ours-desktop-tod-*.png`.
- **Change (Brief B):** port the material model exactly (the formula above, one light, coloured shadow = base x shadowColour, core
  terminator -0.25..1, bounce 1.5 m, fog as a screen-space two-colour gradient that is also the background, near/far from the view
  footprint). Keep the four presets' **structure and intensities**; choose our own hues but keep Bruno's relationships: warm light,
  a saturated violet-to-magenta shadow, a two-colour fog that is cooler on one side. Our day, suggested: light `#ffe2c8`, shadow
  `#6a4bff`, fog `#7fe3ff -> #a99bff`, ground dry `#f2b35a`, grass `#b8b62e`-ish. Bruno's world is orange sand with olive grass;
  ours should read as **California valley to New England** (dry gold -> green -> autumn maple) along the route, painted into the
  terrain mask, not a single sand colour.

### 4.9 Shading, outlines, shadows, post
- **Bruno:** no outlines at all. Lambert + the custom output node above. Post: **bloom** (threshold 1, strength 0.25, smoothWidth 1,
  5 mips / 2 on low; only emissives above 1 bloom: headlights, lanterns, boost trails) and a **"cheap DOF" tilt-shift**: blur
  strength = `smoothstep(0.2, 0.5, |uv.y - 0.5|)` with a 25-tap hash blur of 0.003, so the top and bottom fifth of the screen are soft
  (visible in every `SP/r10-ref-b25-*` frame). Real cast shadows from everything including grass tips and leaves.
- **Messenger:** thick, wobbly, hand-drawn ink outlines (screen-space, distance-faded) and flat colour blocks.
- **Ours:** inverted-hull outlines on everything, two-band toon, soft blob shadows plus one shadow map.
- **Change (Brief B):** follow Bruno for the world: **remove outline shells** from ground, grass, trees, props; keep a thin outline
  only on the car and the landmark buildings if Husam wants the hand-drawn hint (Messenger). Add bloom (UnrealBloomPass r149,
  threshold 1.0, strength 0.25) and the tilt-shift pass (a two-pass Gaussian is fine: start 0.2, end 0.5). One 2048 shadow map
  fitted to the view footprint (1024 on phones), PCF.

### 4.10 The car
- **Bruno (`static/vehicle/default.glb`, `World/VisualVehicle.js`, `SP/r10-ref-b25-car-*.png`):** a chunky off-road truck:
  **red** body `#e8332c`-ish over a **dark olive chassis**, huge wheels (radius 0.4 physical, visually larger with black tyres and
  magenta hubs), a roof rack with **four yellow LED lights**, a **yellow light bar** grille (emissive, blooms), a bonnet scoop,
  flared arches, an antenna whose head spins and looks at a target. Proportions: length 2.6, width 1.7, height ~1.6 with wheels;
  wheels ~40% of body height. Animation: chassis = rigid body pose (all the pitch, roll, bounce comes from the physics); each wheel
  eases to its suspension length at `25 * dtScaled`; steering eases at `16 * dtScaled`; blinkers flash 0.8 s while turning; stop
  lights on brake; reverse lights; **boost**: purple energy cells rise, twin pink/white ribbon trails from the rear corners
  (-1.28, 0.1, +-0.55); ground tracks per wheel.
- **Ours:** a red boxy SUV with a yellow roof box, flat grey wheels, white bumpers, an outline shell, a thin antenna
  (`SP/r10-ours-car-front34.png`, `car-side.png`).
- **Change (Brief A):** re-make (do **not** copy the glb) a chunky truck in code with Bruno's proportions and features: body
  2.6 x 1.7, ground clearance ~0.5, wheel radius 0.42 visual with fat 0.35 tyres, flared arches, roof rack with 4 emissive lights
  (colour 3.0x so they bloom), a light-bar grille, antenna with a bobbing ball. Keep **our** red and yellow so it is ours. Drive the
  visual from the physics exactly as VisualVehicle (wheel easing 25, steer easing 16, blinkers, brake/reverse lights, boost trails,
  tyre tracks).

### 4.11 Particles
- **Bruno:** falling leaves (4.4), confetti on achievements, explosion fireballs, wind lines (white strokes, 4 s, 0.1 thick, 2 m up),
  rain lines, snow, lightning, boost trails, speed lines, dust is *not* used (tracks instead).
- **Ours:** dust puffs, confetti, rain and snow, skid marks.
- **Change:** B adds leaves and wind lines; A adds boost trails, speed lines and tracks; drop dust puffs.

### 4.12 Sound (Bruno, `Player.js`, `Audio.js`)
Engine loop (volume `max(0.05, |accel| * 0.5 * (1 + boost) * 0.8)`, rate 0.6..1.1, ease up 10 / down 2.5), tyre-on-pebbles loop by
speed (x 0.1, max 0.25, silent in the air), a skid/pebble scrape by sideways slip and braking, a "spin/wind" loop rate 1..2 by speed,
a force-field loop while boosting, springs squeak on landing (by wheels just touched), a piston hiss on jump, horn, hits by force,
bird tweets, music tracks with a "Now playing" toast. **Licences:** Bruno's sound files are third-party library samples: do not copy;
re-synthesise (we already synthesise in WebAudio) using the same *mapping* (which parameter drives which loop, the easing rates).

### 4.13 UI
- **Bruno:** almost none on screen: two square buttons top right (menu, map), achievement/"Now playing" toasts top centre
  (`SP/r10-ref-b25-hit-2s.png`), diamond interactive points in the world that open on approach (one at a time, `elastic.out(1.3,0.4)`
  1.5 s), a full-height side menu with tabs (`ui-menu.png`, phone `phone-ui-menu.png`), the map modal (`ui-map.png`) where clicking
  a spot respawns you there. Controls are explained only in the menu.
- **Ours:** name card top left, MAP and SETTINGS buttons, labels over landmarks, painted road lessons (round 8 cut these down).
- **Change:** mostly keep round 8's decluttered UI (it already follows Bruno); restyle the two buttons as small square icons top
  right; landmark labels become Bruno's diamond points; map = top-down island render with pins.

---------------------------------------------------------------------------------------------------------------------------------

## 5. Build plan (prioritised), two briefs

Order: A1-A4 first (the feel), then B1-B6 (the world) can proceed in parallel once the flat island exists (B1 is the dependency of
both, so B1 lands first as a stub: a flat 192 m plane with the island mask and the spline road).

### Brief A: driving, camera, car
1. **Flat world stub + physics** (with B1's plane): Rapier-compat vehicle with every constant in 2.1, x2 time scale, heightfield
   collider from the island mask's depth. Acceptance: the 12-row table within 15%.
2. **Camera** = `View.js` port (3.3). Acceptance: offset (18.1, 16.3, 18.1) at 1440x900, radius 55.6 on 390x844, FOV 25, 37 m at boost.
3. **Input**: keys exactly as Bruno; touch ground ring exactly as Nipple.js; tap-to-jump; drag-to-pan; wheel/pinch zoom.
4. **Car model + VisualVehicle** animation, lights, bloom-ready emissives, boost trails, speed lines, tracks render target.
5. Props as rigid bodies (letters, crates, fences, benches, cones, one explosive crate per plaza), respawn, unstuck, auto-flip.
6. Port our self-drive-to-a-sign on the 2D spline; time trial gates on the circuit; `#from-` returns to plaza respawns.
7. Sound mappings (4.12) with our synthesised sources.

### Brief B: world art
1. **Island**: 192 m, our layout drawn as a mask (R paths/plazas, G grass, B depth), outline like a real island (coves, 3-4
   channels, one bridge), the route as a loop road with kerbs, 10 plazas. Map = orthographic top-down render of it.
2. **Material model** (4.8/4.9): one light, coloured shadows, terminator, bounce, waterline, fog gradient as background, the four
   presets and the 240 s day cycle (or the visitor's clock, as now), bloom, tilt-shift. Remove outline shells from the world.
3. **Grass** (4.2) at Bruno's counts, with tracks erasing it.
4. **Trees/bushes** (4.3): our leaf SDF, the 80-quad clusters, three species, see-through near the car, cast shadows.
5. **Water** (4.5), **flowers, pebbles, leaves** (4.4), **wind lines**.
6. **Birds** (4.6) and **locals** (4.7) re-made; landmarks re-seated on plazas with Bruno's slab ground and diamond points.
7. Title/loading: keep the planet art; the title shows the island on a small globe, then the camera descends into the play view.

Performance budget (phones): grass 32k blades, one 1024 shadow map, bloom 2 mips, tilt-shift half-res, foliage ~6k quads total,
DPR <= 2. Bruno's own low tier is the model (`Quality.js`: level 1 = phi 0.27 PI, 512 shadow, 2 bloom mips, no speed zoom).

---------------------------------------------------------------------------------------------------------------------------------

## 6. If the planet must stay (not recommended)
Minimum to read like the references on a sphere: R 32 -> 80+ (so a 31 m camera sees ground, not the limb); camera to Messenger's
follow (distance 5.75-8 x car scale, phi 45-60 deg, auto-centre lerp 0.03 per 60 Hz frame while moving, 0.0125 when idle); Bruno's
grass/foliage/material model mapped to the sphere (grass wrapped in tangent space round the focus, shadow map re-fitted each frame);
the kinematic car kept but retuned to the 2.1 table (it cannot flip, bounce or throw crates). It will look better and still not feel
like Bruno, because the fixed 3/4 diorama view and the rigid-body car are the two things people remember.

---------------------------------------------------------------------------------------------------------------------------------

## 7. Licences
- **folio-2025 and folio-2019 code: MIT** (`license.md`, Copyright Bruno Simon). Porting `PhysicsVehicle`, `View`, `Grass`,
  `Foliage`, `Nipple`, `MeshDefaultMaterial`, `DayCycles`, `cheapDOF` logic and constants is allowed; keep the MIT notice in a comment
  in `index.html` ("adapted from Bruno Simon's folio-2025, MIT").
- **Do not copy Bruno's art or audio**: `static/**` glb models (vehicle, trees, terrain, areas), textures (`foliageSDF`, `terrain.png`,
  `slabs`, `palette`), and sounds (third-party library samples, e.g. "Robotic_Lifeforms", "Glass stone turning loop"). Re-make:
  the car in code, our own leaf SDF canvas, our own island mask, synthesised sounds.
- **Messenger**: all assets and code are abeto's; the mirror is study-only. Take only ideas and the camera parameters
  (numbers are facts); make our own characters and birds.
- **Rapier** (`@dimforge/rapier3d-compat`): Apache-2.0, fine to vendor with its licence file.

---------------------------------------------------------------------------------------------------------------------------------

## 8. Screenshot index
Bruno 2025 desktop: `idle`, `straight-0p25s/0p5s/1s/1p5s`, `hit-2s/2p5s/after` (explosive crates), `circuit-idle`,
`circuit-straight-1s/2p5s`, `turn-0p5s/1p5s/3s`, `boost-0p5s/1p5s/3s`, `drift-0p33s/0p75s/1p5s`, `jump-0p16s/0p6s/1s`,
`jump-standing`, `brake-0p16s`, `reverse-1p5s`, `lowride`, `zoom-closest`, `car-front34/side/rear34`, `tree-oak/birch/cherry`,
`grass-flowers-landing`, `water-shore`, `bridge`, `area-*` (12 areas), `tod-day/dusk/night/dawn`, `weather-rain/snow`,
`season-*`, `ui-menu`, `ui-map`. Phone: `phone-idle`, `phone-touch-forward/turn/halfring`, `phone-tap-jump`, `phone-ui-menu`.
(`overview-top/oblique` are blank: fog and the 200 m far plane hide the island from above; use `ui-map`.) All prefixed
`SP/r10-ref-b25-`.
Bruno 2019: `SP/r10-ref-b19-desk-{0-load,1-start,2-drive,3-turn,4-boost}.png`: fixed camera again (angle (1.135, -1.45, 1.15), FOV 40,
21.5 m, target easing 0.15/frame), flat infinite orange floor, controls painted on the ground.
Messenger: `SP/r10-ref-msg-title-{desk,phone}-*.png`, `SP/r10-ref-msg-title-crop.png`, `SP/r10-ref-msg-social.jpg`.
Ours: `SP/r10-ours-desktop-{idle,straight-0p5s,straight-1p5s,turn-1p5s,turn-3s,boost-1p5s,drift-0p7s,hop}.png`,
`SP/r10-ours-phone-{idle,touch-forward,touch-turn}.png`, `SP/r10-ours-{car-front34,car-side,car-rear34,tree,ground-grass}.png`,
`SP/r10-ours-desktop-tod-{dawn,dusk,night,day}.png`.
