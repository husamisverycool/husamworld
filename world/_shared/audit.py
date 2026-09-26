"""Repetition audit for husam.world.
Flags (1) owned facts appearing outside their owner page and (2) 7-word phrases shared by two pages.
Usage: python3 world/_shared/audit.py        (run from repo root)"""
import re, html, pathlib, itertools, collections

W = pathlib.Path('world')
PAGES = ['index', 'bill', 'speech', 'translation', 'n1', 'triptik', 'os', 'depths', 'weeks', 'everywhere']

# token (case-insensitive regex) -> owner page
OWNED = {
    # Capitol
    r'\bCAIR\b': 'bill', r'AB\s?1766': 'bill', r'AB\s?1947': 'bill', r'SB\s?1161': 'bill', r'AB\s?2549': 'bill', r'SB\s?1038': 'bill',
    r'Patterson': 'bill', r'Shannon Grove': 'bill', r'McCarthy': 'bill', r'Congressional [Ii]ntern': 'bill', r'LegislativeLift': 'bill',
    r'Diversify Our Narrative': 'bill', r'Voters of Tomorrow': 'bill', r'High School Democrats': 'bill', r'Encode Justice': 'bill',
    r'ACLU': 'bill', r'Boys State': 'bill', r'Civics Unplugged': 'bill',
    # Chamber
    r'Mock Trial': 'speech', r'Congressional Debate': 'speech', r'Student Leadership Council': 'speech', r'CHSSA': 'speech',
    r'Ethics Bowl': 'speech', r'TED Student': 'speech', r'Berkeley National': 'speech', r'UOP Invitational|University of the Pacific': 'speech',
    # Bridge
    r'White House in Arabic|WHiA': 'translation', r'Marah Bukai': 'translation', r'Al-Arab': 'translation', r'Seal of Biliteracy': 'translation',
    r'Wall Street Journal|\bWSJ\b': 'translation', r'The Nation\b': 'translation', r'Princeton Summer Journalism': 'translation', r'Youth Climate Action': 'translation',
    # Polling Station
    r'Youth Poll': 'n1', r'Institute of Politics': 'n1', r'Katherine Tai': 'n1', r'Global Research and Consulting|\bGRC\b': 'n1', r'UNICEF': 'n1',
    r'Urban Institute': 'n1', r'Mark Pingle': 'n1', r'University of Nevada|\bUNR\b': 'n1', r'University of Houston': 'n1', r'Chapman': 'n1',
    r'Ballotpedia': 'n1', r'The World in Us': 'n1', r'Institute for Youth in Policy': 'n1',
    # Map Room
    r'Muslim Community Association': 'triptik', r'\$240K|240,000': 'triptik', r'\$500K|500,000': 'triptik', r'Food Bank': 'triptik',
    r'Saturday School': 'triptik', r'Instilt': 'triptik', r'Clovis Community College': 'triptik',
    # Garage
    r'stealth': 'os', r'DoorDash': 'os', r'Electric Deals': 'os', r'bayloop': 'os', r'law firm': 'os', r'Jetson': 'os',
    r'LeapYear': 'os', r'Startups @ Harvard|Startups at Harvard': 'os', r'XFund': 'os', r'Telora': 'os', r'GripTape': 'os',
    # Pier
    r'Coca-Cola': 'depths', r'Gates Scholar': 'depths', r'Gilman': 'depths', r'QuestBridge': 'depths', r'Taco Bell': 'depths',
    r'\bElks\b': 'depths', r'Princeton Prize': 'depths', r'Student of the Year': 'depths', r'Telluride|\bTASS\b': 'depths',
    r'Coolidge': 'depths', r'Notre Dame': 'depths', r'High School Diplomats': 'depths', r'Young Leaders Summit': 'depths',
    r'Profile in Courage': 'depths', r'African American Recognition': 'depths', r'Olympiad': 'depths', r'National History Day': 'depths', r'Summa': 'depths',
    # Plaza
    r'4,000\+?\s*(service )?hours|Volunteer Service Award': 'weeks',
    # Airport
    r'Harvard Model Congress': 'everywhere', r'Crimson': 'everywhere', r'Princeton Review': 'everywhere', r'AlgoEd': 'everywhere',
    r'South Korea': 'everywhere', r'Hillel': 'everywhere', r'Lithuania': 'everywhere', r'Puerto Rico': 'everywhere', r'Catalyst': 'everywhere',
    r'Radcliffe': 'everywhere', r'China Forum': 'everywhere', r'International Relations Council|HMUN|HNMUN': 'everywhere',
    r'Applied Math': 'everywhere', r'Honor Council': 'everywhere', r'Outdoor Program': 'everywhere', r'SPARK': 'everywhere', r'Fong': 'everywhere',
    # World
    r'linkedin\.com': 'index', r'hramadan@college': 'index', r'data:image/jpeg;base64': 'index',
}

def visible_text(raw):
    raw = re.sub(r'<!-- world-nav:start -->.*?<!-- world-nav:end -->', ' ', raw, flags=re.S)
    raw = re.sub(r'<(script|style|svg|noscript)\b.*?</\1>', ' ', raw, flags=re.S | re.I)
    raw = re.sub(r'<[^>]+>', ' ', raw)
    return re.sub(r'\s+', ' ', html.unescape(raw))

def main():
    raws, texts = {}, {}
    for p in PAGES:
        f = W / f'{p}.html'
        if f.exists():
            raws[p] = f.read_text(errors='replace')
            texts[p] = visible_text(raws[p])
    problems = 0
    print('== owned facts outside their owner ==')
    for pat, owner in OWNED.items():
        for p, t in texts.items():
            src = raws[p] if pat.startswith('linkedin') or 'base64' in pat else t
            if p != owner and re.search(pat, src, re.I):
                n = len(re.findall(pat, src, re.I))
                print(f'  {p:12s} mentions /{pat}/ x{n}  (owner: {owner})'); problems += 1
    print('== 7-word phrases shared between pages ==')
    shingles = {}
    for p, t in texts.items():
        words = re.findall(r"[a-z0-9$%,.'’\-]+", t.lower())
        shingles[p] = {' '.join(words[i:i + 7]) for i in range(len(words) - 6)}
    for a, b in itertools.combinations(texts, 2):
        common = shingles[a] & shingles[b]
        if common:
            problems += len(common)
            print(f'  {a} & {b}: {len(common)} shared, e.g. "{sorted(common)[0]}"')
    print(f'\n{problems} problems')

main()
