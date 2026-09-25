# husam.world — the design reasoning

This is the reasoning behind the site: what I took from ~150 of the best personal
sites and galleries, what I left out, and how it all adds up to one idea.

---

## 1. What the great sites have in common

After going through the list (Bruno Simon, Rauno, Paco, Emil Kowalski, Josh Comeau,
Lynn Fisher, Brittany Chiang, Gwern, Maggie Appleton, Frank Chimero, Henry Heffernan,
dustinbrett, Devine/XXIIVV, neal.fun, Neocities, danluu…), almost every memorable
personal site does one of two things:

| Type | Examples | Strength | Weakness |
|---|---|---|---|
| **The spectacle** | bruno-simon.com, henryheffernan.com, dustinbrett.com, the Awwwards WebGL crowd | You remember it forever | Slow to find the actual information. A recruiter with 40 seconds leaves. |
| **The reading room** | brittanychiang.com, danluu.com, gwern.net, frankchimero.com, sive.rs | Clear, fast, all about the writing | Great content, but it looks like thousands of other sites. |

The sites that stay with people are the ones that manage both. Josh Comeau does it
with little delights inside serious writing. Maggie Appleton does it by making the
*structure* (a garden) the memorable part.

**So the rule became: the fun part can never cost you anything, and it has to be
built out of the real content, not stuck on top of it.**

## 2. The idea: one site, two lenses

The domain gave me the idea: **husam.world**. So the site *is* a world, a tiny
floating island. Each part of your life is a building:

| Building | Section | Why that building |
|---|---|---|
| Town Hall (with a working clock) | Home / about | The center, where you start |
| The Workshop (chimney smoking) | Projects | Where things get made |
| The Library | Writing | Where the long pieces live |
| The Garden (greenhouse) | Notes in progress | Maggie Appleton's digital garden, taken literally |
| The Observatory (on a hill) | Experiments / lab | Looking at far-off things |
| The Lighthouse | /now page | A signal of where you are right now |
| The Post Office | Contact | Send a postcard |

Click a building and **a little version of you walks down the paths to it**
(a nod to Bruno Simon), then the content slides in.

The **Read** button (or ⌘K) switches to a clean, fast, text-first page, the same
content laid out like a Brittany Chiang or Frank Chimero site. There is **only one
copy of the content**: plain, semantic HTML sections. The island is *generated from
those sections* by JavaScript. So:

- Recruiters, search engines, screen readers, people without JavaScript, and printers
  all get the plain page.
- Add a `<section data-building="…">` and it shows up on the island.
- Nothing about the island is typed out by hand, so it can't drift out of date.

## 3. The feature that makes it unique: it's *your* local time

Most sites have a dark-mode toggle. On this one, **the island uses the visitor's own
clock**. At 7am it's dawn over the water. At 9pm the windows glow, the stars are out,
and the lighthouse beam sweeps the sea. The Town Hall clock shows the real time.
A time dial lets people drag the sun around.

Two people opening the site at different hours see different versions of it, and
that alone makes people want to send it to someone. It's also cheap to build:
one time value moves a handful of CSS variables.

## 4. Where each detail came from

| Detail | From | How it shows up here |
|---|---|---|
| A world you explore instead of a menu | Bruno Simon, Henry Heffernan, dustinbrett | The island; a character walks to each place |
| Every spectacle has a way out | Brittany Chiang's "who, what, where in 3 seconds" | Read mode; phones start in Read mode |
| Greeting in many languages | Dennis Snellenberg | A 1.3s hello → hola → مرحبا → …, once per visit, click to skip |
| Rotating "X is…" tagline | Jessica Hische | "Husam is <rotating>" |
| Command menu | Rauno, Paco, Linear, Raycast | ⌘K / `/`: jump anywhere, change the time, toggle sound |
| Hover previews for links | gwern.net, Wikipedia | Links inside the site show a preview card |
| Growth stages + backlinks | Maggie Appleton, Andy Matuschak | Garden notes marked seedling/budding/evergreen; "Linked from" is worked out automatically |
| Tiny sounds, off by default | Josh Comeau | Synthesized in the browser (no audio files): footsteps, chimes, hover ticks |
| Small, careful motion | Emil Kowalski, Rauno | Short, springy, and turned off entirely when *prefers-reduced-motion* is set |
| Hand-built and small | danluu, sive.rs, Low-Tech Magazine | No framework, no build step, no trackers, three files |
| A /now page | Derek Sivers (nownownow.com) | The Lighthouse |
| Webring, colophon, guestbook | IndieWeb, Neocities, personalsit.es | Footer webring, colophon, a postcard contact form |
| Secrets in the source code | Old web tradition | ASCII art in the HTML source; typing certain words does things |
| Generative art instead of stock photos | Zach Lieberman, ertdfgcvb | Project covers are generated from the project's name until you add real images |
| Readable type | Frank Chimero, rsms, Craig Mod | Instrument Serif headings, Geist for text, about 68-character lines |
| Prints like a résumé | Old-school CSS craft | The print stylesheet hides the island and prints the reader page cleanly |
| Seeded, reproducible world | Generative art (fxhash, Processing) | The island's shape comes from the seed `husam.world`, so it's always the same island |

## 5. What I left out on purpose

- **Heavy 3D (Three.js/WebGL).** It looks great in screenshots but loads slowly and
  drains phone batteries. The island is hand-drawn SVG and loads almost instantly.
- **Custom cursors and scroll-jacking.** These are the Awwwards habits people find
  most annoying. Scrolling works normally everywhere.
- **Long loading screens.** The greeting is the only intro. It lasts about 1.3s,
  shows once per session, and can be skipped.
- **Pretend "live" features.** No fake visitor counts or fake Spotify widgets.
  The section below lists the ones worth building for real.

## 6. Next steps (in order of how much they'd add)

1. **Your real content**: see `README.md`. This matters more than anything else on this list.
2. **Real project images**: swap each `.thumb` for an `<img>`.
3. **Seasons**: snow on the island in December, cherry blossoms in April. Same
   trick as the time of day, driven by the date.
4. **Live presence**: other visitors show up as tiny figures walking around.
   Needs a small websocket service (e.g. PartyKit or Cloudflare Durable Objects).
5. **Real guestbook**: postcards pinned on the Post Office wall, stored in a tiny
   database (Supabase, or a GitHub-issues-backed form).
6. **Garden dates from git**: note ages ("planted 3 months ago, last tended 2
   days ago") taken from the commit history at deploy time.
7. **ASCII lens**: a third mode that draws the island in text characters, like ertdfgcvb.xyz.
