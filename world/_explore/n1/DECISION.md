# The Polling Station, round 2: decision

Three working prototypes, each on a different reference. Screenshots at 1440 and 390 are in
`world/_shots/n1/` (`pa-*`, `pb-*`, `pc-*`; `pa-g-*` is the graded sheet, `pc-d-*` a drawn guess
after the reveal).

- **A. Answer sheet** (`a.html`). A Scantron form in red drop-out ink on off-white paper, black
  timing marks, lettered ovals, a "Use No. 2 pencil only" band. The visitor fills ovals and feeds
  the sheet into an optical reader, which returns it graded with the answer key printed beside
  each row. After real ballots and Scantron sheets + FiveThirtyEight's step-by-step instrument.
- **B. Research article** (`b.html`). A Distill.pub-style article: Distill's grid (8 text columns,
  page-width figures), Georgia-metric serif body at 19px, a byline row with small-caps labels, an
  interactive "who was the work for" figure (two teams → five clients) and a selection waffle
  with a slider. After Distill + Our World in Data.
- **C. You Draw It** (`c.html`). An Upshot-style draw-the-line: the visitor draws how many
  research posts he'd held by each year, 2022 → 2025, over a yellow band; "Show me how I did"
  animates the true line and answers the guess personally. A second guess for the Ballotpedia
  intake. After NYT Upshot.

## Scores (1–5)

| | A. Answer sheet | B. Article | C. You Draw It |
|---|---|---|---|
| Fidelity to its inspiration | 4: the object is right (ovals, timing marks, drop-out ink); the grading is invented theatre | 4: grid, type and byline are Distill's; but its figures are thin without the text arguing with them | 5: yellow band, snap-to-year, "Show me how I did", a personal verdict |
| Ambition and memorability | 4: everyone has filled one of these; feeding it to a machine is a small delight | 2: handsome and forgettable on its own | 4: the 2025 jump is a real surprise when you've drawn a flattening line |
| Fit with HIS content (only n1 facts) | 5: every question is one of his facts; distractors are his other research sites | 5: can hold everything, with room for the paper title and the dates | 3: only one series is honestly drawable; it can't carry the whole page |
| Not repeating another page's device | 5: a survey/answer instrument is this page's own device | 4: Distill's margin notes and hover footnotes would collide with the Capitol (margin annotations, gwern popups), so those must go | 4: a line over years is close to a timeline; OK only because it's a count of research posts, not a role timeline, and not a calendar or scrollytelling |
| Phone quality | 4: rows stack cleanly; ovals at 34×24 are tappable | 5: Distill's grid collapses naturally | 4: drawing works with touch-action:none; needs a keyboard path |
| Never feels bad | 3: alone it hides answers until graded (must not be the only copy) | 4: no dead ends, but a wall of text risk | 3: alone, a blank yellow chart is an empty state until you draw |

## Decision: combine, with B as the spine

The honest shape for research is **a paper with instruments in it**. So the final is a
Distill-style working paper (B's grid, type, byline, figure captions and appendix) whose figures
are the instruments from A and C:

1. **Instrument 1, the answer sheet (A)**, as the paper's hero figure, where Distill puts its lede
   figure. Seven questions from his record, fed to an optical reader that prints its marks in red
   along the edge the way real OMR scanners do (a mark per row plus a printed total, not a stamp,
   which is the Capitol's). Every answer also appears in the paper's text, so nothing is gated.
2. **Figure 2, You Draw It (C)**: research posts started, cumulative, by year. Yellow band,
   draw, reveal, verdict. Keyboard path (arrows) and a "just show me" link. A Chart | Table
   switch after Our World in Data, and Table 1 printed in the paper so the numbers are always in
   the DOM.
3. **Figure 3, who the work was for (B)**: two teams, five clients, trace on hover/tap/focus. The
   one finding the data supports: the UN is the only client both teams share.
4. **Figure 4, the intake (C + B)**: guess how many of 90+ Ballotpedia applicants got in with a
   Distill slider, then reveal 12 on a 90-square grid, with the caveat that 90 is the floor.
5. **Appendix (B + Pew topline)**: methods (how posts were counted, and that no poll result is
   shown because none is in his fact sheet), the codebook of posts, and a citation block.

Dropped on purpose: Distill's margin side notes and hover footnote cards (Capitol devices), any
stamp for the grade (Capitol), any date-of-visit on the sheet (the World owns the visitor's
clock), and any poll finding or sample size (not in CONTENT.md). No intro: the answer sheet
already asks the visitor to do something first.
