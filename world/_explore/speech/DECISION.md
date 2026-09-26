# The Chamber, round 2: decision

Three working prototypes, each on a different reference. Screenshots: `world/_shots/speech-r2-{a,b,c}-{1440,390}-{top,full}.png`.

- **A, "Three Minutes"** (dennissnellenberg.com + the timekeeper). Grey `#999D9E` hero, a 216px rolling line ("National Finalist —") that reverses with scroll direction, Dennis's magnetic round buttons (1.5s Power4 in, Elastic out, strength 100/50), line-by-line word reveals, a rewritten speech made only of results, flip time cards (3 · 2 · 1 · 30 · STOP) pinned bottom right, and a Dennis work-list "record".
- **B, "Tournament Night"** (ESPN/NBC scorebug, NCAA.com bracket and ticker, Olympic lower thirds). A white NCAA-style results ticker, a slanted-stripe studio open, a fixed scorebug (network · event chip · round · 3:00 clock · n/10), one full-screen "shot" per result with a lower third that builds in (color chip, name bar, big result, gold "game assist" strip), and a "how far he went" road chart.
- **C, "Fight Card"** (Hatch Show Print letterpress + boxing posters). A yellow-stock wood-type poster with red/blue/black inks and misregistration, "Main Event: Congressional Debate at the NSDA National Final", an undercard grid, a Tale of the Tape table (field vs. finish), and a championship belt for the UOP triple.

## Scores (1–5)

| | A: Three Minutes | B: Tournament Night | C: Fight Card |
|---|---|---|---|
| Fidelity to inspiration | 4: the roll, the magnets and the reveals are Dennis's own numbers | 4: scorebug anatomy, ticker and lower thirds read as broadcast at once | 5: reads as a real fight bill at a glance |
| Ambition, memorability | 3: beautiful but quiet; a speech is still a wall of reading | 4: the scorebug is a signature; but ten identical shots | 5: the poster is the thing people will screenshot |
| Fit to HIS content (only Chamber facts) | 2: every fact is a result, so a speech made of results just restates the record in sentences; the old speech's organizing/startup/institutions are gone and there is no opinion I may invent to replace them | 5: every fact *is* a result with a round and a field; lower thirds and the round road say exactly what the titles say | 5: the fight card is literally a list of bouts, and Tale of the Tape is the field sizes |
| Not repeating other pages' devices | 5 (timers, flip cards, gavel are ours) | 4: ticker is not split-flap (Airport), road chart is not a research chart (Polling Station) | 4: no stamps or signatures (Capitol); the belt is not a specimen (Pier) |
| Phone quality | 4 | 3: ten 88vh shots are a long thumb; bug has to dodge the globe corner | 5: a poster is already a tall narrow thing |
| Never feels bad | 3: reading speed vs. the timer is awkward; reveal-on-scroll starts words hidden | 2: repetitive, lots of empty navy, lower thirds start hidden | 4: dense but loud; nothing moves, so it needs life |

## Decision: combine C + B, driven by A's motion and our timer

**Fight night in the Chamber.** The poster (C) is the hero: it is the most memorable object and it lists every bout in the fewest words, as Hatch's "forty words or fewer" asks. Then you go inside and watch the night as a broadcast (B), but not ten identical shots: each segment uses a *different* broadcast graphic (a round-by-round road for the main event, Tale of the Tape for fields, a belt reveal for the UOP triple, an NSDA ballot with the rank circled for Berkeley, a two-up lower third for the council and TED). A's Dennis motion runs through it: the rolling line under the poster that flips with scroll direction, magnetic round buttons (Ring the bell, the gavel), and word-mask reveals that only ever *replay* on visible text.

The speech is **dropped**. Every Chamber fact is a result; a three-minute speech built only from results would say the record twice, and anything more would be invented opinion. What stays from A is the timekeeper: the scorebug's clock is a **flip card** that runs 3 → 2 → 1 → 30 → STOP as you move through the night, and the page ends on STOP and the gavel. The intro is the timekeeper holding up the cards (3, 2, 1, TIME) in about two seconds.

Unifying the two worlds: the broadcast package is "printed" from the poster's inks (stock yellow `#F2C230`, ink `#151515`, red `#C8102E`, blue `#1F3A93`) on a dark arena wall, so the TV graphics look like they came from the same fight promotion. Fonts: Anton and Alfa Slab One (wood type), Rye (the "vs." ornament only), Barlow Condensed + Barlow (broadcast).

Rules I'm holding myself to after the prototypes:
- Everything visible at rest (B and A both started text hidden; the final only animates text that is already on screen, or replays on demand).
- Sound off by default; the toggle is the first control in tab order; every sound has a visual twin.
- No fact outside the Chamber list; no dates except the ones given (Council 2024–25, TED 2023).
