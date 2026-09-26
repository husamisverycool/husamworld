"""Insert (or refresh) the shared world-nav into every district page.
Usage: python3 world/_shared/inject.py   (run from repo root)"""
import re, pathlib
W = pathlib.Path('world')
nav = (W / '_shared' / 'worldnav.js').read_text()
IDS = ['bill', 'speech', 'translation', 'n1', 'triptik', 'os', 'depths', 'weeks', 'everywhere']
START, END = '<!-- world-nav:start -->', '<!-- world-nav:end -->'
for i in IDS:
    f = W / f'{i}.html'
    if not f.exists():
        print('skip (missing)', f); continue
    h = f.read_text()
    h = re.sub(re.escape(START) + '.*?' + re.escape(END) + r'\n?', '', h, flags=re.S)
    block = f'{START}\n<husam-world-nav current="{i}"></husam-world-nav>\n<script>\n{nav}</script>\n{END}\n'
    if re.search(r'</body>', h, re.I):
        h = re.sub(r'</body>', lambda m: block + m.group(0), h, count=1, flags=re.I)
    else:
        h += '\n' + block
    f.write_text(h)
    print('nav ->', f)
