#!/usr/bin/env python3
"""Builds world/depths.html (The Pier) as one self-contained file."""
import html
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import art  # noqa: E402

ROOT = '/home/user/husamworld'
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'world', '_explore', 'depths', 'a.html')

E = html.escape

# ------------------------------------------------------------------ honors with odds
# pool / picked, straight from versions/CONTENT.md. approx=True where CONTENT gives "~" or a percentage.
SPECS = [
    dict(id='qb-finalist', pool=25500, picked=7287, approx=False, art=art.school7, w=.9, lane=.3,
         name='QuestBridge National College Match Finalist', fact='7,287 finalists from 25,500.'),
    dict(id='qb-cps', pool=16000, picked=3911, approx=False, art=art.school4, w=.9, lane=.9,
         name='QuestBridge College Prep Scholar', fact='3,911 scholars from 16,000.'),
    dict(id='hsd', pool=700, picked=80, approx=True, art=art.dolphin, w=.95, lane=.1,
         name='High School Diplomats Finalist', fact='About 80 finalists from 700+.'),
    dict(id='usc', pool=1800, picked=200, approx=True, art=art.pilotfish, w=.72, lane=.7,
         name='USC Young Leaders Summit Scholar', fact='About 200 from 1,800+.'),
    dict(id='notre-dame', pool=1500, picked=90, approx=True, art=art.lionfish, w=.78, lane=1,
         name='Notre Dame Leadership Seminars', fact='About 90 from 1,500+.'),
    dict(id='jfk', pool=2800, picked=150, approx=True, art=art.swordfish, w=1, lane=.2,
         name='JFK Profile in Courage Essay Contest', fact='Top 5%: about 150 of 2,800+.'),
    dict(id='climate', n=20, approx=True, art=art.brain_coral, w=.72, lane=.75,
         name='International Climate Science Olympiad Semifinalist', fact='Top 5% of 55,000+.'),
    dict(id='tass', pool=2400, picked=72, approx=False, art=art.sea_turtle, w=.82, lane=.3,
         name='Telluride Association Summer Seminar', fact='72 from 2,400+. Tuition-free, six to seven weeks in Critical Black Studies, summer 2024. Elected house chair.'),
    dict(id='taco-bell', pool=14000, picked=400, approx=True, art=art.pufferfish, w=.6, lane=1,
         name='Taco Bell Live Más Scholar', fact='$10K. About 400 from 14,000.'),
    dict(id='quest-excellence', pool=3911, picked=100, approx=True, art=art.nautilus, w=.62, lane=.6,
         name='QuestBridge Quest for Excellence Award, Humanities', fact='About 100 from the 3,911 College Prep Scholars.',
         note='The pool is scholars, not applicants.'),
    dict(id='coolidge', pool=4100, picked=100, approx=False, art=art.grouper, w=.86, lane=0,
         name='Coolidge Scholarship Senator', fact='100 from 4,100+.'),
    dict(id='elks', pool=21000, picked=500, approx=False, art=art.staghorn, w=.6, lane=.35,
         name='Elks Most Valuable Student Semifinalist', fact='500 from 21,000+.'),
    dict(id='gates', pool=48000, picked=750, approx=False, art=art.manta, w=1, lane=.4,
         name='Gates Scholar', fact='750 from 48,000+.'),
    dict(id='princeton-prize', pool=600, picked=3, approx=False, art=art.barreleye, w=.85, lane=.75,
         name='Princeton Prize in Race Relations, San Francisco', fact='3 from 600+.'),
    dict(id='coca-cola', pool=105000, picked=150, approx=False, art=art.red_jelly, w=.62, lane=.25,
         name='Coca-Cola Scholar', fact='150 from 105,000+.'),
]
FLOOR = dict(id='nsda-soty', pool=140000, picked=86, approx=False,
             name='NSDA Student of the Year', fact='86 from 140,000+ members.', note='That pool is every member, not applicants.')

for s in SPECS + [FLOOR]:
    if 'n' not in s:
        s['n'] = s['pool'] / s['picked']


def odds_str(n):
    if n < 9.95:
        v = f'{n:.1f}'
        if v.endswith('.0'):
            v = v[:-2]
    else:
        v = f'{int(n + .5):,}'
    return f'1 in {v}'


def odds_html(s):
    o = E(odds_str(s['n']))
    if s['approx']:
        return f'<span aria-hidden="true">~</span><span class="sr-only">about </span>{o}'
    return o


def odds_plain(s):
    return ('~' if s['approx'] else '') + odds_str(s['n'])


SPECS.sort(key=lambda s: s['n'])
NMAX = FLOOR['n']

# ------------------------------------------------------------------ zones (ocean names, rarity bands)
ZONES = [
    ('sunlight', 1, 'The Sunlight Zone', '1 in 1 to 1 in 10'),
    ('twilight', 10, 'The Twilight Zone', '1 in 10 to 1 in 100'),
    ('midnight', 100, 'The Midnight Zone', '1 in 100 to 1 in 1,000'),
    ('abyssal', 1000, 'The Abyssal Zone', '1 in 1,000 and rarer'),
]
CHALLENGER = ('deepest', 1590, 'The Deepest Point', 'On this page, anyway')


def zone_of(n):
    z = ZONES[0]
    for zz in ZONES:
        if n >= zz[1]:
            z = zz
    return z


count_twilight = sum(1 for s in SPECS if 10 <= s['n'] < 100)
count_below_100 = sum(1 for s in SPECS + [FLOOR] if s['n'] >= 100)
count_measured = len(SPECS) + 1
count_rush = sum(1 for s in SPECS if 33 <= s['n'] < 43)
POOLS = sum(s['pool'] for s in SPECS + [FLOOR] if 'pool' in s and s['id'] != 'quest-excellence') + 55000

BLURBS = [
    (27.5, 2, 1, f'{count_twilight} of his {count_measured} measured honors live in this zone.'),
    (46.5, 2, .5, f'Rush hour: {count_rush} honors between 1 in 33 and 1 in 42.'),
    (53, 2, 0, 'The light starts to go around here.'),
    (80, 2, 1, 'It’s a long way to the next one.'),
    (108, 3, .5, 'The sun gives up around here.'),
    (150, 2, .3, f'Only {count_below_100} of his honors are rarer than 1 in 100.'),
    (225, 2, .2, 'Three were picked in San Francisco. He was one of them.'),
    (290, 2, .8, 'Every unit of depth is one more person in the pool for each person picked.'),
    (370, 2, .2, 'Nothing between here and 1 in 700.'),
    (450, 2, .7, 'Still here? Good.'),
    (500, 3, .5, 'Halfway to 1 in 1,000.'),
    (600, 2, .3, 'Almost there. For this one, anyway.'),
    (748, 2, .75, 'For every Coca-Cola Scholar, about 699 others weren’t picked.'),
    (830, 2, .2, 'One left. It’s 928 units further down.'),
    (930, 3, .5, 'Below 1 in 1,000 it gets very quiet.'),
    (1070, 2, .6, 'You’ve scrolled about <span data-screens>seventy</span> screens to get here.'),
    (1160, 2, .2, 'Nothing lives here.'),
    (1260, 2, .7, 'Still nothing.'),
    (1360, 2, .3, 'You can skip to the bottom any time. It’s under Jump, top right.'),
    (1450, 2, .6, 'Something down here is glowing.'),
    (1530, 3, .5, 'Getting closer.'),
]

# ------------------------------------------------------------------ the raft: honors with no published odds (CONTENT.md, Honors)
RAFT = [
    ('Benjamin A. Gilman Scholar', 'Scholarship.', art.f_glass),
    ('National African American Recognition Program', 'National recognition.', art.f_orange),
    ('International Geography Olympiad', 'Team USA qualifier: 7th nationally, with a perfect qualifying score.', art.f_globe),
    ('National History Day', '2× Valley Champion.', art.f_bottle),
    ('Summa Cum Laude', 'The highest of the Latin honors.', art.f_cap),
]
TOTAL = count_measured + len(RAFT)

# ------------------------------------------------------------------ markup pieces
FISH_MARK = ('<svg viewBox="0 0 30 20" aria-hidden="true" focusable="false"><path d="M2,10 C6,3 15,2 21,8 L28,3 L27,10 L28,17 L21,12 C15,18 6,17 2,10 Z" fill="#2c2c54"/>'
             '<circle cx="8" cy="9" r="1.6" fill="#f7f1e3"/></svg>')
ARROW = '<svg viewBox="0 0 14 16" aria-hidden="true" focusable="false"><path d="M7,1 V14 M1.5,8.5 L7,14 L12.5,8.5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def spec_html(s):
    note = f'<span class="note">{E(s["note"])}</span>' if s.get('note') else ''
    return (f'<article class="spec" id="s-{s["id"]}" data-n="{s["n"]:.6f}" data-lane="{s["lane"]}" aria-labelledby="s-{s["id"]}-h">'
            f'<div class="spec-art" style="--w:{s["w"]}">{s["art"](s["id"])}</div>'
            f'<h3 class="spec-name" id="s-{s["id"]}-h">{E(s["name"])}</h3>'
            f'<p class="spec-fact">{E(s["fact"])}{note}</p>'
            f'<p class="spec-odds"><span class="tether"></span>{odds_html(s)}</p>'
            '</article>')


def blurb_html(b):
    n, span, lane, text = b
    return f'<p class="blurb" data-kind="blurb" data-n="{n}" data-span="{span}" data-lane="{lane}">{text}</p>'


def zone_html(z):
    zid, n, title, rng = z
    return (f'<h2 class="zone-title" id="z-{zid}" data-kind="zone" data-n="{n}">{E(title)}'
            f'<span class="zone-range">{E(rng)}</span></h2>')


def floor_html():
    s = FLOOR
    return (f'<article class="spec spec-floor" id="s-{s["id"]}" data-kind="floor" data-n="{s["n"]:.6f}" aria-labelledby="s-{s["id"]}-h">'
            f'<div class="spec-art floor-angler">{art.anglerfish(s["id"])}</div>'
            f'<div class="spec-text"><h3 class="spec-name" id="s-{s["id"]}-h">{E(s["name"])}</h3>'
            f'<p class="spec-fact">{E(s["fact"])}<span class="note">{E(s["note"])}</span></p></div>'
            f'<p class="spec-odds">{odds_html(s)}</p>'
            '</article>')


def scale_html():
    items = []
    for s in SPECS:
        items.append((s['n'], 1, spec_html(s)))
    for b in BLURBS:
        items.append((b[0], 1, blurb_html(b)))
    items.append((CHALLENGER[1], 0, zone_html(CHALLENGER)))
    items.append((NMAX, 2, floor_html()))
    items.sort(key=lambda t: (t[0], t[1]))
    out = []
    bounds = [z[1] for z in ZONES] + [1e9]
    for zi, z in enumerate(ZONES):
        lo, hi = bounds[zi], bounds[zi + 1]
        inside = [h for (n, _, h) in items if lo <= n < hi]
        head = zone_html(z) if zi else (
            '<header class="zone-head" data-kind="head" data-n="1">'
            + zone_html(z).replace(' data-kind="zone" data-n="1"', '')
            + '<p class="blurb">From here down, depth is odds: an honor that picked 1 person in 64 sits at 1 in 64. '
              'Up here, you swim in schools.</p></header>')
        out.append(f'<section id="{z[0]}" aria-labelledby="z-{z[0]}">' + head + ''.join(inside) + '</section>')
    return '\n'.join(out)


def raft_html():
    lis = []
    for i, (name, note, fn) in enumerate(RAFT):
        lis.append(f'<li class="float"><div class="float-art" style="--d:{-(i * 0.73) % 5:.2f}s">{fn(f"raft{i}")}</div>'
                   f'<h3 class="float-name">{E(name)}</h3><p class="float-note">{E(note)}</p></li>')
    return (
        '<section class="surface" id="surface" aria-labelledby="surface-title">'
        '<h2 class="zone-title" id="surface-title">The Surface<span class="zone-range">No published odds</span></h2>'
        f'<p class="blurb">These {len(RAFT)} honors never came with a pool size, so there’s nothing to weigh them down. They float.</p>'
        '<ul class="floats">' + ''.join(lis) + '</ul></section>'
    )


def list_html():
    groups = []
    for zi in range(len(ZONES) - 1, -1, -1):
        z = ZONES[zi]
        members = [s for s in SPECS + [FLOOR] if zone_of(s['n']) == z]
        members.sort(key=lambda s: -s['n'])
        if not members:
            continue
        rows = ''.join(
            f'<li class="list-row"><span class="list-odds">{E(odds_plain(s))}</span>'
            f'<span class="list-name"><button type="button" data-go="s-{s["id"]}">{E(s["name"])}</button></span>'
            f'<span class="list-fact">{E(s["fact"])}{(" " + E(s["note"])) if s.get("note") else ""}</span></li>'
            for s in members)
        groups.append(f'<section class="list-group"><h3 class="list-zone">{E(z[2])}<span>{E(z[3])}</span></h3><ul class="list-rows">{rows}</ul></section>')
    raft_rows = ''.join(
        f'<li class="list-row"><span class="list-odds">no odds</span><span class="list-name">{E(n)}</span><span class="list-fact">{E(t)}</span></li>'
        for (n, t, _) in RAFT)
    groups.append(f'<section class="list-group list-raft"><h3 class="list-zone">The Surface<span>No published odds</span></h3><ul class="list-rows">{raft_rows}</ul></section>')
    return (
        '<div class="list-view" id="listView" role="dialog" aria-modal="true" aria-labelledby="list-title" hidden>'
        '<button class="list-close" id="listClose" type="button">Back to the dive</button>'
        '<div class="list-inner">'
        '<h2 id="list-title">The Deep End, as a list</h2>'
        f'<p class="list-sub">All {TOTAL} honors. Odds are the size of the pool divided by the number picked. '
        '“~” means the source figure was approximate or a percentage.</p>'
        '<div class="list-sort" role="group" aria-label="Order">'
        '<button type="button" data-sort="deep" aria-pressed="true">Rarest first</button>'
        '<button type="button" data-sort="shallow" aria-pressed="false">Surface first</button></div>'
        '<div class="list-groups" id="listGroups">' + ''.join(groups) + '</div>'
        '<p class="list-foot">Pick any honor to swim straight to it.</p>'
        '</div></div>'
    )


def jump_menu():
    rows = [('surface', 'The Surface', 'no odds'), ('sunlight', 'Sunlight Zone', '1 in 1+'), ('twilight', 'Twilight Zone', '1 in 10+'),
            ('midnight', 'Midnight Zone', '1 in 100+'), ('abyssal', 'Abyssal Zone', '1 in 1,000+')]
    b = ''.join(f'<li><button type="button" data-go="{k}">{E(t)}<span class="r">{E(r)}</span></button></li>' for k, t, r in rows)
    b += '<li><hr></li><li><button type="button" data-go="bottom">Skip to the bottom<span class="r">1 in 1,628</span></button></li>'
    b += '<li><button type="button" data-go="top">Back to the surface<span class="r">top</span></button></li>'
    return f'<ul class="menu" id="jumpMenu" hidden>{b}</ul>'


def gauge_html():
    segs = [('surface', 'The surface', '#8fe3f5'), ('sunlight', 'Sunlight: 1 in 1+', '#2cc3d6'), ('twilight', 'Twilight: 1 in 10+', '#1a8aa0'),
            ('midnight', 'Midnight: 1 in 100+', '#2d5a86'), ('abyssal', 'Abyssal: 1 in 1,000+', '#5a5a96'),
            ('bottom', 'The bottom', '#ede5ce'), ('end', 'The end', '#f7f1e3')]
    b = ''.join(f'<button type="button" data-go="{k}" style="--c:{c}" aria-label="Jump to {E(t)}"><span aria-hidden="true">{E(t)}</span></button>' for k, t, c in segs)
    return f'<nav class="gauge" id="gauge" aria-label="Depth gauge">{b}<span class="pip" id="gaugePip" aria-hidden="true"></span></nav>'


def scene_html():
    return (
        '<svg class="scene" id="scene" viewBox="0 0 1440 340" aria-hidden="true" focusable="false">'
        '<defs><clipPath id="above-water"><rect id="above-rect" x="0" y="-3000" width="1440" height="3240"/></clipPath></defs>'
        '<g id="under"></g>'
        f'<g id="pier" transform="translate(0,240)">{art.pier_group()}</g>'
        f'<g id="raft" transform="translate(1040,240)"><g id="raft-bob">{art.raft_group()}</g></g>'
        f'<g clip-path="url(#above-water)"><g id="diver" transform="translate(440,136)">{art.diver_standing()}</g></g>'
        '<g id="splash"></g>'
        '</svg>'
    )


def pebbles():
    import random
    rnd = random.Random(7)
    ps = []
    for _ in range(46):
        x = rnd.uniform(0, 1440)
        y = rnd.uniform(10, 880)
        rx = rnd.uniform(3, 11)
        ps.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rx:.1f}" ry="{rx * rnd.uniform(.5, .75):.1f}" fill="{rnd.choice(["#d8cfb4", "#cfc5a8", "#c5bb9e", "#e3dbc3"])}"/>')
    return ('<div class="pebbles" aria-hidden="true"><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">'
            + ''.join(ps) + '</svg></div>')


CSS = open(os.path.join(HERE, 'depths.css')).read()
JS = open(os.path.join(HERE, 'depths.js')).read()

DOC = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Deep End</title>
<meta name="description" content="Husam Sokar's honors, each at the depth of its odds: from the surface down to 1 in 1,628.">
<meta name="theme-color" content="#9ee0fe">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Heebo:wght@400;700&family=Oswald:wght@300;400;500;700&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add('js');</script>
<!--
  The Pier: an homage to Neal Agarwal's "The Deep Sea" (neal.fun/deep-sea).
  Depth = rarity. Every honor sits at "1 in N", where N = pool / number picked (from versions/CONTENT.md).
  Scale is linear: one unit of N is 60px (desktop), 68px (tablet) or 96px (phone). Study notes: world/_study/depths.md
-->
<style>
{CSS}
</style>
</head>
<body>
<a class="skip-link" href="#listView" id="skipToList">Skip to the list of honors</a>
<div class="water" id="water" aria-hidden="true"><canvas id="water-canvas"></canvas></div>

<nav class="controls" aria-label="Page controls">
  <div style="position:relative">
    <button class="ctl" id="jumpBtn" type="button" aria-expanded="false" aria-controls="jumpMenu">Jump</button>
    {jump_menu()}
  </div>
  <button class="ctl" id="listBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="listView">List</button>
</nav>
{gauge_html()}

<main>
<section class="title-slide" id="top" aria-labelledby="page-title">
  <a class="mark" href="index.html#from-depths" aria-label="husam.world: back to the map">HUSAM{FISH_MARK}WORLD</a>
  {scene_html()}
  <div class="title-wrapper">
    <h1 class="title" id="page-title">The Deep End</h1>
    <p class="title-credit">Husam Sokar’s honors, at the depth of their odds</p>
    <div class="title-actions">
      <button class="dive-btn" id="diveBtn" type="button">Dive {ARROW}</button>
      <button class="text-btn" id="skipBottom" type="button">or skip to the bottom</button>
    </div>
  </div>
</section>

<div class="ocean" id="ocean">
{raft_html()}
<div class="scale" id="scale">
{scale_html()}
<div class="descender" id="descender" aria-hidden="true" style="position:absolute"><div class="descender-sticky">{art.hadal_diver()}</div></div>
</div>
<div class="depth-line" id="depthLine" aria-hidden="true"><span id="depthText">1 IN 1</span></div>
</div>

<div class="floor-edge" aria-hidden="true">{art.floor_edge()}</div>
<section class="floor" id="bottom" aria-labelledby="end-title">
  {pebbles()}
  <h2 class="big" id="end-title">The Deep End</h2>
  <p class="who">{count_measured} honors with a pool. {len(RAFT)} without one.</p>
  <p class="why">Add up every pool on this page and you get {POOLS:,}+ people. He was picked out of each.</p>
  <button class="back-top" id="backTop" type="button">Back to the surface</button>
</section>
</main>

{list_html()}
<button class="skip-intro" id="skipIntro" type="button">Skip intro</button>
<p class="sr-only" id="live" aria-live="polite"></p>
<script>
{JS}
</script>
</body>
</html>
'''

with open(OUT, 'w') as f:
    f.write(DOC)
print('wrote', OUT, len(DOC), 'bytes')
print('measured', count_measured, 'raft', len(RAFT), 'total', TOTAL, 'twilight', count_twilight, 'below100', count_below_100, 'rush', count_rush)
for s in SPECS + [FLOOR]:
    print(f'{s["n"]:10.3f}  {odds_plain(s):>14}  {zone_of(s["n"])[2]:<18} {s["name"]}')
