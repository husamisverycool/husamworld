# Study, round 2: The Airport (`everywhere.html`)

Studied live on 2026-09-26 (Firecrawl scrape with screenshot/branding/markdown; the proxy blocks curl/WebFetch for most hosts, so everything went through Firecrawl). Screenshots in `world/_shots/everywhere-study/`. The round-1 study of ertdfgcvb (`everywhere.md`) still stands; this file adds the new references and says what each one gives the page.

## 1. play.ertdfgcvb.xyz and ertdfgcvb.xyz (Andreas Gysin), re-read
Specifics are in `everywhere.md` (per-cell `main()`, aspect-corrected grid, density ramps sorted by measured ink, `drawBox` round borders, the home page's 3-letter word field warped by value noise with trails, the letter flap `" ABC…XYZ0123456789"` one step every 2 frames with 6-frame stagger, the `x/3 + 2y` diagonal decode, the speed-scaled scramble cursor).
- **New observation that matters now:** the home program's word field is always **three letters** (ert, dfg, cvb, then shuffled 3-letter words). Three letters is also the length of every code an airport speaks in. With the name hero gone, the field can hold three-letter codes instead: `BOS`, then the ISO 3166 country codes of the trips (`KOR`, `LTU`, `POL`, `HUN`, `PRI`) and `EUR` for HMC Europe. These are country codes, not airports: no invented flight or city.
- **Taken:** the three-letter word field as the hero, and the letter-flap as the way one code changes into the next.

## 2. Real split-flap boards: Solari di Udine, Frankfurt Hbf, Cifra 3
Wikipedia "Split-flap display" and the Commons photo of the Frankfurt (Main) Hauptbahnhof board (`ffm.png`).
- **Destinations are whole-word flaps, not letters.** On the Frankfurt board "KARLSRUHE", "DORTMVND" (a Roman V for U: the lettering was painted), "RIEDST. GODDELAU" are single pre-printed flaps. Only numbers (platforms 2, 6, 11…) are per-digit. So a real board changes a row in **one or two clacks**, not a long letter cascade. Letter-by-letter drums exist (later Solari airport boards) but the word flap is the older, truer image.
- **Graphic flaps:** the same board carries an **airplane pictogram flap** and a "Hält nicht" (does not stop) flap. A split-flap unit can hold a pictogram. This is the bridge to Aicher.
- Look: matte charcoal (#1c1d1e to #262626) modules, white lettering, wide-tracked bold grotesque caps, a visible horizontal split through every character, hinge pins at the split ends, empty modules show a blank dark flap. Rows are separated by a 1-module gap; columns have no rules.
- Solari's **Cifra 3** clock (Gino Valle, 1965) had graphic input from **Massimo Vignelli**: the split-flap and Vignelli's signage come from the same hands.
- Boston detail: the MBTA replaced the Solari boards at North and South Station and now plays a generated flapping noise so people still look up. (Context for the page's own design; I keep the page silent since only the World, Chamber and Garage may have sound toggles.)
- **Taken:** word flaps for destination/program columns (one clack), per-character flaps for codes and numbers, a pictogram flap column, the hinge split, blank flaps as the board's rest state.

## 3. Otl Aicher: Frankfurt Airport (1972) and Munich (1972 Games, Munich Airport II)
otlaicher.de, "Finding ways out of uniformity" (C. M. Semmler), full text.
- Frankfurt's Central Terminal wayfinding (March 1972): **colour coding by kind of thing**: **blue for everything to do with air traffic**, **green for secondary services** (toilets, lockers, pharmacies), **white for commercial**, **red for prohibition**. Set in **Univers 55**, bilingual German/English, **95 pictograms**, made together with the Munich Olympic set. Enamel signs **54 × 54 cm**, square.
- Munich: the **square**, extendable into a grid, divided diagonally into a key of **45° and 90°** elements; pictograms and sign modules sit on a square grid with its diagonals. Munich Airport signage: **light blue with white lettering**; the palette is light blue, white, silver, green.
- Aicher's own sketch: "development from text-based to pictogram-based signage systems".
- **With Husam's content:** each Harvard program gets a pictogram built on a 45°/90° square grid, and the colour code sorts the programs honestly: **blue = the ones that fly** (South Korea, the Hillel tour, Puerto Rico, HMC Europe), **green = the service fellowships** (Outdoor Program, Honor Council, SPARK, Fong), **white = the campus institutions** (Model Congress Boston, the Crimson Business Board, Radcliffe, China Forum, IRC, Leadership Institute).
- **Taken:** the three-colour code, the 45/90 pictogram grid, and the observation that a square grid of 45° pieces is exactly a character grid of half-cell triangles.

## 4. Massimo Vignelli and Bob Noorda, NYCTA Graphics Standards Manual (Unimark, 1970)
order.design reissue page (screenshot `order.png`), search results; details of the manual from the reissue.
- Signs are **modular panels** (a 1 ft square module and multiples), **white Standard Medium / Helvetica on black**, flush left, with a **slim white band across the top** of nearly every sign; exits and warnings on red and yellow; route symbols are **coloured discs** with a letter or number; the arrow is its own square module at the start or end of a line.
- Manual sheets are **13 × 13 in**; the reissue's cloth cover is signal red-orange with white Helvetica.
- **Taken:** the black overhead sign with the thin white band as the page's section headers, and the rule that an arrow gets its own square.

## 5. Boarding passes: Tyler Thompson, "Boarding Pass / Fail" (2008–2010)
passfail.squarespace.com, full post and the practical responses (Timoni Grone, Graphicology).
- Hierarchy by use: **flight number first** (gates change), **gate** next to it, then **seat**, then **zone**; a **black stripe** across the pass carrying the route; PM times white on a black box, AM black on white. Fonts: **Titling Gothic** (tall, condensed) for the fields and **Gotham Book** for labels.
- The objections that made it better: passes are **thermal-printed**: black plus at most **one other colour, usually red**; use **24-hour time** and a sortable date; the passenger **stub** is torn off and kept (the seat should be biggest there); passes end up as **bookmarks**.
- **Taken:** the thermal slip: white paper, black print, one red (the Crimson's red, which is also the classic thermal second colour), the stub with a perforation, fields ordered by what you need first, labels small and caps.

## 6. Luggage tags (IATA Resolution 740)
- A tag is a long narrow strip: the **destination code in huge letters**, a 10-digit licence-plate number with **interleaved 2-of-5 barcodes** (horizontal and vertical), the carrier, a small tear-off stub. Printed thermal, black only.
- **Taken:** tall-code strips for the campus roles, if a paper direction wins.

## 7. The Harvard Crimson and the Harvard Gazette (their own editorial design)
thecrimson.com (screenshot `crimson.png`, branding) and news.harvard.edu/gazette (`gazette.png`).
- Crimson: theme **#A70003**; masthead "The Harvard Crimson" in a crimson blackletter-free serif at ~72px between two **hairline rules**; above it a dateline row in small caps: **"FRIDAY, SEPTEMBER 25"** left, **"VOLUME CLIII"** right; section nav in tracked caps separated by **"•"**; bylines in crimson caps ("BY … • 16 HOURS AGO"); headlines in a text serif (Georgia fallback), 0 radius everywhere, 8px base unit.
- Gazette: cream **#FFFBF4** page, **#A51C30** Harvard crimson for the logo square and the second nav row (tracked caps "AMERICA AT 250 · EXPERIENCE…"), large tight serif headlines (Sanomat), body in Neue Haas Grotesk, vertical hairline between columns.
- **Taken:** the dateline row (a real date, volume-style numbering is not needed), crimson only as a small signal colour, hairline rules and tracked caps with "•" separators, captions written like a paper's (who, what, when; no adjectives).

## What the page can be, in one line per reference
- ertdfgcvb: everything is characters; the hero is a program, not a picture.
- Solari: the board changes a row in one clack; a flap can be a pictogram.
- Aicher: colour means kind; every program has a sign built on 45° and 90°.
- Vignelli: black sign, white band, arrow in its own square.
- Thompson: the order of fields is the order you need them; thermal black plus one red.
- Crimson/Gazette: a dateline, hairlines, a single crimson.
