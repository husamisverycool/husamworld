# Study, round 2: The Pier (`depths.html`)

Studied 2026-09-26. Firecrawl (screenshots, HTML, branding, markdown) for everything live; most direct
downloads (Wikimedia, BHL, Smithsonian) are blocked by the sandbox egress, so plate images came
through Firecrawl screenshots. Reference screenshots: `world/_shots/depths-r2/ref/`.
Round-1 notes on neal.fun/deep-sea stay in `world/_study/depths.md` and still apply; below is what's new.

## 1. neal.fun/deep-sea (re-read against the round-1 build)
- What still carries the page: the linear scale (every unit of depth costs the same scroll), the sticky
  counter at `bottom: 18%` with its dashed rule, lilac `#eabdff` zone titles in Oswald 700 48px, cream
  `#f7f1e3` uppercase names, white Oswald 24px blurbs, and the long empty stretches with jokey one-liners.
- The ending is quiet: sand gradient `#ede5ce → #b5ad9a`, the title repeated in navy `#2c2c54` 76px, credits,
  one link. No summary of what you saw. **That's the gap to fill**: the dive has no recap, and the old Pier
  ending filled it with his photo and contact, which now belong to the World.
- With Husam's content: the deepest point is now NSDA Student of the Year (86 from 140,000+ = 1 in 1,628),
  which is his own. The scale shrinks from 2,500 to 1,628 units, so the page is about 35% shorter.

## 2. neal.fun "The Size of Space"
- Title slide: black `#000`, title Roboto 700 ~76px white, "Made by Neal Agarwal" 500 ~28px, instruction
  line in grey `#555`-ish at ~26px, "Use the Right Arrow Key or Swipe Left to Start" plus an arrow sticker.
  Three emoji-style planets float at random around it (canvas).
- Mechanic: one object per step. Right arrow / swipe advances; the three.js camera eases out so the new,
  bigger object fills the frame and the previous one shrinks to a dot beside it. The DOM holds only
  `.item-description` (`.item-title` + `.item-type`) pinned bottom-centre. End slide repeats the title
  with a quote and the same credit block as deep-sea.
- Memorable because: the zoom *is* the comparison; you feel each jump in scale as the last thing shrinks.
- With Husam's content: each honor as one lit point in a crowd the size of its pool; zoom out as the crowd
  grows from 4 to 1,628. Risk: one item at a time hides everything else (fails "complete at rest").

## 3. neal.fun "Spend Bill Gates' Money"
- 1000px column on `#f1f2f6`; white header card with a round portrait and the title (Roboto 700 ~32px);
  a **sticky green money bar** (`#2ecc71 → #1abc9c`, white 700 ~34px) that counts down as you buy;
  3-column grid of white item cards (image ~130px, name 700 22px, price in green 500 20px, Sell / count / Buy).
  Items are sorted cheapest to dearest. Ending: a receipt listing everything you bought and the total.
- Memorable because: the running total, and the receipt at the end that turns play into a tally.
- Taken: **the ending as a tally of everything you passed**, and ascending order as the organising idea.

## 4. The Pudding, "The Largest Vocabulary in Hip Hop" (Matt Daniels)
- Header: Atlas Grotesk light ~76px `#282828`, dek in grey 500 ~20px, byline, a pale-yellow `#fffdc0` date
  chip. Body in Publico Text ~19px, 640px measure.
- The chart: a full-bleed `#f7f7f7` band, title "# of Unique Words Used Within Artist's First 35,000 Lyrics"
  (~32px light), a horizontal axis with **dotted vertical gridlines** labelled with a bold number and a light
  unit ("**3,000** words", "4,000", "5,000", "**6,000** words"), and each rapper as a small round head placed
  at his exact value; crowded values stack. Controls: an "All / Just [Wu-Tang]" toggle and a "Find an Artist"
  select. Then a second, binned beeswarm by era.
- Memorable because: every face sits at its exact value on one axis, so you read rank and gaps at once.
- Taken: the **one-axis recap** idea (every honor at its exact odds, bold number + light unit labels).

## 5. Ernst Haeckel, *Kunstformen der Natur* (1899–1904), Tafel 8, Discomedusae
- 100 plates issued in sets of ten, lithographed by Adolf Giltsch. Themes: symmetry and levels of
  organisation; figures arranged "for maximum visual impact".
- Plate 8 anatomy (seen at biolib.de): ivory paper `#f6efe0`; a running head in small italic serif,
  author left ("Haeckel, Kunstformen der Natur."), plate right ("Tafel 8 — Desmonema."); a single thin
  rule frame inset from the edge; 4 figures, each numbered with a tiny Arabic numeral set near it (1, 2, 3, 4),
  arranged around a central axis with the big one diagonal across; caption centred under the frame in
  letterspaced roman: Latin group name, an em dash, then the vernacular ("Discomedusae. — Scheibenquallen.").
  Palette: carmine `#c8475c`, slate blue `#8fa3b8`, saffron `#e8a33a`, rose `#f1b7a8`.
  A facing "Erklärung" page lists each figure by number with its name and notes.
- Memorable because: symmetry and density turn a list of organisms into one designed object.
- Taken: **the plate as a composition**: running head, rule frame, numbered figures around an axis,
  "Latin. — Vernacular." caption, and a numbered legend. Not taken: the cream-and-serif typography
  (too close to a banned look, and a facing-page layout is the Bridge's device).

## 6. Natural-history specimen labels (Smithsonian NMNH / AMNH conventions)
- Direct pages were blocked; working from the NMNH collection-search field set seen in search results
  (Catalog Number "USNM", department, taxon, locality) and standard label practice: a small card, thin
  border, catalogue number first and largest, the name, then provenance lines in small type. One label per
  specimen, same format every time, which is what makes a drawer read as a *collection*.
- Taken: a **catalogue number on every specimen** (No. 1 to No. 21) that matches its figure number in the
  closing plate, so the dive and the plate index each other.

## 7. Josh Worth, "If the Moon Were Only 1 Pixel" (a scroll-length classic)
- Horizontal, one pixel = one Moon; ~886 screens wide. Between planets, short dry asides at irregular
  intervals ("Pretty empty out here.", "Halfway home."), metaphors for the distance, a bottom bar of planet
  icons to jump, and a **light-speed button** that auto-scrolls at c so you can feel the true pace.
- Memorable because: the emptiness is the content, and the auto-travel makes the scale physical.
- Taken: **a "let go" sink control**: you stop scrolling and sink at a steady pace, any input takes back
  control. It's the Pier's version of travelling at light speed.

## What this means for Husam's content
- Rarity is the only axis that matters here, and depth expresses it best (a) because it's linear: a 1-in-700
  honor really does sit twice as far down as a 1-in-350 would. The Size-of-Space zoom (c) makes the pool
  visible as a crowd, which the dive never did. The Haeckel plate (b) gives the ending its form: one
  composed sheet of everything, numbered, instead of a photo and contact block.
