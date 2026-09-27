# Round 4: the World (hub), driving and ambition

Husam: "the car is hard to work right now and the world could be much more ambitious and draw more inspiration... be very, very ambitious... someone can increase their sensitivity or decrease their sensitivity... don't rely on your own devices, rely on the inspiration... the direction you're moving in is good, so don't shift so heavily that it loses the direction."

So: same tiny planet, same road from Fresno to Cambridge, same landmarks, same toon look, same title (the red 3D name), the same HUD vocabulary (cream slabs, ink outlines, Bungee). Keep all of that and make it feel like a real, finished Bruno Simon-level game.

## Read first
- `world/WORLD.md` and `world/OWNERSHIP.md`, both binding. The hub owns 3D driving, the car, physics props, the sky and time of day, the visitor's clock, and engine and horn sound. Ground labels and teasers never contain a district's facts, numbers or organization names. The photo, email (hramadan@college.harvard.edu) and LinkedIn appear only on the hub.
- `world/_study/index.md`, `index-r2.md`, `index-r3.md`, `nav-r3.md` (what was already studied and built)
- `world/_study/ORIGINAL-INSPIRATION.txt` (Husam's own list; bruno-simon.com leads it)

## The references (study the real thing, write specifics down)
- **Bruno Simon's folio 2019** (github.com/brunosimon/folio-2019): the car, its physics (cannon raycast vehicle), controls, touch controls, camera, the floor-painted instructions, the areas, and the props (bowling, bricks, the Konami code).
- **Bruno Simon's folio 2025** (github.com/brunosimon/folio-2025): the vehicle feel, input handling (keyboard, gamepad, touch), options and menu, map, respawn, achievements, circuit or time trial, weather and day cycle, wind in grass and trees, particles, sounds, and how its settings are presented.
- **Messenger** by Abeto (messenger.abeto.co): the tiny-planet feel, the camera on a sphere, characters and their bubbles, and its touch controls.
- Anything else in ORIGINAL-INSPIRATION.txt that fits, e.g. Jesse Zhou, rauno.me or emilkowal.ski for the micro-interactions of the settings UI.

If a site won't load, read its source on GitHub (raw.githubusercontent.com, or the GitHub MCP tools), or use WebSearch/WebFetch. Write concrete numbers and mechanics into `world/_study/index-r4.md`, and cite them in code comments where you use them.

## Must deliver
1. **Driving that feels great on keyboard, touch and gamepad.** Diagnose why it's hard now; the phone stick is camera-relative ("points where you want to go") while the camera follows the car. Match how the references do it: acceleration, steering and its speed-dependence, drift/grip, braking, reverse, the camera follow and lag, and staying on and near the road. It must be easy for a first-timer on a phone to drive to a landmark and go in.
2. **Settings (seamless, in the hub's own UI vocabulary, inspired by how the references present options):**
   - steering sensitivity;
   - speed;
   - camera distance / auto-camera;
   - control scheme on touch (e.g. "stick steers the car" vs "stick points the way", and/or tap-to-drive);
   - sound volume;
   - graphics quality;
   - vibration on phones, if the platform supports it;
   - reduced motion;
   - anything else the references offer that fits.

   It opens from a small button in the HUD and with a key, works with keyboard, touch and screen readers, and never blocks the view. **No localStorage or sessionStorage** (a site rule): settings live for the visit.
3. **Ambition in the world**, taken from the references and fitting this planet:
   - life and motion: wind in trees and grass, particles and dust, skid marks, birds or small creatures, clouds;
   - more physics props to knock over;
   - a circuit or time trial along the road with a timer;
   - small achievements or discoveries, with toasts;
   - weather or better day and night (headlights at night);
   - characters with speech bubbles in the Messenger style, saying teasers only, never another district's facts;
   - satisfying sounds;
   - hidden easter eggs.

   Choose what makes it feel alive and finished, not cluttered. Every addition must earn its place and be traceable to a reference.
4. **Performance:** stays smooth on mid-range phones. Keep the adaptive quality and add a quality setting; test frame cost.

## Keep working (don't break)
- Opening goes straight to the planet with the red 3D name and "Start the car": no white HTML name, no loading screen.
- `#from-<page>` spawns the car at that landmark with no intro.
- The map ("Or read the map" / M) scrolls on iPhone (the panel is the scroller on `.coarse`).
- The start camera flight stays smooth (no up-vector flips).
- The river stops at the bridge.
- The road is laid in strips (no ground poking through).
- The favicon links, `lib/three.min.js` and `lib/cannon.min.js` (local copies; don't switch back to CDNs).
- Nothing on the hub may name a district's facts. `python3 world/_shared/audit.py` must stay at 0.

## Test like a player
- Serve with `cd world && python3 -m http.server 8820` (restart if `curl localhost:8820` fails).
- Use Playwright with `--use-gl=swiftshader`. Handy scripts are in `/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/`:
  - `drive.js`: iPhone joystick via CDP `Input.dispatchTouchEvent`;
  - `intro.js`: per-frame camera log;
  - `hubriver2.js`: driving screenshots;
  - `phone.js`: map scroll on iPhone;
  - `ttt.js`: time to title;
  - `swipe.inc.js`.

  Copy and adapt them, but don't overwrite other files there; name yours `r4-*.js`.
- Write an automated "can a newcomer drive to the Capitol and go in, on phone and on desktop" test, and make it pass.
- Screenshot at 390×844 (touch) and 1440×900 in day and night, check for console errors, and run `node world/_shared/qa.js index` (must be 0).

## Rules
- Only edit `world/index.html` (and new study/test files). Don't commit; the lead does.
- Report back briefly: what you took from each reference, what changed, how you verified it, and anything unfinished.
