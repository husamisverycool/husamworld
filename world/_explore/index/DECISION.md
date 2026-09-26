# THE WORLD, round 2: which direction

Three working prototypes, screenshots in `world/_shots/proto-{a,b,c}-{1440,390}-*.png`.

| | A. Flat road, 2025 polish | B. Tiny planet | C. One slow road |
|---|---|---|---|
| Built on | bruno-simon.com 2025 source (camera, fog, reveal ring, diamond tags, tracks) | Messenger (Abeto) + Bruno's car | Slow Roads + Igloo's continuous intro |
| File | `a.html` | `b.html` | `c.html` |

## Scores (1–5)

| Criterion | A | B | C |
|---|---|---|---|
| Fidelity to its inspiration | 4: FOV 25, phi .27π/theta .25π, speed zoom, two-colour fog, reveal ring, sliding tags, tyre tracks all read as 2025 | 4: title planet with block letters in front, palette atlas, outlines, upright objects on the curve, auto-follow camera | 4: dusk haze, glowing tracked wordmark, pill "begin", chase cam, cruise |
| Ambition and memorability | 2: it is round 1 with better light. A visitor who saw the old page sees the same thing | 5: a planet you can drive all the way around, where the road *is* the shape of the world | 3: beautiful for thirty seconds, then it is a road |
| Fits HIS content (name, photo, contact, Fresno → Cambridge) | 3: the road is a squiggle on a slab; Fresno and Cambridge are just its ends | 5: the road spirals from a Fresno pole to a Cambridge pole; the ground turns from valley gold to New England green as you go; the name is the title and the first thing you knock over | 4: literally Fresno → Cambridge, with a "% of the way" meter |
| Doesn't repeat another page's devices | 4: driving is the World's; but it *is* the previous World | 5: nobody else has a planet, a car, physics or the sky | 2: a long linear journey sits too close to the Pier's super-long descent and the Map Room's strip map of the route |
| Phone quality | 3: the long lens needs a +9 pull-back on portrait, fog swallows the scene unless re-tuned; shadow maps are heavy | 4: the whole static world is one draw call plus one outline pass; the curvature hides distance, so no far-plane or fog tricks; one finger drives | 4: simple, but a 70° FOV on portrait makes the landmarks tiny |
| Never feels bad in any direction | 3: slab edges are dead ends; long empty ground between landmarks | 5: no edges and no dead ends: every direction comes back around, the next landmark is always just over the horizon, and the Map is the planet seen from orbit | 2: you can only go forward; the landmarks are glimpsed, not visited; Cambridge is a dead end |
| **Total** | **19** | **28** | **19** |

## Decision: B, the tiny planet, carrying the best of A and C

The planet wins on the two criteria that matter most for the front door: it is the one thing a visitor will send to
a friend, and it cannot feel bad in any direction, because there is no edge to hit and no end to reach.
It also turns the World's one owned idea into geometry: **one road from Fresno to Cambridge, wrapped around a
world.** The current flat page does not win; it becomes A, and A only contributes parts.

Taken into the build:
- **From Messenger (B's base)**: the title shot (the whole planet, the name in chunky block letters in front of it,
  one slab button), outlines on everything, a single palette atlas that swaps the whole world's mood with the
  visitor's clock, objects upright on the curve, a camera that follows by itself, one-finger touch.
- **From Bruno 2025 (A)**: the reveal ring (here it sweeps colour across the planet from Fresno, in the
  time-of-day reveal colour), diamond tags whose labels slide out as you get close, speed zoom, a camera roll kick
  on crashes, tyre tracks, the name as physical bricks you knock over, right-edge Map / Sound / Clock tabs.
- **From Bruno 2019 (round 1, kept)**: the joystick sets a heading, H honks and hops, R resets, Enter goes in,
  a pad at every landmark.
- **From Igloo / Lusion**: an intro that is one continuous real-time move (the block letters fly down with the
  camera and become the bricks), and a transition into a district that is a camera dive, then a chromatic split,
  then a mask in the district's own colour. No cut to a separate loading screen.
- **From Jesse Zhou**: an adaptive quality step (pixel ratio drops if the frame rate does) and the Map as a
  station camera: the planet from orbit, turning to each landmark you hover.
- **From Slow Roads (C)**: the browser tab's title follows your progress along the road ("Fresno ···●··· Cambridge"),
  and the dusk palette.

Not taken: C's chase camera (it hides the map and the physics), A's slab and shadow maps.

## Content rules for the build
- The World shows only: the name, the photo (Map card and the mailbox letter), LinkedIn + `[email]` with Copy, and
  "Fresno → Cambridge". Fresno and Cambridge appear only as the road's two ends.
- Every tag, sign, ground text and Map line is a teaser written for the hub: no numbers, organisations, bills,
  places or roles. District names ("The Capitol") are allowed as pointers.
