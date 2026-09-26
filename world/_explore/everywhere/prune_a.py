"""Prototype A: the round-1 Airport, pruned to its own facts. Builds a.html from ../../everywhere.html."""
import re, pathlib
HERE = pathlib.Path(__file__).parent
src = (HERE / '../../everywhere.html').read_text()

def cut(s, start, end, repl=''):
    i = s.index(start); j = s.index(end, i)
    return s[:i] + repl + s[j:]

s = src
s = s.replace('<title>Husam Sokar</title>', '<title>The Airport</title>')
s = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="The Airport: Harvard and abroad, drawn in characters.">', s)

# hero columns: no name, no stealth, no contact
hero_new = '''<div class="cols hcols">
      <div>
        <h1>The Airport:</h1>
        <p>Harvard and abroad.</p>
      </div>
      <div class="w2">
        <p>Harvard College, sophomore. Applied Math in Government and Economics.</p>
        <p class="gap">Home base is Cambridge. Five trips have left from it so far.</p>
      </div>
      <div class="wide-only">
        <p>Index:</p>
        <ul>
          <li><a href="#route">Route</a></li>
          <li><a href="#departures">Departures</a></li>
          <li><a href="#gates">Gates</a></li>
        </ul>
      </div>
      <div class="wide-only">
        <p>Cambridge, MA:</p>
        <p><span class="hi" id="hclock">--:--:--</span></p>
        <p class="gap">Sun overhead:</p>
        <p id="hsun">--</p>
      </div>
    </div>'''
s = cut(s, '<div class="cols hcols">', '<p class="hint">', hero_new + '\n    ')

route_new = '''<ol class="entries">
      <li class="entry" id="p-cambridge" data-entry="0">
        <p class="k">Fall 2025– · Harvard College</p>
        <h3 class="h3wrap"><button class="go" type="button">Cambridge &amp; Boston, MA</button></h3>
        <p>Applied Math in Government and Economics.</p>
        <p>Chair (Senior Staff) of Harvard Model Congress since January 2026, on staff since September 2025, directing the Boston conference: North America's largest congressional simulation, 1,500+ delegates from 100+ schools.</p>
      </li>
      <li class="entry" id="p-korea" data-entry="1">
        <p class="k">The Harvard Crimson</p>
        <h3 class="h3wrap"><button class="go" type="button">South Korea</button></h3>
        <p>Two weeks of workshops on writing, leadership and journalism, and mentoring students, as a Global Programs Associate for the Crimson.</p>
      </li>
      <li class="entry" id="p-hillel" data-entry="2">
        <p class="k">Harvard Hillel Travel Program</p>
        <h3 class="h3wrap"><button class="go" type="button">Lithuania · Poland · Hungary</button></h3>
        <p>A research tour, as a Hillel Travel Program Fellow.</p>
      </li>
      <li class="entry" id="p-pr" data-entry="3">
        <p class="k">Catalyst</p>
        <h3 class="h3wrap"><button class="go" type="button">Puerto Rico</button></h3>
        <p>A service-learning trip, as a Catalyst Sustainability Scholar.</p>
      </li>
      <li class="entry" id="p-europe" data-entry="4">
        <p class="k">HMC Europe</p>
        <h3 class="h3wrap"><button class="go" type="button">Europe</button></h3>
        <p>On staff: 500+ delegates from 20+ countries.</p>
      </li>
    </ol>'''
s = cut(s, '<ol class="entries">', '  </section>\n</div>', route_new + '\n')
s = s.replace('Every place the work has reached, in date order. The lines start in Fresno; Harvard\'s trips branch from Cambridge. The globe follows as you scroll.',
              'Every trip leaves from Cambridge. The globe follows as you scroll.')

# departures: drop stealth row + sound
s = re.sub(r'\s*<li><button class="row" type="button" data-code="████ · San Francisco".*?</button></li>', '', s, flags=re.S)
s = s.replace('Harvard programs that came with a ticket, plus the summer in San Francisco.', 'Harvard programs that came with a ticket.')
s = re.sub(r'<div><p>Sound:</p>.*?</div>\n', '', s, flags=re.S)
s = re.sub(r'(<div class="info" data-for="dep".*?<p class="ihead">Information · <span class="icode">).*?(</span></p>\s*<p class="itext">).*?(</p>)',
           r'\1HMC · Boston\2Chair (Senior Staff) since Jan 2026, on staff since Sep 2025. Directing the Boston conference, North America\'s largest congressional simulation: 1,500+ delegates from 100+ schools.\3', s, flags=re.S)
# gates: drop IOP, Youth Poll, GRCG
for code in ['IOP · Institute of Politics', 'HYP · Harvard Youth Poll', 'GRCG · Global Research &amp; Consulting']:
    s = re.sub(r'\s*<li><button class="row" type="button" data-code="' + re.escape(code) + r'".*?</button></li>', '', s, flags=re.S)
s = s.replace('<span class="sub">12 open</span>', '<span class="sub">9 open</span>')
s = re.sub(r'(<div class="info" data-for="gates".*?<span class="icode">).*?(</span></p>\s*<p class="itext">).*?(</p>)',
           r'\1THCB · Crimson Business Board\2Project Team Lead, TPR/AlgoEd, on The Harvard Crimson Business Board since Dec 2025. Leads international writing and leadership camps with The Princeton Review and AlgoEd.\3', s, flags=re.S)
s = re.sub(r'\s*<div class="mi"><p class="code">(IOP|HYP|GRCG)</p>.*?</div>', '', s, flags=re.S)
# contact section and colophon line
s = cut(s, '<section class="sect" id="contact"', '</main>', '')
s = s.replace('The globe, the name and the portrait are computed', 'The globe and the codes are computed')

# script: places
places = '''var P = {
  cambridge: { name: 'Cambridge', lat: 42.37, lon: -71.11, entry: 0, pri: 9, box: ['CAMBRIDGE & BOSTON, MA', 'Harvard College, since fall 2025.', 'Chair, Harvard Model Congress:', '1,500+ delegates, 100+ schools.'] },
  korea:     { name: 'South Korea', lat: 36.4, lon: 127.9, entry: 1, pri: 7, cls: 5, box: ['SOUTH KOREA', 'The Harvard Crimson: two weeks of', 'workshops on writing, leadership', 'and journalism.'] },
  lithuania: { name: 'Lithuania', lat: 55.3, lon: 23.9, entry: 2, pri: 6, cls: 2, box: ['LITHUANIA · POLAND · HUNGARY', 'Harvard Hillel Travel Program', 'Fellow: a research tour.'] },
  poland:    { name: 'Poland', lat: 52.1, lon: 19.4, entry: 2, pri: 6, cls: 3, box: ['LITHUANIA · POLAND · HUNGARY', 'Harvard Hillel Travel Program', 'Fellow: a research tour.'] },
  hungary:   { name: 'Hungary', lat: 47.2, lon: 19.4, entry: 2, pri: 6, cls: 4, box: ['LITHUANIA · POLAND · HUNGARY', 'Harvard Hillel Travel Program', 'Fellow: a research tour.'] },
  pr:        { name: 'Puerto Rico', lat: 18.22, lon: -66.45, entry: 3, pri: 6, cls: 6, box: ['PUERTO RICO', 'Catalyst Sustainability Scholar:', 'a service-learning trip.'] },
  europe:    { name: 'Europe', lat: 49.5, lon: 9.0, entry: 4, pri: 7, cls: 1, region: true, box: ['EUROPE', 'Harvard Model Congress Europe:', '500+ delegates, 20+ countries.'] }
};'''
s = cut(s, 'var P = {', 'var PLIST', places + '\n')
s = re.sub(r"var ARCS = \[.*?\]\.map", "var ARCS = [\n  ['cambridge', 'korea', 1], ['cambridge', 'lithuania', 2], ['cambridge', 'poland', 2], ['cambridge', 'hungary', 2], ['cambridge', 'pr', 3], ['cambridge', 'europe', 4]\n].map", s, flags=re.S)
ents = '''var ENTRIES = [
  { places: ['cambridge'], f: { lat: 42, lon: -71, zoom: 2.2 } },
  { places: ['korea'], hl: [5], f: midFocus(['cambridge', 'korea'], 0.95) },
  { places: ['lithuania', 'poland', 'hungary'], hl: [2, 3, 4], f: midFocus(['cambridge', 'poland'], 1.0, [0.8, 1.2]) },
  { places: ['pr'], hl: [6], f: midFocus(['cambridge', 'pr'], 1.5) },
  { places: ['europe'], hl: [1], f: midFocus(['cambridge', 'europe'], 0.98, [0.8, 1.2]) }
];'''
s = cut(s, 'var ENTRIES = [', 'ENTRIES.forEach', ents + '\n')
s = s.replace("var G = { lon: -96, lat: 24,", "var G = { lon: -40, lat: 30,")
s = s.replace("var opts = [['HUSAM SOKAR · EVERYWHERE'], ['HUSAM SOKAR', 'EVERYWHERE'], ['HUSAM', 'SOKAR', 'EVERYWHERE'], ['HUSAM', 'SOKAR', 'EVERY', 'WHERE']];",
              "var opts = [[F.word || 'BOS']];")
# portrait -> stub
s = cut(s, '/* ------------------------------------------------------------ portrait */', '/* -------------------------------------------------------------- layout */',
        "var PT = { dirty: false, seen: 1 };\nfunction portraitLayout() {}\nfunction portraitFrame() {}\n")
s = re.sub(r"  new IntersectionObserver\(function \(es\) \{\n    es\.forEach\(function \(e\) \{ VIS\.portrait.*?observe\(PT\.cv\);\n", '', s, flags=re.S)
# sound button
s = re.sub(r"var sndBtn = \$\('\.js-sound'\);\nsndBtn\.addEventListener\('click', function \(\) \{.*?\n\}\);\n", '', s, flags=re.S)
# word cycling: ISO country codes (not airports)
s = s.replace("window.__ev = {", """var WORDS = ['BOS', 'KOR', 'LTU', 'POL', 'HUN', 'PRI', 'EUR'], WI = 0;
setInterval(function () { if (REDUCED) return; WI = (WI + 1) % WORDS.length; F.word = WORDS[WI]; buildLetters(); F.dirty = true; }, 5200);
window.__ev = {""")
(HERE / 'a.html').write_text(s)
print('ok', len(s))
