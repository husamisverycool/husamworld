# The Airport, round 2: deciding

Three working prototypes, all with only the Airport's facts (Harvard College and the concentration; Harvard Model Congress Boston and Europe; the Crimson Business Board and South Korea; the fellowships including Hillel and Catalyst; Radcliffe; China Forum; IRC; Leadership Institute). Screenshots: `world/_shots/ev-{a,b,c}-{desktop,phone}-*.png`; the round-1 page is `ev-r1-*`.

- **A** (`a.html`, built by `prune_a.py` from the round-1 page): the ertdfgcvb ASCII globe and split-flap board, pruned. The name field becomes the home program's three-letter word field, cycling `BOS KOR LTU POL HUN PRI EUR` (ISO country codes, not airports). Globe arcs leave only from Cambridge.
- **B** (`b.html` + `picto.js`): Aicher/Vignelli wayfinding. Frankfurt's colour code (blue for air traffic, green for services, white for everything else), 14 pictograms drawn on a 45°/90° square grid, black overhead panels with Vignelli's white band, arrows in their own squares.
- **C** (`c.html`): boarding passes and luggage tags. Thompson's field order, a black route stripe, thermal black plus one red (the Crimson's), a stub that tears off, IATA-style tags on a belt for the Cambridge roles.

## Scores (1–5)

| | A: ASCII globe + flaps | B: Aicher/Vignelli signs | C: boarding pass |
|---|---|---|---|
| Fidelity to its inspiration | 5: a close reading of play.core and the home program | 4: the colour code and grid are right; enamel squares in a web grid lose the architecture | 4: the pass is right; the tags are generic |
| Ambition and memorability | 5: a live globe lit by today's sun, the word field, a board that clacks | 3: handsome, calm, forgettable once scrolled | 3: a nice object, seen before (every travel-themed portfolio has a pass) |
| Fit to HIS content (only owned facts) | 4: five places from one hub is exactly his Harvard year; the campus roles have no geography, so they need the board | 5: the colour code sorts his roles honestly (fly / serve / institutions) and every program gets a sign of its own | 2: the pass forces fields he has no facts for (seat, gate, date), so I had to invent labels like "Stops 3" and fake tag numbers |
| Devices not used elsewhere | 5: ASCII, globe and split-flap are the Airport's by ownership | 5: nobody owns signage or pictograms | 2: a passport-stamp direction collides with the Capitol's rubber stamp, so stamps were dropped before building; what's left is thin |
| Phone quality | 3: the round-1 board scrolls sideways; dense | 4: two-up squares read well; the overhead rail overflowed | 2: 443px overflow, passes too wide, stubs awkward |
| Never feeling bad | 3: the round-1 route was long empty stretches of black between cards; the sticky-globe scroll is also the Plaza's device (sticky scrollytelling) and must go | 4: no dead ends, but a grid of cards reads close to a bento | 2: the "print as you reach it" reveal left passes blank in the full-page capture: exactly the empty state we must never have |

Totals: A 25, B 25, C 15.

## What each one taught
- **A** has the only real moment: a globe you can turn, with a word that changes into a country. It owns its devices outright. Its weaknesses are layout (the sticky scroll route, which is also not allowed now; the side-scrolling board on phones) and a flat, all-gray board where every row looks the same.
- **B** has the best information design. The Frankfurt colour code is not decoration here: it tells you in one glance which programs flew, which were service, which are institutions. And the pictograms give every one of his programs an identity. Its weakness is that as a page it's a card grid.
- **C**'s best idea is small: the order of fields is the order you need them, and thermal print is black plus one red. Everything else either invents data or hides content.

## Decision: A, elevated, carrying B inside it
The winner is **A's world** (everything is characters, a globe, a split-flap board: the devices this page owns) with **B's system built into the board**, the way real boards already did it:

1. **Hero = the ertdfgcvb home program, honestly.** No name. The full-bleed warped three-letter word field, typed over by Gysin's column header. The word is a code: `BOS`, then `KOR`, `LTU`, `POL`, `HUN`, `PRI`, `EUR`. It changes the way the home page changes words, letter by letter through the drum `" ABC…XYZ"`, and **the globe beside it turns to the country the word names and draws that flight from Cambridge**. A "Codes:" column lets you pick one. This replaces the sticky-scroll route (Plaza's device) with a self-contained instrument that needs no scrolling.
2. **The board becomes a real Solari board.** From the Frankfurt Hbf photo: destinations and programs are **word flaps** that step through the column's own drum (you see the other destinations flash by, one clack each), codes are letter flaps, and there is a **pictogram flap** column, as real boards had an aircraft flap. The pictograms are B's Aicher set, on enamel in Frankfurt's colours: **blue** for the four programs that fly, **green** for the service fellowships, **white** for the campus institutions. The colour key is the only legend needed.
3. **Phones get their own board**, not a side-scrolling desktop one: two-line rows (code, destination, pictogram; then the program), all readable at 390px.
4. **From C, only what survives the rules:** fields ordered by what you need first (where, what, as what), and the Crimson's red nowhere at all (a second accent would fight Aicher's colours; the board carries the colour).
5. **From the Crimson/Gazette:** a dateline in the header (Cambridge's date, computed live) and plain, paper-style captions.

Removed from round 1: the U.S. places and their cards, the stealth startup, the IOP, Youth Poll and GRCG rows, the ASCII photo, contact and copy button, the name hero, the sticky route, the sound toggle (sound toggles belong to the World, Chamber and Garage only), and the "skip intro" wording (now "land now").
