# The Capitol, round 2: study

Screenshots of the live references (Firecrawl) are kept in the scratchpad (`bill-r2/*.png`); what matters is written down here.
Only the Capitol's own facts (OWNERSHIP.md) are considered for "what it would look like with his content".

---

## 1. congress.gov bill page (H.R.3684, 117th Congress), scraped live

**Layout.** 1170px centred column on a `#F7F7F7` band; white page below the tabs. Top: the wordmark `CONGRESS.GOV` in a Trajan-like serif, navy `#1B4B6F` with a small red star/dot; a mid-grey search band (`#6d7680`ish) with a white select + input + navy square search button.
Breadcrumb (11px, underlined links) → title `H.R.3684 - Infrastructure Investment and Jobs Act` in **Arial bold 20px**, `#212529`, with `117th Congress (2021-2022)` under it at 12px grey.
**The overview box.** A dark-red tab label (`LAW`, white on `#a52a2a`-ish, with `Hide Overview ✕`), sitting on a white box with a 3px grey border. Inside, a two-column definition table: bold labels right-padded (`Sponsor:`, `Committees:`, `Committee Meetings:`, `Latest Action:`, `Roll Call Votes:`, `Tracker:`), 12–13px Arial, values with blue underlined links (`#245276` / `#3366CC`).
**The tracker.** Six chevrons in one row, each ~100px wide, 18px tall, 1px grey outline, white fill, 11px text: `Introduced > Passed House > Passed Senate > Resolving Differences > To President > Became Law`. The current stage is filled **near-black `#333` with white bold text**. Chevrons are made with a notch on the left and a point on the right (clip-path shape), no gaps.
**Right rail.** `More on This Bill`, `Subject — Policy Area:` headings in bold 11px with 1px rules between groups.
**Tabs.** `Summary (3) · Text (8) · Actions (183) · Titles (99) · Amendments (539) · Cosponsors (5) · Committees (2) · Related Bills (139)`: light-grey boxed tabs, the active one white with a red label. Counts in parentheses are the charm: the page tells you how much is inside before you open it.
**Copy tone.** Bureaucratic, exact, dated: `11/15/2021 Became Public Law No: 117-58.` Every claim has a date and a source.
**Radius** 0 everywhere except the 4px buttons. No shadows. Type is Arial/Helvetica only.
**Memorable:** the chevron tracker and the tab counts. The record *is* the design.
**With Husam:** a record with counts that are really his (`Cosponsors (5,000+)`, `Related Bills (5)`), a tracker whose stages are his actual steps, and an `All Actions` table that is his dated history in the Capitol's lane.

## 2. California Legislative Information (leginfo), AB 1766 Text and Status tabs, scraped live

His five bills are **California** bills, so this is the truest reference of all.
**Chrome.** A Capitol-dome seal left, `California` in an orange-brown copperplate script (`#b4581b`-ish) over `LEGISLATIVE INFORMATION` in spaced Trajan caps; a 3px navy `#1d3f5e` rule under the header; grey tab bar (`Home · Bill Information · California Law · …`) with the active tab raised white.
**Bill text tab.** Centred: `Assembly Bill No. 1766` (bold serif 20px), `CHAPTER 482` (larger, regular serif), the long title (`An act to amend Section …`) centred in 17px sans, the bracketed line `[ Approved by Governor … Filed with Secretary of State … ]`, then `LEGISLATIVE COUNSEL'S DIGEST` in small caps as a centred heading, then the digest paragraphs in Verdana-like 15px: "Existing law … This bill would …". The body begins `The people of the State of California do enact as follows:`. Amended versions show **added text in italic (blue on the site) and deleted text struck through (red)**.
**Status tab.** The best device found in this study: **"Steps bill has passed through in each house"**, a two-lane rail. Two labelled lanes (`Senate` above, `Assembly` below), one continuous 3px line that runs along the Assembly lane (green) through `1st · Cmt · 2nd · Cmt · 2nd · 3rd · Pass`, **jumps up** to the Senate lane (red) for `1st · Cmt · 2nd · 3rd · 2nd · 3rd · Pass`, then drops back down for `Pass · Chp`. Stops are 11px labels, 50px apart. Under it: a boxed `Bill Status` table (grey header row, 1px `#8aa` rules, bold labels: `Measure: / Lead Authors: / Principal Coauthors: / Coauthors: / Topic: / 31st Day in Print: / Title: / House Location: / Chaptered Date: / Last Amended Date:`), then a `Type of Measure` list (`Majority Vote Required · Non-Appropriation · Fiscal Committee · Non-Urgency · Non-Tax levy`) and `Last 5 History Actions` (date | action).
**Tone.** Deadpan, exhaustive, typed by clerks.
**Memorable:** the two-lane line that switches houses; the italic/strike amendment convention; "Legislative Counsel's Digest" as a plain-language abstract.
**With Husam:** the two lanes are *real* for him: he worked with an **Assembly** office (Asm. Jim Patterson, through Legislative Director Ian Coolbear) and a **Senate** office (Sen. Shannon Grove). His roles that changed title (LegislativeLift: volunteer → Outreach Director → Executive Director) can be shown as amendments in italic/strike. Careful: the bills' own outcomes are NOT in the fact sheet, so no stop may claim a bill passed or was chaptered; the rail must track *his* steps.

## 3. GPO bill PDF (govinfo, BILLS-117hr3684ih.pdf), parsed live

Page one exactly: `117TH CONGRESS / 1ST SESSION` stacked top-left in small caps, `H. R. 3684` bold right; one-line purpose (`To authorize funds for … and for other purposes.`) under a rule; `IN THE HOUSE OF REPRESENTATIVES` centred caps; the date `JUNE 4, 2021` in small caps; `Mr. DEFAZIO (for himself, Ms. NORTON, and Mr. PAYNE) introduced the following bill; which was referred to the Committee on …` with hanging indent; a double rule; `A BILL` very large bold, letterspaced; the purpose again; then the enacting clause in italic, `Be it enacted by the Senate and House of Representa-/tives of the United States of America in Congress assembled,`. **Line numbers 1–25 in the left margin of every page**, restarting per page; `SECTION 1. SHORT TITLE.` in bold caps; the TOC as a hanging list `Sec. 101. Definitions.` under centred `TITLE I—…` heads with an em-dash; running foot `•HR 3684 IH` bottom left. Type is a Century Schoolbook cut, ~12pt on 24pt leading (double spaced) so line numbers align with text lines.
**Memorable:** the line numbers; `A BILL`; the long em-dash title heads; "and for other purposes."
**With Husam:** his section of the Capitol set as a bill, each Title a lane of his work, each section one role, with line numbers that really count lines.

## 4. gwern.net (/design), scraped live

**Type.** Source Serif 4 body 16–20px, justified with hyphenation, `#333` text on `#fff`; title in bold small caps 50px (`DESIGN OF THIS WEBSITE`); metadata line in italic with tiny interpunct separators; **no colour at all** except link hover (`#BF1722` from the branding scrape). Dotted-underline links.
**Layout.** A bordered TOC box floated left of a bordered abstract box, both 1px `#ccc`, numbered `1 · 3.1 · 3.1.1` in grey. Right edge: a column of square icon buttons (theme, reader mode, search, help).
**Sidenotes.** On wide screens the footnotes move into the right margin, aligned to their reference, with a numeral; they overlap nothing (collision avoidance pushes them down). On narrow screens they become popins (tap to expand inline).
**Popups.** Hover a link for ~250 ms and a bordered, shadowless 1px box opens beside it with a preview (the abstract, the section); popups can nest; moving the mouse into a popup keeps it; Esc closes. Links carry a tiny icon saying what they point to.
**Memorable:** "semantic zoom": every term can be opened to its source without leaving the page.
**With Husam:** every bill number (`AB 1766`, `SB 1038`) opens its digest; every organisation opens its record; margin notes carry the dates and counts.

## 5. Schoolhouse Rock!, "I'm Just a Bill" (ABC, first aired 27 March 1976, 3:16; written by Dave Frishberg, sung by Jack Sheldon; design Tom Yohe, animation Phil Kimmelman & Associates); Wikipedia article and the ABC still (via CNN) scraped live

**The character.** A rolled sheet of paper standing upright, top edge curled over like a quiff; wobbly, uneven **black ink outline ~3px** with no shading; off-white paper; two round eyes with small pupils; a small bump of a nose; a line mouth; thin noodle arms with 4-finger gloveless hands; stubby feet; **a red sash across the body with a round red-white-blue campaign button reading `BILL`**; motion shown with loose parallel **speed lines**.
**The world.** Flat 1970s cel colour: sky cyan, the white Capitol dome, grey steps, mustard/orange accents, fat outlines; limited animation (holds, then a snap to a new pose); the boy asks questions, the bill answers in song.
**The structure.** Sitting on the Capitol steps (waiting) → how he got here (people back home) → a congressman sponsors him → committee (a pile of bills; "waiting") → the House votes → the Senate → the President's desk → he's signed (joy), with the veto aside.
**Tone.** Warm, patient, funny, a little melancholy; teaches the process by giving the paperwork feelings.
**Memorable:** a piece of paper with a face, waiting on the steps.
**With Husam:** his bills get faces. AB 1766 wearing its own badge on the steps of the **State Capitol in Sacramento**, the four others beside it, the people who carry bills upstairs (a lead advocate, an office's legislative director), and a new stop Schoolhouse Rock never had: the congressman's *district* office in Clovis where an intern works. All songs/captions must be written fresh (quote nothing).

## 6. Additional: CNN's still and the leginfo "Type of Measure" list (captured above)
The still confirmed the drawing specifics (ink weight, the sash and button, speed lines). The leginfo "Type of Measure" list (`Majority Vote Required · Non-Appropriation · Fiscal Committee`) is a great deadpan device for summarising a record.

---

## What each would look like here, and the traps
- A **tracker** must not claim a bill's outcome. It tracks *his* steps (dates from the fact sheet only).
- **No name hero** (the round-1 page's giant `HUSAM SOKAR ACT` must go). His name may appear only incidentally, e.g. a sponsor line `Mr. Sokar`.
- **Not sticky scrollytelling** (the Plaza's), **not a countdown** (the Chamber's), **not a strip map** (the Map Room's). The Schoolhouse-Rock journey therefore has to be a contained, click/tap-driven cartoon, not a scroll-pinned story.
- Devices that are ours: legislative typography, line numbers, margin annotations, signature pad, rubber stamp. Use all of them.
