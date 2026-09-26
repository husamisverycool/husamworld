# Study: neal.fun/deep-sea (for `depths.html`, The Pier)

Studied live on 2026-09-26 with Firecrawl: page markdown, raw HTML, branding, a 1440×900
screenshot of the title slide, and the page's own Nuxt chunks (`/_nuxt/a4b2523.js` holds the
component, CSS strings and the WebGL shaders; `/_nuxt/87a7d03.js` is the regl library).

## Structure (top to bottom)
1. **Title slide**: `100vh`, flex-centred. Title "The Deep Sea" and a credit line "by Neal Agarwal".
   The title wrapper is nudged up (`bottom: 50px`). NEAL.FUN hand-lettered logo top-left (150px wide,
   18px inset). Language picker top-right (globe icon + "English", 18px inset).
2. **Ocean**: four stacked CSS grids, each `grid-template-columns: repeat(8, 1fr)`,
   `grid-template-rows: repeat(999, 50px)` (the last one 642 rows), `max-width: 1400px`,
   `padding: 0 15px` (20px under 550px). Every animal and every text blurb is a grid item placed by
   inline custom properties: `--row`, `--row-width`, `--col`, `--col-width`, plus `-mobile`
   variants used under 500px. Hand-placed, so things at the same depth sit side by side.
3. **Depth line**: one element at the end of the ocean, `position: sticky; bottom: 18%;
   transform: translateY(-50%)`, full width, `border-bottom: 1px dashed rgba(255,255,255,.2)`,
   `padding-bottom: 10px`, centred, white, Roboto 700 28px (22px under 600px). Text:
   `"{depth} METERS DEEP"`. `opacity: 0` while depth is 0, fades in (0.3s) after.
   Because it is sticky inside the ocean, it comes to rest on the sea floor at the end.
4. **Sea floor**: an SVG wavy sand edge (`ocean-bottom-top.svg`, 23px tall, nudged down 5px), then
   `.ocean-bottom`, `100vh`, `linear-gradient(#ede5ce, #b5ad9a)`. Centred: the title again
   (76px, 700, `#2c2c54`), "Made with ♥ by Neal Agarwal", a special-thanks line, "Buy me a coffee!",
   and at `bottom: 100px` a link "More posts on Neal.fun" (Oswald 28px, `#333`).

## Scale and the counter
- **Linear.** 50px grid row = 3 m, so **16.67 px per metre**. Four grids = 3,639 rows ≈ 182,000px
  of scroll for 10,924 m. About 200 screens at 900px tall.
- Counter formula (from the component): `depth = round(clamp(scrollY / 50 * 3 - 12, 0, 10924))`.
  It is read from scroll position, not from the element's position.
- Zone titles sit at their real depths: Twilight (row 67 ≈ 200 m), Midnight (row 333 ≈ 1,000 m),
  Abyssal (≈ 4,000 m), Hadal (≈ 6,000 m), Challenger Deep (≈ 10,900 m). There is **no title for
  the sunlight zone**; the surface is simply the start.

## The water (WebGL, regl, full-screen fixed canvas behind everything)
- Canvas container: `position: fixed; height: 100vh; z-index: 1`, CSS fallback background
  `linear-gradient(180deg, #9ee0fe, #e2e9c5)` (the sky).
- Fragment shader, per pixel (`st` = 0..1, y up):
  - `depth = scrollY / innerHeight` (in screens). `depth > 12` → pure black.
  - Wavy surface: `diff = st.y - .025*fbm(st + t*.0005) - .016*sin(st.y + 16*st.x + t*.006)`.
    Above `depth + .222` → sky: `mix(vec3(1,.929,.678), vec3(.612,.878,1), st.y)` (sand-yellow at the
    horizon, blue at the top). So the waterline starts **22% up from the bottom** of the first screen.
  - A thin white foam line just under the surface: `step(.216, diff - depth)`.
  - Water colour: `hsb2rgb(h = .55 + tiny fbm wobble, s = 1, b = 1 - depth*.1 + edgeShade + lightBeams)`.
    - `edgeShade = -.3 * (smoothstep(0,.5, st.x-.8) + smoothstep(0,.5, .2-st.x))`: darker edges.
    - `lightBeams = .04*sin(t*.01 + st.x*15) + .5*(st.y - .99)`: faint vertical light bands that
      sway, and the bottom of the screen always half a step darker than the top.
    - So brightness falls 10% per screen scrolled: black after ~10 screens. Most of the page is black.
  - Sampled from the screenshot: surface water `#00a1a9`, mid `#008b99`, bottom of screen
    `#00758b`, dark edges `#005f72`. Sky top `#9de0fe`, mid `#bde4e4`, near horizon `#dee9c8`.
- Marine snow: 250 GL points, re-seeded every 10 frames, random x/y, size up to 10px pulsing with
  `sin(age/80)`, parallax on scroll (`parallax * 2 * (scrollNow - scrollAtSpawn)/viewHeight`),
  a tiny sideways sway, grey `.8` with a soft round falloff `.5 - length(pointCoord - .5)`,
  hidden above the waterline.

## Type and colour
- Title: Roboto 700, 76px (48px under 500px), `#2c2c54`, centred.
- Credit, blurbs, names, zone titles: **Oswald**.
  - Credit: 26px (18px mobile), `#4d4d80`, 15px under the title.
  - Animal name: 16px, `font-weight: lighter`, uppercase, `#f7f1e3`, opacity .9, 5px under the image
    (14px, no margin under 600px).
  - Blurb: 24px (20px mobile), white, `line-height: 1.6em`, centred, spans 3 to 9 columns.
  - Zone title: 48px (32px mobile), 700, uppercase, lilac **`#eabdff`**.
- Palette overall: navy `#2c2c54`, slate-violet `#4d4d80`, cream `#f7f1e3`, lilac `#eabdff`,
  sand `#ede5ce → #b5ad9a`, and the water.

## Animals
- Flat, friendly vector illustrations (PNG), natural colours, no outlines, soft shading. Sizes
  vary with the real animal (killer whale spans 8 columns, a velvet crab 2). Every image has the
  name under it, nothing else. **Facts live in separate blurbs**, placed near the animal.
- The only moving picture is the Trieste: `position: sticky; top: 40%`, `max-width: 400px`
  (250px mobile), floating with `translateY(-50%) → (-53%) rotate(2deg)` over 6s, alternate,
  ease-in-out. It rides down with you through the last section.

## Pacing and tone
- Crowded near the surface (manatee, dolphins, turtles, sharks within the first 200 m), sparse
  below. Blurbs every few screens, fewer as you go down.
- Caption tone: one plain fact with a small twist, short sentences, the occasional exclamation.
  Examples of the *kind* of line (not to be copied): a record set by a named person in a named year;
  "thought extinct until found alive"; a one-line joke answering its own question.
- Deliberate emptiness late on, with lines about how lonely and sparse it is, then a run of
  short one-line blurbs telling the 1960 Trieste descent step by step, each a screen or two apart,
  ending with the zone title for the deepest point.
- Ending: black water gives way to a sand floor. Title repeated. Quiet credits. A single link out.

## What I am taking for The Pier
- Same skeleton: title slide with the waterline 22% up; an 8-column, max-1400px ocean; a sticky
  counter at `bottom: 18%` with the dashed rule; lilac zone titles; cream uppercase Oswald names;
  white Oswald blurbs; a sand floor with a centred ending and one link at the bottom.
- The water shader, ported to raw WebGL (no regl) with the same maths, including marine snow,
  plus light shafts near the surface that fade out.
- Linear scale, one "1 in N" unit = a fixed number of pixels. The counter reads "1 IN 1,628".
- A sticky descender in the last section (the diver from the intro, in place of the Trieste).
- A short step-by-step run of blurbs before the bottom, built only from facts in CONTENT.md.
- Fonts: Oswald as-is. Roboto is on the banned list, so the Roboto roles (title, counter) use
  **Heebo**, whose Latin is drawn from Roboto and is the closest Google Fonts match.
