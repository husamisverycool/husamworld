# Study, round 3: the Garage (`world/os.html`)

Not a redesign. Same arc (night driveway, door rolls up, START at the CRT, push into the glass, BIOS, splash, HusamOS 95), same desktop, same programs, same plaque. This round puts every visible detail back next to its reference.

**Sources re-opened this round**
- henryheffernan.com, live (Firecrawl screenshot + rendered HTML): the START popup and the inner iframe's DOM with inline styles.
- os.henryheffernan.com/experience, live screenshot at 1920×1080 (the Showcase with its nav and a page).
- Source, github.com/henryjeff/portfolio-inner-site: `showcase/Home.tsx`, `showcase/VerticalNavbar.tsx`, `general/Link.tsx`, `showcase/Experience.tsx`, `showcase/ResumeDownload.tsx`, `os/Window.tsx`, `os/Toolbar.tsx`, `index.css`, `App.css`.
- Source, github.com/henryjeff/portfolio-website: `src/Application/UI/style.css`, `components/LoadingScreen.tsx`.
- daedalOS (DustinBrett/daedalOS), from the round-1 notes in `os.md`: window open/close/minimize motion, Run, terminal commands, context menus.
- California Registered Historical Landmark No. 976 (the HP garage plaque), for the plaque's wording and casting.

QA: 0 before, 0 after (`node world/_shared/qa.js os`). Extra checks I ran with the same tool: every Showcase page, and the desktop with each program open (Electric Deals, stealth.zip, Grants, Jetson, Prompt after `neofetch`/`dir`/`help`, Mines, Display, the Start menu) and `#page`. All 0 after fixes. Three of those extra states failed before this round (the browser window 27, the Prompt 17, the Start menu 12) and are fixed below.

---

## Side by side: what differed, what changed

### 1. Boot, loader, START popup, HUD (henryheffernan.com)
| Detail | Henry (measured) | Round 2 | Round 3 |
|---|---|---|---|
| Typeface | `style.css`: `h1…p { font-family: monospace; font-size: 16px; }`, which renders as DejaVu Sans Mono (see the live screenshot) | VT323 at 20–22px (my own retro default) | **Noto Sans Mono**, the Google face closest to how that `monospace` renders, at **16px**, `letter-spacing: .8px`. It's on the loader, popup, HUD, BIOS, shutdown log, safe screen and the BIOS drawn on the 3D CRT. VT323 stays only where DOS text mode is the reference: the Prompt and the Start-menu banner (Henry uses the Terminal bitmap font there). |
| Phone size | `@media (max-width:768px) { … font-size: 10px }` | 17–18px VT323 | BIOS **10px, letter-spacing 0** on phones, like Henry, so the IDE lines fit on one row. The popup and HUD use 13–14px because they have to be tapped and read. |
| Vendor block | `<b>` green lines, "Released" block 64px to the right | not bold, 40px | bold green, **64px** gap |
| START button | `.bios-start-button p { padding: 8px }`, border `4px 3px` | padding 8/14 | padding **8px** |
| Popup title | "Henry Heffernan Portfolio Showcase 2022" | "HusamOS 95 · The Garage" | "The Garage Showcase 2026" (his pattern, no decorative middle dot) |
| Skip | Henry has none. His skip is the footer line "Press **DEL** … **ESC** to skip memory test" | "Skip intro ›" (a chevron + label button, which is on the banned list) | "Press **ESC** to skip" in the same box style as START (4px/3px border, ESC in BIOS green); on touch screens, "Tap to skip" |

### 2. The Showcase window (portfolio-inner-site)
This is the biggest change, and it's the most Henry thing on the page. Round 2 kept one layout (left nav + page) for every page, including HOME. Henry has two layouts.

- **Home** (`Home.tsx`): no nav. A centred header, `name: { fontSize: 72, marginBottom: 16, lineHeight: 0.9 }` in gastromond, then an `h2` at 32px, then a row of links with `link: { padding: 16 }`, then a `forHireContainer` (`marginTop: 64`) below them. Ours now matches that: **"Things built here"** (Caprasimo 72/.9, standing in for gastromond; it is not the district name), the h2 "From two stores at 14 to a stealth startup", the link row NOW · ELECTRIC DEALS · BAYLOOP · JETSON · BACK OFFICE · GRANTS, and the bronze plaque sits in the for-hire slot.
- **Inner pages** (`VerticalNavbar.tsx`): `navbar: { width: 300, padding: 48 }`, `header: { marginBottom: 64 }`, `headerText: { fontSize: 38, lineHeight: 1 }` on two lines, `headerShowcase: { marginTop: 12 }` ("Showcase '22"), `link: { marginBottom: 32 }`, links vertically centred (`links: { flex: 1, justifyContent: 'center' }`). Ours now uses exactly those values: "Things / built here", "Showcase '26". The page column is `.site-page-content`: `padding: 64px; padding-top: 32px; padding-left: 16px; overflow-y: scroll`.
- **Page header** (`Experience.tsx`): `headerRow: { justifyContent: 'space-between', alignItems: 'flex-end' }`. It has an `h1` (64px gastromond) with an `h4` link on the right, then an `h3` role (24px Millennium Bold) with bold dates on the right. Every page now has it: *Electric Deals / Facebook + eBay / Entrepreneur at 14 / March - October 2020*, *bayloop / Fresno, CA / Founder & President / October 2023 - December 2024*, *Jetson / Fintech for teens / Paid Intern / Summer 2023*, *stealth.zip / San Francisco / Co-founder & CEO / Summer 2026*, and so on. Body text is `.text-block { text-align: justify }` at 18px with `li { margin-bottom: 16px }`. I left it ragged-right on phones.
- **ResumeDownload box**: `resumeContainer: { padding: 12, border: '2px solid black', borderLeftWidth: 0, borderRightWidth: 0 }` with a 56×48 printer gif, "Looking for my resume?", and "Click here to download it!". Each page now opens with one that points at its program, in his voice: "Looking for the store? Click here to open the saved 2020 page!" Round 2's generic grey "Open …" buttons are gone.
- **Links** (`Link.tsx`): they are ALL-CAPS in his source (`text="EXPERIENCE"`), `fontWeight: 'bolder', textDecoration: 'underline'`, with **no letter-spacing** (`h4 { letter-spacing: 0px }`). Round 2 had `.6px` tracking and black links. They're now browser blue `#0000ee` and turn visited purple `#551a8b` once you've opened a page, as his do in the screenshot.
- **The here-indicator**: `hereIndicator: { width: 4, height: 4, borderWidth: 3, borderStyle: 'solid', borderColor: 'rgb(85, 26, 139)', borderRadius: '50%', marginRight: 6 }`. It's the little purple ring beside the current page. It's his and the caps are his, so both are quoted here as the exception the rules allow.
- **The micro-interaction** (the "stupidly ambitious" detail): in `Link.tsx` the link turns **red on mouse-down** (`active && { color: 'red' }`) and the route changes **100 ms later**. Done: `.lk.down{color:red}` plus a 100 ms delay (0 under reduced motion).
- **Status bar**: Henry's reads "© Copyright 2022 Henry Heffernan". Ours reads "© Copyright 2026 Husam Sokar" on the home page and the C:\GARAGE path on inner pages.
- **Window size**: Henry's window is 1116×860 on a 1280×1024 screen. Ours goes from 880×700 to **1040×740**. It still keeps its bottom edge above the bottom-left 72px corner at every size, and it tightens its measures through a container query when the window is narrower (tablets, or resized by hand).

### 3. Window manager and taskbar (Window.tsx, Toolbar.tsx)
- Drag outline: Henry's is `height: 6px; background-color: white; background-image: linear-gradient(45deg, black 25%, transparent 25%), …; background-size: 4px 4px; background-position: 0 0, 0 2px, 2px -2px, -2px 0`. Ours was 5px with a 2px checker. It is now his exact 6px frame and pattern.
- The title bar's drag area has `cursor: move` in his DOM. Added, for fine pointers only.
- Active task button: his "My Showcase" is pressed with the dither and **not bold**. Removed our bold.
- Start menu: "Help (read as a page)" and "Stand up from the desk" wrapped to two lines in a 252px menu (Henry's items are single-line). They're now "Help" and "Leave the desk". The banner's `overflow:hidden` was clipping the rotated "HusamOS 95" glyph boxes, so I removed it.
- Status bars got an explicit `background: var(--lg)`. That's visually identical, but content scrolled under them now counts as sitting beneath the chrome, not colliding with it.
- Phones: on the full-screen sheets, the status bar now starts 70px in, so "C:\GARAGE\…" never sits under the world button at rest.

### 4. Prompt (daedalOS terminal, DOS dress)
- DOS text mode has no scrollback: when the screen is full, the top line is gone. The Prompt now does the same (lines scroll off instead of piling into a scroller). That matches DOS, and it fixes the 17 clipped lines QA found after `neofetch` + `dir`.

### 5. Electric Deals (the 2020 storefront in the 95 browser)
- `.ed-kind` was a rounded blue **pill tag** (banned). On a Facebook page, the category line under the name is plain grey text (`#65676b`), so that's what it is now.
- The dark rounded "Together: $28,000" box with yellow numbers was my own invention. It is now a third card, "Both stores", in the same Facebook 2020 card and row style as the other two. The cards keep their 8px radius and `0 1px 2px rgba(0,0,0,.2)` shadow, because that is Facebook's 2020 card, not a default.
- "This page was saved in 2020. It may look newer than your computer." was filler microcopy, so it's cut.
- The browser window's body no longer sets `overflow:hidden`. That fixes 24 clipped + 2 overlap + 1 clipped-self findings when the window is open. The search field now ellipsizes.

### 6. The bronze plaque (CHL No. 976)
- Round 2 set "THE GARAGE" in 46px with `.14em` tracking and `text-transform: uppercase`. That is the district name as a display title, in decorative caps, both on the banned list.
- The HP plaque reads "BIRTHPLACE OF 'SILICON VALLEY' … CALIFORNIA REGISTERED HISTORICAL LANDMARK NO. 976". It is cast in capitals with ordinary spacing and has no subtitle. Ours now follows it: **"BUILT IN THIS GARAGE"**, the years, and "HUSAMOS REGISTERED LANDMARK NO. 95". The capitals are typed in the source, not added with `text-transform`, and tracking is `.03em`. The same wording is on the 3D plaque by the door, the Showcase home and `#page` (where it is the `h1`).

### 7. Copy pass (every fact from CONTENT.md, strongest first)
- **Electric Deals:** "At 14, I ran two online stores at once: retail arbitrage on Facebook and drop-shipping on eBay. Together they brought in about $28,000 in revenue and 281+ positive reviews." Then one line per store: Facebook shipped 400+ products, about $20,000 at ~43%, 131+ reviews; eBay about $8,000 at ~39%, 150+ reviews. The role line says "Entrepreneur at 14", which is CONTENT's own phrasing ("Entrepreneur at 14–15").
- **bayloop:** "I founded bayloop, a Fresno-based think tank fighting restrictive zoning." Then "Organized 7 youth phone banks across the Central Valley." and "Conducted legislative research with the National Low-Income Housing Coalition."
- **Jetson:** this now leads with the selectivity: "Selected 1 of 40 from 1,000+ applicants for a paid internship at Jetson, a fintech company for teens."
- **Grants,** ordered by weight: LeapYear ($30K, Hank Couture and Charlton Soesanto); Telora (1 of 16 finalists from 1K+ applicants for a $55K grant and a 6-month residency, withdrew); Startups @ Harvard (non-dilutive, XFund); GripTape Challenger (2023). They're labelled "Startup honors", CONTENT's own category.
- **Stealth:** only the two permitted sentences. I removed every date that hinted at a start month ("June 2026 to now", "Jun 2026", "06-2026", "stealth 06/2026") and replaced it with "summer 2026" or "2026".

## Kept on purpose (and why)
- **Pixelify Sans** for the chrome. It stands in for Henry's lores-15 and MS Sans Serif bitmaps. Google has no MS Sans Serif, and Pixelify is the closest bitmap-looking face.
- **Tinos** for body text. It stands in for Millennium, and Henry's own fallback is `'Times New Roman', Times, serif`.
- **Caprasimo** for gastromond.
- **Turquoise `#3e9697` and the `#c3c6ca`/`#86898d` bevels** are Henry's `colors.ts`.
- **Round 2's opening shot, room, plaque position, Mines, Run, Display Properties and stealth.zip** are unchanged.
- **The Award-style logo** beside the BIOS vendor block stays: Award BIOS put its ribbon logo top-left in exactly that spot.
