# Study, round 2: the Garage (`world/os.html`)

Round 1's study (`os.md`) covers henryheffernan.com, os.henryheffernan.com and dustinbrett.com (daedalOS) in depth, with measured values. This round adds five references and re-reads the current page against OWNERSHIP.md.

Sources this round: live scrape of poolsuite.net (screenshot, branding, markdown); infinitemac.org (screenshot + copy);
the source of system.css (sakofchit/system.css `style.css`), 98.css (jdan/98.css `style.css`) and platinum.css (mat-sz/platinum.css `src/index.scss`);
the HP Garage (Wikipedia, HP's own "A home for innovation" PDF, pastheritage.org) and the Apple garage at 2066 Crist Drive, Los Altos.
7.css (Windows 7 Aero) was looked at and ruled out: its look *is* translucent blurred glass, which BRIEF-RULES bans.

---

## 1. poolsuite.net: a retro OS as a brand
- **Layout (1920×1080 screenshot):** a flat pastel desktop, `#F6D5D5` (pink). No wallpaper, no icons on the desktop. One window, centred, ≈606 px wide: the player. Everything else lives in a **bottom dock**: nine square tiles (≈80×68 px), each a 1 px black box with a 32 px pixel icon over a 10 px label (Player, Newsroom, Mixtapes, Members, Events, Instagram, Vacation, Guestbook, Settings), flush to the bottom edge, butted together with no gaps.
- **Top bar:** not a menu bar. Top-left: a black 32 px square with a white palm glyph, then a white tab "BECOME A MEMBER / LOG IN" (uppercase, letter-spaced pixel serif, 1 px black border, bottom-right corner rounded 4 px, everything else square). Top-right: two white tabs, "FRI 25 SEP 1997" (today's date with the year rolled back to 1997) and a clock glyph + "23:40".
- **Window chrome:** cream `#F9F0E9` body, 1 px black border, a soft grey drop shadow far below (≈0 20px 30px rgba(0,0,0,.15)). Title row 24 px: left a tiny ×, a black square "TV" toggle, a "contract" glyph; right the wordmark "POOLSUITE" in a condensed bold pixel face. No title-bar fill: the chrome is almost nothing.
- **Inside:** a dithered, low-res video ("surfin_the_web.mov 591x455" in a black caption strip with prev/next glyphs), then a white panel "Poolsuite: ON AIR •" (red dot) and the track name, a "Stopped" state, and transport buttons in 1 px black boxes, the active one filled cyan `#AFE2E5`.
- **Type (branding scrape):** Pixolde (headings), ChiKareGo2 (body, the Chicago recreation also used by system.css), Everyday (paragraph). Body 10 px, h1/h2 16 px. Base unit 4 px, radius 2 px.
- **Copy tone:** leisure-deadpan. "Welcome, internet friend." "Join our squad of global leisure enthusiasts today for the handsome price of zero dollars." Team titles: "Executive Poolboy", "Webmaster", "Vintage Computator", "Team Mascot". "Poolsuite OS Version 3.0, Copyright 1986-2026 Ultraleisure Ltd." The brand is the OS; the OS is a mood.
- **Memorable because:** one colour, one window, one dock, and a personality that never breaks. It is the opposite of Henry's: no room, no boot, no depth. It's a lifestyle brand wearing a 1997 Mac.
- **With Husam's content:** "Garage FM"-style: a pastel desk with one hero window (the stealth startup as the "now playing"), a dock of the builds (Electric Deals, bayloop, Jetson, Back office, Grants). Risk: poolsuite's charm is its leisure; Husam's content is a founder's record, and a pink leisure OS reads as a parody of him. Its date/clock tabs are the visitor's clock, which the World owns.

## 2. Classic Mac: System 7 and Mac OS 9, and their web homages
### system.css (System 6/7 look), measured from the source
- Tokens: `--primary #FFFFFF`, `--secondary #000000`, `--tertiary #A5A5A5`, `--disabled #B6B7B8`, `--box-shadow: 2px 2px`, `--element-spacing: 8px`.
- Fonts: `Chicago_12` (ChiKareGo2) for titles and menus, `Geneva_9` (FindersKeepers) for small text, `Monaco` for code.
- `.window`: column flex, `min-width: 320px`, `border: .1em solid black`.
- `.title-bar`: `height: 1.5rem`; the **pinstripes** are `linear-gradient(var(--secondary) 50%, transparent 50%)` at `background-size: 6.67% 13.33%` (six 1 px black lines); the centred title sits on a white knock-out; close box is a small square at left drawn with pseudo-elements, its `:active` fills with the stripe pattern.
- `.btn`: `min-height: 20px; min-width: 59px; padding: 0 20px`, a rounded border drawn with an SVG border-image; pressed = black fill, white text, `border-radius: 6px`.
- Scrollbars 22 px wide, track a 4 px **checkerboard**, thumb a white box with 2 px black border.
- Dialogs: `.standard-dialog` 2 px black border + hard `2px 2px` shadow; `.modal-dialog` double border.
### platinum.css (Mac OS 8/9 "Platinum"), measured
- `$surface #dedede`, `$window-frame #cecece`, `$shadow-white #fff`, `$shadow-light #9c9c9c`, `$shadow-black #000`. Font `Charcoal`.
- Window `padding: 2px` with stacked box-shadow bevels; body `border: 1px solid #000`.
- Title 11.5 px; **pinstripe** lines drawn as pseudo-elements either side of the title; boxes 11×11 with `1px solid #212121` and a `linear-gradient(135deg, #9c9c9c, #fff)` bevel (close at left, zoom and windowshade at right).
### infinitemac.org (Mihai Parparita)
- Each system release is a card drawn as a **beige compact Mac** (`#dcd3bf`-ish case, black bezel, white screen) with the release name in a serif, its date in grey, a two-line description and "Customize… / Run" in System-6 rounded buttons; a tiny rainbow Apple under the screen. Dark slate page `#2a2d33`. The site's logo is an infinity sign in the six-colour Apple stripes over a pixel-font wordmark.
- Copy is plain and historical ("Introduced the MultiFinder, revised the Finder about box, and improved printing support").
### The classic Mac vocabulary (from memory of the systems, confirmed by the above)
- 20 px white **menu bar** across the top (Apple menu left, application menu right, a clock in 7.5+). Desktop: System 7's 50 % grey dither or the 7.5 blue-grey; 32 px icons with Geneva 9 labels on white knock-outs; the **Trash** bottom-right.
- **Boot:** grey screen, the **Happy Mac** in a small compact-Mac outline, then the "Welcome to Macintosh" box, then extension icons marching along the bottom.
- **About This Macintosh:** memory bars per application. **Windowshade** collapses a window to its title bar. Sad Mac on failure. Finder list view with disclosure triangles.
- **With Husam's content:** a Finder window "The Garage" with the builds as folders; "About This Garage" with memory bars sized by revenue; stealth.zip as a locked folder with a padlock badge; extensions marching at boot as his grants. Risk: Chicago and the rainbow Apple are Apple's marks (use a garage glyph and our own pixel type), and the Mac's white-and-black minimalism is quieter than the 95 page he already liked.

## 3. 98.css and 7.css, as design systems
- **98.css** tokens: `--surface #c0c0c0`, `--button-face #dfdfdf`, `--button-highlight #fff`, `--button-shadow #808080`, `--text-color #222`, `--element-spacing 8px`, `--dialog-blue #000080` to `--dialog-blue-light #1084d0` (the title-bar gradient, `90deg`). Buttons are two stacked inset box-shadows (raised outer, raised inner); `.title-bar-controls button` `min-width 16px; min-height 14px`; `.status-bar` `display:flex; gap:1px; margin:0 1px`; `fieldset` uses a groupbox border-image; `ul.tree-view` white with a field border and 6 px padding. Font: "Pixelated MS Sans Serif".
- Take-away: the current page already draws exactly this bevel system with `box-shadow` (Henry's greys `#c3c6ca/#86898d` in place of 98.css's `#c0c0c0/#808080`). 98.css adds the **gradient title bar** (98-era) and the **tree view**; Henry keeps the flat 95 navy. For "95, elevated", staying flat-navy is the more faithful choice; a 98 gradient would be a period error.
- **7.css** is Aero: translucent, blurred title bars and rounded, red close buttons. Banned look (glassmorphism). Out.

## 4. Garage-startup mythology (for the room)
- **HP Garage, 367 Addison Avenue, Palo Alto.** A 12 × 18 ft wooden garage behind a rented house; Hewlett and Packard started in 1939 with $538, counting Dave's used Craftsman drill press; first product the 200A audio oscillator. California Historical Landmark No. 976 (1989): a **bronze plaque**, "Birthplace of Silicon Valley", which people photograph more than the garage. White clapboard, a single swinging door, a workbench under a window.
- **Apple, 2066 Crist Drive, Los Altos.** A 1950s ranch house; the attached garage with a single roll-up door, famous from photos taken from the driveway at the curb.
- **What the myth is made of, visually:** the view **from the driveway at night**, the door rolled up, a warm rectangle of light, a workbench, cardboard boxes of inventory, a bronze plaque. The door going up is the story's opening shot.
- **With Husam's content:** the garage the current page already builds (pegboard, bench, CRT, Electric Deals boxes) seen first from outside, door closed, then the door rolls up. A bronze plaque on the wall naming what was built here, with years, in place of the wall calendar (a calendar belongs to the Plaza).

## 5. Henry Heffernan again (re-read against the rules)
- Henry's inner site opens on **"My Showcase"**: a window that is a whole little website, with a 300 px left nav of big bold underlined serif links (HOME, ABOUT, EXPERIENCE, PROJECTS, CONTACT), Millennium body 18 px, the name at 64–72 px in a soft heavy serif. Round 1 turned it into an About window with a photo and contact. Round 2 can't keep that (no photo, no contact, no name hero), but Henry's *Showcase* shape (nav + pages) fits "things he built" better than an About box ever did: HOME / NOW / ELECTRIC DEALS / BAYLOOP / JETSON / BACK OFFICE / GRANTS.
- The HUD's live clock is Henry's, but "the visitor's clock" is the World's device. It goes. The taskbar clock goes too (daedalOS's calendar popup is also a calendar, which is the Plaza's). Mines' seconds counter is a timer (the Chamber's). All three need replacing with something the Garage owns.

## What I take into the three directions
- **(a) 95, elevated:** keep Henry's room → START → push into the glass → BIOS → splash → desktop. New: the **garage-door opening** from the driveway (the myth's opening shot), the **bronze plaque**, Henry's **Showcase** as the home window (no photo, no name hero), and everything the rules now forbid removed (clock, calendar, timer, About, contact, Harvard, Fresno bio, Languages, Credits).
- **(b) Classic Mac:** System 7 menu bar and pinstripes (system.css values), Platinum greys (platinum.css), a Happy-Mac-style boot with a garage in place of the face, "Welcome to the Garage", extensions marching (the grants), a Finder window per build, About This Garage memory bars.
- **(c) Poolsuite:** one pastel colour, one hero window, a bottom dock, leisure-deadpan copy; the stealth startup as "now playing"; no clock tab.
