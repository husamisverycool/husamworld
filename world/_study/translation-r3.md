# Study, round 3: translation.html (The Bridge)

Studied 2026-09-26. Brief: keep the facing pages, the threads and the draggable seam; replace the "The Bridge" display title and every decorative all-caps label with what the references actually do.

## What I could reach this round
- **Library of Arabic Literature, the real books.** Firecrawl PDF parse of LAL's own free Arabic PDF (*Kalīlah wa-Dimnah*, first 14 pp.) and the full text of an LAL parallel-text volume (*Consorts of the Caliphs*, NYU Press 2015) through a public text mirror. That gave me the actual front-matter order, headings, running heads, folios and paragraph numbering, plus the colophon wording: *"Series design by Titus Nemeth. Typeset in Tasmeem, using DecoType Naskh and Emiri."* (Search snippets from four other LAL volumes confirm: *"The English text is set in Adobe Text … designed by Robert Slimbach."*)
- **LAL site** (live scrape) and the round-2 screenshot (`br-study/lal.png`), which shows the covers close up.
- **Loeb:** loebclassics.com "Logo & Typography" and the Designers & Books interview with HUP's design director (live). Loeb interiors are still not scrapable.
- **Amiri:** the README on GitHub (live).
- **jhey.dev, Typotheque, Khatt, The Nation, WSJ:** the Firecrawl quota ran out partway through, and the proxy blocks direct fetches. I re-checked them against the round-2 captures (`br-study/*.png`, and the full jhey.dev HTML notes in `translation-r2.md`), so nothing below depends on memory alone.

## How the books actually open (and what the page did instead)
From the *Consorts* front matter, in order: the half-title (the title alone) → editorial board → letter from the general editor → **Arabic title page facing the English title page** → copyright/colophon → Table of Contents → front matter under plain headings ("Abbreviations", "Foreword", "Note on the Edition", "Note on the Translation") → the text. The English title page reads, in upper and lowercase text type: *Consorts of the Caliphs / Women and the Court of Baghdad / Ibn al-Sāʿī / Edited by … / Translated by … / New York University Press / New York and London*. The book closes with **"About the Typefaces"**.

| # | Round 2 | What the reference does | Round 3 |
|---|---|---|---|
| 1 | Navy cover with a 230px sky-blue «الجسر» and "THE BRIDGE" in 0.42em-tracked caps | LAL opens on a title page set in the text face: title, subtitle, author, imprint at the foot. Arabic and English title pages face each other | The header is now the **title spread**: two paper pages on the navy cloth (the book open on its case). English: *English and Arabic / Translation, writing, and the press / Husam Sokar / The Bridge · husam.world*. Arabic facing: «العربية والإنجليزية / الترجمة والكتابة والصحافة / النص الإنجليزي وترجمته العربية على صفحتين متقابلتين / الجسر». Each language names itself first. The district name has moved to where LAL puts "New York University Press": it is the imprint now, not the headline |
| 2 | Sky band "LANGUAGE · WRITING · PRESS" in 0.55em caps (the clipped QA text) | That band is the LAL *cover* series line; the title page doesn't have one | Removed, and "OPEN ↓" with it (filler microcopy). The first opening now shows below the title spread |
| 3 | Running heads "THE BRIDGE · CHAPTER" in 11.5px, 0.22em-tracked uppercase, with a rule | LAL running heads are upper and lowercase ("Table of Contents", "Foreword" repeat at the top of each page); no rule | Centred, italic, 14.5px, mixed case: the book title on each page ("English and Arabic" / «العربية والإنجليزية»). No rule |
| 4 | Section titles "CHAPTER I" (13.5px, 0.3em caps) over a 46px italic display line | LAL chapter openings: the number alone, then the title in text type ("1 / Ḥammādah bint ʿĪsā / *Wife of the caliph al-Manṣūr*"); front matter uses plain headings | "1" on its own line, then *Two Languages* in 25–32px roman Source Serif; Arabic "١" then «لغتان» in Amiri Bold. Front matter headings are "Note on the Two Scripts" (in place of "Particulars / Two scripts, one writer"), "Contents" and "About the Typefaces". The Arabic uses LAL's own form «كلمة عن …» (the Kalīlah PDF has «كلمة عن النصّ …») |
| 5 | Inline "§1.1" buttons in bold | LAL prints bare paragraph numbers ("0.1", "1.1", "2.1") **in the outer margin**, and uses "§" only in cross-references ("§§2.1, 37.4"). The Arabic PDF writes them as ١،١, with the Arabic comma | The numbers now hang in the outer margin (left of the English, right of the Arabic), with no §, in Western digits on the English page and ١،١ on the Arabic page. They are still the buttons that pin a thread. On phones they sit inline, since there is no margin |
| 6 | Folios differed across the spread (English 1, Arabic ٢) | In LAL the two facing pages carry **the same folio** ("3 3", "4 4", "5 5" in the extracted text), each in its own numerals | Same number on both pages: 1 / ١ … 5 / ٥; front matter i / أ and ii / ب (English roman, Arabic abjad letters, the usual Arabic book practice for front matter). The contents page numbers now match |
| 7 | Contents: roman I–IV and small caps | LAL contents: "1. Ḥammādah bint ʿĪsā … 4" in upper and lowercase, front matter listed with roman folios | "1. Two Languages … 1" / «١. لغتان … ١», with the Note on the Two Scripts listed at i / أ and About the Typefaces at 5 / ٥. The dot leaders stay: they are the lynnandtonic device and meet at the seam |
| 8 | "Colophon" with a ۞ ornament and a hidden heading | LAL ends with "About the Typefaces" | Renamed and given a real heading. It now states accurately what Amiri is (the Amiri README: "a revival of the beautiful typeface pioneered in early 20th century by Bulaq Press in Cairo, also known as Amiria Press"), and it names LAL by its Arabic name, «المكتبة العربية» (from its logo), in place of my earlier «مكتبة الأدب العربي» |
| 9 | Particulars table labels in 11.5px tracked caps | Typotheque's script table labels are upper and lowercase ("Script Classification", "Letter Case"), about 11px grey (visible in `typo.png`) | 13px grey, upper and lowercase, no tracking |
| 10 | Popover and glossary labels in tracked caps ("USED ON THE FACING PAGE", "GLOSSARY") | LAL back-matter headings are upper and lowercase ("Glossary of Names", "Glossary of Realia") | Italic, upper and lowercase |
| 11 | Khatt interlock "BI– / LIT– / ER– / ACY" with en dashes | Khatt's *Revealing Recording Reflecting* cover breaks words with an em dash that trails one line and leads a later one ("RE— / VEAL / —ING") | "BI— / LIT / ER / —ACY". The caps stay because the reference itself is set in caps (`khatt.png`) |

## Caps I kept, and the proof
Only inside the press clippings, where each paper's own dialect is the point:
- **WSJ** boxed kicker: its front page runs boxed caps "EXCLUSIVE" kickers (`wsj.png`). Kept for "Contributor". The WSJ byline, which the paper doesn't set in caps, is now upper and lowercase.
- **The Nation**: its red section kicker reads "SOCIETY / STUDENTS" and its byline "MARIUM ZAHRA", both in condensed caps (`nation.png`, on this very article). The clipping's kicker is now the article's real section, "Society / Students", shown in caps; "Contributor" moved into the caps byline. Arabic: «مجتمع / طلاب».

Every other `text-transform:uppercase` and decorative `letter-spacing` has been removed.

## Faces
- **Arabic: Amiri (kept).** LAL sets its Arabic in DecoType Naskh and **Emiri**. Amiri is the open revival of the same Bulaq/Amiria Press naskh that Emiri is named for, so it is the closest match on Google Fonts. Scheherazade New and Noto Naskh are rounder and more technical, and Markazi is a text face with a flatter baseline.
- **Latin: Source Serif 4 (kept).** LAL's English is Adobe Text (Slimbach, a transitional). Source Serif is Adobe's own transitional in the Fournier line, with a similar colour and x-height. It has the optical sizes the running heads and the title page need.
- **Title page and chapter titles** are now set in these text faces at modest sizes. Nothing on the page uses a display treatment any more.

## jhey.dev re-check
From the round-2 capture: the status list resolves out of random glyphs (`data-chars` → `data-unscrambled`). The only thing the page takes is that scramble: the title-page title resolves from mixed Latin and Arabic letters on every visit, and is skipped for `#from-`, for reduced motion and on any input. The swap button re-types its labels the same way. Nothing else is borrowed from it.

## Copy
- Ch. 2 now leads with the strongest true fact: "At White House in Arabic I edited and translated between Arabic and English for an audience of more than 350,000: 150,000+ readers and 200,000+ viewers." Then the forms and dates with the role title as held, then Marah Bukai. The Arabic was rewritten to match.
- 1.2 "The Arabic is certified" → "My Arabic is certified".
- Arabic "Certified" row: removed the stray comma («… لثنائية اللغة في العربية»).

## QA
- Before: 10 issues (360/390: the band text was off-screen and clipped ×8, and «صفحة العنوان» sat under the nav ×2).
- After: **0 issues** at 360/390/768/1024/1440/1920. Screenshots are in `world/_shots/translation-r3/` (b-1440-*, b-390-*). The intro, seam drag, thread pinning and language swap were all tested in Playwright with no page errors.
