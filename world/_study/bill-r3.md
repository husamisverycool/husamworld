# The Capitol, round 3: side-by-side with the references

Refinement only. The concept, layout, cartoon, tracker-as-scene-buttons, typeset bill, sidenotes, popups, find band, signature pad and stamp are unchanged.

## What I compared against (live, 26 Sep 2026)
- **congress.gov H.R.3684 (117th)**: overview page scraped at 390px (mobile) with raw HTML. The All Actions page was scraped at 1440px with raw HTML. The site's own stylesheet (`/css/cache/971ea43b….css`) was fetched and searched rule by rule. Captures are in the scratchpad `r3/` folder (`cg-390.png`, `acts-1440.png`, `cg.css`, `cg.html`, `acts.html`).
- **GPO / govinfo bill PDF**: not re-fetched. govinfo.gov, congress.gov PDFs, govtrack and Wikimedia are all blocked by the sandbox egress proxy. My one Firecrawl call on the 1,249-page H.R.3684 PDF used up the scrape credits and returned no image. For the GPO page I relied on the round-2 live parse of `BILLS-117hr3684ih.pdf` (see `bill-r2.md` §3) and on GPO's printed conventions. Where a decision depends on that parse, it is marked *(r2 parse)* below.
- leginfo was also unreachable this round, so its conventions (the digest heading, italic/strike amendments) rest on `bill-r2.md` §2.

## The narrow tracker (the 8 QA issues)
**congress.gov at 390px:** `.bill_progress>li{display:block;float:left;width:6rem;height:1rem;…}`. The chevrons **float and wrap onto new rows** ("Introduced > Passed House" / "Passed Senate" / "Resolving Differences" / …). They never scroll sideways.
**Before:** a single `overflow-x:auto` flex row with clip-path notches. At 360/390 four chevrons were off the right edge (8 issues).
**After:** I rebuilt the tracker on congress.gov's own rules: 11px text, a 1px `#8f8f8f` border with no right border except on the last item, and the point made as a `scale(.707) rotate(45deg)` square with only its top and right borders. The row now wraps like the real one. I also copied the state classes: steps before the current scene are `passed` (`#000` on `#f7f7f7`), the current one is `selected` (`#424242`, white, bold) and later ones stay grey `#767676`. The height is 18px on desktop and 26px on coarse pointers, so the targets stay tappable. **QA 8 → 0.**

## Differences found and what changed

| Detail | congress.gov (proof) | Before | After |
|---|---|---|---|
| Red label text | `<h2 class="label_text">Law</h2>` + `.overview_label .label_text{text-transform:uppercase}`; bill pages read BILL, enacted ones LAW | `RECORD 2021–2025`, letter-spaced .04em | Source text `Bill`, uppercased by the same CSS and not letter-spaced. **Signing turns it into `LAW`** and rewrites Latest Action to "Signed by the reader." |
| Label box | `background:#98382a;border-bottom:3px solid #4a0d0c;height:30px;line-height:30px;padding:0 15px` | flat `#a3231c`, 7px 14px | exact values |
| Label toggle | `Hide Overview ✕`, 11px, `margin-left:30px`; `.off` shows a chevron-down | invented year range | working **Hide Overview / Show Overview** toggle that collapses the box |
| Overview box | `border:2px solid #889daa;box-shadow:0 0 6px #999;padding:32px 30px`; label overlaps it by 15px (`margin:-15px`) | 3px `#cfcfcc`, no overlap | exact values, label overlapping |
| Body type | `font-family:Arial,Helvetica;font-size:.75rem;color:#333;line-height:1.333` | 14px/1.55 | 12px/1.333 `#333` (the bill text keeps its own serif sizes) |
| Links | `a{color:#36C}` `a:hover{color:#24478f;text-decoration:none}` | `#1f5d93`, red hover | exact |
| Title | `h1{color:#202a43;font-size:1.25rem;line-height:1.1}`, `H.R.3684 - Title` with a hyphen, `117th Congress (2021-2022)` underneath | 23px, em dash, purpose line underneath | 20px `#202a43`, hyphen, `119th Congress (2025-2026)` |
| Breadcrumb | `.breadcrumbs{font-size:.6875rem;color:#666}` Home > Legislation > 117th Congress > H.R.3684 | 11.5px, two levels | 11px `#666`, four levels |
| Search band | `#a6adbd` band, select and input with a 3px navy frame (measured from the screenshot) | dark `#5d6873`, white frames | light band, navy frames |
| Tabs | `.tabs_links li{border:1px solid #ccc;background:#f7f7f7;margin-right:5px}` `a{font-size:.6875rem;color:#666}` `li.selected{background:#fff;border-color:#999}` `li.selected a{color:#900;font-weight:bold}`; not sticky; full-width `1px #999` rule | 13px, `#eee`, red, **sticky** | exact values, not sticky, wraps instead of scrolling. Labels now `Actions (11)`, `Related Bills (5)`, `Text (n lines)` |
| Section heading | `All Actions: H.R.3684 — 117th Congress (2021-2022)` with "All Actions:" in red | "…— Worked End to End Act" | `All Actions: H.R.2026 — 119th Congress (2025-2026)`; the measures became congress.gov's **Related Bills** tab with its columns `Bill · Latest Title · Relationship to H.R.2026` |
| Actions table | `table.item_table{border-top:1px solid #333}` `thead th{background:#f5f5f5;border-bottom-color:#333}` `td{border-top:1px solid #ddd;padding:12px 10px}` `.date{width:15%;white-space:nowrap}`; the Chamber cell is plain text and **blank when no chamber acted** | coloured dots, a dot legend, invented chambers "Field" and "Civic education" | exact table styling. Chamber is plain text (`House`, `Assembly, Senate`) and blank otherwise; dots and legend removed. The results line copies "183 results for All Actions" → "**11** results for All Actions, newest to oldest." |
| Right rail | `.tertiary_section{border-top:1px solid #ccc}` h3 bold 13px `#666`: "More on This Bill", "Subject — Policy Area:" | "More on This Record"; **big navy stat tiles** (5,000+ / 800+ / 11K+ / 80+) | "More on This Bill", a "Subject — Policy Area:" block (Civil Rights and Liberties, Minority Issues, a real CRS policy area), counts as plain list lines, script as a plain decimal list |

## The bill text (GPO), line by line
- **Line numbers:** unchanged. They still count real rendered lines and restart at 1 every 25 lines *(r2 parse: "Line numbers 1–25 in the left margin of every page, restarting per page")*. Before, the page number sat in the gutter on a dashed rule and **crashed into line 25**. Now it is a bold numeral at the far left of the gutter on the row of that page's line 1, under a hairline, so no two numbers collide.
- **Page-one caps:** GPO sets the heading in caps and small caps (`117TH CONGRESS / 1ST SESSION`, the date `JUNE 4, 2021`, the sponsor `Mr. DEFAZIO`) *(r2 parse)*. I switched these from `all-small-caps` + letter-spacing to plain `small-caps` over mixed-case source text, which gives GPO's large initial and small-cap body. The .09–.11em letter-spacing is gone.
- **Subsection headings:** GPO writes `(a) IN GENERAL.—` in caps and small caps. Mine were all-small-caps (`LEAD MEASURE`) and are now `Lead Measure` in small caps.
- **Title heads** (`TITLE I—…`): still full caps as in GPO, with letter-spacing cut from .07em to .01em.
- **Caps that stay, with their source:** `IN THE HOUSE OF REPRESENTATIVES`, `A BILL` (GPO sets it wide-spaced), `SECTION 1. SHORT TITLE.` / `SEC. 102.` (bold caps), `•HR 2026 IH` *(r2 parse)*. `LEGISLATIVE COUNSEL'S DIGEST` stays in small caps (leginfo, r2), with spacing cut to .03em. `ENROLLED` on the rubber stamp matches a real enrolment stamp.
- **Margin annotations:** each sidenote used to start with a small letter-spaced uppercase sans label ("SACRAMENTO", "1 OF 5"), which is the AI eyebrow on the banned list. I replaced them the gwern way: a numbered superscript on the section heading links to a sidenote that starts with the same numeral, followed by an italic run-in. On narrow screens the notes drop inline into a 1px box with no accent bar.
- **Popups:** gwern's are shadowless 1px boxes that open on a short hover. I removed the drop shadow and set the delay to 250ms, the r2 measurement.

## Copy pass (every change supported by CONTENT.md)
- Latest Action: "Managing Director … ends." → "Completed term as Managing Director, California High School Democrats, 1 of 9 directors."
- §302 "he helped lead" → "Mr. Sokar was one of five executives leading Diversify Our Narrative" (removes the hedge).
- §301(b) **fixed an error**: "80 volunteers" → "more than 80 volunteers" (80+).
- §304 → "He was selected as one of 50 paid Election Fellows of Voters of Tomorrow".
- §101 names CAIR in full and adds "worked five California bills end to end".
- Actions rows lead with the role title, then the selectivity: "1 of 5 executives leading a national 501(c)(3) of 5,000+ student organizers and 800+ district chapters. Featured in TIME, Bloomberg, Vox, ABC Nightline and The Washington Post". LegislativeLift reads "Executive Director … Rose from volunteer to Outreach Director to Executive Director." The CAIR row now reads "Lead Advocate, CAIR … Five California bills worked end to end."
- Cartoon: scene 5 now leads with "Executive Director of LegislativeLift"; scene 7 now reads "Encode Justice, as an Advocacy Fellow".

## Checks
- `node world/_shared/qa.js bill`: **8 → 0** at 360/390/768/1024/1440/1920.
- `audit.py`: the only remaining line is `depths`, not this page.
- Tested the tracker states, signing (BILL→LAW, Latest Action, Signed chevron), Hide/Show Overview, no console errors. Screenshots: `world/_shots/bill-r3-a2-*`, `bill-r3-signed-*`, `bill-r3-hidden-*`, `bill-r3-tracker-*`.
