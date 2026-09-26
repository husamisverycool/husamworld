# Study, round 3: THE SWITCHER (`world/_shared/worldnav.js`)

Husam: "when I click on the bottom left and it's the spinning globe icon thing ... make sure that none of that looks
like AI. All of it looks like AI right now." And the globe is the Airport's device.

## What was there (round 2) and why it read as AI
| Element | Where it came from | Verdict |
|---|---|---|
| Dark orb, 1px white border, soft drop shadow, white halo ring | default "floating action button" | generic UI furniture |
| Wireframe globe icon spinning forever | an icon set; the globe belongs to the Airport | not ours, and constant motion on a reading page |
| "husam.world" tooltip pill (999px radius, dark) | default tooltip | pill |
| Dark rounded panel, 16px radius, big blurred shadow, scale-pop with overshoot | default popover | dark glassy panel |
| Cream "Back to the world" button with a chevron | default | chevron + label |
| `OTHER DISTRICTS` in 11px caps, `letter-spacing:.12em` | default eyebrow | banned eyebrow |
| "• you are here" in blue | default | named on the anti-AI list |
| Near-black circular wipe | default | not the hub's wipe |

## References, read live
- **bruno-simon.com (2025 folio source, `sources/style/map.styl`, `sources/Game/Map.js`)**. His map is a modal
  with `.location` pins: a `.pin` that is a white 20px square `transform rotate(45deg)` with a `4px solid #251f2b`
  border, and a `.name` that pops from `scale(0,0)` with `transition transform 0.3s cubic-bezier(0.65,-1,0.45,1)`
  and in with `cubic-bezier(0.49, 2.2, 0.53, 0.75)` on hover. Positions come from the real world
  (`worldToMap(respawn.position)`), and clicking a location **respawns the car there**. The player marker is
  rotated with the vehicle and bounces (`map-player-animation`, 1s) when the map opens. His map trigger is an
  edge tab that slides 4px on hover (`transition transform 0.15s`). His title bar animates the tab title with a car
  (live scrape: `Bruno          🚗`).
  (His names are `text-transform uppercase; letter-spacing 1px`. I did **not** take the tracking; the hub's own tags
  are set in Bungee, which is a caps face, with no added tracking.)
- **bruno-simon.com, 2019 folio (`src/javascript/World/index.js`, `Sections/IntroSection.js`)**: loading and start
  are labels on the floor, the controls are drawn on the floor, and there is a touch version of them.
- **The hub itself (`world/index.html`)**: its landmark tags are an ink diamond (`#23262e`, cream inset line) with a
  label that **slides out from behind the diamond** (`uOff` 1 → 0); its UI material is the "slab" (cream
  `#f5f0e1`, `0 0 0 2.5px ink, 0 5px 0 2.5px ink`), from Messenger's BEGIN button; its action button is yellow
  `#f2c94c`; type is Bungee + Barlow; pads are dashed rings on the ground; going into a district is a circle mask in
  the district's colour with its name in Bungee; the toast on return says "Back on the road".
- **emilkowal.ski/ui/great-animations**: ease-out, under 300ms for UI, animate only `transform` and `opacity`
  (WAAPI/CSS so a busy main thread cannot drop frames), interruptible, and a reduced-motion variant.
- **rauno.me/craft/interaction-design**: *spatial consistency* (things open from where they live and go back
  there), *fidgetability*, *frequency & novelty* (low-frequency UI may animate; keyboard-heavy UI should be instant),
  Fitts's law and corners.
- **paco.me** (raw HTML): entrance is a per-item stagger (`data-animate`, `--stagger: n`), and the footer carries a
  tiny live object (the analog clock drawn in CSS) instead of an icon.

## Ideas judged
1. **A tiny drawn miniature of the hub (chosen).** It is the World's own object, so it borrows no district device,
   and it answers "an object from the hub world itself" literally.
2. Bruno's edge tab (red-to-plum gradient, inset white line). Faithful to Bruno, but foreign to *our* hub, whose UI
   is cream slabs; and a tab on the left edge fights every district's content.
3. A hub-style diamond tag alone ("WORLD"). Clean, but it says nothing about where you are.
4. The dashboard-style list only. That is what we had.

## What it is now
**Closed (inside the 72×72 corner: 56px at 10px inset).** The planet, drawn in code: the hub's ground rules
(its value noise, gold valley south of −4°, green north), its two-band toon light from the upper left with the day
preset's coloured shadow (`#8388d8`, mixed .62), its rim light, its ink outline, the spiral road in asphalt with an
ink edge, the Fresno plaza, trees poking over the horizon like on the title planet, a soft contact shadow, and **your
red car parked on the road at this district**, nose up the road. The view is the driving view: behind the car. It
does not spin. Point at it and the car **hops** (the hub's H key), and a hub tag slides out of a diamond:
`HUSAM.WORLD`. Each district shows a different planet, because each district's car sits at a different place.

**Open.** The planet **leaves its pad and grows into the map** (a FLIP from the button's rect, 420ms,
`cubic-bezier(.32,.72,0,1)`), turning while it grows from the driver's view to north-up. Left behind in the corner:
the hub's **dashed pad** (cream dashes over an ink ring), which is also the close target. The map sits in the hub's
sky (`radial-gradient(120% 90% at 50% 38%,#b4e6f0,#6dbcd6)`) on a slab of hub paper. On the planet: nine **diamond
pins at the real positions** of the nine landmarks (lat/lon computed with the hub's road maths: LAT0 −64, LAT1 64,
TURNS 2.35, LON0 .4, sites beside the road at the hub's depths), the road with cream edges and a dashed gold centre,
Fresno and Cambridge plazas, the car at this district's pad, and this district's pin in red with its label out.
Pins behind the planet hide. Next to it: **"Back on the road"** as the hub's yellow slab button (it links to
`index.html#from-<page>`, so the hub spawns the car at this landmark and toasts "Back on the road"), and the nine
places in road order, each a small hub diamond + name in Bungee + one plain line.

**Station camera.** Hover or focus a place and the planet turns to put that pin in front, its diamond grows with
Bruno's overshoot (`cubic-bezier(.49,2.2,.53,.75)`) and its tag slides out. Drag the planet to turn it (the hub's
map drags too). Following Bruno, clicking a pin takes you there.

**Going.** The hub's own wipe: a circle mask that opens from the diamond you picked, in that district's colour, with
its name in Bungee rising in. Home wipes in the hub's sky colour, so it cuts seamlessly into the hub's sky.

**Rows** stagger in 22ms apart (paco.me's `--stagger`), `rise` 340ms ease-out. Close is faster than open (240ms):
the planet flies back onto its pad.

## Rules
- Dismiss: Escape (focus returns to the planet), a pointer-down anywhere outside, or tabbing out. Never modal.
- Keyboard: Enter/Space opens and focuses "Back on the road"; ↑/↓ move through the list, Home/End jump; visible
  focus (3px `#f2c94c`, the hub's focus colour; rows get an ink inset line and white fill).
- Touch: 56px target; rows ≥ 42px; pins ignore touch hover and never fire during the fly-out.
- 360px: map 136px beside the home button, list below; the whole list fits at 360×640.
- Reduced motion: no hop, no fly, no stagger, no wipe; the map just appears, turning is instant.
- No libraries. Type: the hub's Bungee + Barlow, fetched from Google Fonts with `text=` (only the glyphs used) and
  **renamed `hwn Bungee` / `hwn Barlow`** before injection, so a page that already loads Barlow (the Chamber) keeps its
  own faces. Fallbacks: Arial Black / Arial.
- `#from-<page>` kept. DISTRICTS ids and names kept.

## Descriptions (no district-owned facts; pointers only)
| Place | Round 2 | Round 3 |
|---|---|---|
| The Capitol | Advocacy & legislation | Advocacy and lawmaking |
| The Chamber | Debate & speech | Debate and speech |
| The Bridge | Arabic ↔ English | Arabic and English, in print |
| The Polling Station | Research & data | Research and data |
| The Map Room | Home ground | Home ground |
| The Garage | Things he built | Things he built |
| The Pier | Honors, by rarity | Honors, by rarity |
| The Plaza | Every week since 2015 | How the weeks fill up |
| The Airport | Harvard & travel | Campus, and far from it |

(The Plaza's line no longer implies a grid that starts empty; the Airport's no longer names Harvard, which the
Airport owns.)

## Tested
Copies of bill, os, weeks, depths and everywhere in `world/_explore/nav/`, injected with a private script
(the real pages untouched, `inject.py` not run). Screenshots `world/_shots/nav-r3-*` (closed, hover, open, hovered
row, reduced motion) at 1440, 390 and 360. `qa.js` on every copy: 0 issues. Keyboard, Escape, outside click,
navigation and bfcache return checked by script.
