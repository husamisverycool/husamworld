# husam.world: the plan

One world, many places. The front door is a 3D world you drive around (after Bruno Simon's folio). Every landmark in it is the entrance to a **district**: a full page about one part of Husam's life, each built as a close, ambitious homage to one specific site from his inspiration list. Each district looks nothing like the others.

This is inspiration-led, not investor-led. The goal is a site people send to each other because they've never seen anything like it, and which, district by district, shows how much he does.

## Files (all in `world/`)
| File | District | About | Inspiration (study it live) | Status |
|---|---|---|---|---|
| `index.html` | **The world** (hub) | Who he is, the map of everything, contact | bruno-simon.com (the 2019 folio: github.com/brunosimon/folio-2019) | new |
| `bill.html` | **The Capitol** | Advocacy and legislation: five CA bills, Congress, LegislativeLift, NSDA legislation | GPO bill typography + gwern.net popups | built (round 1) |
| `translation.html` | **The Bridge** | Arabic ↔ English, White House in Arabic, press | facing-page bilingual editions + jhey.dev | built (round 1) |
| `n1.html` | **The Polling Station** | Research: Youth Poll, IOP, econometrics, consulting | pudding.cool | built (round 1) |
| `speech.html` | **The Chamber** | Debate, speech, Mock Trial | dennissnellenberg.com motion + the debate round | built (round 1) |
| `triptik.html` | **The Map Room** | Roots and the route: Fresno → Cambridge | AAA TripTik + bruno-simon.com car | built (round 1) |
| `os.html` | **The Garage** | Building things: Electric Deals at 14, bayloop, the stealth startup, startup grants | henryheffernan.com + dustinbrett.com (daedalOS) | new |
| `depths.html` | **The Pier** | Honors, as rarity: 1 in 105,000 | neal.fun/deep-sea | new |
| `weeks.html` | **The Plaza** | How much he does at once: every week since 2015 | waitbutwhy.com "Your Life in Weeks" + pudding.cool | new |
| `everywhere.html` | **The Airport** | Harvard institutions and travel: Crimson camps (South Korea), Model Congress Boston & Europe, Hillel tour (Lithuania, Poland, Hungary), Catalyst (Puerto Rico), fellowships | play.ertdfgcvb.xyz (Andreas Gysin's ASCII) | new |

Landmarks in the world, in order along one road (the world is his route, Fresno to Cambridge):
Fresno start (name letters fall here; Food Bank crates to knock over) → **Capitol dome** (bill) → **Lectern and gavel** (speech) → **Bridge with English signs on one side and Arabic on the other** (translation) → **Giant dot-plot / polling booth** (n1) → **Old gas station map kiosk** (triptik) → **Garage with a CRT inside** (os) → **Pier with a diving board over dark water** (depths) → **Plaza of floor tiles that light up as you drive over them, one per week** (weeks) → **Airport with a wireframe globe** (everywhere) → **Mailbox** (contact: bump it to copy the email).

## Contract every page follows
- **One self-contained HTML file.** Inline CSS/JS. Google Fonts only for fonts. Scripts only from cdnjs.cloudflare.com or cdn.jsdelivr.net/npm, pinned, UMD builds. No other network requests. Images drawn in code or embedded as data URIs.
- **Facts:** `versions/CONTENT.md` only. Nothing invented (facts, numbers, quotes, opinions). Stealth rule: only "Co-founder & CEO of a stealth startup, backed by DoorDash's early team" and "Spent summer 2026 building it full-time in San Francisco". Email is `[email]` (visible text plus a copy button).
- **Photo:** `versions/assets/husam-new.jpg.b64` (his real headshot) as a data URI.
- **Intros** play on every visit (no localStorage/sessionStorage anywhere; `history.scrollRestoration='manual'`), are skippable, and are skipped for `prefers-reduced-motion`. **Exception:** if the URL hash starts with `#from-`, skip the intro (the visitor is returning from a district).
- **Keep the bottom-left 72×72px corner free** on every district page. A shared "back to the world" button is injected there afterwards.
- **Readable at rest:** every word of content is in the DOM and readable without interaction. Works at 390px and 1440px, no sideways scroll. Visible focus. Respects reduced motion.
- **Not like AI:** see `versions/BRIEF-RULES.md`, "Not looking like AI". Use the typefaces, colors and conventions of the site you're paying homage to (or the closest Google Fonts match), not your defaults.
- **Accuracy to the inspiration is the point.** Before designing, study your reference live (Firecrawl scrape with screenshot/html/branding, and the GitHub source when there is one). Write down the concrete specifics (layout, measurements, colors, type, motion, interaction details, copy tone) in `world/_study/<file>.md`, then build to that level of fidelity with Husam's content. It should be recognizable as a loving homage, better than a knockoff, and never a copy of their words or branding.
- **Check once:** screenshots at 1440×900 and 390×844 plus a console-error check. Fix what you see in one pass. Report back.
