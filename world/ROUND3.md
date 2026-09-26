# Round 3: refine to perfect

Husam loved round 2. He does not want new concepts. He wants **every page honed until it is flawless and unmistakably its inspiration**: "Don't change it, but change it in a way that makes it all really, really good." Keep the direction, the facts you own and your signature device. Raise every detail.

**Not radical.** Husam repeated it: "the direction you were going in was good... I don't want anything so radical that it goes out of that direction... the gist is really, really good." So you are not redesigning.
- Do: keep the layout, concept, structure and signature interactions. A visitor who saw round 2 should recognize the page instantly and think "it got so much better."
- Do: think deeply and ambitiously *within* that direction. Pull it closer to its references, perfect every detail, and fix every flaw.
- Only replace an element when it is on the anti-AI list below or is broken, and replace it with what the reference does in that exact spot.

Read first, in order:
- `world/WORLD.md`
- `world/OWNERSHIP.md` (still binding: only your facts, only your devices)
- `versions/CONTENT.md` (the only source of facts)
- `versions/BRIEF-RULES.md` ("Not looking like AI")
- your own `world/_study/<page>-r2.md` and `world/_explore/<page>/DECISION.md`
- `world/_study/ORIGINAL-INSPIRATION.txt`: the list Husam himself put together. It is the root of everything. Re-read it and check your page against the sites in it that fit.

## What he said, and what it means for you
1. **"Rely solely on the inspiration, not on your own sense of what a good website looks like."** For every visible decision (type, case, size, spacing, color, labels, buttons, motion, microcopy), ask: *which real reference does this come from?* If you can't name it, it came from your defaults, and it goes. Go back to your references live (Firecrawl scrape with `screenshot` + `html`; read GitHub source where it exists) and compare side by side, detail by detail. Write the comparison in `world/_study/<page>-r3.md`: each difference you found and what you changed.
2. **"None of it can look like AI."** He named exactly what gives it away. Remove all of these unless your reference literally does it (then quote the reference's CSS in your r3 study as proof):
   - Small letterspaced ALL-CAPS "eyebrow" labels above headings; ALL-CAPS section titles; `text-transform: uppercase` + `letter-spacing` as a decorative habit.
   - A big display title of the district's name ("The Bridge") in a fashionable serif or display face. The district name is a place in the world, not a page headline. A page opens the way its reference opens.
   - Generic UI furniture: pill tags, rounded cards with shadows, dark glassy panels, "• you are here" dots, chevron + label buttons, emoji, icon sets, gradient text, neon-on-black.
   - Decorative numbering, fake metadata, filler microcopy ("Scroll to explore", "Click to learn more").
3. **"Text never goes out of frame, above something, or on top of something it shouldn't."** No text is clipped, cut off, off-screen, or overlapping other text, and no element blocks another, at any width or scroll position. This is tested by machine:
   - `node world/_shared/qa.js <page>` checks 360/390/768/1024/1440/1920 at every scroll stop. It needs `cd world && python3 -m http.server 8820` running; start it if `curl localhost:8820` fails.
   - **Your page must reach 0 issues.** `offscreen-in-scroller` counts too: a sideways scroller must look like one on purpose and be what the reference does, and otherwise the content should wrap.
   - `data-qa-ignore` is only for deliberate effects the reference has (say which one in a comment next to it).
   - Also look with your own eyes at 390×844 and 1440×900 screenshots at several scroll points, because the machine can't judge beauty or a line of text crashing into a drawing.
4. **"Phrasing should sound very impressive, but still accurate."** Copy pass on every word:
   - Lead with the strongest true fact: scale, selectivity (1 of N), outcomes, firsts, youngest.
   - Use active, concrete verbs, the role title as held, and real numbers from CONTENT.md.
   - Cut hedges ("helped", "assisted with", "was involved in") unless they are the truth.
   - Never inflate: no new numbers, no claims CONTENT.md doesn't support, no invented quotes.
   - No banned copy words.
   - Write in the voice of the reference (a bill speaks like a bill, a museum label like a museum label).
5. **"Stupidly ambitious."** Once the page is correct and faithful, find the detail the reference is famous for that you haven't matched yet, and match it. Examples: the exact easing, the exact cursor, the exact hover, the real sound, the small interaction nobody asked for. Think in terms of Rauno, Paco and Emil-level craft on the micro scale.
6. **Every direction feels good:** no dead ends or confusion, no jank (check that scroll stays smooth), no empty states, no walls of text, and it works with touch, keyboard and reduced motion. Intros replay every visit, are skippable, and are skipped on `#from-` hashes.

## Rules unchanged
- Contract: one self-contained HTML file. Google Fonts only. CDN scripts only from jsdelivr/cdnjs, pinned.
- No localStorage or sessionStorage.
- Keep the UTF-8 meta charset.
- Stealth rule, `[email]` only on the hub, the photo only on the hub.
- **Don't touch the `<!-- world-nav:start --> … <!-- world-nav:end -->` block, and don't run `inject.py`.** The switcher is being redesigned separately; the lead re-injects it. Its closed state stays inside the bottom-left 72×72px, so keep that corner free of content at rest.
- Run `python3 world/_shared/audit.py`. Your page must not be the offender in any line, and must share no 7-word phrase with another page.
- Don't commit; the lead commits.
- Screenshots go to `world/_shots/`. For three.js/cannon, route the CDN to `/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/libs/` (see how `world/_shared/qa.js` does it).

## Report back (short)
- What you compared against, and the 5–10 most important changes.
- The before and after QA counts; final must be 0.
- Anything in CONTENT.md you were unsure how to phrase accurately.
