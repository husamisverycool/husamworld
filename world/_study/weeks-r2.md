# Study, round 2: weeks.html (The Plaza: time itself)

Round 1 notes (Wait But Why, The Pudding) are in `weeks.md` and still hold. This round adds three references that are about *personal* time data rather than a lifespan, and re-reads the round-1 pair against the new rule: **the page names no organization, role, place or program.** Everything it counts is labeled only by the district that owns it.

Sources were read live on 2026-09-26 (Firecrawl screenshots, pixel-sampled locally; the Primer design tokens from npm). feltron.com and dear-data.com are blocked for direct fetch in this sandbox, so every observation below comes from Firecrawl renders.

---

## 1. Nicholas Felton, Feltron Annual Report 2014 (feltron.com/FAR14.html)

The tenth and last report. 16 pages, offset-printed in 7 colors (one fluorescent, one metallic), foil cover. Its stated job: "merge all of this information in a format that reveals connections, provides context and suggests correlations." That is exactly what this page needs to do with one variable (how many things at once).

**Structure.** The pages go Cover → "2014" → "NYC" → "Sources" → Q1 → Q2 → Q3 → Q4 → Totals → Correlations → Elsewhere. Each quarter gets a spread with the same fixed module set in the same positions (Locations, Travel, Computing, Sleep, Transit, Activity, Weather, Photos, Music, Videos, Heart Rate, Weight, Drinking, Driving), so you compare quarters by flipping pages. Repetition is the grid. Nothing is decorated.

**The module (the part to be faithful to).** Read top to bottom:
1. Category name in a **heavy high-contrast display serif**, ~14pt, coral, with a coral hairline rule running the width of the column under it.
2. A one-line tiny caption (sans, ~5pt, grey) saying what the chart is.
3. A **histogram / sparkline** in warm taupe, bars 1px wide, baseline hairline, one or two tiny coral callouts (a max, a date).
4. A **huge numeral** in the same display serif, taupe (`#9F928A` sampled), ~48–60pt, proportional figures, decimals when it's an average (".04", "108.7", "1,601").
5. A tiny caption under the numeral (what the number is: "avg. daily …").
6. Two **sub-stats side by side**, each a coral word or short number over a tiny grey label ("Most: Tuesday", "Least: Sat").
Modules sit in a strict **4-column grid**, 3 rows per page, gutters ~1/8 of a column, hairline coral rules between every row. Page titles ("Totals", "Correlations", "Q1") are the same serif at ~90pt, taupe, flush left, tight tracking.

**Color (sampled).** Cover and "2014" pages: flood of coral `#FF6468` with slate `#374659` and white bubbles (each bubble a day/event). "NYC"/"Elsewhere": taupe flood `#9F928A` with white type and circular photo crops. Inside pages: white paper, coral for labels and rules, taupe for data and numerals, slate for emphasis dots. Three colors carry the whole report.

**Type.** Display: a Didone-leaning black serif (high contrast, ball terminals, tight). Text: a small grotesk at tiny sizes. Closest Google fonts: **Rozha One** or **Gloock** for the serif (not DM Serif / Playfair, both banned), **Archivo** / **Archivo Narrow** for the tiny grotesk.

**Copy tone.** Nouns and numbers. Captions are measurement notes, not sentences: "Hours per day, by week", "Most active: Q3". No adjectives. The only prose is one paragraph of intro.

**What makes it memorable.** A person's year treated with the gravity of a company's annual report. The big numbers are the headlines; the sparklines are the evidence; you trust it because it is so consistent.

**With Husam's content.** A "Sokar Annual Report 2015–2026": each year is a "quarter" spread (same modules every year: things at once, peak week, weeks with anything on, weekend dots, which districts). A "Totals" page with the lifetime numbers: 7 at once, the busiest stretch in weeks, 4,000+ service hours, 5 districts in one week. District names take the place of Felton's categories, so the module headers ARE the cross-links ("The Capitol →"). That solves the no-names rule naturally: Felton never names the song, only "Music".

## 2. Dear Data (Giorgia Lupi and Stefanie Posavec, dear-data.com)

"A year-long, analog data drawing project … by collecting and hand drawing their personal data and sending it to each other in the form of postcards, they became friends." 52 weeks, 52 themes. **Week 14 is "A week of productivity / schedules"**, the same subject as this page.

**The postcard.** ~6×4 in. Front: the drawing, no words. Back, left two thirds: the key. Back, right third: stamp top right, wavy postmark lines, "BY AIR MAIL / par avion" label, "To:" and the address on ruled lines (blurred on the site).

**The key ("HOW TO READ IT:").** Hand-lettered in all caps, underlined. Each glyph is drawn once with an "=" and a short definition ("Each line = 30 minutes", "EACH PLANT REPRESENTS ONE WAY I SPEND MY TIME"). Colors are defined by a swatch stroke next to a word. Giorgia's key is a dense two-column list of 20+ symbols (∖ = line = email sent, ○ = skype call, △ = meeting …); Stefanie's is a short paragraph plus a colour list with totals ("SLEEPING 50:31").

**The drawings (Week 14).** Stefanie: a row of **radial fans, "plants"**, one per activity, one ink line per 30 minutes, each fan in its own felt-tip colour (pink, blue, red, teal, grey, orange, violet), stems of different heights. Giorgia: abstract composition of mixed marks, "position and rotation … absolutely random and direct function of the esthetic composition". Elsewhere (Weeks 1–8): rows of repeated tiny glyphs, one per event, arranged by day (columns) and time (rows); teardrops, ticks, circles with a dot, hatched bars.

**Material.** Cream (Giorgia) or white (Stefanie) card, fine-liner black ink, coloured felt tips and pencils; lines wobble; ink bleeds; smudges acknowledged ("I'm left-handed … I end up smudging it"). Site: Squarespace, white, a brush-lettered "Dear Data" logotype, Futura-like sans for headings (letter-spaced ~0.3em on page titles "Week 14: A week of productivity / schedules"), grey body text.

**Copy tone.** Warm, first person, self-deprecating, curious ("What was I thinking :(", "Be honest :-)"). "Slow data." "A personal documentary rather than a quantified-self project."

**What makes it memorable.** Data as a letter to a friend: the key is part of the charm, and you have to *read* it to see the picture.

**With Husam's content.** One postcard per year (12 cards). Each week a fan; one ink line per thing going on that week, coloured by district; Sunday/Saturday dots as little circles at the stem foot. The back of the card is the key and the year's numbers. **Conflicts to note:** hand-lettered notes and handwriting belong to the Map Room; a postmark is close to the Capitol's rubber stamp. A faithful Dear Data needs handwriting, so this direction can only ever be partly faithful here.

## 3. GitHub's contribution graph (github.com/<user>, Primer tokens)

**Geometry.** 53 week columns × 7 day rows (Sun top … Sat bottom). Cells 10×10px, 2px corner radius, 3px gaps (13px pitch). Month labels above ("Sep Oct Nov … "), 12px, `#1f2328`; day labels "Mon", "Wed", "Fri" only, left. Header above the card: "**3,825 contributions in the last year**" 16px regular. Under the grid: "Learn how we count contributions" (left, 12px muted link) and "**Less ▢▢▢▢▢ More**" (right).

**Color (from @primer/primitives 11.10, light theme).** `contribution-default-bgColor-0..4` = `#eff2f5`, `#aceebb`, `#4ac26b`, `#2da44e`, `#116329`; every cell has a 1px border `#1f23280d` (5% black) so empty cells still read as cells.

**Interaction.** Year list on the right (2026 as a filled blue pill `#0969da` with white text; earlier years plain grey text links); clicking one swaps the grid. Hover a cell: a dark tooltip "N contributions on September 12th." Cells are keyboard focusable.

**What makes it memorable.** Everyone knows how to read it: green = busy, grey = nothing, rows are weekdays. The weekday axis makes weekly rhythm visible (the empty weekend rows).

**With Husam's content.** The weekday rows are exactly how to show the **weekend pattern**: for 2015–2021 the Sunday row is lit, for 2018–2021 the Saturday row too, while weekday rows stay empty until 2020. The year list is a natural year switcher. Its sequential 5-step green is the model for the load ramp (0, 1–2, 3–4, 5–6, 7).

## 4. Wait But Why, "Your Life in Weeks" (re-read; details in weeks.md)

Taken forward: 52 hollow boxes per row, one row per year; navy `#000080` chart title with the key word in red `#CB060C`; "Week of the Year ⟶" and a rotated axis label with a long arrow; hollow-circle annotations with long 1px leader lines to bold coloured margin labels; stick figures (circle head, dot eyes, 2–2.5px black strokes) with single-line speech-bubble tails. **Plaza owns the week grid, sticky scrollytelling and stick-figure asides**, so this is home ground, not borrowing.

## 5. The Pudding (re-read; details in weeks.md)

Taken forward: sticky graphic + steps triggered at 50% of the viewport, 300–600 ms state transitions that highlight the relevant marks and grey the rest, every number in the prose computed from the same data as the chart, a methods box stating caveats plainly.

---

## What each reference gives the build

| Reference | The one thing to take |
|---|---|
| Feltron 2014 | The module: district header + hairline rule, sparkline, one huge serif numeral, two sub-stats. And the report structure (Totals page, the same spread for every year). |
| Dear Data | "HOW TO READ IT": a key you read before the picture, with each glyph drawn once. And the fan glyph (one line per thing), which draws "how many at once" better than a shade does. |
| GitHub graph | The 7-row week column that makes weekends visible, the Less/More ramp, and the year switcher list. |
| Wait But Why | The 52-box life grid, hollow-circle annotations with long leaders, stick-figure asides. |
| The Pudding | Sticky chart + steps; every number computed; methods box. |
