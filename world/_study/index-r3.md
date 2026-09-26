# Study, round 3: THE WORLD (`index.html`), a lighter pass

Same direction as round 2 (Messenger's tiny planet, Bruno's car, tags and reveal). Compared again with the 2019
folio source (`folio-2019/src/javascript/World/index.js`, `Sections/IntroSection.js`) and the 2025 source
(`folio-2025/sources/style/*.styl`, `Game/Map.js`, `Reveal.js`). The live site renders black in the headless
scraper (WebGL), so its tab title (`Bruno 🚗`, animated) was the only live detail; everything else is from source.

## Differences found, and what changed
| Spot | Reference does | We had | Now |
|---|---|---|---|
| Title screen | Messenger: the planet, the block title, one slab button, nothing else | + a boxed `FRESNO → CAMBRIDGE, THE LONG WAY AROUND` line in 15px caps tracked .2em | Line removed from the title; the phrase moved onto the photo card (normal case) |
| "Or read the map" | (no equivalent; kept as a plain text link) | boxed 14px caps tracked .14em | plain Barlow 600, 2px underline |
| Start button | 2025: the "press to start" label pops in with `elastic.out(0.5)` when loading finishes | appeared instantly | pops with an elastic keyframe (scale .82 → 1.09 → .97 → 1.02 → 1, .9s) when ready |
| Controls hints | 2019: the controls are **drawn on the floor** at the start (arrow keys; a separate touch texture when `config.touch`) | a cream bar of `<kbd>`s pinned to the bottom-left of the screen | painted on the road ahead of the car, like the teasers: `ARROWS OR WASD / TO DRIVE`, `SHIFT TO BOOST / SPACE TWICE TO HOP`, `H FOR THE HORN / R FOR THE ROAD`; phones get `DRAG THE STICK / TO DRIVE`. The full list stays in the map's footer. (This also removes the bar that sat under the exit sign.) The old `ONE ROAD / KEEP GOING` paint made way. |
| Ground labels | 2025: diamond + label sliding out; road paint = floor text | already matched | kept; teasers re-checked: none names an organisation, number, bill or place a district owns |
| Plate, clock tab, photo card | (hub UI) | sub-lines in 12–13px caps tracked .1–.14em | normal case Barlow 600 |
| Mailbox letter | | red tracked-caps eyebrow "You bumped the mailbox" above "Write to Husam" | eyebrow gone; the sentence opens the paragraph |
| Map card | | "DRIVER" eyebrow above the name; route in tracked caps | eyebrow gone; route in plain Barlow 600 |
| Map stops | the in-world exit sign's tab is a Bungee chip ("Exit 1") | `EXIT 1` / `DRIVE THERE` in 12–13px caps tracked | Exit number is the same Bungee chip as the sign's tab (road order is real information); "Drive there" in plain Barlow |
| Toast over the map on phones | | "Drag the stick to drive" could sit on top of the open map's text | toasts hide while the map is open |

Kept on purpose: Bungee (the World's signage face; a caps font, never tracked), road paint in capitals (road
markings are capitals), the block-letter name.

## Owned things
Photo, LinkedIn and `[email]` remain only here. No teaser, sign or paint line carries a district's facts.

## QA
`node world/_shared/qa.js index`: 0 issues before, 0 after. Screenshots `world/_shots/index-r3-*` (title, road,
map at 1440 and 390). Audit: the only remaining line is the Pier's (`Clovis Community College`), not this page.
