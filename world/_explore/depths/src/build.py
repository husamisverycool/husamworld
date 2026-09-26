#!/usr/bin/env python3
"""Builds world/depths.html (The Pier) as one self-contained file."""
import html
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import art  # noqa: E402

ROOT = '/home/user/husamworld'
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'world', 'depths.html')

E = html.escape

# ------------------------------------------------------------------ honors with odds
# pool / picked, straight from versions/CONTENT.md. approx=True where CONTENT gives "~" or a percentage.
SPECS = [
    dict(id='qb-finalist', pool=25500, picked=7287, approx=False, art=art.school7, w=.9, lane=.3,
         name='QuestBridge National College Match Finalist', fact='One of 7,287 finalists, out of 25,500.'),
    dict(id='qb-cps', pool=16000, picked=3911, approx=False, art=art.school4, w=.9, lane=.9,
         name='QuestBridge College Prep Scholar', fact='One of 3,911 scholars, out of 16,000.'),
    dict(id='hsd', pool=700, picked=80, approx=True, art=art.dolphin, w=.95, lane=.1,
         name='High School Diplomats Finalist', fact='One of about 80 finalists, out of 700+.'),
    dict(id='usc', pool=1800, picked=200, approx=True, art=art.pilotfish, w=.72, lane=.7,
         name='USC Young Leaders Summit Scholar', fact='One of about 200 scholars, out of 1,800+.'),
    dict(id='notre-dame', pool=1500, picked=90, approx=True, art=art.lionfish, w=.78, lane=1,
         name='Notre Dame Leadership Seminars', fact='One of about 90, out of 1,500+.'),
    dict(id='jfk', pool=2800, picked=150, approx=True, art=art.swordfish, w=1, lane=.2,
         name='JFK Profile in Courage Essay Contest', fact='Top 5%: one of about 150, out of 2,800+.'),
    dict(id='climate', n=20, approx=True, art=art.brain_coral, w=.72, lane=.75,
         name='International Climate Science Olympiad Semifinalist', fact='Top 5% of 55,000+.'),
    dict(id='tass', pool=2400, picked=72, approx=False, art=art.sea_turtle, w=.82, lane=.3,
         name='Telluride Association Summer Seminar', fact='One of 72, out of 2,400+. A tuition-free seminar in Critical Black Studies, summer 2024, where he was elected house chair.'),
    dict(id='taco-bell', pool=14000, picked=400, approx=True, art=art.pufferfish, w=.6, lane=1,
         name='Taco Bell Live Más Scholar', fact='A $10,000 scholarship. One of about 400, out of 14,000.'),
    dict(id='quest-excellence', pool=3911, picked=100, approx=True, art=art.nautilus, w=.62, lane=.6,
         name='QuestBridge Quest for Excellence Award, Humanities', fact='One of about 100, chosen from the 3,911 College Prep Scholars.',
         note='They were already 1 in 4.1.'),
    dict(id='coolidge', pool=4100, picked=100, approx=False, art=art.grouper, w=.86, lane=0,
         name='Coolidge Scholarship Senator', fact='One of 100 Senators, out of 4,100+.'),
    dict(id='elks', pool=21000, picked=500, approx=False, art=art.staghorn, w=.6, lane=.35,
         name='Elks Most Valuable Student Semifinalist', fact='One of 500 semifinalists, out of 21,000+.'),
    dict(id='gates', pool=48000, picked=750, approx=False, art=art.manta, w=1, lane=.4,
         name='Gates Scholar', fact='One of 750 Gates Scholars, out of 48,000+.'),
    dict(id='princeton-prize', pool=600, picked=3, approx=False, art=art.barreleye, w=.85, lane=.75,
         name='Princeton Prize in Race Relations, San Francisco', fact='One of 3, out of 600+.'),
    dict(id='coca-cola', pool=105000, picked=150, approx=False, art=art.red_jelly, w=.62, lane=.25,
         name='Coca-Cola Scholar', fact='One of 150 Coca-Cola Scholars, out of 105,000+.'),
]
FLOOR = dict(id='nsda-soty', pool=140000, picked=86, approx=False,
             name='NSDA Student of the Year', fact='One of 86, out of 140,000+.', note='The pool is every member of the National Speech & Debate Association.')

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
    ('sunlight', 1, 'The Sunlight Zone', ''),
    ('twilight', 10, 'The Twilight Zone', 'Below 1 in 10, fewer than one in ten get picked.'),
    ('midnight', 100, 'The Midnight Zone', 'Below 1 in 100, fewer than one in a hundred.'),
    ('abyssal', 1000, 'The Abyssal Zone', 'Below 1 in 1,000, fewer than one in a thousand.'),
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
POOL_COUNT_ = None
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
    (930, 3, .5, 'It gets very quiet from here.'),
    (1070, 2, .6, 'You’ve scrolled about <span data-screens>seventy</span> screens to get here.'),
    (1160, 2, .2, 'Nothing lives here.'),
    (1260, 2, .7, 'Still nothing.'),
    (1360, 2, .3, '1 in 1,000 is a long way up now.'),
    (1420, 2, .6, 'Something down here is glowing.'),
    (1565, 2, .3, 'Getting closer.'),
]

# ------------------------------------------------------------------ the raft: honors with no published odds (CONTENT.md, Honors)
RAFT = [
    ('Benjamin A. Gilman Scholar', 'Scholar.', art.f_glass),
    ('National African American Recognition Program', 'National recognition.', art.f_orange),
    ('International Geography Olympiad', 'Team USA qualifier: 7th nationally, with a perfect qualifying score.', art.f_globe),
    ('National History Day', 'Valley Champion, twice.', art.f_bottle),
    ('Summa Cum Laude', 'Clovis Community College. The highest Latin honor.', art.f_cap),
]
TOTAL = count_measured + len(RAFT)
POOL_COUNT = {1: 'one', 15: 'fifteen'}.get(len([x for x in SPECS + [FLOOR] if x['id'] != 'quest-excellence']), str(len([x for x in SPECS + [FLOOR] if x['id'] != 'quest-excellence'])))

# catalogue numbers, in the order a diver meets them: the floats, then down the scale
CAT = {}
for i, r in enumerate(RAFT):
    CAT['raft%d' % i] = i + 1
for i, sp in enumerate(SPECS):
    sp['no'] = len(RAFT) + i + 1
FLOOR['no'] = TOTAL
POOL_N = 1490

# ------------------------------------------------------------------ markup pieces
FISH_MARK = ('<svg viewBox="0 0 30 20" aria-hidden="true" focusable="false"><path d="M2,10 C6,3 15,2 21,8 L28,3 L27,10 L28,17 L21,12 C15,18 6,17 2,10 Z" fill="#2c2c54"/>'
             '<circle cx="8" cy="9" r="1.6" fill="#f7f1e3"/></svg>')
ARROW = '<svg viewBox="0 0 14 16" aria-hidden="true" focusable="false"><path d="M7,1 V14 M1.5,8.5 L7,14 L12.5,8.5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def no_html(no):
    return f'<span class="spec-no"><span class="sr-only">No. </span>{no}</span>'


def spec_html(s):
    note = f'<span class="note">{E(s["note"])}</span>' if s.get('note') else ''
    return (f'<article class="spec" id="s-{s["id"]}" data-n="{s["n"]:.6f}" data-lane="{s["lane"]}" aria-labelledby="s-{s["id"]}-h">'
            f'<div class="spec-art" style="--w:{s["w"]}">{s["art"](s["id"])}{no_html(s["no"])}</div>'
            f'<h3 class="spec-name" id="s-{s["id"]}-h">{E(s["name"])}</h3>'
            f'<p class="spec-fact">{E(s["fact"])}{note}</p>'
            f'<p class="spec-odds"><span class="tether"></span><span>{odds_html(s)}</span></p>'
            '</article>')


def blurb_html(b):
    n, span, lane, text = b
    return f'<p class="blurb" data-kind="blurb" data-n="{n}" data-span="{span}" data-lane="{lane}">{text}</p>'


def zone_html(z):
    zid, n, title, rng = z
    rng_html = f'<span class="zone-range">{E(rng)}</span>' if rng else ''
    return f'<h2 class="zone-title" id="z-{zid}" data-kind="zone" data-n="{n}">{E(title)}{rng_html}</h2>'


def floor_html():
    s = FLOOR
    return (f'<article class="spec spec-floor" id="s-{s["id"]}" data-kind="floor" data-n="{s["n"]:.6f}" aria-labelledby="s-{s["id"]}-h">'
            f'<div class="spec-text"><h3 class="spec-name" id="s-{s["id"]}-h">{E(s["name"])}</h3>'
            f'<p class="spec-fact">{E(s["fact"])}<span class="note">{E(s["note"])}</span></p></div>'
            f'<div class="spec-art floor-angler">{art.anglerfish(s["id"])}{no_html(s["no"])}</div>'
            f'<p class="spec-odds">{odds_html(s)}</p>'
            '</article>')


def scale_html():
    items = []
    for s in SPECS:
        items.append((s['n'], 1, spec_html(s)))
    for b in BLURBS:
        items.append((b[0], 1, blurb_html(b)))
    items.append((CHALLENGER[1], 0, zone_html(CHALLENGER)))
    items.append((POOL_N, 0, pool_html()))
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
            + '<p class="blurb">From here down, depth is odds. An honor that picked 1 person in 64 sits at 1 in 64. '
              'Up here, you swim in schools.</p></header>')
        out.append(f'<section id="{z[0]}" aria-labelledby="z-{z[0]}">' + head + ''.join(inside) + '</section>')
    return '\n'.join(out)


def raft_html():
    lis = []
    for i, (name, note, fn) in enumerate(RAFT):
        lis.append(f'<li class="float" id="f-{i + 1}"><div class="float-art" style="--d:{-(i * 0.73) % 5:.2f}s">{fn(f"raft{i}")}{no_html(i + 1)}</div>'
                   f'<h3 class="float-name">{E(name)}</h3><p class="float-note">{E(note)}</p></li>')
    return (
        '<section class="surface" id="surface" aria-labelledby="surface-title">'
        '<h2 class="zone-title" id="surface-title">The Surface</h2>'
        f'<p class="blurb">These {len(RAFT)} honors never published a pool size, so there’s nothing to weigh them down. They float.</p>'
        '<ul class="floats">' + ''.join(lis) + '</ul></section>'
    )


def pool_html():
    return (f'<figure class="pool" id="pool" data-kind="pool" data-n="{POOL_N}">'
            '<canvas class="pool-canvas" id="poolCanvas" width="600" height="600" aria-hidden="true"></canvas>'
            '<figcaption class="blurb">1,628 points, and one of them is lit. That’s 1 in 1,628.</figcaption>'
            '</figure>')


# ------------------------------------------------------------------ the plate (after Haeckel, Kunstformen der Natur)
import math as _m
PW, PH, CX, CY = 1000, 1120, 500, 660
RINGS = [(140, '1 in 1,000'), (275, '1 in 100'), (400, '1 in 10')]


def _fig(x, y, size, svgm, no, label):
    return (f'<div class="pf" style="left:{x / PW * 100:.2f}%;top:{y / PH * 100:.2f}%;width:{size / PW * 100:.2f}%">'
            f'{svgm}<span class="pf-no">{no}</span></div>')


def plate_html():
    by = {s['id']: s for s in SPECS}
    figs = []
    # centre: the deepest
    figs.append(_fig(CX, CY, 200, art.anglerfish('pl-soty'), FLOOR['no'], FLOOR['name']))
    # midnight ring: left and right
    for sid, ang in (('coca-cola', 180), ('princeton-prize', 0)):
        sp = by[sid]; a = _m.radians(ang)
        figs.append(_fig(CX + _m.cos(a) * 208, CY + _m.sin(a) * 208, 118, sp['art']('pl-' + sid), sp['no'], sp['name']))
    # twilight ring: nine, mirrored about the axis, rarest at the top
    order = ['gates', 'elks', 'coolidge', 'quest-excellence', 'taco-bell', 'tass', 'climate', 'jfk', 'notre-dame']
    angs = [-90, -50, -130, -10, 190, 30, 150, 60, 120]
    for sid, ang in zip(order, angs):
        sp = by[sid]; a = _m.radians(ang)
        figs.append(_fig(CX + _m.cos(a) * 338, CY + _m.sin(a) * 338, 104, sp['art']('pl-' + sid), sp['no'], sp['name']))
    # sunlight ring: the four diagonals
    for sid, ang in (('usc', -45), ('hsd', -135), ('qb-cps', 45), ('qb-finalist', 135)):
        sp = by[sid]; a = _m.radians(ang)
        figs.append(_fig(CX + _m.cos(a) * 462, CY + _m.sin(a) * 462, 104, sp['art']('pl-' + sid), sp['no'], sp['name']))
    # the surface: a row of floats along the top
    for i, (name, note, fn) in enumerate(RAFT):
        figs.append(_fig(100 + i * 200, 108, 86, fn(f'pl-raft{i}'), i + 1, name))
    rings = ''.join(f'<circle cx="{CX}" cy="{CY}" r="{r}" />' for r, _ in RINGS)
    rlab = ''.join(f'<span class="pr-lab" style="top:{(CY + r) / PH * 100:.2f}%">{E(t)}</span>' for r, t in RINGS)
    svg_rings = (f'<svg class="pr" viewBox="0 0 {PW} {PH}" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
                 f'<g fill="none">{rings}</g><line x1="{CX}" y1="190" x2="{CX}" y2="{PH - 30}"/>'
                 f'<path d="M40,190 C200,176 320,204 500,190 C680,176 800,204 960,190"/></svg>')
    # legend, grouped like the rings
    groups = [
        ('The Sunlight Zone', '1 in 1 to 1 in 10', [by[k] for k in ('usc', 'hsd', 'qb-cps', 'qb-finalist')]),
        ('The Twilight Zone', '1 in 10 to 1 in 100', [by[k] for k in order]),
        ('The Midnight Zone', '1 in 100 to 1 in 1,000', [by['coca-cola'], by['princeton-prize']]),
        ('The Abyssal Zone', '1 in 1,000 and rarer', [FLOOR]),
    ]
    leg = []
    for title, rng, members in groups:
        members = sorted(members, key=lambda x: x['no'])
        rows = ''.join(
            f'<li><button type="button" class="lg-go" data-go="s-{m["id"]}"><span class="lg-no">{m["no"]}</span>'
            f'<span class="lg-name">{E(m["name"])}</span><span class="lg-odds">{odds_html(m)}</span></button></li>'
            for m in members)
        leg.append(f'<div class="lg-group"><h3 class="lg-zone">{E(title)}<span>{E(rng)}</span></h3><ol class="lg-rows">{rows}</ol></div>')
    rows = ''.join(
        f'<li><button type="button" class="lg-go" data-go="f-{i + 1}"><span class="lg-no">{i + 1}</span>'
        f'<span class="lg-name">{E(name)}</span><span class="lg-odds">no pool</span></button></li>'
        for i, (name, note, fn) in enumerate(RAFT))
    leg.insert(0, f'<div class="lg-group"><h3 class="lg-zone">The Surface<span>No published odds</span></h3><ol class="lg-rows">{rows}</ol></div>')
    return (
        '<section class="plate" id="collection" aria-labelledby="plate-title">'
        '<div class="plate-sheet">'
        '<div class="plate-run" aria-hidden="true"><span>The Pier, The Deep End.</span><span>Plate 1. — Honores.</span></div>'
        f'<div class="plate-frame" role="img" aria-label="All {TOTAL} honors drawn on one plate: the deepest at the centre, rings for each zone around it, the five without a pool along the top.">'
        f'{svg_rings}{rlab}{"".join(figs)}</div>'
        '<h2 class="plate-cap" id="plate-title">Honores. <span>— Everything on the way down.</span></h2>'
        '</div>'
        '<p class="lg-lead">Every specimen, by number. Pick one to swim back to it.</p>'
        '<div class="legend">' + ''.join(leg) + '</div>'
        '</section>'
    )


def jump_menu():
    rows = [('surface', 'The Surface', 'no odds'), ('sunlight', 'Sunlight Zone', '1 in 1+'), ('twilight', 'Twilight Zone', '1 in 10+'),
            ('midnight', 'Midnight Zone', '1 in 100+'), ('abyssal', 'Abyssal Zone', '1 in 1,000+')]
    b = ''.join(f'<li><button type="button" data-go="{k}">{E(t)}<span class="r">{E(r)}</span></button></li>' for k, t, r in rows)
    b += '<li><hr></li><li><button type="button" data-go="bottom">Skip to the bottom<span class="r">1 in 1,628</span></button></li>'
    b += '<li><button type="button" data-go="collection">The whole collection<span class="r">all {TOTAL}</span></button></li>'.replace('{TOTAL}', str(TOTAL))
    b += '<li><button type="button" data-go="top">Back to the surface<span class="r">top</span></button></li>'
    return f'<ul class="menu" id="jumpMenu" hidden>{b}</ul>'


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
  Scale is linear: one unit of N is 60px (desktop), 68px (tablet) or 96px (phone).
  The closing plate is after Haeckel's Kunstformen der Natur; the pool of 1,628 points after neal.fun/size-of-space. Study notes: world/_study/depths.md and depths-r2.md. Source: world/_explore/depths/src/build.py
-->
<style>
{CSS}
</style>
</head>
<body>
<a class="skip-link" href="#collection">Skip to the whole collection</a>
<div class="water" id="water" aria-hidden="true"><canvas id="water-canvas"></canvas></div>

<nav class="controls" aria-label="Page controls">
  <div style="position:relative">
    <button class="ctl" id="jumpBtn" type="button" aria-expanded="false" aria-controls="jumpMenu">Jump</button>
    {jump_menu()}
  </div>
  <button class="ctl" id="sinkBtn" type="button" aria-pressed="false">Let go</button>
</nav>

<main>
<section class="title-slide" id="top" aria-labelledby="page-title">
  <a class="mark" href="index.html#from-depths" aria-label="husam.world: back to the map">HUSAM{FISH_MARK}WORLD</a>
  {scene_html()}
  <div class="title-wrapper">
    <h1 class="title" id="page-title">The Deep End</h1>
    <p class="title-credit">Husam Sokar’s honors, at the depth of their odds</p>
    <div class="title-actions">
      <button class="text-btn" id="skipBottom" type="button">Skip to the bottom</button>
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
  <p class="who">You touched the bottom. Here’s everything you passed.</p>
  {plate_html()}
  <div class="tally">
    <p class="tally-big">{POOLS:,}+</p>
    <p class="tally-line">That’s the {POOL_COUNT} pools on this page, added up. He was picked out of every one.</p>
    <p class="tally-note">Quest for Excellence chose from the College Prep Scholars, so that pool isn’t counted twice. Anyone in two pools is counted in both.</p>
  </div>
  <button class="back-top" id="backTop" type="button">Back to the surface</button>
</section>
</main>

<button class="skip-intro" id="skipIntro" type="button">Skip the jump</button>
<p class="sr-only" id="live" aria-live="polite"></p>
<script>
{JS}
</script>
</body>
</html>
'''

# keep the shared world-nav block (same form as world/_shared/inject.py writes it)
# round 3: copy the block verbatim from the live page (the lead owns it; never regenerate it here)
_live = open(os.path.join(ROOT, 'world', 'depths.html')).read()
_a = _live.index('<!-- world-nav:start -->'); _b = _live.index('<!-- world-nav:end -->') + len('<!-- world-nav:end -->')
DOC = DOC.replace('</body>', _live[_a:_b] + '\n</body>', 1)

with open(OUT, 'w') as f:
    f.write(DOC)
print('wrote', OUT, len(DOC), 'bytes')
print('measured', count_measured, 'raft', len(RAFT), 'total', TOTAL, 'twilight', count_twilight, 'below100', count_below_100, 'rush', count_rush)
for s in SPECS + [FLOOR]:
    print(f'{s["n"]:10.3f}  {odds_plain(s):>14}  {zone_of(s["n"])[2]:<18} {s["name"]}')
