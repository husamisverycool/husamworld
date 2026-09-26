// Layout QA for husam.world: finds text that is clipped, off-screen, overlapping other text,
// or covered by fixed/sticky UI, at several widths and scroll positions.
// Usage: node world/_shared/qa.js <page> [widths]      e.g. node world/_shared/qa.js bill 390,1440
// Needs: python3 -m http.server 8820 running inside world/. Elements (or ancestors) with
// data-qa-ignore are skipped (use only for deliberate effects, e.g. a marquee, and say why).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const LIBS = '/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/libs';
const page = process.argv[2] || 'index';
const widths = (process.argv[3] || '360,390,768,1024,1440,1920').split(',').map(Number);

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const all = [];
  for (const w of widths) {
    const mobile = w < 800;
    const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await ctx.route(/three@[^/]+\/build\/three\.min\.js/, r => r.fulfill({ body: fs.readFileSync(LIBS + '/three/build/three.min.js'), contentType: 'text/javascript' }));
    await ctx.route(/cannon\.min\.js/, r => r.fulfill({ body: fs.readFileSync(LIBS + '/cannon/build/cannon.min.js'), contentType: 'text/javascript' }));
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(`http://localhost:8820/${page}.html#from-qa`, { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    const vh = await p.evaluate(() => innerHeight);
    const stops = [];
    for (let y = 0; y < H - vh; y += Math.round(vh * 0.8)) stops.push(y);
    if (stops.length > 60) stops.length = 60; // very long pages: sample the first 60 screens
    stops.push(Math.max(0, H - vh));
    const seen = new Set();
    for (const y of stops) {
      await p.evaluate(y => window.scrollTo(0, y), y);
      await p.waitForTimeout(250);
      const found = await p.evaluate(() => {
        const out = [], vw = innerWidth, vh = innerHeight;
        const ign = el => !!el.closest('[data-qa-ignore]');
        const vis = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; } return true; };
        const label = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''));
        const pinned = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') return e; } return null; };
        const srOnly = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width <= 2 || r.height <= 2 || ((r.right <= 0 || r.bottom <= 0) && /absolute|fixed/.test(s.position)) || (s.clip && s.clip !== 'auto') || /inset\(50%/.test(s.clipPath); };
        const txt = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim().replace(/\s+/g, ' ');
        // text-bearing leaves in or near the viewport
        const texts = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        while (walker.nextNode()) {
          const el = walker.currentNode;
          if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|svg|SVG)$/.test(el.tagName) || el.closest('svg')) continue;
          const t = txt(el); if (!t || t.length < 2) continue;
          if (ign(el) || !vis(el) || srOnly(el)) continue;
          const range = document.createRange(); range.selectNodeContents(el);
          const rects = [...range.getClientRects()].filter(r => r.width > 1 && r.height > 1);
          if (!rects.length) continue;
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) continue;
          texts.push({ el, t, r, rects });
        }
        for (const o of texts) {
          // off-screen horizontally
          for (const rr of o.rects) if (rr.right > vw + 1 || rr.left < -1) { const sc = [...(function*(e){for(;e;e=e.parentElement)yield e})(o.el.parentElement)].find(a => a !== document.body && a !== document.documentElement && /(auto|scroll)/.test(getComputedStyle(a).overflowX)); out.push([sc ? 'offscreen-in-scroller' : 'offscreen', label(o.el), o.t.slice(0, 60)]); break; }
          // clipped by an overflow-hidden ancestor
          for (let a = o.el.parentElement; a && a !== document.body; a = a.parentElement) {
            const s = getComputedStyle(a);
            if (/(hidden|clip)/.test(s.overflowX + s.overflowY)) {
              const ar = a.getBoundingClientRect();
              if (o.rects.some(rr => rr.right > ar.right + 2 || rr.left < ar.left - 2 || rr.bottom > ar.bottom + 2 || rr.top < ar.top - 2)) { out.push(['clipped', label(o.el) + ' in ' + label(a), o.t.slice(0, 60)]); break; }
            }
          }
          // text overflowing its own box when that box clips
          const s = getComputedStyle(o.el);
          if (/(hidden|clip)/.test(s.overflowX) && s.textOverflow !== 'ellipsis' && o.el.scrollWidth > o.el.clientWidth + 1) out.push(['clipped-self', label(o.el), o.t.slice(0, 60)]);
        }
        // text overlapping text (not ancestor/descendant)
        const opaque = e => { const c = getComputedStyle(e).backgroundColor.match(/[\d.]+/g); return (c && (c.length < 4 || +c[3] > 0.9)) || getComputedStyle(e).backgroundImage !== 'none'; };
        const occluded = (A, B) => {
          for (const ra of A.rects) for (const rb of B.rects) {
            const x0 = Math.max(ra.left, rb.left), x1 = Math.min(ra.right, rb.right), y0 = Math.max(ra.top, rb.top), y1 = Math.min(ra.bottom, rb.bottom);
            if (x1 <= x0 || y1 <= y0) continue;
            const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
            if (cx < 0 || cy < 0 || cx > vw || cy > vh) return false;
            const top = document.elementFromPoint(cx, cy); if (!top) return false;
            const T = (A.el === top || A.el.contains(top)) ? A : (B.el === top || B.el.contains(top)) ? B : null;
            const U = T === A ? B : A;
            // top element is neither: find the layer it belongs to and see if it hides U
            let e = T ? T.el : top;
            for (; e && !e.contains(U.el); e = e.parentElement) if (opaque(e)) return true;
            return false;
          }
          return false;
        };
        const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const A = texts[i], B = texts[j];
          if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
          if (pinned(A.el) !== pinned(B.el)) continue; // scrolling under a pinned bar is layering, judged by 'covered'
          let hit = false;
          for (const ra of A.rects) { for (const rb of B.rects) { const x = inter(ra, rb); if (x > 0.15 * Math.min(ra.width * ra.height, rb.width * rb.height)) { hit = true; break; } } if (hit) break; }
          if (hit && occluded(A, B)) continue; // one sits on an opaque layer above the other (a window, a card): layering, not a collision
          if (hit) out.push(['overlap', label(A.el) + ' × ' + label(B.el), A.t.slice(0, 30) + ' | ' + B.t.slice(0, 30)]);
        }
        // fixed/sticky UI covering text (including the injected nav button)
        const fixed = [];
        for (const el of document.querySelectorAll('body *')) {
          const s = getComputedStyle(el);
          if ((s.position === 'fixed' || s.position === 'sticky') && vis(el) && !ign(el)) { const r = el.getBoundingClientRect(); if (r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < vh && r.width < vw * 0.98) fixed.push({ el, r }); }
        }
        // scrolling text passes under pinned UI by design; it only matters where it can rest:
        // at the very top and the very bottom of the page (or on pages that don't scroll)
        const atRest = scrollY < 2 || scrollY + vh >= document.documentElement.scrollHeight - 2;
        if (atRest) for (const f of fixed) for (const o of texts) {
          if (f.el.contains(o.el) || o.el.contains(f.el) || pinned(o.el)) continue;
          const fp = getComputedStyle(o.el); if (fp.position === 'fixed') continue;
          for (const rr of o.rects) if (inter(f.r, rr) > 0.3 * rr.width * rr.height) { out.push(['covered', label(o.el) + ' under ' + label(f.el), o.t.slice(0, 50)]); break; }
        }
        return out;
      });
      for (const f of found) { const k = f.join('|'); if (!seen.has(k)) { seen.add(k); all.push([w, y, ...f]); } }
    }
    const ox = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ox > 0) all.push([w, 0, 'page-scrolls-sideways', ox + 'px', '']);
    for (const e of errors) all.push([w, 0, 'js-error', e.slice(0, 120), '']);
    await ctx.close();
  }
  await browser.close();
  const byKind = {};
  for (const a of all) byKind[a[2]] = (byKind[a[2]] || 0) + 1;
  for (const a of all) console.log(`${a[0]}px @${a[1]}  ${a[2].padEnd(22)} ${a[3]}  «${a[4]}»`);
  console.log(`\n${page}: ${all.length} issues`, JSON.stringify(byKind));
})();
