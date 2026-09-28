# Study, round 8: THE WORLD (`index.html`), intuitive and calm

Husam: "think really deeply on how to make this more intuitive and easy to play ... rely purely on inspiration", and then, through
the lead: "not so cluttered, it feels confusing right now, so rely more on inspiration." So this round mostly takes things away,
and the one thing it adds is guidance that lives in the world. Same planet, road, landmarks, look, loading screen, title and red name.

## 1. How the references onboard and guide (what they actually do)

| Reference | What it does | Source |
|---|---|---|
| Bruno 2025 `InteractivePoints.js` | Only ONE point is open at a time: the closest one within 2.5 m reveals (`elastic.out(1.3, .4)`, 1.5 s); every other point stays a small concealed diamond. The cursor over a point (`rayCursor` sphere r 0.75) also reveals it, and a click interacts. | clone of github.com/brunosimon/folio-2025 (HEAD 2026-04-07) |
| Bruno 2025 `Map.js` | The map is a picture with a pin per area; clicking a location **respawns** the car there (`player.respawn(name)`), closes the map and re-tracks the camera. No route drawing, no minimap on screen. | same |
| Bruno 2025 `Respawns.js`, `Player` | Respawn = the closest named respawn behind a fade; "Unstuck" is a contextual button shown only after 3 s without progress. | same, and `index-r4-refs.md` |
| Bruno 2025 `LandingArea.js` | The start has one interactive point, "Controls", that opens the controls tab for your device (keyboard or touch). Nothing is explained until asked. | same |
| Bruno 2019 | The controls are painted on the floor in front of the car, once. | `index-r4-refs.md` 2.4 |
| Messenger (Abeto case study) | "Easily navigable for all audiences, even those who aren't used to playing video games ... we had to limit certain options and automate others, such as camera centering." No tutorial; NPCs speak when you walk up to them. | Awwwards case study (search snippets; the site is proxy-blocked) |
| Journey (thatgamecompany, GDC 2013) | One goal, visible from the first frame: the mountain on the horizon. Structure and distance steer the eye; no text. | GDC Vault "Designing Journey"; Game Developer "Deconstructing the art design of Journey" |
| Breath of the Wild (CEDEC 2017) | "Gravity": big landmarks (towers, triangles) pull the player; medium shapes hide and reveal; the HUD stays small. | Nintendo Life / Source Gaming write-ups of the CEDEC talk |
| Firewatch | Wayfinding by landmarks (the lookout, trail markers); the map's "you are here" can be switched off. | Campo Santo blog, reviews |
| Super Mario Bros. 1-1 | Teach one verb at a time, by the level, never by text: the Goomba exists because the Koopa was too much to learn first. | Miyamoto interview (IGN), Wikipedia "World 1-1" |
| Alto's Adventure / Odyssey | One touch; nothing on screen that isn't needed now; a button appears only when its power-up is ready. | reviews, `index-r7.md` |
| Mini Motorways | No clutter; the road and its arrows are the interface. | Game Developer, Game UI Database |
| Mario Kart | "Wrong way" and the minimap exist because races are fast and many; the course itself (arrows on the barriers) does most of the guiding. | Mario Wiki, Mario Kart Racing Wiki |
| Monument Valley | "Less game, more experience" (ustwo, GDC 2015): the path is lit by the architecture, no tutorial screens. | GDC Vault |

The common rule: **one clear thing at a time, and let the world point.** Bruno opens one label; Journey shows one mountain;
Mario teaches one verb. A minimap strip, a compass bar or a route line would be a second interface on top of the planet, and none
of the calm references (Bruno, Messenger, Journey, Monument Valley, Alto) has one. Mario Kart does, but it is a race among many.

## 2. The audit (counted, not guessed)
`r8-shots.js` counts what a person sees at five moments (a second after Start, the start, approaching the Capitol, on its pad, the
open road) on a phone upright, a phone on its side and a laptop: HUD elements, open 3D labels, painted road lines in view, locals'
diamonds and speech bubbles.

| | phone 390x844 | phone 844x390 | desktop 1440x900 |
|---|---|---|---|
| before (sum of five moments) | 50 | 83 | 89 |
| after | 27 | 35 | 35 |

What made the first seconds confusing (screenshots `r8-before-*`):
- a farmer's speech bubble over the road before the car had moved (desktop and phone);
- on a laptop, "MAP ROOM" opened at the top right at the start (the nearest building across the spiral, not the next door);
- four tabs on a laptop (map, settings, sound, and a clock saying "trying: day");
- a diamond over every local, the same shape as a door's diamond (two meanings for one symbol);
- road paint: three control lessons on a laptop, two on a phone, plus 2 to 4 lines of teaser before each exit;
- on a pad: the exit sign, a sticker card ("Knock knock"), a bubble and two open labels at once;
- the boost button sat on the exit sign on a phone.

## 3. What changed

| Change | Reference |
|---|---|
| **One open label.** Only the next door you haven't been through opens its label, from far off; every other door is a folded diamond until you're beside it or point at it (hover on desktop). At a door, only that door's label. | Bruno 2025 `InteractivePoints` (one active, hover reveals) |
| **The next landmark on the skyline.** While the next door is far, its sign rises above its roof on a thin ink line so it clears the curve of the planet, and settles back as you arrive. | Journey's mountain, BotW's towers, Firewatch's lookout |
| **One pointer, only when needed.** If the next door is neither on screen nor its building nor its pad, its folded sign is pinned to the screen edge with a small arrow toward it. It disappears the moment the world can do the pointing. | Mario Kart / Firewatch "that way"; Bruno's diamond |
| **Every sign is a button (GPS).** Tap or click a landmark's sign, or the pointer, and the car drives itself along the road to its pad and parks (the round-4 autopilot, now on every scheme and on desktop). Any key or thumb takes back control. | Bruno 2025 points are clickable; Bruno's map respawns you; round 4's Tap to go |
| **Lane arrows before each exit.** The teaser paint (2 to 4 lines) became one line: the name and an arrow to the side the door is on. Teasers stay on the exit sign, the map and in the locals' mouths. | Mini Motorways and real lane arrows |
| **One control lesson.** The road says only how to drive ("ARROWS OR WASD TO DRIVE" / "THUMB DOWN, PUSH TO DRIVE"); boost, hop, horn and respawn are in Settings > Controls. | Bruno 2019 floor paint; Bruno 2025 Controls point |
| **One verb at a time on a phone.** The boost button waits until you've driven; the stick's knob leans up and back every few seconds until your first push. | Mario 1-1, Alto's contextual button |
| **Two tabs on a laptop.** Sound and the clock left the stack: the sound switch sits in the settings head on every screen, the time of day in Settings > World. | Bruno 2025: one menu tab and a map |
| **Locals speak when you stop by them**, never before you've driven, never over a door's sign; no diamond over their heads (a diamond means a door). | Messenger (you walk up to someone) |
| **No sticker over a door.** "Knock knock" is filed quietly (the sign already says you made it); any sticker card waits until you roll off the pad. | Bruno 2025 notifications, one at a time |
| **Coming back.** With `#from-<page>` the district you left is marked visited and its sign stays down until you roll off, so the next door leads straight away. | (friction found in play) |
| **The map remembers.** Visited stops get a tick and fade a little; the next one has a yellow edge. Visits last for the page (no storage). | Bruno 2025 achievements "visit every area" |
| A light buzz on arriving at a pad (phones that can), never before a first tap. | round 7 haptics |

Not taken, and why: a minimap strip and a compass bar (the lead's rule: only if more is removed than added, and the calm references
have none; the tab title already shows `Fresno ●········ Cambridge`); auto-drive from the map (Bruno's map teleports; a
40-second drive to the far end would be friction, so "Drive there" still drops you in); a route line on the ground (a second road on
top of the road).

## 4. Tests (scratchpad)
- `r8-shots.js <tag>`: before/after screenshots with the element count (table above).
- `r8-guide.js`: a newcomer who never touches the stick. On a phone and on a laptop: Start, wait, press the one thing offered (the
  edge pointer, or the next sign once it is in view), ride to the Capitol, Go in; then come back (`#from-bill`) and do the same for
  the Chamber. Both pass with one press per district.
- `r8-dbg.js`: where the next door's sign is.
- The round-5 newcomer (Point, Steer, Tap to go, keys), `r7-trees`, `r7-hygiene`, `r7-load`, `r4-trial`, `r4-func`, `phone.js`.
