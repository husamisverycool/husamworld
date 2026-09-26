# Study, round 2: translation.html (The Bridge)

Studied 2026-09-26. Firecrawl (screenshot + branding + markdown/html) for every live site below; the sandbox proxy blocks direct curl/WebFetch to most of them, and the Firecrawl quota was shared with other builders, so each scrape was spaced a minute apart. Screenshots are in the session scratchpad (`br-study/*.png`). Where a site could not be scraped (the LAL book interiors, the Loeb interiors, tntypography.eu), I used web search plus what I know about the printed objects, and say so.

## 1. Library of Arabic Literature (NYU Press / NYU Abu Dhabi): the direct model
**Scraped:** libraryofarabicliterature.org (screenshot, branding). **Searched:** the series design (Titus Nemeth, tntypography; the page itself 404s through Firecrawl).
- **Livery.** Deep navy cloth `#00285B` (site bg and brand, scraped), a darker `#001838` for text and buttons, and a **sky-blue band** (≈`#5BB8E0` sampled from the covers) with a tracked all-caps line "LIBRARY OF ARABIC LITERATURE" printed across it near the foot of each cover. The Arabic title sits above in large sky-blue calligraphic Arabic; the English title in spaced roman capitals below it. The logo is a single stroke from a calligraphic *kāf* next to «المكتبة العربية» stacked in two lines. Zero border radius everywhere (radius 0px, scraped).
- **Web UI.** Whitney sans at 15px body / 30px heads, uppercase tracked section labels ("FREE ARABIC PDFS", "NEW FROM LAL") in navy with a 1px grey rule under them; the carousel is numbered 1–5 down the left margin with an arrow for the current slide. Slightly institutional, very calm.
- **The books (search, plus the printed volumes):** a parallel-text hardcover, **English on the left page, Arabic on the right**, so both columns meet at the gutter. The Arabic is DecoType's **Tasmeem Naskh**; the English is **Adobe Text Pro**. The designer first tried a baseline grid where every other Arabic line aligned with an English line, then **abandoned it so each script gets its own ideal line spacing**. Alignment is carried by **paragraph numbers** (§1.1, §1.2 …), set in both languages (Arabic uses Arabic-Indic numerals ١٫١), not by a shared baseline. That is the core lesson: the two columns align *by paragraph*, and they are free to drift in between.
- **Tone:** scholarly, generous margins, nothing decorative except the cover calligraphy.
- **With Husam's content:** his WHiA work *is* this kind of text: Arabic and English versions of the same piece. The six articles can be set as a facing-page register, §-numbered in both numeral systems, the two columns released from a shared baseline and re-synchronised at each §.

## 2. Loeb Classical Library (Harvard University Press), from the printed volumes
Not scrapable here (loebclassics.com blocked); from the books themselves:
- Pocket format, original language on the **left (verso)**, English on the **right (recto)**; green cloth for Greek, red for Latin; running heads in spaced small capitals; the two pages start and end on the same passage, so each opening is one unit of text. Footnotes in small type under the translation only.
- Taken: the **"one opening = one unit"** rule. Each section of the page should be a whole opening: the English page and the Arabic page start together and end together, even if their lengths differ. (Loeb's line numbers are not used: line numbers belong to the Capitol.)

## 3. Typotheque (TPTQ Arabic) type pages
**Scraped:** typotheque.com/fonts/arabic (screenshot, branding, markdown).
- TPTQ logo: an orange `#FF6600` square with "T P / T Q" in a 2×2 grid. Selected filter pill and the big script tile are electric blue `#0044FF`; everything else is white/`#F8F8F8` with black text. Pill buttons radius 9999px; panels radius ~10px. UI face: their own **November** at 13px body, 16px heads.
- The Arabic page opens with a **240px blue tile holding one glyph** (ث, white) and, beside it, a **script data table**: *Script Classification: Abjad · Letter Case: None · Commonly Used Quotation Marks: «…» · Numerals: 0–9: ٠١٢٣٤٥٦٧٨٩ · Earliest Recorded Usage: c. 512 CE · Added to Unicode: Version 1.0 (1991)*, label column in 11px grey, values in 14px black, hairline rows.
- Below: a 4-column grid of cells with an "Enter your own text…" type tester; each cell shows the family's Arabic name at ~60px, **fading out at the edge through a white gradient**, with "Compare +" (brown `#AA8866`) top-right and "Quick View ↗" (cyan `#00B6DE`) bottom-right.
- The printed TPTQ Arabic specimen is **bilingual and reads from both ends**: open it from the left for Latin, from the right for Arabic; the two halves meet in the middle. That is the most "Bridge" idea in type publishing.
- **With Husam's content:** the page can be an *object that reads from both ends*. The data-table voice (dry facts about a script) is also a good voice for his facts: "Languages: English, Arabic · Direction: LTR, RTL · Certified: California State Seal of Biliteracy in Arabic".

## 4. Khatt Foundation (Center for Arabic Typography)
**Scraped:** khtt.net/en (screenshot, branding, markdown).
- Site: black bar nav, the خط logo as white calligraphic Kufi on black, "KhattPlain/KhattBold" (their own bilingual face) at 14px, links oxblood `#A94442`, accents `#0099FF` and `#FF0000`.
- Their book cover *Revealing Recording Reflecting* (hero image) is the reference for kinetic bilingual type: **Latin words broken with hyphens ("RE– / VEAL– / ING")** in lime and orange on purple, with the Arabic equivalents («كشف», «تسجيل») running **vertically** and interlocking with the Latin fragments. The two scripts share one block and are the only image.
- Khatt's best-known programme is **Typographic Matchmaking** (Arabic and Latin designers paired to build one bilingual family). The idea: two scripts aren't translated, they are *matched*: matching weight, colour and rhythm, not letter shapes.
- **With Husam's content:** a type-first cover where "English / العربية" and "Arabic / الإنجليزية" interlock, and the Seal of Biliteracy treated as a matched pair of words rather than a certificate.

## 5. jhey.dev (Jhey Tompkins): cursor play
**Scraped:** jhey.dev (screenshot, branding, full HTML).
- A single left-aligned column ~580px wide, centred. Headline in a heavy serif at `--font-level:3.8` fluid size, leading 1, letter-spacing −0.5px; under it a **dot-matrix mono** (Doto) uppercase 14px line. Body grey `#666`, links `#FF6467` that **fill solid red with white text on hover/focus** (no underline).
- A **faint square grid** in the page background that is only visible toward the lower right (masked radial fade), like graph paper under the cursor.
- The **status list** (location, weather, CodePen, Steam, Spotify) uses a **character scramble**: each span has `data-chars` and `data-unscrambled`; text resolves from random glyphs into the real string, and overlong strings become a marquee.
- Entrance: `animate-[reveal_0.35s_ease-out_0.5s_both]` with `--translate-from-y:1rem`: one short upward reveal, 350ms, starting after 0.5s.
- A signature drawn as SVG paths with `pathLength=1` and per-path `--path-speed`/`--path-delay` (not usable here: handwriting belongs to the Map Room).
- **With Husam's content:** the scramble is the right toy for a translator, if the random glyphs come from **both alphabets** and the string resolves into the *other language*. Hover a heading and it re-types itself in Arabic, then back.

## 6. lynnandtonic.com (Lynn Fisher), v.XIX
**Scraped:** lynnandtonic.com (screenshot, branding).
- Speckled paper `#E4E2D7`, ink `#111`. Name in a rough display serif (Hubano Rough) at 96px, "Designer for the Web" under it, then a **table of contents with dot leaders and Roman numerals** (ABOUT ....... I, WORK ....... II …) in small caps. "v. XIX" at the bottom: she redesigns every year and numbers the versions.
- Her lasting lesson is that the site is *designed at every width*, not just at breakpoints: dragging the window is part of the show.
- **With Husam's content:** a bilingual contents page: English entries with Western numerals on the left, Arabic entries with Arabic-Indic numerals on the right, dot leaders running *toward each other*. The draggable seam gives the "designed at every width" feeling: dragging it reflows both columns live.

## 7. Google Translate and DeepL: interaction details
**Scraped:** deepl.com/translator (screenshot, branding; a Cloudflare check covered the page but the layout is visible).
- DeepL: navy `#0F2B46` text and primary buttons (radius 40px), pale blue `#DEF5FF` selection, two equal panes with a thin border and 6px radius, a language bar above them: **"English ⌄   ⇄   Arabic ⌄"** centred on the seam. Source text 24px, the Arabic target right-aligned. Under the target: thumbs, copy, share. Right sidebar: "Glossaries", "Style rules". Below: a "Dictionary" panel.
- DeepL's signature (from use): **click any word in the translation and a dropdown of alternatives appears**; picking one re-flows the rest of the sentence. Hovering a sentence in either pane highlights its counterpart in the other.
- Google Translate (from use): the **⇄ swap button rotates 180°** and the texts trade panes; a character counter reads "0 / 5,000"; hovering a sentence highlights the aligned sentence in the other pane in pale blue.
- **With Husam's content:** sentence-to-sentence highlight is the alignment thread in another form. A swap button (⇄) is the honest control for "which language leads". A DeepL-style alternatives dropdown on key words from his headlines shows what translation choices look like.

## 8. Newspaper fronts: the WSJ and The Nation (where he contributed)
**Scraped:** wsj.com (screenshot, branding) and his *Nation* article (screenshot, branding, full text).
- **WSJ:** masthead in the WSJ's Scotch-style caps with a full stop, 1px rules, section nav in 15px Retina, then three columns: left stack of headlines (~30px condensed serif, 1.2 leading) with **boxed "EXCLUSIVE" kickers** (1px black border, 12px caps), grey Retina deks at 16px, comment counts; a centre lead image with a 36px centred headline; right "Opinion" rail with **gold/ochre author kickers** (`#8B6F3A` range) in tracked caps. Links `#0274B6`. Radius 2px.
- **The Nation:** a **red `#E8192B` nav bar** with white condensed caps (Suisse Intl Condensed), section kicker "SOCIETY / STUDENTS" in red condensed caps, a very large light display serif headline (**Ivar Display** at 55px), italic serif dek (Ivar Text), byline in grey condensed caps, "SHARE ⌄" on the right. Logo: "Nation." white on a black box.
- **Found while reading the Nation piece:** the student quoted is printed as "Husam **Ramadan**, a high school junior at Clovis North High School in Fresno, California". His WHiA credit line reads "Edited/Translated by Husam **Ramadan**" (WHiA piece dated 24/08/2022, "By Omar Al-Shommari, WHIA Iraq Office"). CONTENT.md gives the surname Sokar. I don't quote either article or use that surname; flagged for Husam.
- **With Husam's content:** a wire-desk/front-page direction: the six WHiA headlines as a newsroom rundown (slug, kicker, desk, both languages), and the two contributions as clippings in each paper's own typographic dialect.

## 9. White House in Arabic (whia.us), the publication itself
**Scraped:** whia.us/en/6115 (screenshot, branding, text).
- White background, **Georgia** throughout (41px heads, 18px body), navy `#0A2458` tag pills, link blue `#0078FF`, a White House facade logo over "WHIA", and **«العربية»** in the English nav as the language switch. Each English piece ends with the italic credit "*Edited/Translated by …*".
- **With Husam's content:** the italic credit line is the real trace of his job. The page can end each article entry with the same form of credit, without his name (the genre, not the byline).

## What I'm taking into the prototypes
- (a) **LAL facing pages, elevated:** navy + sky-blue livery, Adobe Text → Source Serif 4, Tasmeem Naskh → Amiri, §-paragraph alignment in two numeral systems, threads between §s, Loeb "one opening = one unit", lynnandtonic dot-leader contents, DeepL sentence highlight.
- (b) **Type specimen (TPTQ/Khatt):** the glyph tile + script data table, a type tester with a weight axis (Readex Pro, a real Arabic/Latin matched family on Google Fonts, 160–700), Khatt interlocking hyphenated cover, jhey two-alphabet scramble.
- (c) **Newsroom / wire:** WSJ front layout (boxed kickers, rules, condensed heads), The Nation red bar and Ivar-like display (Newsreader), WHiA credit line, a two-language wire rundown.
