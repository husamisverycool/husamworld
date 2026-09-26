# Study, round 3: The Airport (`everywhere.html`)

Round 3 is a refinement pass. The layout, the concept (a globe drawn in characters, the three-letter code field, the Solari boards with Aicher pictogram flaps), and every interaction stay as they were. Each change below either pulls a detail closer to a named reference or fixes a flaw.

## What I compared against, and how
- **ertdfgcvb.xyz (home):** raw HTML from a Firecrawl scrape (the rendered `<pre>`, with its span colours) and the inline boot script. The proxy blocks the site in Playwright, and Firecrawl ran out of credits partway through, so the r1 study of `js.js` still covers the motion details.
- **play.core source:** `git clone github.com/ertdfgcvb/play.core`. I read `run.js`, `modules/sort.js`, `modules/drawbox.js`, and every program's `density` string.
- **Solari di Udine, primary sources:** the *C.E. Flap Unit, Technical Description* (Nov 1984) and the *Series 90 Boards, Technical Description* (Nov 1984). Both are scanned PDFs in `github.com/jpwolfe31/Solari-Split-Flaps` ("Technical Documents"). They come from a real 1960s airport board the owner bought on eBay. I rendered the pages and read them.
- **Open split-flap hardware:** `github.com/scottbez1/splitflap` `firmware/src/config.h`, for the 40-flap order.
- **r2 references:** Aicher (Frankfurt colour code, 45°/90° grid), Vignelli, and Thompson. The r2 study still stands, and nothing in those parts changed.
- **Screenshots:** before `world/_shots/ev-r3before-*`, after `ev-r3d-*` (390×844 and 1440×900 at every scroll stop), and interaction `ev-r3d-inter-*`.

## 1. The font (Gysin's monospace, or its closest Google match)
- **Reference:** play.core's `run.js` loads `SimpleConsole-Light.woff` as weight 400. The ertdfgcvb type is **LL Simple Console *Light***.
- **Before:** Fira Mono 400. That is the right family but the wrong weight, and Fira Mono has no Light.
- **Check:** I queried the Google Fonts CSS for a dozen monospaces and asked which ones serve `U+2500-259F` (box drawing and blocks, which the globe, `drawBox` and the markers need). Only **Fira Code** (and Geist Mono, which is banned) does, and Fira Code has a 300 Light.
- **Changed:** the page and the canvas grid are now set in **Fira Code 300**, with ligatures off (`font-variant-ligatures:none` was already set). Bold cells use 500. It is the same family as before, so nothing jumps, but it is now as light as the reference.

## 2. Glyph density ramps
- **Reference, home field:** the scraped `<pre>` shows the word drawn as runs like `c0c0c0bCb0c3Y3Y3Y3Y` and `!Z!Z!Z`: two ramps on a checkerboard, `" .·•-+=:;*ABC0123!*"` and `" ·-•~+:*abcXYZ*"`. Full-value cells show a swapped pair (`"· · · ·"`, `"+ "`, `" ."`), and the letters are grey with no solid blocks.
- **Before:** the code was drawn with solid `█ ▀ ▄` half-blocks, plus a `░` shadow and a magnifying lens under the cursor. Neither the lens nor the shadow comes from the home page (the lens came from nowhere; the shadow was borrowed from `drawbox.js`), so the word looked like a pixel font, not like Gysin.
- **Changed:** the word is now read through **his two checkerboard ramps**, with the trail `v = max(v, prev·0.95)`, noise lifting patches to full value, and **his five swapped-in pairs** (a new pair is picked each time the word changes, as his does). Strong cells are bright and a little bolder so the code still reads at 390px. The lens and the `░` shadow are gone. His scramble radius under the pointer stays.
- **Reference, globe:** play.core's standard ramp is `'Ñ@#W$9876543210?!abc;:+=-,._ '` (`basics/coordinates_xy.js`, `demos/hotlink.js`), re-sorted at load by `sort.js`.
- **Before:** the globe's land ramp was an invented `'+=*oacxsz0123…KHNM#%&@W'`.
- **Changed:** the land now uses the **upper part of his standard ramp**, `'+:;cba!?0123456789$W#@Ñ'`, sorted by measured ink in Fira Code at load (the page's `sortRamp` is his `sort.js`). Brightness is squared, so only the most sunlit land reaches `W # @ Ñ`. A linear map made whole continents a wall of `$@`.

## 3. Real Solari lettering: why it is all capitals (proof)
1. The flap count is fixed. The C.E. Flap Unit description (1-1) says: *"The flap units may have 40 or 60 flaps."* Its characteristics table (4-1) gives *"p: number of flaps (40 or 60)"*.
2. A 40-flap drum is exactly blank + 26 capitals + 10 digits + 3 punctuation marks. scottbez1's legacy 40-flap set is `' ', A–Z, 0–9, '.', ',', '\''`, which is 40 flaps. Adding lower case would take 26 more, or 66 flaps, which is more than any Solari unit carries. Even the 60-flap unit has only 20 spare flaps, used for punctuation and symbols.
3. The same document's lettering sheets (2-2, 2-3) show only capitals ("ABC", "AB", "A") in Gill Sans Bold and Akzidenz-Grotesk. The capacity table (1-2) is set as "A", "AB", "A B:", "ABCDEF…". The board drawing (Boards, fig. 1, p. 1-3) shows a destination flap reading **"SAVONA"** and a top tablet reading **"DEPARTURES"** in widely spaced capitals.

So capitals on the flaps are the medium, not a style. The drum is now the real order: blank, A–Z, 0–9, `. , '`, then the 60-flap extras `- : + / & ( ) $`. I removed `· ? █`, which no Solari drum carries.

### The board's own caps (the one place the page uses tracked capitals)
The anti-AI rule bans letterspaced all-caps labels unless the reference does them. On a Solari board it does. The Boards description (1-2, d) says the top line carries *"covering tablets … silk-screen processed with the standing writings such as: type of board, meaning of the pieces of information"*, and fig. 1 draws "D E P A R T U R E S" in spaced capitals. The CSS, quoted in the page with its source:
```css
.plate{…font:700 15px/1 var(--flap);letter-spacing:.22em;…text-transform:uppercase}
.bh{…font:500 12px/1.2 var(--flap);letter-spacing:.12em;…text-transform:uppercase}
```
The difference from r2: these were in Fira Mono, which made them read like UI eyebrow labels. They are now in the **board's own face**, so they read as the silk-screened tablets they copy. Nothing outside the boards is tracked or capitalised: the Gysin columns stay in sentence case with colons.

## 4. The flap face
- **Reference:** C.E. Flap Unit 4-1: *"style of characters: Gill Sans Bold (other on request)"*, *"colour of characters: white on black"*. 2-1: *"any type (Gill Sans Bold, Univers, Helvetica, etc.)"*.
- **Before:** Fira Mono Bold on every flap, which looked like a terminal, not a board.
- **Changed:** all flaps, tablets, the clock and the information board are set in **Cabin 700**. Cabin is Google's humanist sans drawn after Johnston and Gill, so it is the closest free match to Gill Sans Bold. Cabin's **width axis (75–100%)** now does what `fitFlaps()` used to fake with font-size: long names get a narrower cut first (as a sign painter paints a narrower letter), and the size only drops if 75% is still too wide. A second pass measures the real glyphs so nothing clips. Letter cells use 88% width so W and M sit inside their module.

## 5. Flap timing and motion
- **Reference:** C.E. Flap Unit 4-1: *"drive pulse length: 60 to 120 ms according to the flap unit type and number of modules"*. The test device (6-2) steps at 40/60/80/100/120 ms. 5-1: *"7/8 clicks of the blade are necessary to make the next flap fall"*, which means the flap drops under gravity.
- **Before:** letters stepped every 65 ms and word flaps every 110 ms, and both halves scaled linearly.
- **Changed:** letter units step every **80 ms** and the heavier long word flaps every **120 ms**, both inside Solari's range. The top leaf now **accelerates as it falls** (ease-in) and the bottom leaf **lands with a 5% settle** (ease-out plus overshoot), instead of a linear squash.

## 6. Sound
- **Reference:** the clatter is the thing people remember. Boston's MBTA plays a generated flap noise on its replacement boards (r2 study).
- **Changed:** a synthesized click (a 35 ms noise burst plus a 1.45 kHz ping, band-passed with a random centre and pitch) plays once per drive step, louder when more units turn at once. It **only follows the visitor's own click or tap** on a code, a globe marker, a board row or the information board, for 2.6 s. There is no autoplay, no toggle (toggles belong to the World, Chamber and Garage), and no sound under reduced motion. `CLACK_ON = false` in the source silences the page.

## 7. Board layout
The layout already matched the Frankfurt photo and the Solari drawing (a top line of tablets, rows of modules, a pictogram flap column), so it did not change. The Solari readability page (2-1) also confirms that flaps carry *"multi coloured symbols (such as airline logos) and pictograms"*, which is the precedent for the Aicher pictogram flaps.

## 8. Phones: ASCII art never touches text
- The code field kept its gutter against the canvas's *ceil* column count, so the last letter ran to about 5px from the edge at 390px. It now uses whole visible columns (a 2ch gutter).
- The code field is two rows taller on phones so the letters read.
- A blank row now separates the code from the globe (the arcs are clipped one row lower).
- Globe labels and `drawBox` boxes must fit inside the *visible* columns with a 1ch margin. Before, "Lithuania" touched the right edge.
- Land glyphs used to butt against markers ("█& Lithuania", "8 Hungary"). Every marker now gets a one-cell halo, and the cells between a marker and its label are cleared.
- The gap between the hall and Departures is shorter on phones (3 lines instead of 5).

## 9. Copy pass
- **Hero column 2** is written in Gysin's form (one line per thing, commas, no adjectives) and leads with the strongest facts: *Harvard College, sophomore, Applied Math in Government and Economics. Chair of Harvard Model Congress, North America's largest congressional simulation. Project Team Lead, The Harvard Crimson Business Board.*
- **HMC Boston:** it now leads with scale: *"Directs the Boston conference, North America's largest congressional simulation: 1,500+ delegates from 100+ schools. Chair (Senior Staff) since Jan 2026; on staff since Sep 2025."* The remarks drum adds "N. America's largest".
- **Crimson Business Board:** *"Leads international writing and leadership camps with The Princeton Review and AlgoEd for The Harvard Crimson, the nation's oldest daily college newspaper (est. 1873) and a $1M+ media enterprise."* The remarks drum adds "Est. 1873" and "$1M+ enterprise".
- **South Korea:** the trip comes first ("Traveled to South Korea for The Harvard Crimson to mentor students and lead two weeks of workshops…"), then the Quiz Bowl judging.
- **Accuracy fix:** r2 called the departures "programs that came with a ticket" and the blue key "the programs that flew somewhere". CONTENT.md says he *staffs* HMC Europe, not that he travelled there. Both now say "reach abroad", and the section line names what the four are: "three trips and a conference of 20+ countries".
- **China Forum** remarks add "America's largest".
- The colophon names the two faces and why they were chosen.

## Removed because no reference does them
- The magnifying lens over the code.
- The `░` drop shadow under the code.
- The invented land ramp.
- The `· ? █` flaps.
- The colon after the district name (Gysin's first column is his bare name, "ertdfgcvb").

## QA
`node world/_shared/qa.js everywhere` gave 0 issues before and 0 after. `audit.py` shows 0 problems. The world-nav block is byte-identical to r2. There are no console errors at 360, 390, 1024 (reduced motion) or 1440.
