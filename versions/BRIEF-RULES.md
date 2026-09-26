# Rules every version follows

You are building ONE version of Husam Sokar's personal website. Read `versions/CONTENT.md` first; it is the only source of facts.

## Output
- One self-contained file: `versions/<your-folder>/index.html` (full HTML document with <!doctype html>, <title>Husam Sokar</title>). All CSS and JS inline.
- Fonts: Google Fonts only (fonts.googleapis.com), each with a real fallback stack. Scripts only if truly needed, pinned from cdnjs.cloudflare.com. No other external resources: no external images, no iframes, no fetches.
- Photo: `versions/assets/husam.jpg.b64` holds the base64 of his headshot. Embed as `data:image/jpeg;base64,...` (insert it with a small shell/python step, don't retype it). Treat it as a placeholder.
- Don't commit or push; the lead will.

## Facts
- Use only CONTENT.md. Never invent facts, numbers, quotes, testimonials, links, or dates. Curate: you don't need every item, but what you show must be exact.
- Stealth startup: say "Co-founder & CEO of a stealth startup, backed by DoorDash's early team" (and summer 2026 in San Francisco). Nothing about product, customers, or money raised.
- Email is unknown: show `[email]` as plain visible text. No mailto-only contact. LinkedIn URL is real and may be linked.
- Leave a short HTML comment `<!-- PLACEHOLDER: ... -->` next to anything he must supply.

## Not looking like AI (this matters most)
Banned fonts: Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Space Grotesk, Space Mono, Geist, Instrument Serif, Fraunces, Playfair Display, DM Sans, DM Serif, IBM Plex (any), JetBrains Mono, Manrope, Outfit, Syne, Cormorant.
Banned looks: warm cream + serif + terracotta; near-black with one neon/acid accent; purple-to-blue gradients; glassmorphism; emoji anywhere; rounded cards with drop shadows on everything; bento grids; a centered hero of big name + tagline + two buttons; opening with a row of big-number stat tiles; "01 / 02 / 03" markers unless the order is real information; accent bars on card edges; generic icon sets.
Banned copy: "passionate", "leveraging", "impact-driven", "journey", "I'm a [X] who loves [Y]", "Hi, I'm Husam 👋", "Let's connect!", "crafting", "elevate". Write plainly and specifically, the way a sharp person talks.
Your concept brief below gives a specific visual world. Commit to it fully; the design should only make sense for Husam. Take one real risk.

## Craft
- Works at 390px phone width and 1440px desktop. No horizontal page scroll. Side gutters ≥16px.
- Complete at rest: all content is readable on load without clicking or waiting. Interaction adds delight, never hides the only copy of information. Nothing starts at opacity:0 waiting for scroll.
- Respect prefers-reduced-motion. Visible keyboard focus. Semantic HTML (headings, lists, links). Real <a> links for external URLs with target="_blank" rel="noopener".
- One deliberate visual world; you may commit to a single theme (no dark mode needed) but set body background and all colors explicitly.
- No print buttons, no alert/confirm/prompt, no localStorage dependence.
- Keep it fast: no heavy libraries; canvas/SVG by hand is fine.

## Check once, then stop
Serve the folder (python3 -m http.server) and take ONE pair of screenshots with Playwright (global install: `require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')`; Chromium is preinstalled; Google Fonts may be blocked in this sandbox, which is fine). Desktop 1440×900 full page, and phone 390×844 full page. Also log any page errors. Fix what you see in one pass. Don't loop. Save screenshots in your folder as `shot-desktop.png` and `shot-phone.png`.

## Report back (short)
1. The concept in two sentences. 2. Fonts and palette used. 3. The one risky/signature interaction. 4. Every placeholder he must fill. 5. Any fact you weren't sure how to phrase.
