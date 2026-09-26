# The Map Room, round 3: refine

Page: `world/triptik.html` ("Home Lines"). Same page as round 2: crate-label masthead, pocket guide with the system map and the Sanborn KEY, then one strip map per line with the highlighter, the counselor's pen and the one tear-off notice. Nothing was redesigned. Every change below either brings a detail closer to a named reference or removes something on the ROUND3 anti-AI list.

## How I studied this round (and its limits)
- Firecrawl returned 402 (out of credits). Direct fetches of eBay, Flickr, Substack, LOC, Wikipedia, archive.org, geographicus and the AAA regional magazines were refused by the egress proxy (403). So there were no new scans this round. I worked from web-search result text (which quotes the eBay listings, the AAA Northeast magazine, Rainey Knudson's "61. AAA TripTik", a VW Vortex thread, the IJOC paper "From AAA TripTik to Google", the NY Transit Museum's Vignelli-at-50 page and Carter's Ink / Hi-Liter histories), plus the round-2 study, and I compared against those.
- Before and after screenshots: `world/_shots/triptik-before-{1440,390}-*.png` and `triptik-r3-{1440,390}-*.png`, with the highlighter mid-wipe and after a route is selected in `triptik-r3-mid-*.png` and `triptik-r3-sel-*.png`.

## What the references say, detail by detail, and what changed

### AAA TripTik (the strips)
| Reference detail | Round 2 | Round 3 |
|---|---|---|
| "An AAA agent used a highlighter to mark the route on strip maps, which were then combined into a **spiral-bound booklet**" (AAA Northeast; Knudson: "assembling narrow strips of map into a spiral-bound flipbook"). Spiral binding is one of my own devices. | No binding anywhere, even though the r2 DECISION said to keep it once. | Every strip is **spiral-bound on its short edge**: punched holes, a black plastic coil with a soft highlight and a contact shadow. It runs down the left edge on desktop, where the strip lies sideways, and across the top on phones, where the strip runs top to bottom the way a real TripTik is held. |
| The counselor "would drag an **orange highlighter** over the entire planned journey" (VW Vortex thread, quoted in results; one 1947 Delaware TripTik was marked in green). | Lime `rgba(214,255,20,.7)`, left over from round 1. | **Fluorescent orange** `#ff8c1e` at .62, multiplied into the paper. |
| A **chisel-tip** marker: flat ends, even width, water-based ink that streaks and pools, edges slightly ragged (Hi-Liter histories: "chisel-shaped or broad-felt tip", translucent). | A CSS bar with 14px round ends and flat, perfect colour. Round caps on the map too. | One SVG filter (`#hlTex`) is shared by the map, the strips and the KEY swatch: `feDisplacementMap` roughs up the edges, and low-frequency turbulence makes the ink uneven. Ends are square (`butt`) and corners bevelled, as a chisel tip leaves them. |
| The counselor marks the whole route, **branches included**. | On desktop the mark stopped at "VP & Executive Director" and never reached the four ends; on phones it stopped at the fork. | The strip highlighter is now an SVG path drawn to the **real DOM positions**. On desktop it runs the track, down the edge, along the bar and down each of the four spurs in one stroke. On phones it runs down to the last end. It redraws on resize and whenever a strip changes height (ResizeObserver), so late fonts can't leave it short. |
| A hand moves at a hand's speed. | Every wipe took 1.4s whatever its length. | Duration = length ÷ 820px/s, clamped to 0.55–1.9s, easing `cubic-bezier(.3,.08,.25,1)` (a fast start, then a steady drag). |
| The mark is ink **on** the paper, but the route under it must stay readable. | Multiplying over the lines changed their Vignelli colours (the blue M turned teal). | The highlighter sits **under** the printed line on the strips, the same way it already did on the system map, so every line keeps its own colour and the mark reads as a halo of ink. |
| You mark with the pen in your hand. | Hover showed the default pointer. | The cursor over route bullets and map lines is a small **highlighter with a chisel tip** (an inline SVG cursor), with a pointer fallback. |
| Markers such as "Mark line F" do not exist on a TripTik. | A lime all-caps "MARK LINE F" button sat on every sign. | Removed. The **route bullet on each sign is the button** ("Run the highlighter along line F"), so the tool is the symbol itself, as on the guide above. |

Handwriting: kept Nanum Pen Script in pen blue `#1f3a9e`. The sources describe counselors' marks and notes but not their pens, so there was nothing to justify a change.

### 1972 Vignelli map, pocket guide and NYCTA signs
- The 1972 map sets station names in Helvetica, mixed case (NY Transit Museum), and the Unimark/NYCTA sign standard is white Helvetica on black, mixed case ("Uptown & The Bronx"). Round 2 had drifted into letterspaced caps in six places, and all six are now mixed case with no tracking: the guide headings ("How to use this map", "Routes", now set as real `h2`s under a 6px black rule, like the NYCTA sign band), the service notes on the map ("Sundays · 2015–2021"), the service notes on the signs, the run labels on the strips ("Volunteer · Sundays"), the borough-style area names ("Fresno · Clovis", "Central Valley") and "Home" at the transfer station.
- Collisions fixed on the system map. "Drives & mentoring" ran past the map's grid frame, so the M fork and its four ends moved 24px left. "VP & Executive Director" touched the fork's diagonal, so that station moved to x=830. In the dimmed state the black service-note boxes stayed dark while everything else faded, which was a bug, and they now dim too.

### Sanborn KEY
- The notched "KEY" banner stays letterspaced Ultra caps. That is the reference itself: the LOC Sanborn key sheet prints KEY in spaced display capitals in a notched banner.
- The three black ALL-CAPS tags ("SCHEMATIC", "TRANSFER", "BRANCHES") were generic UI furniture and are gone. They're replaced by the Sanborn **"Reference"** panel form: a heading over a rule, then paragraphs with run-in italic roman heads ("*Schematic.* Not to scale…").
- The highlighter swatch in the KEY now shows exactly what the page does: orange, textured, under a blue line.

### Crate label
Unchanged. Its letterspaced condensed caps ("BRAND", "CALIFORNIA", and the bottom band "GROWN IN THE CENTRAL VALLEY · FRESNO & CLOVIS, CALIFORNIA") are the label genre itself: lug and citrus labels print the grower's place in a spaced condensed-caps band ("GROWER & PACKER · EXETER, CALIFORNIA", r2 study §4).

### Bulletin notice
The headline was forced to caps with `text-transform`, and it now reads "Drives & Mentoring" in title case in the photocopied-flyer condensed face. The tear-off tabs are unchanged.

### Removed from defaults
- The "STRIP MAPS" section title in extruded Anton caps (it came from no reference). It is now a plain paper tab in Helvetica Bold, "Strip maps", with the same 6px black top rule as the guide.
- An invalid `<span>` inside each `<ol>` (the old highlighter bar).

## Copy pass
- Intro now leads with the strongest true facts: "…Five lines leave from there, one for each commitment. The longest, line M, ends at 150+ community events, $240K+ raised and a $500K pledge for Fresno's first Muslim women's transitional home."
- The routes list now uses full, exact names: "Central California Food Bank", "Masjid Fresno Saturday School", "Muslim Community Association of Fresno", "Muslim Student Association · Clovis Community College · 2022" (was "MSA on campus") and "Instilt Educate · Tutor · 2023" (was "Tutoring").
- How-to: "…the way a travel counselor marked a route."
- The Reference note on branches names all four ends.
- The colophon names the TripTik: "strips bound like an AAA TripTik and marked the way its travel counselors marked them".
- No new numbers and no new claims. Every figure is CONTENT.md's.

## Checks
- `node world/_shared/qa.js triptik`: 0 issues before, 0 after (360/390/768/1024/1440/1920).
- `audit.py`: triptik is not an offender. The only line naming triptik is depths mentioning "Clovis Community College", which is the Pier's Summa Cum Laude line and not mine to change.
- There is no horizontal overflow at 390 or 1440. The world-nav block is byte-identical to round 2. Reduced motion places the marks without the wipe.
