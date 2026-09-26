# Study, round 3: weeks.html (The Plaza)

Husam's note: "make sure that you don't start with a year where they're doing mostly nothing. Maybe make it clearer that they're doing a lot somehow." He liked the direction, so the page keeps its structure: a FAR14 coral cover with a bubble field, then Totals, The Weeks (sticky GitHub graph and steps), Years, Districts, Overlaps and Sources. This round changes the order things are read in, not the design.

## Compared against

- **feltron.com/FAR14.html**, re-scraped live on 2026-09-26 (Firecrawl, full-page screenshot at 1440). The site shows all 16 spreads as thumbnails.
- **GitHub's contribution graph**: the year list, from the r2 notes.
- **The Pudding**: step order, from the r1/r2 notes.

| Detail | FAR14 / GitHub / Pudding | Round 2 page | Round 3 change |
|---|---|---|---|
| What the cover is made of | FAR14's cover and its "2014" page are almost all bubble field. The dense columns start about a fifth of the way down the page, and the type is small. | A two-line 156px "2015– / 2026" and a five-line intro pushed the bubbles below the fold at 1440. The first thing you saw was 2015–2019: five nearly empty columns. | The year range is set on one line at the "2014" page's scale (`clamp(58px,9.4vw,122px)`). The key moves under the field. At 390, 768 and 1440, all 12 year columns are on the first screen. |
| Density in every column | Every FAR14 column is full, with big white and slate bubbles. | Chronological order put the sparse years first, on the left on desktop and in the top row on phone. | **Newest year first** (2026 → 2015), the same order GitHub's year list uses and this page's own year list already used. The five tall columns (2022–2026) lead. The weekend-only years taper off at the end. |
| Column hairlines | FAR14 runs thin light rules between the bubble columns. | None. | Added: 1px white rules at 35% opacity between columns. |
| Cover text | FAR14 cover: one short block of small intro text, top left. | An intro that explained what the report doesn't say. | The block now **opens with the true count**, in the display serif: "7 things at once, every week for 13 weeks straight. 611 weeks since January 2015, and not one blank on the chart." Every number is `data-calc`, computed from the record. The intro below it is shorter: 3 lines instead of 5. |
| Story order | The Pudding often opens on the finding and then rewinds. | The sticky graph opened on 2015, where the only thing lit is the Sunday row. | The 2025 "busiest stretch" step (with the juggler) now comes **first** ("Start at the top."). The story then goes back to 2015 ("Ten years earlier, it was one day a week.") and runs forward. The 2022 step ties back to it: "not until the stretch this story opened on". The dek says so. No step was added and none repeats. |
| Phone year list | GitHub never hides years off to the side. | A sideways-scrolling button strip. 10 year buttons were offscreen. | A 6×2 grid, so all 12 years are visible. |
| Phone table | n/a (accessibility table) | `min-width:700px` inside a scroller. 22 cells were offscreen. | Under 640px the district headers turn on their side (`writing-mode:vertical-rl`, the way a chart's axis label does), so all 11 columns fit in 354px. |

## Counts (all derived from versions/CONTENT.md dates by the page's own code)
- 7 at once, month-dated items only, Oct 1 to Dec 31, 2025, 13 weeks. The seven: service/ethics fellowships (Aug 2025–), IOP (Sep 2025–May 2026), HGRCG (Sep 2025–Feb 2026), Model Congress (Sep 2025–), Crimson Business Board (Oct 2025–), Radcliffe (Oct 2025–Apr 2026), MCAF (to Dec 2025). By district: 4 Airport, 2 Polling Station, 1 Map Room.
- 611 weeks counted, Jan 2015 to this week. "Not one blank on the chart" depends on the weekend rows ("most Sundays 2015–21, most Saturdays 2018–21"). That is why the cover says "on the chart" and not "every week of his life". The Methods note still calls the weekend rows a habit.
- 4,000+ hours and the President's Volunteer Service Award stay in Totals, unchanged.
- No organization or role is named in visible copy (names appear only in code comments, as in r2).

## QA
Before: 56 issues. 12 overlaps: the two h1 lines at every width, and the h1 over the key at 1024+. 44 offscreen-in-scroller: the year strip and the table.
After: **0** at 360/390/768/1024/1440/1920. The 768 fix: the two-row bubble layout now applies below 860px, so the cover fills the tablet screen and the Totals dek no longer sits under the corner button at rest. On phone the key is right-aligned so the bottom-left 72px stays clear. audit.py: 0 problems.
Screenshots: `world/_shots/weeks-r3-before-*`, `weeks-r3-a-*` (cover), `weeks-r3-b-*` (steps, table), `weeks-r3-c-768-0.png`.
