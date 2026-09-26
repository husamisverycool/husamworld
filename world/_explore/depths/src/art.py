# Hand-drawn SVG art for depths.html. Flat, friendly, no outlines (after Neal's illustrations).
import math

INK = '#1c2233'


def svg(vb, inner, cls='', label=''):
    w, h = vb
    c = f' class="{cls}"' if cls else ''
    return (f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}"{c} aria-hidden="true" '
            f'focusable="false">{inner}</svg>')


def eye(cx, cy, r, pupil='#1c1c2e', white='#fff'):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{white}"/>'
            f'<circle cx="{cx - r * .22:.1f}" cy="{cy}" r="{r * .6:.1f}" fill="{pupil}"/>'
            f'<circle cx="{cx - r * .45:.1f}" cy="{cy - r * .32:.1f}" r="{r * .22:.1f}" fill="#fff"/>')


TAILS = {
    'fork': 'M148,50 C160,40 172,24 194,12 C186,34 186,66 194,88 C172,76 160,60 148,50 Z',
    'round': 'M146,50 C156,32 184,28 194,50 C184,72 156,68 146,50 Z',
    'lunate': 'M144,50 C154,42 166,18 198,6 C184,32 184,68 198,94 C166,82 154,58 144,50 Z',
    'flying': 'M146,50 C158,42 170,28 190,18 C184,36 184,52 186,60 C194,72 198,86 200,96 C176,84 158,62 146,50 Z',
}
BODY = 'M16,52 C16,33 54,21 96,21 C128,21 148,37 156,50 C148,63 128,79 96,79 C54,79 16,71 16,52 Z'
BELLY = 'M20,58 C42,73 82,79 110,76 C132,73 146,62 153,53 C127,65 76,70 20,58 Z'


def fish(tx, ty, sx, sy, body, belly, fin, tail='fork', tail_fill=None, eye_r=6, flip=False,
         extra='', dorsal=True, cls='', mouth=True, gill=True):
    """Generic fish in a 200x100 local box, facing left (flip=True faces right)."""
    if flip:
        tr = f'translate({tx + 200 * sx:.1f},{ty}) scale({-sx},{sy})'
    else:
        tr = f'translate({tx},{ty}) scale({sx},{sy})'
    tf = tail_fill or fin
    c = f' class="{cls}"' if cls else ''
    parts = [f'<g transform="{tr}"{c}>']
    if dorsal:
        parts.append(f'<path d="M84,24 C94,8 120,6 134,28 Z" fill="{fin}"/>')
    parts.append(f'<path d="M104,76 C110,88 124,90 130,72 Z" fill="{fin}"/>')
    parts.append(f'<path d="{TAILS[tail]}" fill="{tf}"/>')
    parts.append(f'<path d="{BODY}" fill="{body}"/>')
    parts.append(f'<path d="{BELLY}" fill="{belly}"/>')
    parts.append(extra)
    if gill:
        parts.append(f'<path d="M54,35 C62,45 62,59 54,68" stroke="{INK}" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>')
    parts.append(f'<path d="M60,56 C72,70 90,72 96,62 C88,55 72,53 60,56 Z" fill="{fin}" opacity=".9"/>')
    parts.append(eye(38, 44, eye_r))
    if mouth:
        parts.append(f'<path d="M17,55 C21,57 25,57 29,55" stroke="{INK}" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/>')
    parts.append('</g>')
    return ''.join(parts)


# ---------------------------------------------------------------- specimens

def school7(uid):
    silver = ('#a3c2d6', '#eef4f7', '#81a1b8')
    gold = ('#f2c14e', '#fde9a8', '#d99f2e')
    pos = [(14, 22), (104, 6), (196, 26), (58, 66), (150, 58), (234, 80), (104, 106)]
    goldset = {2, 4}
    out = []
    for i, (x, y) in enumerate(pos):
        b, be, f = gold if i in goldset else silver
        out.append(fish(x, y, .34, .29, b, be, f, eye_r=7, cls='sway' if i % 2 else 'sway2'))
    return svg((310, 140), ''.join(out))


def school4(uid):
    blue = ('#4d8fd1', '#e3eef8', '#3b76b4')
    gold = ('#f2c14e', '#fde9a8', '#d99f2e')
    stripe = '<path d="M34,40 C74,31 128,32 152,48 C128,42 76,41 34,45 Z" fill="#f5d547"/>'
    pos = [(8, 14), (150, 4), (70, 64), (178, 78)]
    out = []
    for i, (x, y) in enumerate(pos):
        if i == 1:
            out.append(fish(x, y, .5, .42, *gold, cls='sway'))
        else:
            out.append(fish(x, y, .5, .42, *blue, tail_fill='#f0c93a', extra=stripe,
                            cls='sway2' if i % 2 else 'sway'))
    return svg((290, 125), ''.join(out))


def boxfish(uid):
    spots = [(52, 40), (76, 34), (100, 38), (124, 34), (62, 58), (88, 56), (114, 60), (140, 54),
             (54, 80), (80, 80), (106, 78), (132, 82)]
    s = ''.join(f'<circle cx="{x}" cy="{y}" r="{3.6 if i % 3 else 4.4}" fill="#1d1d2b"/>' for i, (x, y) in enumerate(spots))
    inner = (
        '<path d="M150,62 C160,50 176,46 184,54 C182,64 182,70 184,80 C176,86 160,80 150,70 Z" fill="#e0b020"/>'
        '<path d="M30,40 C30,28 42,22 58,22 L130,22 C146,22 156,32 156,46 L156,80 C156,96 146,104 130,104 L58,104 C42,104 30,96 30,82 C22,78 18,70 18,62 C18,54 22,46 30,40 Z" fill="#f4c430"/>'
        '<path d="M34,88 C40,98 50,102 60,102 L130,102 C144,102 152,94 154,84 C120,92 70,94 34,88 Z" fill="#f9dc75"/>'
        + s +
        '<path d="M110,24 C114,12 126,12 128,24 Z" fill="#e0b020"/>'
        '<path d="M66,70 C72,80 84,82 88,74 C82,68 72,66 66,70 Z" fill="#e0b020"/>'
        + eye(46, 48, 9) +
        '<ellipse cx="20" cy="64" rx="3.2" ry="2.6" fill="#b5653a"/>'
    )
    return svg((190, 112), inner)


def dolphin(uid):
    inner = (
        '<path d="M124,36 C132,20 144,12 158,10 C151,22 151,32 157,42 Z" fill="#6a88a1"/>'
        '<path d="M246,74 C254,60 262,52 270,50 C265,63 263,71 259,76 C263,82 267,92 270,102 C261,97 252,88 246,80 Z" fill="#6a88a1"/>'
        '<path d="M12,72 C18,68 26,67 34,64 C40,52 52,44 70,40 C104,32 160,34 200,52 C222,62 238,70 252,74 C236,80 222,84 200,84 C160,92 110,96 70,90 C52,88 40,84 32,80 C24,78 16,76 12,72 Z" fill="#7d9cb5"/>'
        '<path d="M30,78 C50,86 90,94 130,92 C165,90 195,84 215,80 C190,80 150,83 120,83 C80,83 50,81 30,78 Z" fill="#dbe5ed"/>'
        '<path d="M80,48 C110,38 160,40 196,56 C160,46 116,46 80,54 Z" fill="#8fadc4" opacity=".6"/>'
        '<path d="M86,86 C90,100 98,108 112,112 C107,101 105,93 107,87 Z" fill="#6a88a1"/>'
        '<circle cx="52" cy="61" r="3.6" fill="#1c2233"/><circle cx="51" cy="59.8" r="1.1" fill="#fff"/>'
        '<path d="M18,74 C27,77 36,77 45,72" stroke="#4f6b82" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    )
    return svg((272, 116), inner)


def pilotfish(uid):
    cid = f'{uid}-c'
    bands = ''.join(f'<rect x="{x}" y="0" width="13" height="100" fill="#2e4a68"/>' for x in (44, 72, 99, 124, 146))
    extra = (f'<clipPath id="{cid}"><path d="{BODY}"/></clipPath>'
             f'<g clip-path="url(#{cid})">{bands}</g>')
    return svg((204, 100), fish(2, 0, 1, 1, '#8aaccb', '#e1ebf3', '#6f93b5', tail_fill='#2e4a68', extra=extra))


def electric_ray(uid):
    spots = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#a9855a" opacity=".55"/>' for x, y, r in
                    [(96, 46, 5), (134, 56, 4), (150, 90, 5), (112, 104, 4), (84, 96, 3.5), (126, 78, 3)])
    inner = (
        '<path d="M168,60 C186,58 196,66 196,75 C196,84 186,92 168,90 Z" fill="#b8946a"/>'
        '<path d="M190,70 L232,72 L232,78 L190,80 Z" fill="#b8946a"/>'
        '<path d="M205,71 L212,64 L216,72 Z M218,72 L224,66 L227,72 Z" fill="#a8845a"/>'
        '<path d="M226,66 C236,62 244,66 246,75 C244,84 236,88 226,84 Z" fill="#b8946a"/>'
        '<path d="M30,75 C30,40 70,22 110,22 C150,22 178,44 182,75 C178,106 150,128 110,128 C70,128 30,110 30,75 Z" fill="#c8a47a"/>'
        '<ellipse cx="108" cy="75" rx="60" ry="38" fill="#d7b88f" opacity=".75"/>'
        + spots +
        '<circle cx="66" cy="64" r="5" fill="#2a2230"/><circle cx="64.6" cy="62.6" r="1.5" fill="#fff"/>'
        '<circle cx="66" cy="86" r="5" fill="#2a2230"/><circle cx="64.6" cy="84.6" r="1.5" fill="#fff"/>'
        '<path d="M246,75 C258,75 262,96 252,108 C243,118 248,132 262,132" stroke="#2b2b3a" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
        '<rect x="260" y="125" width="15" height="13" rx="2.5" fill="#2b2b3a"/>'
        '<rect x="274" y="127.5" width="8" height="2.6" rx="1" fill="#c9ccd6"/>'
        '<rect x="274" y="132.8" width="8" height="2.6" rx="1" fill="#c9ccd6"/>'
    )
    return svg((286, 146), inner)


def octopus(uid):
    arms = [
        'M86,96 C70,120 40,120 36,140 C33,156 50,162 57,151',
        'M100,98 C96,130 80,150 88,170 C92,181 105,179 104,170',
        'M118,98 C120,132 118,160 132,172 C140,178 151,172 146,163',
        'M134,96 C150,120 172,128 180,146 C186,160 174,168 167,158',
        'M76,92 C56,100 34,96 24,110 C18,119 25,127 33,122',
    ]
    a = ''.join(f'<path d="{d}" stroke="#e7784a" stroke-width="12" fill="none" stroke-linecap="round"/>' for d in arms)
    suck = ''.join(f'<circle cx="{x}" cy="{y}" r="2.4" fill="#f7c6aa"/>' for x, y in
                   [(64, 118), (46, 128), (95, 132), (88, 152), (121, 132), (126, 152), (158, 126), (172, 140), (52, 100), (34, 108)])
    inner = (
        a + suck +
        '<path d="M146,92 C170,98 188,90 196,74" stroke="#e7784a" stroke-width="11" fill="none" stroke-linecap="round"/>'
        '<g transform="rotate(14 196 44)">'
        '<rect x="180" y="18" width="34" height="50" rx="2" fill="#f5eedb"/>'
        '<ellipse cx="197" cy="18" rx="18" ry="5" fill="#e6dcc0"/><ellipse cx="197" cy="68" rx="18" ry="5" fill="#e6dcc0"/>'
        '<path d="M186,30 H208 M186,38 H208 M186,46 H204 M186,54 H208" stroke="#b9ab8a" stroke-width="2"/>'
        '</g>'
        '<path d="M190,70 C198,72 204,66 202,58" stroke="#e7784a" stroke-width="9" fill="none" stroke-linecap="round"/>'
        '<path d="M70,20 C100,0 150,4 164,34 C176,60 162,88 140,98 L96,98 C74,90 58,62 62,40 C64,32 66,26 70,20 Z" fill="#e7784a"/>'
        '<ellipse cx="102" cy="32" rx="24" ry="12" fill="#f39c72" opacity=".6"/>'
        '<circle cx="128" cy="30" r="4" fill="#c95b30"/><circle cx="146" cy="50" r="3" fill="#c95b30"/><circle cx="84" cy="46" r="3.4" fill="#c95b30"/>'
        + eye(98, 78, 7.5) + eye(134, 78, 7.5)
    )
    return svg((222, 184), inner)


def squid(uid):
    ink = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#1f1d33" opacity=".86"/>' for x, y, r in
                  [(32, 70, 22), (18, 54, 14), (50, 52, 13), (20, 88, 13), (46, 92, 15), (8, 72, 9), (64, 72, 10)])
    arms = ''.join(f'<path d="M92,{y0} C78,{y0 + d} 66,{y0 - d} {x1},{y1}" stroke="#d4606d" stroke-width="4.2" fill="none" stroke-linecap="round"/>'
                   for y0, d, x1, y1 in [(64, 6, 58, 60), (68, 5, 54, 66), (72, -5, 54, 76), (76, -6, 58, 82)])
    inner = (
        ink +
        '<path d="M92,66 C70,58 50,50 26,48" stroke="#d4606d" stroke-width="3" fill="none" stroke-linecap="round"/>'
        '<path d="M92,74 C70,82 50,90 28,94" stroke="#d4606d" stroke-width="3" fill="none" stroke-linecap="round"/>'
        '<ellipse cx="25" cy="48" rx="6" ry="4" fill="#d4606d"/><ellipse cx="27" cy="94" rx="6" ry="4" fill="#d4606d"/>'
        + arms +
        '<path d="M214,52 C226,34 244,36 254,50 C246,58 236,62 226,62 Z" fill="#d4606d"/>'
        '<path d="M214,88 C226,106 244,104 254,90 C246,82 236,78 226,78 Z" fill="#d4606d"/>'
        '<path d="M110,70 C120,52 170,44 214,52 C232,56 246,64 254,70 C246,76 232,84 214,88 C170,96 120,88 110,70 Z" fill="#e57b86"/>'
        '<path d="M124,62 C150,52 190,50 230,58 C190,56 150,58 124,66 Z" fill="#f09aa3" opacity=".7"/>'
        '<ellipse cx="104" cy="70" rx="17" ry="14" fill="#e57b86"/>'
        '<circle cx="150" cy="64" r="2.6" fill="#c9505e"/><circle cx="176" cy="76" r="2.4" fill="#c9505e"/><circle cx="198" cy="62" r="2.2" fill="#c9505e"/>'
        + eye(104, 66, 7)
    )
    return svg((258, 140), inner)


def lionfish(uid):
    cid = f'{uid}-c'
    spines = []
    memb = []
    for i in range(9):
        x0 = 66 + i * 12
        y0 = 62 - (6 if 2 < i < 7 else 2)
        x1 = x0 + 8 + i * 2.5
        y1 = 8 + abs(i - 3) * 5
        spines.append(f'<path d="M{x0},{y0} L{x1:.0f},{y1}" stroke="#a83a2a" stroke-width="2.6" stroke-linecap="round"/>')
        if i < 8:
            x2 = 66 + (i + 1) * 12 + 8 + (i + 1) * 2.5
            y2 = 8 + abs(i + 1 - 3) * 5
            memb.append(f'<path d="M{x0},{y0 + 4} L{x1:.0f},{y1 + 8} L{x2:.0f},{y2 + 8} L{x0 + 12},{y0 + 4} Z" fill="#f2cdbf" opacity=".55"/>')
    stripes = ''.join(f'<path d="M{x},20 L{x - 14},100" stroke="#b5402e" stroke-width="7"/>' for x in range(44, 200, 17))
    body_extra = f'<clipPath id="{cid}"><path d="{BODY}"/></clipPath><g clip-path="url(#{cid})">{stripes}</g>'
    fan = ''.join(f'<path d="M96,110 L{140 + i * 12},{168 - i * 6}" stroke="#b5402e" stroke-width="2" opacity=".7"/>' for i in range(6))
    inner = (
        ''.join(memb) + ''.join(spines) +
        '<path d="M92,104 C112,138 150,168 214,170 C190,146 160,126 124,100 Z" fill="#efc3b1" opacity=".85"/>' + fan +
        fish(24, 50, .92, .74, '#f5e6d6', '#fbf1e6', '#c8553f', tail='round', dorsal=False, extra=body_extra, eye_r=6.5)
        + '<path d="M40,98 C60,112 70,128 66,146 C58,132 50,118 36,106 Z" fill="#efc3b1" opacity=".8"/>'
    )
    return svg((226, 176), inner)


def swordfish(uid):
    dorsal = '<path d="M70,26 C72,-8 90,-16 102,-10 C96,4 104,18 120,26 Z" fill="#24466f"/>'
    inner = (
        '<path d="M72,51 L4,56 L72,61 Z" fill="#1f3c63"/>'
        f'<g transform="translate(52,18) scale(1.25,.8)">{dorsal}</g>'
        + fish(52, 16, 1.25, .8, '#2f5585', '#c4d3e3', '#24466f', tail='lunate', dorsal=False, eye_r=5)
    )
    return svg((306, 104), inner)


def brain_coral(uid):
    grooves = [
        'M34,112 C38,98 50,100 52,88 C54,76 68,78 70,66 C72,56 86,54 90,46',
        'M60,118 C60,104 74,106 76,94 C78,82 92,84 94,72 C96,60 110,60 112,50 C114,42 126,40 132,38',
        'M94,120 C94,108 108,108 110,96 C112,84 126,86 128,74 C130,64 142,64 146,56 C150,50 160,50 166,52',
        'M130,120 C130,110 144,108 148,98 C152,88 164,88 168,80 C172,72 180,74 186,78',
        'M24,94 C32,88 34,78 44,72 C52,66 54,58 62,52',
        'M164,122 C166,112 176,110 182,104 C186,98 192,98 196,100',
    ]
    g = ''.join(f'<path d="{d}" stroke="#b27238" stroke-width="3.6" fill="none" stroke-linecap="round"/>' for d in grooves)
    inner = (
        '<ellipse cx="108" cy="130" rx="92" ry="9" fill="#5f5a6c"/>'
        '<path d="M16,128 C12,72 58,26 108,26 C160,26 204,72 200,128 Z" fill="#d99a5b"/>'
        '<path d="M20,128 C22,104 34,82 50,68 C40,92 38,110 40,128 Z" fill="#c08447" opacity=".6"/>'
        '<ellipse cx="92" cy="48" rx="40" ry="13" fill="#eab983" opacity=".5"/>'
        + g +
        '<ellipse cx="40" cy="132" rx="16" ry="6" fill="#6d6878"/><ellipse cx="176" cy="133" rx="20" ry="6" fill="#6d6878"/>'
    )
    return svg((216, 140), inner)


def flying_fish(uid):
    inner = (
        '<path d="M100,60 C126,30 176,6 238,2 C214,26 180,50 140,68 Z" fill="#7fb2e0" opacity=".55"/>'
        '<path d="M232,62 H250 M226,72 H252 M236,82 H250" stroke="#d6ebff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>'
        + fish(26, 42, .98, .62, '#3f73b9', '#dbe7f5', '#2f5d9c', tail='flying', eye_r=7) +
        '<path d="M88,76 C112,44 160,18 222,12 C196,38 162,62 124,80 Z" fill="#a6d0f2" opacity=".9"/>'
        '<path d="M96,74 L206,20 M104,76 L196,34 M112,78 L184,48" stroke="#6fa6d8" stroke-width="1.6" opacity=".8"/>'
    )
    return svg((256, 118), inner)


def sea_turtle(uid):
    inner = (
        '<path d="M170,100 C190,110 206,124 214,138 C196,134 180,122 166,110 Z" fill="#8ea55a"/>'
        '<path d="M92,72 C80,42 96,14 120,4 C114,30 112,52 116,72 Z" fill="#7d944d"/>'
        '<path d="M60,86 C60,50 100,30 146,32 C186,34 212,58 212,86 C212,104 190,114 146,116 C100,118 60,112 60,86 Z" fill="#6f8f45"/>'
        '<path d="M60,90 C70,108 110,120 146,120 C186,120 208,108 212,90 C200,104 180,110 146,112 C110,114 76,106 60,90 Z" fill="#56722f"/>'
        '<path d="M104,52 L128,44 L152,48 L156,72 L132,82 L106,76 Z M156,48 L180,50 L196,66 L182,86 L156,72 Z M74,70 L104,52 L106,76 L82,96 Z M106,76 L132,82 L130,106 L96,104 Z M132,82 L156,72 L182,86 L166,106 L130,106 Z" fill="#7fa152" stroke="#55722f" stroke-width="2.4" stroke-linejoin="round"/>'
        '<path d="M62,78 C48,70 30,70 22,78 C16,84 20,94 32,96 C44,98 56,94 64,90 Z" fill="#a3b86c"/>'
        '<circle cx="35" cy="82" r="3.6" fill="#1c2233"/><circle cx="34" cy="81" r="1.1" fill="#fff"/>'
        '<path d="M22,90 C26,91 30,91 34,89" stroke="#56722f" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
        '<path d="M86,96 C76,118 54,136 26,146 C40,126 56,108 72,94 Z" fill="#93aa5d"/>'
    )
    return svg((220, 150), inner)


def pufferfish(uid):
    cx, cy, r = 92, 86, 62
    sp = []
    for i in range(26):
        a = math.radians(i * (360 / 26) + 5)
        if 140 < math.degrees(a) % 360 < 215:
            continue
        x1, y1 = cx + math.cos(a) * (r - 4), cy + math.sin(a) * (r - 4)
        x2, y2 = cx + math.cos(a) * (r + 12), cy + math.sin(a) * (r + 12)
        pa = a + math.pi / 2
        dx, dy = math.cos(pa) * 4, math.sin(pa) * 4
        sp.append(f'<path d="M{x1 + dx:.1f},{y1 + dy:.1f} L{x2:.1f},{y2:.1f} L{x1 - dx:.1f},{y1 - dy:.1f} Z" fill="#c79a3a"/>')
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="3" fill="#9c7a33" opacity=".75"/>' for x, y in
                   [(90, 40), (112, 46), (130, 60), (100, 60), (120, 80), (76, 50), (140, 82), (106, 34)])
    inner = (
        '<path d="M150,86 C164,74 180,72 188,80 C184,88 184,92 188,100 C180,108 164,104 150,94 Z" fill="#d8b04c"/>'
        + ''.join(sp) +
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#efcf6a"/>'
        '<path d="M36,100 C44,136 76,150 100,148 C128,146 150,128 154,104 C120,118 70,118 36,100 Z" fill="#fbeec7"/>'
        + dots +
        '<path d="M108,98 C120,90 132,92 136,102 C126,108 116,106 108,98 Z" fill="#d8b04c"/>'
        + eye(62, 70, 13) +
        '<ellipse cx="33" cy="95" rx="5.5" ry="4.5" fill="#b5653a"/>'
    )
    return svg((194, 164), inner)


def hammerhead(uid):
    inner = (
        '<path d="M120,62 C130,40 146,26 160,20 C155,40 151,54 151,64 Z" fill="#7a8795"/>'
        '<path d="M120,88 C130,110 146,124 160,130 C155,110 151,96 151,86 Z" fill="#7a8795"/>'
        '<path d="M206,68 C212,60 220,58 224,62 L218,72 Z M206,82 C212,90 220,92 224,88 L218,78 Z" fill="#7a8795"/>'
        '<path d="M258,75 C268,60 282,50 298,44 C292,60 290,68 286,75 C290,82 292,90 296,102 C282,94 268,88 258,75 Z" fill="#7a8795"/>'
        '<path d="M60,75 C60,68 80,62 110,60 C160,56 210,64 240,72 C250,74 256,74 264,75 C256,76 250,76 240,78 C210,86 160,94 110,90 C80,88 60,82 60,75 Z" fill="#8d9aa8"/>'
        '<path d="M34,36 C40,32 50,34 54,40 C58,50 62,58 74,64 L74,86 C62,92 58,100 54,110 C50,116 40,118 34,114 C30,110 32,102 36,96 C40,88 42,82 42,75 C42,68 40,62 36,54 C32,48 30,40 34,36 Z" fill="#8d9aa8"/>'
        '<path d="M86,75 L250,75" stroke="#6f7b89" stroke-width="3" stroke-linecap="round" opacity=".55"/>'
        '<path d="M70,70 C100,66 150,64 200,70" stroke="#a8b3bf" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>'
        '<circle cx="39" cy="41" r="3.6" fill="#1c2233"/><circle cx="39" cy="109" r="3.6" fill="#1c2233"/>'
    )
    return svg((300, 150), inner)


def nautilus(uid):
    cx, cy = 120, 88
    stripes = []
    for i in range(9):
        a0 = math.radians(-100 + i * 26)
        a1 = a0 + math.radians(9)
        ri, ro = 22, 70
        p1 = (cx + math.cos(a0) * ri, cy + math.sin(a0) * ri)
        p2 = (cx + math.cos(a0 + .35) * ro, cy + math.sin(a0 + .35) * ro)
        p3 = (cx + math.cos(a1 + .45) * ro, cy + math.sin(a1 + .45) * ro)
        p4 = (cx + math.cos(a1) * ri, cy + math.sin(a1) * ri)
        stripes.append(f'<path d="M{p1[0]:.1f},{p1[1]:.1f} Q{(p1[0] + p2[0]) / 2 + 6:.1f},{(p1[1] + p2[1]) / 2 - 4:.1f} {p2[0]:.1f},{p2[1]:.1f} L{p3[0]:.1f},{p3[1]:.1f} Q{(p3[0] + p4[0]) / 2 + 6:.1f},{(p3[1] + p4[1]) / 2 - 4:.1f} {p4[0]:.1f},{p4[1]:.1f} Z" fill="#b5673d" opacity=".85"/>')
    cid = f'{uid}-c'
    tent = ''.join(f'<path d="M58,{y0} C40,{y0 + d} 26,{y0 - d} {x1},{y1}" stroke="#d9b99a" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
                   for y0, d, x1, y1 in [(80, 4, 12, 70), (86, 3, 8, 84), (92, -3, 10, 98), (98, -4, 16, 110), (84, 8, 20, 62), (96, -8, 24, 118), (90, 0, 4, 91)])
    inner = (
        tent +
        f'<clipPath id="{cid}"><circle cx="{cx}" cy="{cy}" r="72"/></clipPath>'
        f'<circle cx="{cx}" cy="{cy}" r="72" fill="#f3e6d0"/>'
        f'<g clip-path="url(#{cid})">{"".join(stripes)}</g>'
        f'<path d="M{cx},{cy - 14} A14,14 0 1,1 {cx - 12},{cy + 8} A26,26 0 1,0 {cx + 24},{cy - 20}" stroke="#d8c3a1" stroke-width="3" fill="none"/>'
        f'<circle cx="{cx + 2}" cy="{cy + 2}" r="9" fill="#e5d3b3"/>'
        '<path d="M48,88 C48,58 66,40 86,44 C76,60 74,76 78,94 C72,112 62,120 50,114 C48,106 48,96 48,88 Z" fill="#7a4a36"/>'
        '<circle cx="66" cy="72" r="5.4" fill="#1c1c2e"/><circle cx="64.6" cy="70.4" r="1.6" fill="#fff"/>'
    )
    return svg((196, 164), inner)


def grouper(uid):
    cid = f'{uid}-c'
    spots = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#5a4a36" opacity=".55"/>' for x, y, r in
                    [(70, 36, 5), (96, 30, 4), (120, 40, 5), (84, 54, 4), (110, 58, 6), (136, 50, 4), (60, 60, 3.5), (130, 66, 4), (100, 72, 3.5), (146, 42, 3)])
    extra = f'<clipPath id="{cid}"><path d="{BODY}"/></clipPath><g clip-path="url(#{cid})">{spots}</g>' \
            '<path d="M14,52 C18,64 30,68 44,62" stroke="#3d3226" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    return svg((244, 124), fish(2, 0, 1.2, 1.22, '#7c6a50', '#b9a585', '#5f513d', tail='round', eye_r=5, extra=extra, mouth=False))


def staghorn(uid):
    br = [
        'M105,166 L100,120 L70,90 L52,50 L40,18',
        'M70,90 L86,56 L92,26',
        'M100,120 L128,92 L152,58 L166,24',
        'M128,92 L118,60 L124,28',
        'M100,120 L102,80 L108,42',
        'M52,50 L28,38',
        'M152,58 L180,48',
        'M70,90 L40,82',
    ]
    b = ''.join(f'<path d="{d}" stroke="#d9a38e" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' for d in br)
    tips = ''.join(f'<circle cx="{x}" cy="{y}" r="6.5" fill="#f4d3c6"/>' for x, y in
                   [(40, 18), (92, 26), (166, 24), (124, 28), (108, 42), (28, 38), (180, 48), (40, 82)])
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="1.8" fill="#b97d68"/>' for x, y in
                   [(98, 140), (84, 104), (62, 72), (48, 36), (88, 44), (140, 76), (160, 42), (120, 46), (104, 60), (102, 100)])
    inner = '<ellipse cx="106" cy="168" rx="68" ry="11" fill="#6d6878"/>' + b + tips + dots
    return svg((212, 180), inner)


def hermit_crab(uid):
    inner = (
        '<path d="M60,122 C38,100 42,60 76,40 C110,20 160,30 176,62 C190,92 172,124 140,132 C110,138 80,138 60,122 Z" fill="#d9b489"/>'
        '<path d="M80,46 C104,36 144,40 166,70 M70,70 C96,56 140,58 170,92 M66,98 C92,86 130,90 156,120" stroke="#c49a69" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>'
        '<path d="M150,72 C150,58 134,52 124,60 C114,68 120,84 134,84 C150,84 160,68 154,52 C148,38 124,34 110,46" stroke="#a9804f" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
        '<ellipse cx="68" cy="112" rx="25" ry="19" fill="#5e3e2b"/>'
        '<path d="M56,106 L44,84 M66,104 L62,80" stroke="#d4553a" stroke-width="4" stroke-linecap="round"/>'
        '<circle cx="44" cy="82" r="5" fill="#1c1c2e"/><circle cx="42.6" cy="80.6" r="1.5" fill="#fff"/>'
        '<circle cx="62" cy="78" r="5" fill="#1c1c2e"/><circle cx="60.6" cy="76.6" r="1.5" fill="#fff"/>'
        '<path d="M52,128 L40,146 M60,130 L54,150" stroke="#c24a31" stroke-width="5" stroke-linecap="round"/>'
        '<path d="M46,114 C30,110 20,120 24,131 C28,141 44,141 51,132 C55,126 54,117 46,114 Z" fill="#d4553a"/>'
        '<path d="M24,124 C30,124 34,126 38,128" stroke="#a83a27" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    )
    return svg((196, 156), inner)


def manta(uid):
    inner = (
        '<path d="M196,80 L298,80" stroke="#26324a" stroke-width="3" stroke-linecap="round"/>'
        '<path d="M40,80 C60,70 92,40 152,6 C160,30 172,52 198,68 C222,74 246,77 262,80 C246,83 222,86 198,92 C172,108 160,130 152,154 C92,120 60,90 40,80 Z" fill="#2f3d52"/>'
        '<path d="M92,64 C112,50 132,36 150,24 C142,44 134,58 122,70 Z" fill="#e3eaf0" opacity=".92"/>'
        '<path d="M92,96 C112,110 132,124 150,136 C142,116 134,102 122,90 Z" fill="#e3eaf0" opacity=".92"/>'
        '<ellipse cx="116" cy="80" rx="54" ry="15" fill="#3a4b63"/>'
        '<path d="M44,72 C32,62 22,62 16,70 C24,72 32,75 40,78 Z M44,88 C32,98 22,98 16,90 C24,88 32,85 40,82 Z" fill="#26324a"/>'
        '<circle cx="46" cy="71" r="2.8" fill="#0f1420"/><circle cx="46" cy="89" r="2.8" fill="#0f1420"/>'
    )
    return svg((300, 160), inner)


def barreleye(uid):
    gid = f'{uid}-g'
    inner = (
        f'<defs><radialGradient id="{gid}"><stop offset="0" stop-color="#8dffb9" stop-opacity=".55"/><stop offset="1" stop-color="#8dffb9" stop-opacity="0"/></radialGradient></defs>'
        '<path d="M120,96 C140,118 170,126 200,122 C180,110 160,100 140,90 Z" fill="#9aa7c9" opacity=".35"/>'
        + fish(26, 40, .98, .78, '#454a5e', '#6c728a', '#373c50', tail='round', eye_r=0.01, gill=False, mouth=False,
               extra='<circle cx="30" cy="56" r="3" fill="#1c1f2b"/><circle cx="40" cy="58" r="2.4" fill="#1c1f2b"/>')
        + f'<circle cx="80" cy="44" r="30" fill="url(#{gid})"/>'
        '<rect x="66" y="34" width="11" height="24" rx="5.5" fill="#62d98f"/><rect x="82" y="32" width="11" height="24" rx="5.5" fill="#62d98f"/>'
        '<ellipse cx="71.5" cy="35" rx="4.4" ry="3.2" fill="#d9ffe6"/><ellipse cx="87.5" cy="33" rx="4.4" ry="3.2" fill="#d9ffe6"/>'
        '<path d="M40,64 C38,40 56,18 84,16 C112,14 132,34 130,62" fill="#cdefff" fill-opacity=".13" stroke="#dff5ff" stroke-opacity=".6" stroke-width="1.8"/>'
        '<path d="M56,30 C64,24 74,21 84,21" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    )
    return svg((228, 128), inner)


def red_jelly(uid):
    gid = f'{uid}-g'
    arms = [
        'M78,98 C66,134 88,164 74,200 C68,218 76,232 86,236 C94,220 90,200 98,176 C106,150 94,124 98,100 Z',
        'M104,102 C98,140 118,168 108,206 C104,222 110,234 120,236 C126,218 124,196 128,172 C132,146 118,126 120,102 Z',
        'M128,100 C134,136 152,158 146,196 C144,212 150,226 160,228 C164,210 162,190 162,168 C162,142 146,124 142,98 Z',
        'M58,96 C48,124 60,148 50,176 C46,190 52,200 60,202 C66,188 64,172 70,154 C76,134 70,116 74,98 Z',
    ]
    a = ''.join(f'<path d="{d}" fill="#8f1a26" class="arm"/>' for d in arms)
    inner = (
        f'<defs><radialGradient id="{gid}"><stop offset="0" stop-color="#ff5b6b" stop-opacity=".32"/><stop offset="1" stop-color="#ff5b6b" stop-opacity="0"/></radialGradient></defs>'
        f'<circle cx="110" cy="96" r="100" fill="url(#{gid})"/>'
        + a +
        '<g class="bell"><path d="M30,96 C30,40 70,14 110,14 C150,14 190,40 190,96 C176,104 160,100 150,108 C136,100 124,108 110,104 C96,108 84,100 70,108 C60,100 44,104 30,96 Z" fill="#b3222f"/>'
        '<path d="M52,54 C62,32 88,22 110,22 C90,30 74,44 64,64 Z" fill="#dc4b56" opacity=".75"/>'
        '<path d="M36,94 C60,86 90,84 110,84 C136,84 160,86 184,94" stroke="#7f1420" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/></g>'
    )
    return svg((220, 240), inner)


def anglerfish(uid):
    gid = f'{uid}-g'
    teeth_top = ''.join(f'<path d="M{x},{y} l4,10 l4,-10 Z" fill="#f3efe6"/>' for x, y in [(44, 103), (54, 101), (64, 102), (74, 105), (84, 109)])
    teeth_bot = ''.join(f'<path d="M{x},{y} l4,-11 l4,11 Z" fill="#f3efe6"/>' for x, y in [(42, 136), (52, 133), (62, 130), (72, 127), (82, 123)])
    star = []
    for i in range(10):
        a = math.radians(-90 + i * 36)
        r = 6.2 if i % 2 == 0 else 2.6
        star.append(f'{60 + math.cos(a) * r:.1f},{28 + math.sin(a) * r:.1f}')
    inner = (
        f'<defs><radialGradient id="{gid}"><stop offset="0" stop-color="#fff7b8" stop-opacity=".9"/><stop offset=".35" stop-color="#ffe36b" stop-opacity=".35"/><stop offset="1" stop-color="#ffe36b" stop-opacity="0"/></radialGradient></defs>'
        f'<circle cx="60" cy="28" r="58" fill="url(#{gid})" class="lure-glow"/>'
        '<path d="M210,104 C226,86 240,82 248,88 C244,104 244,116 248,132 C240,136 226,130 210,116 Z" fill="#231d2c"/>'
        '<path d="M150,52 C160,38 176,38 182,52 Z" fill="#231d2c"/>'
        '<path d="M52,96 C60,64 96,46 138,48 C184,50 214,78 214,110 C214,142 184,164 140,166 C100,168 70,154 58,138 Z" fill="#2e2638"/>'
        '<path d="M40,104 C56,96 76,100 96,112 C80,124 64,132 44,136 C38,126 36,114 40,104 Z" fill="#5a1f2e"/>'
        + teeth_top + teeth_bot +
        '<path d="M36,136 C54,132 78,126 100,116 C98,130 84,148 60,154 C46,156 36,148 36,136 Z" fill="#3a3046"/>'
        '<path d="M130,120 C144,110 160,114 164,128 C150,134 138,132 130,120 Z" fill="#231d2c"/>'
        '<circle cx="150" cy="80" r="2.4" fill="#3d3349"/><circle cx="170" cy="96" r="2" fill="#3d3349"/><circle cx="160" cy="140" r="2.4" fill="#3d3349"/><circle cx="186" cy="120" r="2" fill="#3d3349"/>'
        '<circle cx="106" cy="80" r="5.2" fill="#d6d1e6"/><circle cx="105" cy="80" r="2.6" fill="#1c1c2e"/>'
        '<path d="M112,52 C104,18 80,8 62,22" stroke="#4a3f58" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
        '<circle cx="60" cy="28" r="10" fill="#fff3a0" class="lure"/>'
        f'<polygon points="{" ".join(star)}" fill="#f6b928"/>'
    )
    return svg((252, 172), inner)


def snailfish_group(uid, glow_index=None, face_right=True):
    body = 'M4,14 C4,6 12,2 20,3 C30,4 38,10 50,12 C58,13 64,14 72,16 C64,18 56,19 48,20 C36,22 28,26 18,26 C10,26 4,22 4,14 Z'
    gid = f'{uid}-g'
    out = [f'<defs><radialGradient id="{gid}"><stop offset="0" stop-color="#fff3b0" stop-opacity=".75"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient></defs>']
    idx = 0
    for row in range(2):
        for col in range(5):
            x = 6 + col * 74 + (row * 30)
            y = 10 + row * 42
            glow = idx == glow_index
            fill = '#fff1c9' if glow else '#f3c3cd'
            if glow:
                out.append(f'<circle cx="{x + 36}" cy="{y + 14}" r="40" fill="url(#{gid})"/>')
            tr = f'translate({x},{y})' if not face_right else f'translate({x + 76},{y}) scale(-1,1)'
            out.append(f'<g transform="{tr}"><path d="{body}" fill="{fill}" opacity=".92"/>'
                       f'<path d="M22,7 C28,10 30,16 26,21" stroke="#e7a2b1" stroke-width="1.4" fill="none" opacity=".7"/>'
                       f'<circle cx="12" cy="11" r="2.2" fill="#2a2230"/></g>')
            idx += 1
    return svg((412, 80), ''.join(out))


# ---------------------------------------------------------------- floats (no published odds)

def f_glass(uid):
    cid = f'{uid}-c'
    net = ''.join(f'<path d="M{x},10 L{x + 50},90 M{x + 50},10 L{x},90" stroke="#8a6a44" stroke-width="1.8"/>' for x in range(0, 120, 16))
    return svg((120, 92), f'<circle cx="60" cy="50" r="31" fill="#76c49a" opacity=".85"/><ellipse cx="50" cy="38" rx="11" ry="7" fill="#e6fff0" opacity=".7"/>'
               f'<clipPath id="{cid}"><circle cx="60" cy="50" r="32"/></clipPath><g clip-path="url(#{cid})">{net}</g>'
               '<path d="M60,19 C56,10 64,4 60,-2" stroke="#8a6a44" stroke-width="2.4" fill="none"/>')


def f_buoy(uid):
    return svg((120, 92), '<path d="M30,50 A30,30 0 0 1 90,50 Z" fill="#e04b3f"/><path d="M30,50 A30,30 0 0 0 90,50 Z" fill="#f7f1e3"/>'
               '<rect x="30" y="47" width="60" height="6" fill="#c33a30"/><ellipse cx="48" cy="34" rx="8" ry="5" fill="#fff" opacity=".45"/>'
               '<path d="M52,20 C52,8 68,8 68,20" stroke="#8d8f9c" stroke-width="3.4" fill="none"/>')


def f_cork(uid):
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="1.6" fill="#9d6d3c"/>' for x, y in [(40, 40), (52, 52), (64, 42), (78, 50), (86, 38), (46, 56), (70, 58)])
    return svg((120, 92), '<path d="M4,48 H116" stroke="#e8dcc0" stroke-width="3"/><rect x="28" y="28" width="64" height="40" rx="16" fill="#c9955b"/>'
               '<rect x="28" y="28" width="64" height="12" rx="6" fill="#d9aa73"/>' + dots)


def f_orange(uid):
    return svg((120, 92), '<circle cx="60" cy="50" r="30" fill="#f08a3c"/><path d="M31,44 H89 V56 H31 Z" fill="#f7f1e3"/>'
               '<ellipse cx="48" cy="34" rx="9" ry="5" fill="#fff" opacity=".45"/><path d="M54,20 C54,12 66,12 66,20" stroke="#8d8f9c" stroke-width="3" fill="none"/>')


def f_globe(uid):
    cid = f'{uid}-c'
    return svg((120, 92), f'<clipPath id="{cid}"><circle cx="60" cy="48" r="32"/></clipPath>'
               '<circle cx="60" cy="48" r="32" fill="#4f8fd8"/>'
               f'<g clip-path="url(#{cid})"><path d="M30,30 C40,22 54,26 56,36 C58,46 46,48 44,58 C42,66 32,64 28,56 Z" fill="#6fbf5a"/>'
               '<path d="M66,22 C78,20 90,28 90,40 C84,44 74,40 70,46 C66,52 72,62 66,68 C60,62 62,50 58,42 C56,32 60,24 66,22 Z" fill="#6fbf5a"/>'
               '<path d="M60,16 C44,30 44,66 60,80 M60,16 C76,30 76,66 60,80 M28,48 H92" stroke="#fff" stroke-width="1.4" fill="none" opacity=".55"/></g>'
               '<ellipse cx="48" cy="32" rx="9" ry="5" fill="#fff" opacity=".35"/>')


def f_bowl(uid):
    return svg((120, 92), '<path d="M20,40 H100 C98,64 82,78 60,78 C38,78 22,64 20,40 Z" fill="#b8793f"/>'
               '<ellipse cx="60" cy="40" rx="40" ry="8" fill="#d39658"/><ellipse cx="60" cy="41" rx="33" ry="5" fill="#8f5a2c"/>'
               '<path d="M30,52 C44,58 76,58 90,52 M36,64 C50,69 70,69 84,64" stroke="#9e6634" stroke-width="1.6" fill="none" opacity=".7"/>')


def f_bottle(uid):
    return svg((120, 92), '<g transform="rotate(-24 60 48)"><rect x="30" y="34" width="56" height="28" rx="12" fill="#7cc2a0" opacity=".78"/>'
               '<rect x="84" y="41" width="16" height="14" rx="3" fill="#7cc2a0" opacity=".78"/><rect x="98" y="42" width="9" height="12" rx="2" fill="#c9955b"/>'
               '<rect x="40" y="40" width="34" height="16" rx="7" fill="#f3ead3"/><path d="M44,45 H70 M44,50 H66" stroke="#b9ab8a" stroke-width="1.4"/>'
               '<rect x="36" y="37" width="30" height="4" rx="2" fill="#fff" opacity=".4"/></g>')


def f_cap(uid):
    return svg((120, 92), '<path d="M36,50 C36,64 84,64 84,50 L84,40 L36,40 Z" fill="#23234a"/>'
               '<path d="M60,18 L108,36 L60,54 L12,36 Z" fill="#2c2c54"/><path d="M60,22 L100,36 L60,50 L20,36 Z" fill="#3a3a6a"/>'
               '<path d="M60,36 L96,46 L96,64" stroke="#f2c14e" stroke-width="2.4" fill="none"/><path d="M92,62 L100,62 L98,74 L94,74 Z" fill="#f2c14e"/>'
               '<circle cx="60" cy="36" r="3" fill="#f2c14e"/>')


def f_seal(uid):
    return svg((120, 92), '<path d="M14,60 C14,40 40,30 66,34 C88,37 104,48 110,60 C104,70 88,76 66,76 C40,78 14,74 14,60 Z" fill="#9aa3ad"/>'
               '<path d="M104,56 C112,48 118,48 120,54 C116,60 114,64 118,70 C112,72 106,66 104,62 Z" fill="#848d98"/>'
               '<path d="M20,66 C40,74 70,76 96,70 C74,72 44,72 20,66 Z" fill="#c7cdd4"/>'
               '<circle cx="46" cy="44" r="2.4" fill="#6f7884"/><circle cx="72" cy="42" r="2" fill="#6f7884"/><circle cx="86" cy="52" r="2.2" fill="#6f7884"/>'
               '<circle cx="26" cy="50" r="5.4" fill="#1c1c2e"/><circle cx="24.6" cy="48.6" r="1.8" fill="#fff"/>'
               '<ellipse cx="15" cy="58" rx="3" ry="2.4" fill="#2a2230"/>'
               '<path d="M18,62 L4,60 M18,64 L5,66 M20,62 L8,56" stroke="#d6dbe0" stroke-width="1" />'
               '<path d="M58,72 C56,82 62,86 70,84 C68,80 66,76 68,72 Z" fill="#848d98"/>')


def f_bell(uid):
    return svg((120, 92), '<path d="M36,70 L44,40 H76 L84,70 Z" fill="#d9483b"/><rect x="30" y="68" width="60" height="10" rx="3" fill="#b83a2f"/>'
               '<path d="M48,40 L54,12 M72,40 L66,12 M52,24 H68" stroke="#6b6d7c" stroke-width="3" stroke-linecap="round"/>'
               '<path d="M52,32 C52,22 68,22 68,32 L70,36 H50 Z" fill="#e3b341"/><circle cx="60" cy="37.5" r="2" fill="#b98a22"/>'
               '<rect x="46" y="50" width="28" height="4" fill="#f7f1e3" opacity=".8"/>')


def f_crate(uid):
    return svg((120, 92), '<rect x="30" y="26" width="60" height="50" fill="#b98a55"/>'
               '<path d="M30,42 H90 M30,58 H90" stroke="#9c6f3e" stroke-width="2.4"/><path d="M30,26 L90,76 M30,76 L90,26" stroke="#a57746" stroke-width="4" opacity=".6"/>'
               '<rect x="30" y="26" width="60" height="50" fill="none" stroke="#8a5f33" stroke-width="4"/>')


def f_ring(uid):
    return svg((120, 92), '<circle cx="60" cy="48" r="26" fill="none" stroke="#f7f1e3" stroke-width="14"/>'
               '<circle cx="60" cy="48" r="26" fill="none" stroke="#e04b3f" stroke-width="14" stroke-dasharray="20.4 20.4" transform="rotate(-10 60 48)"/>'
               '<circle cx="60" cy="48" r="33" fill="none" stroke="#d9c39a" stroke-width="1.6" stroke-dasharray="6 5"/>')


def f_spar(uid):
    return svg((120, 92), '<path d="M50,84 L54,26 H66 L70,84 Z" fill="#3f9a64"/><path d="M52.6,46 H67.4 L68.4,62 H51.6 Z" fill="#f7f1e3"/>'
               '<path d="M60,26 V6" stroke="#6b6d7c" stroke-width="2.4"/><path d="M60,6 L80,11 L60,16 Z" fill="#e04b3f"/>')


def f_bobbers(uid):
    out = []
    for i in range(4):
        x = 20 + i * 27
        out.append(f'<path d="M{x},46 A11,11 0 0 1 {x + 22},46 Z" fill="#e04b3f"/><path d="M{x},46 A11,11 0 0 0 {x + 22},46 Z" fill="#f7f1e3"/>'
                   f'<path d="M{x + 11},35 V26 M{x + 11},57 V64" stroke="#6b6d7c" stroke-width="2"/>')
    return svg((120, 92), '<path d="M10,66 C40,72 80,72 112,64" stroke="#e8dcc0" stroke-width="1.6" fill="none"/>' + ''.join(out))


def f_can(uid):
    return svg((120, 92), '<rect x="38" y="30" width="44" height="46" rx="4" fill="#4aa06a"/><rect x="38" y="30" width="44" height="8" rx="4" fill="#5fb87e"/>'
               '<rect x="34" y="70" width="52" height="8" rx="3" fill="#357a4f"/><path d="M60,30 V16" stroke="#6b6d7c" stroke-width="3"/>'
               '<circle cx="60" cy="13" r="5" fill="#bff5c9"/><rect x="50" y="46" width="20" height="14" rx="2" fill="#f7f1e3" opacity=".85"/>')


def f_octo(uid):
    legs = ''.join(f'<path d="M{34 + i * 7.5},58 C{32 + i * 7.5},70 {40 + i * 7.5},72 {37 + i * 7.5},80" stroke="#ef8fb1" stroke-width="6" fill="none" stroke-linecap="round"/>' for i in range(8))
    return svg((120, 92), legs + '<path d="M28,58 C24,30 42,12 60,12 C78,12 96,30 92,58 Z" fill="#f29ab8"/>'
               '<ellipse cx="50" cy="26" rx="12" ry="7" fill="#fff" opacity=".4"/>'
               '<circle cx="50" cy="42" r="4" fill="#2a2230"/><circle cx="70" cy="42" r="4" fill="#2a2230"/>'
               '<path d="M54,50 C58,54 62,54 66,50" stroke="#2a2230" stroke-width="2" fill="none" stroke-linecap="round"/>')


def f_corks3(uid):
    out = []
    for i in range(3):
        x = 22 + i * 28
        out.append(f'<rect x="{x}" y="{34 + (i % 2) * 8}" width="22" height="30" rx="6" fill="#c9955b"/><rect x="{x}" y="{34 + (i % 2) * 8}" width="22" height="8" rx="4" fill="#d9aa73"/>')
    return svg((120, 92), ''.join(out))


def f_bronze(uid):
    return svg((120, 92), '<circle cx="60" cy="50" r="30" fill="#c9864a"/><circle cx="60" cy="50" r="23" fill="#b57236"/>'
               '<ellipse cx="48" cy="34" rx="9" ry="5" fill="#fff" opacity=".35"/>'
               '<text x="60" y="61" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#f7f1e3">3</text>'
               '<path d="M54,20 C54,12 66,12 66,20" stroke="#8d8f9c" stroke-width="3" fill="none"/>')


# ---------------------------------------------------------------- scene

def pier_group():
    """Pier + diving board in local coords, waterline at y=0. Deck top y=-78. Board tip (446,-100)."""
    posts = ''.join(f'<rect x="{x}" y="-68" width="14" height="140" fill="url(#pier-post)"/>' for x in (12, 84, 156, 228, 292))
    braces = ''.join(f'<path d="M{a + 7},-58 L{b + 7},-10 M{b + 7},-58 L{a + 7},-10" stroke="#5a3620" stroke-width="5" opacity=".85"/>' for a, b in ((12, 84), (84, 156), (156, 228), (228, 292)))
    seams = ''.join(f'<path d="M{x},-78 V-66" stroke="#8a5731" stroke-width="1.2" opacity=".55"/>' for x in range(22, 312, 24))
    return (
        '<defs><linearGradient id="pier-post" x1="0" y1="-68" x2="0" y2="72" gradientUnits="userSpaceOnUse">'
        '<stop offset="0" stop-color="#6e4426"/><stop offset=".485" stop-color="#6e4426"/>'
        '<stop offset=".5" stop-color="#23606a" stop-opacity=".85"/><stop offset="1" stop-color="#0d6a78" stop-opacity="0"/></linearGradient>'
        '<linearGradient id="ladder-g" x1="0" y1="-78" x2="0" y2="46" gradientUnits="userSpaceOnUse">'
        '<stop offset="0" stop-color="#c9ccd6"/><stop offset=".62" stop-color="#c9ccd6"/><stop offset=".64" stop-color="#6fb7c2" stop-opacity=".8"/><stop offset="1" stop-color="#6fb7c2" stop-opacity="0"/></linearGradient></defs>'
        + posts + braces +
        '<rect x="0" y="-80" width="312" height="14" fill="#a86d40"/><rect x="0" y="-80" width="312" height="3.5" fill="#c58a58"/>' + seams +
        '<rect x="318" y="-78" width="3" height="124" fill="url(#ladder-g)"/><rect x="336" y="-78" width="3" height="124" fill="url(#ladder-g)"/>'
        + ''.join(f'<rect x="318" y="{y}" width="21" height="2.6" fill="url(#ladder-g)"/>' for y in (-60, -40, -20, 0, 20)) +
        '<path d="M318,-78 C318,-92 339,-92 339,-78" stroke="#c9ccd6" stroke-width="3" fill="none"/>'
        # lamp post + life ring
        '<rect x="38" y="-152" width="4.5" height="72" fill="#3f3f55"/><path d="M30,-152 H50 L46,-166 H34 Z" fill="#2c2c54"/><circle cx="40" cy="-150" r="4" fill="#fff3b0"/>'
        '<circle cx="40" cy="-110" r="10" fill="none" stroke="#f7f1e3" stroke-width="5.5"/>'
        '<circle cx="40" cy="-110" r="10" fill="none" stroke="#e04b3f" stroke-width="5.5" stroke-dasharray="7.85 7.85"/>'
        # bollard + rope
        '<rect x="232" y="-96" width="14" height="16" rx="3" fill="#3f3f55"/><rect x="229" y="-99" width="20" height="5" rx="2" fill="#4d4d66"/>'
        '<ellipse cx="266" cy="-84" rx="14" ry="4.5" fill="none" stroke="#d9c39a" stroke-width="3"/><ellipse cx="266" cy="-86" rx="9" ry="3" fill="none" stroke="#d9c39a" stroke-width="2.6"/>'
        # board stand
        '<rect x="290" y="-98" width="22" height="18" rx="2" fill="#d4d7de"/><rect x="290" y="-98" width="22" height="4" fill="#e6e8ee"/>'
        '<g id="board"><rect x="292" y="-104" width="156" height="7" rx="3" fill="#f4f1e8"/><rect x="292" y="-100.5" width="156" height="1.8" fill="#4d8fd1"/></g>'
    )


def diver_standing():
    """Tiny swimmer, feet at (0,0), arms up. Height ~66."""
    skin = '#a8683f'
    return (
        f'<path d="M-3.4,-43 L-4.6,-63 M3.4,-43 L4.6,-63" stroke="{skin}" stroke-width="3.8" stroke-linecap="round"/>'
        f'<rect x="-5" y="-22" width="4.2" height="22" rx="2" fill="{skin}"/><rect x="0.8" y="-22" width="4.2" height="22" rx="2" fill="{skin}"/>'
        f'<rect x="-6.2" y="-45" width="12.4" height="19" rx="5" fill="{skin}"/>'
        '<rect x="-6.4" y="-29" width="12.8" height="9" rx="2.5" fill="#2c2c54"/>'
        f'<circle cx="0" cy="-51" r="6.4" fill="{skin}"/><path d="M-6.6,-51.5 A6.6,6.6 0 0 1 6.6,-51.5 Z" fill="#e05a47"/>'
        '<rect x="0.5" y="-51.5" width="6.5" height="2.8" rx="1.4" fill="#7fd0f0"/>'
    )


def raft_group():
    """Raft in local coords, waterline y=0, centred on x=0."""
    lash = ''.join(f'<rect x="{x}" y="-14" width="6" height="22" fill="#d9c39a"/>' for x in (-78, -26, 26, 74))
    return (
        '<rect x="-4" y="-124" width="5" height="108" fill="#7a4f2c"/>'
        '<path d="M1,-122 C30,-128 62,-112 104,-120 L104,-80 C62,-72 30,-88 1,-82 Z" fill="#f7f1e3"/>'
        '<text x="52" y="-106" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="11.5" fill="#2c2c54" letter-spacing=".4">NO PUBLISHED</text>'
        '<text x="52" y="-91" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="11.5" fill="#2c2c54" letter-spacing=".4">ODDS</text>'
        '<rect x="-64" y="-36" width="18" height="18" rx="4" fill="#8d5a34"/><rect x="-64" y="-31" width="18" height="2.4" fill="#6b4225"/><rect x="-64" y="-24" width="18" height="2.4" fill="#6b4225"/>'
        '<rect x="34" y="-38" width="22" height="20" fill="#c28f58"/><path d="M34,-38 L56,-18 M56,-38 L34,-18" stroke="#9c6f3e" stroke-width="2"/>'
        '<rect x="-104" y="-20" width="208" height="7" rx="2" fill="#b07a47"/>'
        '<rect x="-110" y="-14" width="220" height="22" rx="11" fill="#9a6a3e"/>'
        '<rect x="-110" y="-14" width="220" height="5" rx="2.5" fill="#b3804f"/>'
        + lash +
        '<circle cx="-104" cy="-3" r="10" fill="#c49a6c"/><circle cx="-104" cy="-3" r="6" fill="none" stroke="#9a6a3e" stroke-width="1.4"/><circle cx="-104" cy="-3" r="2.4" fill="#9a6a3e"/>'
        '<rect x="-112" y="0" width="224" height="10" fill="#0b6f7d" opacity=".42"/>'
    )


def hadal_diver():
    """Scuba diver with a headlamp, facing left, descending. viewBox 320x190."""
    skin = '#a8683f'
    return svg((320, 190), (
        '<defs><linearGradient id="beam-g" x1="1" y1="0" x2="0" y2="0">'
        '<stop offset="0" stop-color="#fff6c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient></defs>'
        '<path d="M150,92 L0,40 L0,178 L150,104 Z" fill="url(#beam-g)" class="beam"/>'
        '<g class="kick"><path d="M258,96 L304,74 L316,86 L262,108 Z" fill="#e0503f"/><path d="M252,112 L300,118 L302,134 L250,126 Z" fill="#d44637"/></g>'
        '<path d="M200,96 C220,96 240,96 258,100 L256,110 C238,110 220,112 200,112 Z" fill="#2c3446"/>'
        '<path d="M200,108 C220,112 236,118 252,120 L250,130 C232,128 216,124 198,118 Z" fill="#252c3c"/>'
        '<rect x="170" y="70" width="78" height="20" rx="10" fill="#e2b13c"/><rect x="170" y="70" width="78" height="6" rx="3" fill="#f0c95a"/>'
        '<rect x="242" y="74" width="10" height="12" rx="2" fill="#7c7f8f"/>'
        '<path d="M150,94 C160,84 190,82 210,90 C214,100 210,112 200,118 C180,120 160,114 150,106 Z" fill="#2c3446"/>'
        '<path d="M166,108 C150,118 136,126 122,128" stroke="#2c3446" stroke-width="9" stroke-linecap="round" fill="none"/>'
        f'<circle cx="120" cy="128" r="5" fill="{skin}"/>'
        f'<circle cx="146" cy="98" r="13" fill="{skin}"/>'
        '<path d="M133,96 A13,13 0 0 1 158,90 L158,96 Z" fill="#2c3446"/>'
        '<rect x="130" y="94" width="16" height="10" rx="3" fill="#7fd0f0" stroke="#1c2233" stroke-width="2"/>'
        '<circle cx="146" cy="86" r="4.2" fill="#fff6c8"/>'
        '<path d="M152,108 C160,112 168,110 176,104" stroke="#1c2233" stroke-width="3" fill="none"/>'
        '<g class="dbub"><circle cx="160" cy="70" r="3.2" fill="none" stroke="#dff5ff" stroke-width="1.2"/><circle cx="166" cy="56" r="2.4" fill="none" stroke="#dff5ff" stroke-width="1.2"/><circle cx="158" cy="42" r="4" fill="none" stroke="#dff5ff" stroke-width="1.2"/></g>'
    ), cls='hadal-diver')


def floor_edge():
    return ('<svg class="floor-edge-svg" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
            '<path d="M0,22 C80,14 160,10 240,16 C330,23 400,28 480,22 C560,16 640,8 720,12 C820,17 900,28 990,26 C1080,24 1150,12 1240,12 C1320,12 1380,20 1440,18 L1440,40 L0,40 Z" fill="#ede5ce"/>'
            '<path d="M0,22 C80,14 160,10 240,16 C330,23 400,28 480,22 C560,16 640,8 720,12 C820,17 900,28 990,26 C1080,24 1150,12 1240,12 C1320,12 1380,20 1440,18" fill="none" stroke="#f7f0dc" stroke-width="3"/>'
            '</svg>')
