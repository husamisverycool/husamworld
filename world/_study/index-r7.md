# Study, round 7: THE WORLD (`index.html`), solid trees and the phone

Husam: "think deeply about how to make it perfect on phone and draw a ton of inspiration in all conceivable ways and also dont
let me just go through trees on computer". Same planet, road, landmarks, look, loading screen, title and red name.

## 1. Why the car went "through" trees
Measured with `r7-trees.js` (scratchpad) before touching anything:
- Every tree was a disc of 0.45 (the trunk is 0.14 to 0.17), and the car was a disc of 1.15. Head-on, the car stopped with its
  nose 0.28 from the trunk's centre: inside a canopy 0.8 to 1.7 wide that hangs at bonnet height (almond canopies start 0.6 up,
  the car's roof is 1.6). The canopy then dissolved (the see-through), so it read as driving through.
- A disc car rounds off its own corners (1.58 from its centre): at an angle the corner went 0.41 into a tree's disc.
- Rocks were discs of 0.6 drawn up to 1.0 wide; houses were discs of `max(w, d) x 0.6`, so their corners were soft.
- Missing from `statics`: the plaza's benches and lamp posts, the bridge's parapets, the time trial's gate posts; the Capitol,
  hall, office, garage and terminal were only covered by discs.
- A hit was a squeeze: speed x `(1 - dt x 12)` per frame while pressed, so the car slid to a stop over several frames with the
  engine still pushing.

## 2. What the references do, and what the hub now does
| Reference | Specific | In the hub |
|---|---|---|
| Bruno 2025 `World/Trees.js` | each tree is a `fixed` body with a cylinder collider and `onCollision` plays `hitDefault` | each tree is solid out to its canopy at the car's height (worked out from its own canopy ellipsoid or cone, x 0.9, 0.3 to 1.35); a hit plays the thud |
| Bruno 2025 `PoleLights.js`, `Benches.js`, `Fences.js` | every pole, bench and fence has its own fixed cuboid | lamp posts, plaza benches and lamps, bridge parapets, gate posts (while racing), and the main block of every landmark are solid; square things are oriented boxes |
| Bruno 2025 physics (Rapier rigid bodies) | a fixed collider stops a body; restitution is small | the car is its footprint (0.86 x 1.32 half sizes), collided box-vs-disc (closest point) and box-vs-box (separating axes). The velocity into the object is removed, and 22% of it bounces back above 3 u/s; the velocity along it stays, so a glance slides by |
| Bruno 2025 `Wind.js` shared by foliage | one wind function moves every canopy in the vertex shader | the object you hit (matched by its `oc` attribute) leans on a damped spring (17 rad/s, decay 3.6/s) in the same vertex shader, trunk and canopy together, outline included |
| Bruno 2025 `Leaves.js`, confetti on success | leaves and confetti are particles pushed by the car | a hit tree drops a burst of its own canopy colours (from the palette texture, so they follow day and night), lighter and slower than confetti |
| Bruno 2019 car hit sound | volume from impact speed, 100 ms apart | thud from impact speed; the camera rocks (the round-4 `kickCam`), the body pitches and heaves; a buzz on phones |
| Bruno 2025 achievements | a sticker for a discovery | "Knock on wood": hit a tree hard |

Road assist checks the lane along the heading it is about to steer to and does nothing if a static is there; Tap to go
steers round anything in its lane. The tumbling letters, crates and pins use the same shapes (`pushOffStatics`). Placement of
the scatter still uses the old footprints (`pr`), so no tree, rock or house moved.

## 3. The phone
Sources: Bruno 2025 `style/general.styl` (`-webkit-tap-highlight-color: transparent`, `touch-action: manipulation` "prevents
double tap zoom", `touch-action: none` on the canvas, `user-select: none` on menu, map, notifications and buttons),
`Viewport.js` (pixel ratio capped at 2, heavy work throttled 400 ms after a resize), `Audio.js` (mutes on blur), `Ticker.js`
(`maxDelta 1/30`), `Quality.js` (phones start at Low); Three.js Journey's performance lesson and the three.js tips lists (cap
the pixel ratio, render only when needed, it saves battery); tijnjh/ios-haptics (Safari 17.4's `<input type=checkbox switch>`
ticks the Taptic Engine when its label is clicked; programmatic use was patched in iOS 26.5); Apple's HIG (44 pt targets);
Alto's Odyssey and Mini Motorways (a landscape phone keeps its HUD in the corners and gives the middle to the game).
Messenger's case-study pages and Awwwards are blocked by the proxy (as in round 6).

Played at 390x844, 360x740 and 430x932 in both orientations (`r7-phones.js`). Portrait was already sound. Fixed:
- **Landscape was the desktop HUD**: four worded tabs, a two-line plate, the settings as a narrow side panel with the joystick
  under it, the red name drawn over "Start the car" and the photo card over both, notices on top of the exit sign. Now a phone
  on its side (coarse pointer, at most 500 px tall) gets the phone's quiet HUD; every corner respects its safe area (the notch
  sits on a side); the name sits in the top 60% (checked with the camera's own projection: it ends 53 px above the button); the
  settings are a full-height sheet on the right and the camera moves the car left of it; the exit sign sits between the thumbs.
- 360 px wide: the settings head squeezed its close button to 23 px. Under 380 px the Sound and Map buttons become icons.
- Tap targets under 44 px: the plate (30 px), the settings tabs (38), the title's text links, the map's stop links and its
  "Drive there" buttons.
- Text: toasts 13 to 14 px, sticker kicker 11 to 12, a bubble's speaker 10 to 11.
- Touch hygiene: no tap flash, no double-tap zoom, no page pinch while driving (iOS `gesturestart`), no selection or callout
  on the game's UI (the map and the letter stay selectable), no menu on a long press, no pull-to-refresh.
- The address bar and rotation: the canvas follows once per frame (not per event), and measures again 350 and 800 ms after a
  rotation.
- Battery and heat: touch screens draw at most 60 frames a second (a 120 Hz phone would draw twice what anyone sees); parked and
  untouched for 8 s, the world ticks at 30 until the next touch. The adaptive quality ignores the idle frames.
- Background: a hidden tab stops drawing, suspends audio and lets go of a held thumb or key; back-forward cache resumes it.
- Haptics: on by default on phones; Android through the Vibration API; iOS through the switch technique where it still works.
- The status bar takes the sky's colour (day `#6dbcd6`, night `#161d3d`).
- Loading screen: on a phone on its side the low cloud sat on the Fresno-Cambridge line; it moves below it.

## Tests (scratchpad)
`r7-trees.js` (desktop keys and phone stick, head-on, at an angle, boosted, into trees, a house, a lamp and a rock; the car's
footprint never overlaps a static and every hit stops it), `r7-pads.js` (every pad, spawn point and the whole road are clear
of the new colliders), `r7-phones.js` (the three phones, both orientations, with an off-screen / small-target / small-text
audit), `r7-hygiene.js` (rotation, address bar, styles, pinch, long press, frame pacing, hidden tab, status bar),
`r7-load.js` (the loading screen plays at phone sizes). The round-5 newcomer (three touch schemes and keys), round-4 trial and
function tests and `phone.js` (the map scrolls on iPhone) still pass.
