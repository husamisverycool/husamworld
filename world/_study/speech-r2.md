# Study, round 2: speech.html (The Chamber)

Studied 2026-09-26. Firecrawl (screenshot, rawHtml, branding, directQuote on the JS source, PDF parse). Direct curl/WebFetch to these hosts is blocked by the egress proxy, so everything below came through Firecrawl. Screenshots in `world/_shots/study-speech/`.

## 1. dennissnellenberg.com (motion, huge type, magnetic buttons)

What it is, measured:
- **Type:** Neue Montreal (self-hosted `NeueMontreal-Regular.otf`), one weight, regular. Branding reports h1 **216px**, h2 54px. The name is set once at that size and is the whole hero. No bold anywhere; size does all the hierarchy.
- **Colors:** hero is a photo on flat grey `#999D9E`; dark sections `#1C1D20`; one blue `#455CE9` used only for the button fill on hover. White text on grey. Border radius 0 on everything except round buttons (perfect circles) and the pill "hanger".
- **Hero layout:** nav top (44px in: "© Code by Dennis" left; Work, About, Contact right, ~17px). Photo centered. Left edge: a black pill "hanger" (SVG, 300×121, rounded right end with a round hole) holding "Located / in the / Netherlands" + a spinning wireframe globe. Right: a small ↘ arrow over "Freelance / Designer & Developer" (~32px).
- **The rolling name:** `Dennis Snellenberg —` repeats in a marquee along the bottom. From the JS: `roll(".big-name .name-wrap", {duration: 18})`, a GSAP timeline animating `xPercent: -100` with `ease: "none"`, `repeat: -1`. A ScrollTrigger flips `timeScale` to `-1` when the scroll direction changes, so the name runs backwards when you scroll up. Also `data-scroll-direction="horizontal" data-scroll-speed="4"` pushes it sideways with scroll.
- **Magnetic buttons** (verbatim from `index-new.js`): on `mousemove`, `x = ((clientX - left)/width - 0.5) * data-strength`, same for y; the inner `.btn-text` moves by `data-strength-text`. Tween `1.5s, Power4.easeOut`. On `mouseleave`: back to 0 in `1.5s Elastic.easeOut`. Strengths: big round CTA 100/50, "More work" 25/15, nav links 20/10, menu 50/25. Only when `innerWidth > 540` (no magnet on phones).
- **Button fill:** `.btn-fill` (a circle bigger than the button) slides from `y: 76%` to `0%` in `0.6s Power2.easeInOut` on enter, and out to `-76%` on leave; text color flips `#1C1D20 → #FFFFFF` in 0.3s.
- **Line reveal:** every word of the intro paragraph is wrapped (`span-line > span-line-inner`) and animates `from y: 100%`, `duration 1`, `stagger .01`, `ease power3.out` when it enters.
- **Loader:** the words Hello, Bonjour, स्वागत हे, Ciao, Olá, おい, Hallå, Guten tag, Hallo flash one after another (~0.1–0.2s each), each with a dot, then the screen lifts off with a curved bottom edge (`rounded-div`, an ellipse that flattens as it moves).
- **Work list:** full-width rows split by 1px stripes; title huge left (~5vw), service small right. A floating image and a round "View" disk follow the cursor over the list.
- **Memorable because:** one enormous thing moving slowly, and everything you touch leans toward you.
- **With Husam's content:** the rolling marquee can carry a *result* ("National Finalist — Congressional Debate —") instead of a name (no name heroes on districts). The magnetic round button is perfect for "Start the clock" and the gavel. The work list becomes the record list.

## 2. joshwcomeau.com (delight, opt-in sound)

- **Look:** white page, sky-blue header `#A0D4EE` with cloud shapes and a 3D mascot; body in Wotfard 16–17px `#0A0C10`; section labels uppercase letterspaced magenta (`ARTICLES AND TUTORIALS`, ~15px, ~0.15em tracking); tags are pale-blue pills. Header icons: search, **speaker (sound toggle)**, theme sun, RSS.
- **Sound, from his use-sound article:** UI controls make sound (theme toggle, the sound toggle itself, the Like button). Volumes are low: `volume: 0.25` for a checkbox, `0.5` for others. The Like button uses **rising pitch**: `playbackRate` starts `0.75` and goes `+0.1` per click. His rules, verbatim: "it's important to include a 'mute' button somewhere on your page, accessible by using keyboard navigation"; "Ideally, no sounds should take place until the user has reached that control in the tab order"; "critical information is never communicated exclusively by sound … Sites should remain 100% usable without sound."
- **Boop / whimsy:** small, springy, reversible transforms (a rotate or scale that snaps back after ~150ms) on hover; delight is a reward for curiosity, never a gate.
- **Memorable because:** the page reacts, and sound is a quiet secret.
- **With Husam's content:** sound starts OFF; the toggle is the first control in tab order; everything synthesized with WebAudio (gavel knock = filtered noise + low sine thump; bell = two sines; crowd = band-passed noise swell). Rising pitch for each result revealed in a row. Applause you can add to, pitch climbing, capped.

## 3. Broadcast graphics (ESPN/NBA/NBC scorebug, NCAA bracket, Olympic results)

- **Scorebug** (SVG "Designing the Modern Scorebug", June 2026): "the signature of the broadcast"; it must "carry the brand and appease the viewer while letting the game remain the star". Modern bugs stripped gradients and 3D; NBC's NBA bug has a "**game assist**" secondary row for records and quick stats that slides out below the main score/clock read. Lower-third info "slides out from the bottom". Operators trigger animations live (the "slam" graphic), so each element enters as a discrete event.
- **Anatomy I'll follow:** a single horizontal bar, flat colors, one chip per side in its team color, big tabular numerals (condensed), the clock in a separate dark cell, period/round in small caps next to it, an assist row that pushes out underneath for 4–6s then retracts.
- **NCAA.com bracket (screenshot):** a **ticker strip across the very top**: a row of ~125px cells each reading `FINAL` (9px caps grey) over two lines: logo, team abbreviation (11px caps), score right-aligned; losers in grey `#999`, winners black. Round header row: `FIRST ROUND 3/20-3/21 … SWEET 16 … ELITE EIGHT`, 11px caps, with a pale grey bar above each column. Game boxes ~220×105, white, 1px `#ddd` border, `FINAL` tiny right-aligned header; seed number small grey before the name; winner row black, loser grey. Connectors are 1px grey right-angle elbows. The page is quiet so the result pops.
- **Olympic results boards (OBS, from memory of the Paris 2024 package):** rank column, name in caps, result right-aligned in tabular figures, small boxed status flags (`Q`, `OR`), gold/silver/bronze discs. Lower thirds wipe in with a color block (≈300ms expo-out), then text rises out of a mask (≈200ms, staggered), hold, and exit in reverse.
- **Memorable because:** information arrives as *events*, one at a time, with a beat.
- **With Husam's content:** each result is a lower third. The scorebug's clock is the Chamber's three-minute speech timer. The bracket becomes a "how far he went" road for each event (qualified → octos → quarters → semis → final), which is only what each title literally says.

## 4. Fight-night posters (Hatch Show Print, Nashville, letterpress since 1879)

- From their own post "A Show Poster by Any Other Name" (Aug 17, 2015): posters tell "stories in forty words or fewer—with the emphasis on fewer"; "Fewer letters mean clearer messages: New Comedians! More Animals! Air Conditioned! Daring Feats Daily!" Hand-carved wood type and blocks; hand-inked layers, "a wonderful range of colors"; printed on a Vandercook. Site itself: near-black textured header, a red `#8B1A2B`-ish roundel logo, slab headings (Clarendon-like caps), red outlined buttons.
- **Boxing poster anatomy (the genre):** a top banner (TONIGHT / ONE NIGHT ONLY), fighter names in the biggest stacked condensed gothic that fits the width, "vs." small in script or a slab, weight class and rounds in a band, venue and date strip, ringside prices at the foot; 2–3 inks (black, red, one blue or yellow), slight misregistration, wood-grain speckle; every line a different size so each word fills the measure.
- **Memorable because:** loud, flat, physical, and every line justified to the edge.
- **With Husam's content:** the undercard is the list of events; "Tale of the Tape" (the stat panel before a fight) is a natural way to set each field size against his placing. A championship belt for the UOP triple.

## 5. The NSDA Congressional Debate ballot (official "Speech Evaluation, Invitational Form", updated 2/2/15)

- Header: `CONGRESSIONAL DEBATE` / big `Speech Evaluation` / italic `Invitational Form`. Fields: `Student Name: School Code:` / `Session: Room: Chamber #:`.
- Directions in bold caps words: "**RATE** each speech 1-6 points, with one being the worst, six being the best". Criteria in caps: ORIGINALITY OF THOUGHT, ORGANIZATION AND UNITY, EVIDENCE AND LOGIC, DELIVERY; and ANSWERS QUESTIONS.
- Each speech block: `SPEECH 1 · Topic: Side: ☐ Sponsor ☐ AFF ☐ NEG`, a comment box, and `Circle Point Rating: 6 5 4 3 2 1` with *highest … lowest* under it.
- Footer: `PRINT Judge Name:` and **RANK THIS SPEAKER** `1st 2nd 3rd 4th 5th 6th 7th 8th None` ("Students not in the top eight will be given a rank of 9").
- Presiding form: `FIRST HOUR OF SERVICE / SECOND / THIRD`, each `6 5 4 3 2 1`.
- **With Husam's content:** the circled rank row is a strong, honest device for a placing (circle "3rd" for Berkeley). No stamps and no signatures (those belong to the Capitol).

## What I take from each
- Dennis: one enormous rolling line; magnetic round buttons with the exact 1.5s Power4/Elastic feel; line-by-line reveals.
- Josh: sound off by default, toggle first in tab order, low volume, rising pitch, never the only signal.
- Broadcast: results arrive as events (lower thirds), a persistent scorebug whose clock is ours, a ticker, a quiet bracket.
- Fight poster: fewer words, bigger; the fight card as a table of contents; Tale of the Tape.
- NSDA ballot: circle the rank.
