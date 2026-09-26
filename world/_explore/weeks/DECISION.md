# The Plaza, round 2: which direction

Three working prototypes, all built on the same name-free record (`data.js`: every role reduced to a district id, names only in comments). Screenshots at 1440 and 390 are in `world/_shots/weeks-r2/proto-{a,b,c}-*.png`.

- **A. The week grid, name-free** (Wait But Why + The Pudding): round 1's page with the names stripped out. A blue-titled post, a navy "Twelve Years in *Weeks*" chart, 12 rows × 52 hollow boxes shaded by count, weekend dots under the boxes, sticky steps, a hover card listing districts.
- **B. The annual report** (Feltron 2014): a coral cover with a field of week bubbles in twelve year columns, then "Totals", "Districts" and "Years" pages built from Felton's module (serif header + hairline, sparkline, one huge numeral, two sub-stats).
- **C. Twelve postcards** (Dear Data, Week 14 "A week of productivity / schedules"): one card per year. Each week is a Posavec-style fan with one ink line per thing, coloured by district, and weekend circles at its foot. The back of each card holds a hand-lettered "HOW TO READ IT" key, a stamp and a "To:" block.

## Scores (1–5)

| | A. grid | B. report | C. postcards |
|---|---|---|---|
| Fidelity to its inspiration | 4. Recognizably WBW, but it's round 1 again. | 4. The module, cover and page rhythm read as Feltron straight away. | 3. It needs handwriting to feel like Dear Data, and it can't have much (see below). |
| Ambition and memorability | 2. Once the names are gone, the chart is just a gradient. | 5. A person's weeks treated as an annual report is the idea people will remember. | 4. It's charming, and the fans show "how many at once" better than any shade. |
| Fit with HIS content (own facts only) | 3. The shape is there, but it has no room for 4,000+ hours or "zero empty weeks". | 5. The big numerals are exactly his own facts: 7 at once, 13 weeks, 5 districts in one week, 4,000+ hours, 0 empty weeks. District names become the module headers, so the cross-links are built in. | 3. The facts are in there, but you have to read them off twelve keys. |
| Not repeating other pages' devices | 5. The week grid, sticky steps and stick figures are the Plaza's own. | 4. Charts are about time, not research, and there are no dot plots of honors. But on its own it has no week grid, which is the Plaza's signature. | 2. Handwriting notes belong to the Map Room, a postmark is too close to the Capitol's rubber stamp, and a flip-to-back would be the Chamber's flip card. |
| Phone quality | 2. 52 boxes across 358px is unreadable; the chart turns into a stripe. | 4. The modules drop to 2 columns and still read. | 3. Cards stack fine, but the keys get cramped and the page runs 8,000px. |
| Never feels bad | 3. Five nearly blank rows before anything happens. | 3. The 2015–2019 year modules say "0" in huge type: an empty state in 60pt. | 2. Five cards of almost nothing, then a key that overflows. |
| **Total** | **19** | **25** | **17** |

## What the prototypes taught

1. **The early years aren't empty, they're weekends.** A, B and C all made 2015–2019 look like nothing, but in the data every one of those weeks has a Sunday dot, and from 2018 a Saturday one too. Counted properly, **no week since January 2015 has had nothing in it**. GitHub's 7-row contribution graph is the form that shows this. With Sunday and Saturday as rows of their own, the weekend rows are lit for five years before any weekday is. That fixes the "feels bad" problem in all three directions.
2. **Felton's module is the right container for facts that belong to this page.** The big numbers ARE the content: things at once, the busiest stretch, the widest week, the weekends, the service hours. Felton never names the song, only "Music". Here we never name the role, only "the Capitol".
3. **Eight district colours break Felton's three-colour restraint** if they're everywhere. They belong only where identity is the point: the stacked weekly bars, the legend, and the hover fan. Everything else stays coral, taupe and slate.
4. **Dear Data's fan is the best single-week glyph**, one line per thing at once. It works as the hover card's picture, not as the page.

## The pick: B, combined

**The Plaza Annual Report, 2015–2026.** Feltron 2014 is the frame and the voice. The Plaza's own week grid is at its centre, drawn the way GitHub draws a year. Dear Data supplies the one-week glyph, and Wait But Why supplies the asides.

- **Cover** (coral flood, FAR14): "2015–2026" in the display serif, one paragraph of intro, and the bubble field: every week a bubble in its year's column, sized by how many things were going on, with the peak weeks in slate. Hover or tap any bubble to get the week card.
- **Totals** (FAR14's Totals page): 4-column modules. At once (7), Busiest stretch (13 weeks), Widest week (5 districts), Weekends (links to the Map Room, without naming the places), Nothing weeks (0), Service (4,000+ hours, President's Volunteer Service Award).
- **The Weeks** (the Plaza's signature, with sticky scrollytelling): a GitHub-style year graph, 7 rows × 52 weeks with a Less/More ramp, plus GitHub's year list. Beneath it sits a 12-year Wait But Why strip of the whole record. Chapters scroll past as steps: weekends only → Saturdays join → the first weekday things → 2022 turns dark → the widest week → the busiest stretch → now. They tell a story of time and load, with no names anywhere. Two stick-figure asides.
- **Years** (Felton's Q1–Q4 spreads): the same module for each of the 12 years. 52 weekly bars stacked by district, the weekend ticks under them, and a numeral that is never a sad zero: "most at once", or the weekend count in the years before 2020.
- **Districts**: eight modules, each headed with its district's name and linking there. A sparkline of how much was going on in it each year, weeks with anything there, and most at once there.
- **Overlaps** (FAR14's "Correlations"): the district pairs that ran together the longest, in weeks.
- **Sources** (FAR14's "Sources" page): how precisely each thing on the chart is dated (to the month, placed by season, year only, weekly, undated), as big percentages. The method, told the Feltron way.
- **Table view** of every year × district, for accessibility and as the relief the palette's contrast warning requires.
- The week card, everywhere: "Week of Oct 6, 2025", a Dear Data fan (one line per thing, coloured by district), then "4 things in the Airport · 2 in the Polling Station · 1 in the Map Room", each part a link to that district.

Colour: coral `#FF6468`, taupe `#9F928A` and slate `#374659` are sampled from FAR14. The magnitude ramp is one slate hue with GitHub's five classes (0, 1–2, 3–4, 5–6, 7), validated as an ordinal ramp. The districts use the validated 8-slot categorical palette in a fixed order (the Capitol, the Chamber, the Bridge, the Polling Station, the Map Room, the Garage, the Pier, the Airport), and passes CVD and normal-vision checks. Type: Rozha One (the Felton display serif) and Hanken Grotesk (the tiny captions).
