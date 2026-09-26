# Study: weeks.html (The Plaza)

References studied live on 2026-09-26 with Firecrawl (markdown, branding, full-page screenshots, cropped and pixel-sampled locally):

- waitbutwhy.com/2014/05/life-weeks.html ("Your Life in Weeks", Tim Urban, May 7, 2014)
- waitbutwhy.com/2015/12/the-tail-end.html (the sequel: same grids, plus crossed-out icons)
- waitbutwhy.com/2013/10/why-procrastinators-procrastinate.html (stick figures and speech bubbles)
- pudding.cool/2018/06/makeup-shades/ ("Beauty Brawl": sticky swatch grid + scroll steps; HTML read)
- pudding.cool/process/how-to-implement-scrollytelling/ (Russell Samora on the sticky-graphic + trigger-step pattern)
- pudding.cool/2018/04/birthday-paradox/ (Pudding branding: Atlas Grotesk / Whitney, #022340 ink)

## Wait But Why: the page

- White page (#fff). One text column ~780px wide at 1400px viewport, sidebar on the right (ours has no sidebar).
- Post title: Noto Sans Bold ~40px, color **#4D96C6** (sampled). Byline row under it: small grey "May 7, 2014   By Tim Urban" with a tiny calendar glyph, ~15px, grey.
- A grey "Note:" box under the byline: 1px #ccc border, light grey fill (#f5f5f5), italic 14px text, bold "Note:".
- Body: Noto Sans 16-17px, color #333/#414140, line-height ~1.6, paragraphs spaced ~1em. Links **#1C6391** / #4D96C6, not underlined.
- Voice: short paragraphs, second person, dry asides, rhetorical questions ("But how about your weeks?"), em dashes, italics for emphasis (*precious*, *mine*). Sentences like "But there they are, fully countable, staring you in the face." Section breaks are bold one-line headers (**The Life Calendar**). Ends with a row of underscores `_______` before the newsletter.
- Footnotes: small blue filled circles with a white number, inline after the sentence.

## Wait But Why: the charts (the part to be faithful to)

- Chart title centred, Arial/Helvetica Bold ~32-36px in navy **#000080**, with the key word in red **#CB060C** ("A 90-Year Human Life in **Weeks**").
- Above the grid, left: "Week of the Year" in navy Helvetica regular ~18px followed by a long thin navy arrow (⟶, ~100px shaft, open head).
- Column numbers 1, 5, 10, 15 ... 50 in small black Helvetica (~11px) above the first row, centred on their column.
- Left side: "Age" rotated 90° in navy with a long downward arrow; row numbers 0, 5, 10 ... every 5 rows, right-aligned small black.
- Boxes: hollow squares, 1px dark grey stroke (#4f4f4f, anti-aliased to #7f7f7f/#c0c0c0), ~7px square on a ~10px pitch (gap ≈ 30% of pitch). 52 per row, one row per year. No fills in the base chart.
- Credit: "waitbutwhy.com" small bold black Helvetica, bottom right under the grid.
- "Life of a Typical American": life chapters are translucent colored bands behind the boxes, with labels on the right margin (bold Helvetica ~16px, centred, 2 lines) joined to the band by a short thin horizontal rule in the band's color. Sampled band colors: #a6d3ff (early years, blue), #94caaf (elementary, teal), #9dd894 (middle, green), #ffff94 (high school, yellow), #ffc58b (college, orange), #ff9c9c (career, pink-red), #c8b5da (retirement, lavender).
- Point annotations: a **hollow circle** (~12px, 2px colored stroke) drawn on a specific week, joined by a **long straight 1px leader line** at any angle to a **bold, centred, colored multi-line label** in the left or right margin. Label and line share a color (navy, green, orange, red, purple, maroon, black). Lines cross each other freely. Labels are short and funny or dry. Superscript footnote numbers on some labels.
- The Tail End: used-up items are crossed with a thin **red X** (#e33) over the icon; the unused remain clean. The chart is still on a white card, credit bottom right.

## Wait But Why: the drawings

- Stick figures: circle head (~40px, 2-2.5px black stroke, slightly irregular), two small dot eyes close together, a single curved line smile (or a small "o"), straight single-line body, arms and legs as straight lines, no hands or feet. Sometimes holding an object drawn in color (a steering wheel, a book).
- Speech bubbles: wobbly rounded rectangle, 2px black stroke, white fill; the tail is a **single long line** from the bubble to the head (not a triangle). Lettering is a bold rounded comic hand (Comic-Sans-like), black, centred, ~16px, tight leading.
- Labels on drawings: bold Helvetica in green/blue with a hand-drawn curved arrow pointing at the thing.
- "waitbutwhy.com" credit under every drawing.
- Drawings are sparse; each one earns its place by making one joke or one point.

## The Pudding: scrollytelling mechanics

- Sticky graphic + steps (scrollama pattern): the graphic sits in a `position: sticky` container while text `.step` blocks scroll past; each step is ~88% of the viewport tall (Beauty Brawl: `height: 794px` at 900px viewport) and triggers at the 50% offset line. Scrolling is never hijacked; the graphic only updates state.
- Desktop: graphic column on the left (~55%), step text in a narrow right column (~400px). Mobile: graphic full width, steps scroll over it as white cards.
- Chart header: small uppercase kicker ("LIGHTNESS OF FOUNDATION SHADES") above a bold sans title; methodology in a boxed note ("How We Measure ...") with a hand-drawn border and bulleted steps.
- Precision: every number in the step text is computed from the same data the chart draws; annotations are thin lines with small labels; hover gives exact values; a methods note states caveats plainly.
- Transitions are short (300-600ms) and state-based: highlight the relevant marks, dim the rest to grey.

## Decisions for weeks.html

- Page is a WBW post: white, one ~760px text column, blue Noto Sans title, grey byline, grey "Note:" box, Noto Sans body in #333.
- The chart is a WBW chart: Arimo Bold (metric twin of Arial) navy #000080 title with the red keyword, "Week of the Year ⟶", "Year ↓" on the left (years instead of ages), hollow boxes 52 per row, credit bottom right, hollow-circle annotations with long leader lines to colored bold labels.
- Asides: Comic Neue Bold in wobbly bubbles with single-line tails, stick figures in 2.2px black SVG strokes. Sparingly (four figures).
- Pudding layer: the chart is sticky while chapter steps scroll past; each step changes the chart state (highlights, circles, labels). Hover/tap any week for a card. Lane view toggle. Methods note with the approximation rules. Full role table in the DOM.
- Fonts: Noto Sans (body), Arimo (chart), Comic Neue (hand). None banned.
