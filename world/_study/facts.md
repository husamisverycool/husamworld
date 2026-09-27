# Study: the plain page → `world/facts.html`

Husam's ask: "a no nonsense no stimulation version of all the necessary facts straight up", intuitive, reached from everywhere.

## How I could read the references (be honest about it)
The sandbox's egress proxy refuses danluu.com, paco.me, brittanychiang.com, rsms.me, stephango.com, leerob.com, gwern.net, craigmod.com and paulstamatiou.com (both curl and WebFetch: `EGRESS_BLOCKED`). raw.githubusercontent.com is open, so where a site's source is public I read the source:
- **Brittany Chiang**: `bchiang7/v4` → `src/styles/variables.js`, `src/components/sections/jobs.js` (measured values below).
- **Steph Ango**: `kepano/flexoki` README (the palette his site uses) and `kepano/tidy/tidy.css` (his bookmarklet for making any article readable: the purest statement of his reading taste).
- **Gwern**: `gwern/gwern.net` → `css/initial.css`.
- **motherfuckingwebsite / bettermotherfuckingwebsite**: the seven declarations, confirmed through search results that quote them (original down; mirrors on GitHub).
- **Dan Luu**: his own posts via search ("Speeding up this site by 50x", "How web bloat impacts users with slow connections").
- **Escape hatches**: `brunosimon/folio-2019` `src/index.html`; `henryjeff/portfolio-website` `LoadingScreen.tsx`; Bruno 2025 from our own round-4 notes (`index-r4-refs.md`).
paco.me, rsms.me, leerob, craigmod and Stamatiou could not be opened; nothing below is attributed to them.

## What each one does, specifically

### motherfuckingwebsite.com / bettermotherfuckingwebsite.com
- MFW: zero CSS. The browser's defaults *are* the design. Argument: "it's fucking lightweight … loads fast … fits on all your shit".
- BMFW adds exactly: `body{margin:40px auto;max-width:650px;line-height:1.6;font-size:18px;color:#444;padding:0 10px}` `h1,h2,h3{line-height:1.2}`. No webfonts, no JS.
- **Taken:** the measure (650px ≈ 70 characters), 18px/1.6 body, 1.2 headings, the gutter floor. The page reads correctly with the stylesheet deleted.

### danluu.com
- "Pure HTML with a few lines of embedded CSS." He found fonts were 43.8% of his page weight and dropped them; removed the one bit of JS (a sidebar toggle) because analytics showed nobody used it. Pages must stay readable if any dependency fails.
- **Taken:** no webfonts at all (system stack), one inline `<style>`, one small inline `<script>` that only *adds* conveniences. Every fact is in the HTML at load. Nothing waits.

### brittanychiang.com (v4 source; v5 keeps the idea)
- Experience entry = `h3`: **title** then ` @ company` (company in the accent colour), then `.range` in `--font-mono` at `--fz-xs` 13px, `--light-slate`, then a short bulleted description. Type scale is 12/13/14/16/18/20/22/32px. Content column `max-width:700px`.
- v5 (current, from memory of the live site; could not re-open): a two-column row per job with the **date range in a narrow left column** and role · org + one line on the right, and a "View Full Résumé" link at the end.
- **Taken:** the row shape: a small, muted, tabular date column on the left (on phones it sits above), then *Role, Organization* in bold, then one plain sentence. Not taken: tabs, the neon accent, the letterspaced-caps dates.

### stephango.com (Flexoki + tidy.css)
- Flexoki: "an inky color scheme for prose … inspired by analog printing inks and warm shades of paper". Light: paper `#FFFCF0`, text black `#100F0F`, muted base-600 `#6F6E69`, rules base-150 `#DAD8CE`; dark: black `#100F0F` ground, base-200 `#CECDC3` text, base-500 `#878580` muted, base-850 `#343331` rules. Accents blue-600 `#205EA6` / blue-400 `#4385BE`.
- tidy.css: system stack (`-apple-system, BlinkMacSystemFont, …, Segoe UI, Helvetica, Arial, sans-serif`), `line-height:1.8`, `width:40em; max-width:88%`, links in the *text* colour and underlined, visited links muted, dark mode purely via `prefers-color-scheme`.
- **Taken:** the Flexoki values for both themes (automatic dark mode, no toggle), links as underlined text rather than coloured blobs (blue only on hover/focus), and the system stack minus Inter/IBM Plex (banned here). Paper + sans + blue is not the banned cream/serif/terracotta look.

### gwern.net (`css/initial.css`)
- Body `max-width:935px` for a page with sidenotes; numbers in tables use `font-variant-numeric: tabular-nums`; every heading is its own link (the section anchors are the navigation).
- **Taken:** tabular numerals for every date and figure so columns line up; each `h2` is a self-link (`#building`, `#honors` …) so any section can be sent as a URL; a one-line table of contents at the top, not a sidebar.

### Escape hatches in 3D portfolios
- **Bruno Simon 2019** (`src/index.html`): the HTML has *no* plain content at all; the only DOM text is the Three.js Journey popup. No escape hatch.
- **Bruno Simon 2025** (round-4 notes): content lives in a centred menu over the game (Home/Options/Controls/…), still inside the 3D experience.
- **Henry Heffernan** (`LoadingScreen.tsx`): the BIOS loader's footer reads "Press **DEL** to enter SETUP , **ESC** to skip memory test"; phones get "WARNING: This experience is best viewed on a desktop or laptop computer." The inner site (os.henryheffernan.com) is a separate plain-ish page.
- **Lesson:** the good hatch is a named key plus a quiet text link at the moment you'd bail (the title screen), and a real URL of its own, so it can be pasted into an email. The hub already has "Or read the map"; the facts page sits beside it as "Or just the facts", with **P** (plain) as the key, since M/O/T/R/H/E/F/B/A, arrows, WASD, Space and Shift are taken.

## Decisions for facts.html
| Detail | From | Value |
|---|---|---|
| Type | danluu (no fonts), tidy.css | system stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif` |
| Measure | BMFW | `max-width:650px` text column; date column adds 7.5em at ≥700px so the reading line stays ≈ 650px |
| Size / leading | BMFW | 18px / 1.6 body (17px under 400px), headings 1.2 |
| Colour | Flexoki | light `#FFFCF0` / `#100F0F` / `#6F6E69`; dark `#100F0F` / `#CECDC3` / `#878580`; links underlined text, blue on hover |
| Experience rows | Brittany Chiang | muted tabular date column, **Role, Org**, one sentence |
| Anchors | gwern | every section heading links to itself; one-line contents at top |
| Numbers | gwern | `tabular-nums` everywhere |
| Order | recruiter/VC scan | who + contact → building → Harvard now → research → advocacy → community → writing → debate → honors → time |
| JS | danluu | none needed to read; an inline script only unhides: filter box (`/` to focus, Esc to clear), Copy email, Save as PDF (`window.print()`) |
| Print | résumé | 10.5pt, black on white, no links row, no district pointers, rows don't split, URLs for email/LinkedIn printed as text |
| Motion | all of them | none |
| Updated line | a plain dated footer, so a reader knows how fresh the facts are | "Updated September 2026" in the footer |
