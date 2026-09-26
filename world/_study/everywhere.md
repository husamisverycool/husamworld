# Study: ertdfgcvb (Andreas Gysin) for `everywhere.html`

Sources studied live on 2026-09-26: ertdfgcvb.xyz (home, raw HTML, `main.css`, the minified `js.js` boot program), play.ertdfgcvb.xyz (playground UI, `abc.html` manual, the Wireframe cube program running), and the play.core source (github.com/ertdfgcvb/play.core: `run.js`, `core/textrenderer.js`, `modules/drawbox.js`, `modules/sort.js`, programs `sdf/cube.js`, `sdf/balls.js`, `demos/donut.js`, `demos/doom_flame.js`, `camera/camera_gray.js`). Screenshots in the session scratchpad.

## The core idea
- Everything is a **character grid**. A program is a GLSL-like function `main(coord, context, cursor, buffer)` called once per cell per frame, returning a char (or `{char, color, backgroundColor, fontWeight}`); `pre()` and `post()` run once per frame (post is used to draw overlays such as info boxes).
- Output is **text in a `<pre>`** (one `<span style="display:block">` per row, spans only when style changes). A canvas renderer exists as an alternate. Frame rate is capped: 30 fps in the playground, 60 fps on the home page.
- Geometry is corrected by the **cell aspect** (`metrics.aspect = cellWidth / lineHeight`, about 0.44 in Simple Console at 16/19). Circles stay round because x is multiplied by aspect: `st.x = 2*(x - cols/2)/min(cols,rows)*aspect`.
- **Density ramps** map a value to a glyph: `'Ñ@#W$9876543210?!abc;:+=-,._ '`, cube `' -=+abcdX'`, balls `'#ABC|/:÷×+-=?*· '`, donut `'.,-~:;=!*#$@'`, flame `'...::/\\/\\/\\+=*abcdef01XYZ#'`, camera `' .x?▂▄▆█'`. `sort.js` sorts a ramp by **measured brightness**: draws each glyph at 30px on a canvas and sums the pixels. Doing this at runtime with the page font is the authentic move.
- **Brightness from lighting/SDF**: `exp(-k*|d|)` falloff (cube, circle), `1 - exp(-3|d|)` (balls), dot-product luminance (donut, 0..11 index).
- **Box drawing is the chrome**: the font (LL Simple Console by Norm) was chosen for its complete box-drawing set and its odd lowercase r. `drawbox.js` draws boxes into the buffer with border styles `round ╭╮╯╰─│`, `double ╔╗╝╚═║`, `single`, `fat █▀▄`; shadows `░ ▒ ▓ █ ▚ ╳`. `drawInfo()` is a 24-wide round box, white bg, black text: `FPS / frame / time / size 98×56 / font aspect 0.44 / cursor 0,0`. The cube program draws a background lattice `┼──────` / `│      ` in black with the solid in royalblue.

## ertdfgcvb.xyz home (the studio page)
- **Black** body, text `rgb(190,190,190)`, links `rgb(250,250,250)`, no underline, font Simple Console 1em, `--line-height: 19px`. No images, no chrome.
- Real DOM content (`<main>`) is laid out on a CSS grid (`--c1: 18ch; --c2: 36ch`, `grid-gap: 2ch`, `left: 2ch`) but is **invisible**; its measured position is re-typeset into the full-page `<pre>` character by character. Columns are separated by `│` drawn from row 0 to the bottom of the tallest column. Under `120ch` the grid collapses to `1fr 1fr` rows mode with `─` rules above each block; under 400px the font drops to 0.8em / 16px line.
- Labels end in a colon: "External:", "Physicals:", "Toys:", "Email for inquiries or just to say:". Terse, lowercase-ish, lists of links, one per line.
- **Background field**: a 3-letter word (ert, dfg, cvb, then shuffled 3-letter words) drawn with an 8×11 bitmap font, scaled to fill the screen and **warped by 2D value noise** (x ±0.25, y ±0.9 of the field), scale breathing between 1.2 and 0.5 with `cos(t*0.0004)`. Intensity keeps a **trail** (`v = max(sample, v*0.95)`).
- Two ramps in a **checkerboard** (`(x+y)%2`): `" .·•-+=:;*ABC0123!*"` and `" ·-•~+:*abcXYZ*"`; the last glyph of each is swapped for a random pair ("+ ", " .", "· ", ": ", "• "). Colors: grays 120 and 90 (bright only when the value is ≥ 0.99).
- **Word change is a split-flap**: every 300 frames each letter steps through `" ABC…XYZ0123456789"` one position every 2 frames until it reaches the new letter, letters staggered by 6 frames. This is the connection to the airport board.
- **Text decode**: every glyph of the content cycles through a long charset (`" .,·-•─~+:;=*π’“”┐┌┘└┼├┤┴┬│╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@a…Z0…9%()"`) until it lands on its real letter; the start delay is `floor(x/3 + 2*y) + 2` frames, a **diagonal wipe** from the top left.
- **Cursor**: a scramble radius that grows with pointer speed (`r = min(r*0.75 + 0.4*speed, 20)`); cells inside it restart the decode, so text and field boil around the pointer and settle again. Fast movement also cross-fades the two grays toward random **EGA colors** (the only color on the page).
- The email link has `data-flap`: its text is swapped every 9 s among shuffled one-liners and re-decodes each time. Press `f` for fullscreen (an HTML comment says so). A `?mode=screensaver` hides the text.

## play.ertdfgcvb.xyz (the playground)
- Three columns: live output (white, black glyphs) | CodeMirror "day" editor (gray comments, blue keywords, orange strings) | a **black nav column** separated by dashed rules `------------------------`, items with right-aligned hotkeys in gray (`Run  Ctrl+Enter`), examples indented by category (basics, sdf, demos, camera, contributed).
- The manual (`abc.html`) is plain serif HTML with blue links, rules above each section, "Section: Title" headings. Tone: dry, precise, a little funny ("The project will stay up until it breaks.", "just eternity").

## What to take for The Airport
1. One character grid, drawn per cell, aspect-corrected; Fira Mono (Google Fonts) because it is the one Google monospace with the full **box-drawing and block-element set** (its `symbols2` subset, U+2500–259F), which is exactly why Gysin chose Simple Console. 16px / 19px line, 2ch gutters, 18ch/36ch columns, labels with colons, 190/250 grays on black.
2. Hero = a program: a lit, rotating globe computed per cell (lat/lon from the view vector, land mask sampled, brightness from a real-time sun, ramp sorted by measured brightness), arcs and markers as glyphs, a `drawBox` round box on hover, a `drawInfo` box in the corner.
3. The name as the home page's warped word field (noise warp, trails, checkerboard ramps), with the header typeset on top in columns separated by `│` and the field kept off the text cells.
4. Intro = the decode: a wall of noise glyphs resolving along the `x/3 + 2y` diagonal. Cursor = the speed-scaled scramble radius.
5. The departures board is the home page's letter flap made physical: fixed drum order, one step per tick, staggered starts. Monochrome: no EGA colors (the brief allows one accent at most; I use none).
