# Round 2: how every page gets made

Husam's direction: **more ambitious, inspiration first, over and over; try several directions and deduce the best; never repetitive; never feels bad in any direction; no corners cut.**

Read, in order: `world/WORLD.md` (the world and the page contract), `world/OWNERSHIP.md` (which facts and devices are YOURS; binding), `versions/CONTENT.md` (the only source of facts), and "Not looking like AI" in `versions/BRIEF-RULES.md`.

## The process (do every step; write each one down)
1. **Study (inspiration first).** Study at least four references in depth: the ones named in your brief plus any others you find that fit better (Awwwards, godly.website, siteinspire, the FWA, CSS Design Awards, Codrops demos). Use the Firecrawl tools (scrape with `screenshot`, `html`, `branding` formats; read GitHub source where it exists). If a tool fails, use `curl` through the proxy or WebFetch. Write concrete specifics in `world/_study/<page>-r2.md`: exact type, sizes, grid, colors, motion curves and durations, interaction mechanics, copy tone, and what makes each one memorable. Note what each would look like with Husam's content.
2. **Explore (try it all out).** Build 2–3 genuinely different directions as real, working, quick prototypes in `world/_explore/<page>/a.html`, `b.html`, `c.html`. Each one is built on a different reference or combination of references, not a variation on one idea. Screenshot each at 1440 and 390.
3. **Deduce.** In `world/_explore/<page>/DECISION.md`, score each direction against:
   - fidelity to its inspiration;
   - ambition and memorability;
   - how well it fits HIS content (only the facts you own);
   - not repeating any other page's devices (see OWNERSHIP.md);
   - phone quality;
   - never feeling bad in any direction: no dead ends, no confusion, no jank, no empty states, no walls of text.
   Pick one, or combine the best parts, and say why. If the current page wins, say that honestly and elevate it.
4. **Build** the chosen direction to its most ambitious form, replacing `world/<page>.html`. Fidelity to the inspiration is the point: study again whenever you're unsure, rather than guessing.
5. **Audit.** Run `python3 world/_shared/audit.py`. Your page must not appear in any "mentions" line as the offender (you only show your own facts). Also remove from your page any sentence that restates another page's content. Shared-phrase lines involving other pages that are still being rebuilt are fine, as long as your page contains only its own facts.
6. **Check** at 1440×900 and 390×844 (a phone emulation with touch, isMobile), plus a console-error check, plus reduced motion. The CDNs are blocked in this sandbox. For three.js and cannon, serve the local copies in `/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/libs/` via Playwright `context.route`. Fix everything, then check again once.

## Page rules (unchanged from WORLD.md, plus these)
- No photo, contact block, email, LinkedIn or copy-email button on district pages (only the World has those). No name hero on district pages. The stealth startup appears ONLY in the Garage.
- Keep the bottom-left 72×72px free (the injected globe button). Intros are optional; if you have one, it must be a device only your page uses, replay on every visit, be skippable, and be skipped for `#from-` hashes and reduced motion.
- Keep the `<!-- world-nav:start --> ... <!-- world-nav:end -->` block if it is present (or leave it out; the lead re-injects it).
- Don't commit; the lead commits. Keep scratch work in `world/_explore/<page>/` (checked into git) and screenshots in `world/_shots/` (ignored).

## Report back
The references you studied and the one thing you took from each; the directions you tried and why the winner won; what's in the final; placeholders; any facts you were unsure of.
