# Study, round 3: The Pier (`depths.html`)

Re-studied 2026-09-26. neal.fun/deep-sea was loaded live through Firecrawl: the raw HTML with its inlined Nuxt
CSS, the full DOM (all 192 animals and blurbs with their grid rows), and a scripted scroll that read the
counter and took screenshots at nine depths (`world/_shots/depths-r3/ref/ds-1440-*.jpg`). Firecrawl's browser
has no WebGL and no webfonts, so those shots show the CSS fallback water and Arial. Water colours still come
from the shader maths in `depths.md`. The Firecrawl credits ran out before Size of Space and Spend could be
re-scraped, so for those the r2 notes (`depths-r2.md`) are the reference.

Source of the page: `world/_explore/depths/src/` (`build.py`, `depths.css`, `depths.js`, `art.py`). Run
`python3 build.py` to rebuild. The build now copies the `world-nav` block from the live page word for word and
never regenerates it.

## Neal's CSS, quoted (the proof for every case and size decision)
```
.depth-line  { border-bottom:1px dashed rgba(255,255,255,.2); bottom:18%; color:#fff; font-family:Roboto;
               font-size:28px; font-weight:700; padding-bottom:10px; position:sticky; transform:translateY(-50%);
               transition:opacity .3s ease-in-out }            text: "0 METERS DEEP" … "10848 METERS DEEP"
.zone-title  { color:#eabdff; font-size:48px; font-weight:700; text-transform:uppercase }   (32px ≤500px)
.animal-name { color:#f7f1e3; font-family:Oswald; font-size:16px; font-weight:lighter; margin-top:5px;
               opacity:.9; text-transform:uppercase }
.blurb       { color:#fff; font-size:24px; line-height:1.6em; padding-top:8px; text-align:center } (20px ≤500px)
.title-langs { color:#4d4d80; font-family:Oswald; font-size:18px; position:absolute; right:18px; top:18px }
.lang-button { border-radius:8px; padding:6px 8px; background:0 0 } :hover { background:rgba(0,0,0,.06) }
.lang-menu   { background:#fff; border-radius:10px; box-shadow:0 6px 24px rgba(0,0,0,.18); padding:6px 0 }
.site-logo   { left:18px; top:18px; width:150px }
```
None of these uses letter-spacing. Uppercase appears in exactly two places: zone titles and animal names.

## Detail by detail

| Detail | Neal (live) | Pier in r2 | Changed in r3 |
|---|---|---|---|
| Counter text | Raw integer, no thousands separator ("1788 METERS DEEP") | "1 IN 1,628" with a comma | "1 IN 1628". Decimals stay below 10 (1 IN 3.5), since the odds need them there |
| Counter type | Roboto 700 28px, no tracking | Heebo 700 28px + `letter-spacing:.01em` | Tracking removed |
| Zone titles | Lilac, 700, 48px, uppercase, **title only**. The line that follows is an ordinary white blurb ("No sunlight is able to reach this deep.") | Title + a lilac, tracked, 21px range line ("1 in 10 to 1 in 100") | The range line is now a white 24px/1.6 blurb under the title, in Neal's voice: "Below 1 in 10, fewer than one in ten get picked." / "…fewer than one in a hundred." / "…one in a thousand." The Surface's subtitle is gone (its blurb already says it) |
| Animal names | Oswald lighter 16px, uppercase, no tracking, opacity .9, 5px under the picture | 17px 300, `letter-spacing:.035em`, opacity .95, 8px under | Exactly Neal's values (14px on phones, where two lanes are 175px wide) |
| Catalogue numbers | (none) | Lilac "NO. 13" eyebrow, 12px, `letter-spacing:.2em`, above every name: the banned eyebrow | A small numeral beside each drawing, like Haeckel's figure numbers (the plate uses the same form): Heebo 700 14px, cream at 70%, top right of the art. Screen readers still hear "No. 13" |
| Odds tag under each specimen | (none; Neal's facts live in blurbs) | "1 IN 33", uppercase with .09em tracking: too much like the counter, and the tracking was a default | Lower case "1 in 33", no tracking, 15px. It now reads as the specimen's label, not a second counter. The "~" sits against the number instead of floating in the flex gap |
| Title slide | Title + credit, and nothing else. You just scroll | Title + credit + navy "DIVE ↓" chevron button + "or skip to the bottom" | The chevron button is gone (generic UI furniture). One underlined Oswald link remains, "Skip to the bottom", set like Neal's underlined credit link |
| Logo / controls inset | 18px from the top and left; picker 18px from the top and right, 6px 8px padding | 12px, padding 8px 10px | 18px and 6px 8px (12px on phones, as Neal's ≤500px rule) |
| Controls under water | The picker isn't pinned; it scrolls away with the title | Pinned, on a dark translucent rounded panel (a "dark glassy panel") | The panel is gone: cream text straight on the water. Because they're pinned and Neal's aren't, **they step aside**: when a line of text scrolls under them they fade out (.2s) and come back when it has passed. They stay while focused, while the menu is open or while sinking |
| Right-edge depth gauge | None; the browser scrollbar is the only gauge | A 7-colour rail with a "you are here" pip and tracked-caps tooltips | Removed (you-are-here dot, pill tooltips). The Jump menu still goes everywhere |
| Menu | White, radius 10, `0 6px 24px rgba(0,0,0,.18)`, rows 8px 16px, hover `#f1f2f6` | Same | Kept: it is Neal's lang-menu to the pixel |
| Water colour ramp | `b = 1 - depth*.1`, depth = scrollY / innerHeight from the top of the page: 10% darker per screen, black after 10 screens | Darkness tied to odds units (`(n-1)/11`). That depended on the device (8%/screen on phones, 13.6% on desktop) and left the surface floats at full brightness | Neal's formula exactly: `dark = scrollY / innerHeight`. Same pace per screen on every device; black at the 10th screen, as in Neal's (about 1 in 118 on desktop, just past the Midnight line; about 1 in 63 on phones, where the scale is stretched) |
| Illustrations | Flat, posterized, near-photographic PNGs; natural colour; no outlines; size follows the real animal | Flat SVG with no outlines, natural colour, size set per specimen; friendlier faces | Kept. A full redraw would be a redesign. Noted as the one remaining gap in fidelity |
| Pacing | 30 animals in the first 200 m; then long gaps with single blurbs; lonely lines late ("The deep sea can be a lonely place."); a step-by-step run before the bottom | Same shape: crowded sunlight/twilight, a 928-unit empty stretch with one-liners, then the pool and the lure | Kept. One instructional blurb ("It's under Jump, top right") became a line in Neal's register: "1 in 1,000 is a long way up now." "Below 1 in 1,000 it gets very quiet" became "It gets very quiet from here," because the new abyssal blurb says the rest |
| Trieste / descender | Sticky at 40%, bobs 6s; it is gone before the floor | The diver's sticky track ran to 24px above the deepest specimen, so at "Skip to the bottom" it sat under the controls | Its track now ends half a screen above the floor specimen, so it has left before the sand arrives |
| Ending | Sand gradient `#ede5ce → #b5ad9a`, the title again in navy 76px, credits, one link at `bottom:100px` in Oswald 28px `#333` | Same, plus the Haeckel plate, legend and tally | Kept. The plate sheet lost its drop shadow and rounded corners (a plate is flat paper). Ring labels, the caption and legend odds lost their tracked caps. The legend's zone names keep uppercase, since they are Neal's zone titles set on the sand |
| Raft flag | (none) | "NO PUBLISHED ODDS" in tracked caps | "No published odds" in Oswald 500 |
| Landing at the bottom | (Neal has no skip) | The sand edge at 74% of the screen on every device, which put "You touched the bottom" in the phone's bottom-left 72px | 74% on desktop, 55% on phones: the end title lands clear of the corner |

## Copy pass (every fact from `versions/CONTENT.md`, strongest true form first)
Each specimen now opens "One of N, out of POOL", which is how CONTENT.md states them ("1 of 150 from 105,000+").
- Coca-Cola: "One of 150 Coca-Cola Scholars, out of 105,000+." Gates: "One of 750 Gates Scholars, out of 48,000+."
  Coolidge: "One of 100 Senators, out of 4,100+." Elks: "One of 500 semifinalists, out of 21,000+."
- Princeton Prize: "One of 3, out of 600+." (with the existing "Three were picked in San Francisco. He was one of them.")
- Quest for Excellence: "One of about 100, chosen from the 3,911 College Prep Scholars. They were already 1 in 4.1."
  This uses only the page's own College Prep odds; no new number is derived.
- TASS: "One of 72, out of 2,400+. A tuition-free seminar in Critical Black Studies, summer 2024, where he was
  elected house chair." Taco Bell: "A $10,000 scholarship. One of about 400, out of 14,000."
- NSDA Student of the Year: "One of 86, out of 140,000+. The pool is every member of the National Speech &
  Debate Association." (CONTENT gives 140,000+ as the association's membership.)
- Surface: National History Day "Valley Champion, twice."; Summa Cum Laude "Clovis Community College. The highest
  Latin honor."; Gilman stays bare ("Scholar.") because CONTENT.md gives nothing more.
- Tally: "438,400+. That's the fifteen pools on this page, added up. He was picked out of every one." The note now
  also says honestly that anyone in two pools is counted in both.

## QA
- `node world/_shared/qa.js depths`: 0 before, 0 after.
- It stops after 60 screens, and the page runs to about 110 screens on desktop and 190 on phones. So a copy
  with no screen cap (`scratchpad/depths-r3/qa-full.js`) was run at 360/390/768/1024/1440/1920. It found 5 issues
  past screen 60, all fixed. On the plate, the "1 in 100" ring label crossed figure 10's numeral at 360px: those two
  figures moved from 70°/110° to 60°/120°. The deepest specimen's hidden odds were read as clipped text. Final: 0.
- `audit.py`: 0 problems. No banned copy words. No JS errors at 1440 or 390.
- Screenshots: `world/_shots/depths-r3/` (`before-*`, `a1…a4-*`, `final-*`, `final-sheet.png`).
