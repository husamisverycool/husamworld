// node check.js <desktop|phone|rm> <outprefix>
const { execSync, execFileSync } = require('child_process');
const pw = require(execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const CACHE = '/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/fontcache';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
function get(url) { const f = path.join(CACHE, crypto.createHash('md5').update(url).digest('hex')); if (!fs.existsSync(f)) execFileSync('curl', ['-sS', '-f', '-A', UA, '-o', f, url], { timeout: 30000 }); return fs.readFileSync(f); }
const [mode, out] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const phone = mode === 'phone';
  const ctx = await browser.newContext(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 }, reducedMotion: mode === 'rm' ? 'reduce' : 'no-preference' });
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, async route => { const url = route.request().url(); try { await route.fulfill({ status: 200, body: get(url), headers: { 'content-type': url.includes('googleapis') ? 'text/css; charset=utf-8' : 'font/woff2', 'access-control-allow-origin': '*' } }); } catch (e) { await route.abort(); } });
  const page = await ctx.newPage();
  const errs = [], reqs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('request', r => { const u = r.url(); if (!u.startsWith('http://127.0.0.1') && !u.includes('fonts.g')) reqs.push(u); });
  await page.goto('http://127.0.0.1:8871/depths.html', { waitUntil: 'load' });
  await sleep(700);
  await page.screenshot({ path: out + '-00.png' });
  const intro = await page.evaluate(() => document.documentElement.classList.contains('intro-on'));
  await sleep(4200);
  await page.screenshot({ path: out + '-01.png' });
  // sink test
  let sink = 'hidden';
  if (await page.isVisible('#sinkBtn')) {
    const y0 = await page.evaluate(() => scrollY);
    if (phone) await page.tap('#sinkBtn'); else await page.click('#sinkBtn');
    await sleep(2500);
    const y1 = await page.evaluate(() => scrollY);
    await page.screenshot({ path: out + '-02sink.png' });
    if (phone) await page.touchscreen.tap(200, 400); else { await page.mouse.move(700, 450); await page.mouse.wheel(0, 10); }
    await sleep(600);
    const y2 = await page.evaluate(() => scrollY); await sleep(600);
    const y3 = await page.evaluate(() => scrollY);
    sink = { y0, y1, stoppedDrift: y3 - y2, label: await page.textContent('#sinkBtn') };
  }
  // pool on screen
  await page.evaluate(() => { const p = document.getElementById('pool'); scrollTo(0, p.getBoundingClientRect().top + scrollY + p.offsetHeight / 2 - innerHeight / 2); });
  await sleep(700);
  await page.screenshot({ path: out + '-03pool.png' });
  // legend jump back
  await page.evaluate(() => document.getElementById('collection').scrollIntoView());
  await sleep(400);
  await page.evaluate(() => document.querySelector('[data-go="s-tass"]').click());
  await sleep(3200);
  const tass = await page.evaluate(() => { const r = document.getElementById('s-tass').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom), innerHeight]; });
  await page.screenshot({ path: out + '-04jump.png' });
  // corner check at the end
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await sleep(500);
  const corner = await page.evaluate(() => { const hits = []; for (let x = 2; x < 72; x += 10) for (let y = innerHeight - 70; y < innerHeight; y += 10) { const e = document.elementFromPoint(x, y); if (e && e.closest('button,a,p,h2,h3,li') && !e.closest('husam-world-nav')) hits.push(e.tagName + '.' + e.className); } return [...new Set(hits)]; });
  await page.screenshot({ path: out + '-05end.png' });
  const info = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  // from- hash: no intro
  const p2 = await ctx.newPage();
  await p2.goto('http://127.0.0.1:8871/depths.html#from-index', { waitUntil: 'load' }); await sleep(400);
  const fromIntro = await p2.evaluate(() => document.documentElement.classList.contains('intro-on'));
  console.log(JSON.stringify({ mode, intro, fromIntro, sink, tass, corner, info, external: reqs }), '\nerrors:', errs.length ? errs.join('\n') : 'none');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
