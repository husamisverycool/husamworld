# The Bridge, round 2: which direction

Three working prototypes, screenshots at 1440 and 390 in `world/_shots/translation-r2/` (a-, b-, c-).

| | A · Facing pages (LAL + Loeb + lynnandtonic + DeepL) | B · Type specimen (Typotheque + Khatt + jhey) | C · Wire desk (WSJ + The Nation + WHiA) |
|---|---|---|---|
| Fidelity to inspiration | **5**: navy cloth + sky band cover, English verso / Arabic recto, §-numbers in two numeral systems, columns free of a shared baseline and re-synced per §, exactly what the LAL design notes describe | 4: glyph tile, data table, pill tools, edge-fading cells, Khatt hyphen block are all there, but the Typotheque grid is a catalogue UI and needs products to fill it | 4: boxed kickers, double rule, condensed heads and the red Nation bar read as a front page at once |
| Ambition and memorability | 4: the threads and the draggable seam are strong, but the page is quiet until you touch it | 4: the blue ض tile and the BI–LIT–ER–ACY block are the most striking single frames of the three | 3: a front page is familiar; the mono wire list is a list |
| Fit with HIS content (my facts only) | **5**: the WHiA job *was* making facing texts; the six headlines become real parallel text; the Seal, the press and the journalism roles each fit a § | 3: the specimen grid turns facts into font names ("The Wall S…" fading out). A reader can't read his record in it | 4: headlines and clippings fit, but Arabic is demoted to a caption under English |
| Not repeating other pages' devices | **5**: two scripts side by side, alignment threads and the draggable divider are the Bridge's by the ownership table | 2: "specimens" belong to the Pier; a whole page presented as a specimen sheet is too close | 4: newspaper typography is unowned, but a front page of headlines drifts toward the Capitol's document look |
| Phone quality | 4: stacked pairs work; needs threads that still mean something at 390 | 3: 2-up cells truncate every name | 4: single column reads well |
| Never feels bad | 4: calm, but the prototype has no reason to scroll past the cover and no word-level payoff | 2: the fading cells hide the only copy of facts; the weight slider is a toy with nothing to say | 4: nothing confusing, nothing surprising |
| **Total** | **27** | **18** | **23** |

## Decision: A as the spine, with the best parts of B and C

**A wins** because it is the only direction where the form *is* the content: Husam's work was putting an English text and an Arabic text side by side and making them agree. The LAL book is the right model; its designer's key choice (let each script keep its own leading and re-align paragraph by paragraph, not line by line) becomes the page's behaviour: the two columns drift and the threads show where they agree.

What it takes from the others:
- **From B (Typotheque/Khatt):** a *title page* in the specimen voice: a pair of glyph tiles (Latin "Aa", Arabic "ض": Arabic has no case, which is the point of the pair) over a two-language particulars table (languages, direction, certified, numerals, quotation marks). The Khatt interlocking block becomes the one typographic image, for the Seal of Biliteracy. **Not** taken: the specimen grid and the fading cells (the Pier owns specimens, and they hide facts).
- **From B/jhey:** the two-alphabet scramble, used only where it means something: the cover title resolves out of mixed Latin and Arabic letters (the intro, under 1.2s), and the lead-language swap re-types its labels.
- **From DeepL/Google Translate:** the ⇄ swap control for which language leads; and DeepL's click-a-word alternatives, turned into **word-level alignment threads** in the six headlines, backed by an always-visible glossary so no information lives only in a popover.
- **From C (WSJ/The Nation/WHiA):** the press clippings are set in each paper's own dialect (the WSJ's boxed kicker and heavy condensed serif; The Nation's red condensed kicker and light display serif) inside the facing pages, and the WHiA italic credit line closes the six pieces. **Not** taken: the front-page grid and the wire list.
- **From Loeb and lynnandtonic:** one opening = one unit (running heads and paired folios, English numerals left, Arabic-Indic right); a contents page with dot leaders that run toward each other and meet at the seam.

Phone: pairs interleave (English, then its Arabic), and each pair gets a short thread from its § to its ١٫١ across the gap between them. The glossary, clippings and title page stack. The seam is hidden on phones (there is no second column to resize).
