# Rules for the ten final designs

Read, in this order:
1. `versions/NARRATIVE.md`: the story, what leads, what to leave out, the stealth rule, the voice. Binding.
2. `versions/CONTENT.md`: the only source of facts. Never invent facts, numbers, quotes, testimonials, opinions or beliefs; use `[Husam: …]` placeholders where his own words are needed.
3. `versions/BRIEF-RULES.md`: output, craft, banned fonts, looks and copy, the check-once step, and the report format. All still apply, with these changes:
   - Output goes to `versions/final/<NN-slug>/index.html`, as one self-contained file. Keep `<meta charset="utf-8">` and `<title>Husam Sokar</title>`.
   - Photo: use `versions/assets/husam-new.jpg.b64` (his real color headshot). You may style it (duotone, halftone, crop) if the concept calls for it.
   - Any intro or opening moment plays on EVERY visit. Never gate it with localStorage or sessionStorage. Set `history.scrollRestoration='manual'` and start at the top unless the URL has a #hash. Skippable, and skipped for prefers-reduced-motion.
   - Don't store preferences between visits (no localStorage at all).

## Ambition bar
The user wants the most ambitious sites on his original list as the bar: bruno-simon.com (a physical world you play with), henryheffernan.com (boot into a machine), dennissnellenberg.com (huge type, square corners, a multi-language loader, magnetic buttons), rauno.me and emilkowal.ski (tiny perfect interactions, springs, "Copied" states), jhey.dev (cursor play), lynnandtonic.com (the layout transforms as you resize), gwern.net (hover popups), pudding.cool (scrollytelling), neal.fun (toys), joshwcomeau.com (opt-in synthesized sound). Take the specific techniques your brief names from those sites and execute them with Awwwards/godly.website-level polish, while keeping the whole page readable at rest, working on a phone, and fast.

## Taste for a VC audience
It should feel like the personal site of a founder whom top seed investors already want to meet: confident, specific, well-made, and restrained where it counts. Spectacle is great if it serves the story. The first screen must say who he is and what he's doing now within about 5 seconds.
