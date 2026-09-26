# Study, round 3: speech.html (The Chamber)

Refined, not redesigned: the fight poster, the rolling line, the broadcast night, the scorebug and its flip card, the ladder, Tale of the Tape, the belt, the medal, and STOP with the gavel are all still there. This round compared each detail with a reference and fixed every layout flaw.

## References, looked at again
- **Hatch Show Print fight bills, the real thing** (screenshots through Firecrawl, saved in `world/_shots/study-speech/`):
  - `r3-hatch-amateur-boxing-2009.png`: *Amateur Boxing Show*, Boxing Resource Center, Nashville, ©2009 Hatch Show Print.
  - `r3-hatch-fracas-2005.png`: *The Fracas in Vegas: A Night of Boxing*, ©2005 Hatch Show Print.
- **NCAA.com bracket and scores bar** (`ncaa.png`, from r2).
- **dennissnellenberg.com** (`dennis.png`, plus r2's notes from its JS).
- **joshwcomeau.com** sound toggle (r2 notes).

Firecrawl ran out of credits partway through, so I could not pull NCAA's CSS. For NCAA, the evidence below is the screenshot.

## Where caps stay, and the proof
- **Poster display lines** (Anton and Alfa Slab wood type): stay caps. Both Hatch bills set every display line in caps, each fitted to the measure: AMATEUR / BOXING / SHOW, "THE FRACAS IN VEGAS", "BOXING", "TUES. MARCH 15".
- **Poster small lines**: now mixed case. On the same bills, the small lines are mixed-case condensed gothic: "Bouts begin 6 PM", "Tickets at Door: $5", "2 Rounds of Sparring and Autograph Signing".
- **Scores bar, bracket headers and scorebug**: stay caps. In `ncaa.png` you can see FINAL, the abbreviations (MICH, UCONN), the round headers (FIRST ROUND, SWEET 16), and VIEW ALL SCORES in caps with light tracking. The scorebug is the same scoreboard idiom.
- **Everything else is now mixed case with no tracking.** That covers section titles, lower thirds, Tale of the Tape, the plates, the round-road labels, "That's time.", the round buttons (Dennis sets "Get in touch" in regular mixed case) and the time cards' small labels.

## Differences found, and what changed
| # | Where | Before | Reference | Change |
|---|---|---|---|---|
| 1 | Poster headline | Three fitted lines stacked at line-height .9, so the content boxes overlapped (QA: overlaps at every width) | Hatch 2009 reverses BOXING out of a solid black block, and the lines sit apart on their own bodies | "Main event" is reversed out of an ink block. Lines are set at 1.02 with real gaps, and the ornament gets space above and below |
| 2 | Top band | "The Chamber presents · one night · every format", letterspaced .14em Anton | Fracas: "SELF-LOCK KING PRODUCTIONS PRESENTS" in italic caps, no tracking | "The Chamber presents" in italic condensed caps. Filler cut |
| 3 | Poster small lines, foot | Anton caps, tracked .08em | "2 Rounds of Sparring…" in mixed case; stars as separators | Barlow Condensed in mixed case. Foot reads "Three-minute speeches ★ Questions to follow". Undercard is centred on phones, as Hatch centres everything |
| 4 | Results ticker | Sideways scroller; cells ran under the fixed sound button (44 offscreen-in-scroller, covered text) | NCAA shows only whole cells, a › paging cell, and a link cell at the far right | Whole cells only, paged by the › cell (cells slide in with the expo-out ease). The sound toggle sits in the far-right cell |
| 5 | Sound toggle | Fixed top-right, covering "CA Mock Trial Finals" | Josh's toggle lives in his header, first in tab order, and scrolls away with it | Moved into the scores bar. Still first in tab order, and it no longer floats over anything |
| 6 | Section slates | Letterspaced yellow caps eyebrow ("Bout 1 · Main event") above an all-caps title, overlapping it at 1440 | Anti-AI list. The bout order already lives in the scorebug, which is where a broadcast keeps it | Eyebrows removed. Titles are italic 800 in mixed case |
| 7 | Scorebug game-assist row | One nowrap line that ran off-screen on phones. Segment label clipped at 360 | NBC's game-assist row slides out under the bug | The row wraps and animates max-height, and it can no longer widen the bug. On phones the bout counter drops so the label fits. The row now carries the real stat ("NSDA Nationals: national finalist, 1 of 20 from 50,000+") |
| 8 | Buttons | Pill "Replay ↻", pill "Straight to the card ›" | Dennis's text links are plain text; icons and chevrons came from my defaults | Plain underlined text, with no icon and no pill |
| 9 | Round buttons | Anton caps, tracked .08em | Dennis's round CTA: regular weight, mixed case | Barlow regular in mixed case. Dennis's fill now **exits out the top** on leave (76% → 0 → −76%, 0.6s ease-in-out), as his `.btn-fill` does, instead of sinking back |
| 10 | MVP numeral vs title | Line-height .78 overlapped "Mock Trial" | n/a | Set at 1 |
| 11 | Intro | "TIMEKEEPER" letterspaced label under the card | Filler | Removed. Cards read "Minutes", "Minute", "Time" in the Barlow Condensed small size. Skip no longer shows a focus ring on load |
| 12 | Hero side copy | Two paragraphs; the second explained the UI | Dennis has one statement at that spot | One statement kept. The explainer is cut |

## Copy pass (every result at full strength, nothing new)
- Finalist lower third: "1 of 20 from 50,000+. Also a national semifinalist and a four-time national qualifier."
- Legislation: renamed "National Legislation Author", and it now carries its selectivity, "1 of 41 from 500+". Before, it showed no number at all.
- Council: "1 of 23 students nationwide, representing 140,000+ members to the national board" (the CONTENT.md wording). It also appears on the poster foot.
- Mock Trial: "1 of 128 from 5,000+ competitors" (CONTENT.md gives "competitors" here only).
- **Units checked against CONTENT.md.** Only Mock Trial has a unit ("competitors"). NSDA's "1 of 20 from 50,000+" and the legislation's "1 of 41 from 500+" have none. So Tale of the Tape no longer says "50,000+ competitors" or "500+ entries". Both now read "in the field".
- CHSSA and Ethics Bowl are labelled as state results ("State semifinalist, top 15 in California", and so on). CHSSA is California's state association, and CONTENT gives "top 15 in CA" and "California state quarterfinalist".
- TED: "Mentee, 2023", which is as held; not inflated.

## QA
- Before: 115 issues (44 offscreen-in-scroller, 41 overlap, 12 offscreen, 11 covered, 7 clipped-self).
- After: **0** at 360/390/768/1024/1440/1920.
- One `data-qa-ignore`, on Dennis's rolling marquee, which runs past both screen edges by design (comment in the source).
- Screenshots: `world/_shots/speech-r3-a-*`, `speech-r3-b-390-*`, `speech-r3-intro-*`, `speech-r3-afterintro-*`, `speech-r3-hover-1440.png`, `speech-r3-ticker2-1440.png`.
