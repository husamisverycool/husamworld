// Screenshot + console check for the Airport page and its prototypes.
// usage: node world/_explore/everywhere/shoot.js <path relative to world/> <outname> [extra]
//   extra: "rm" (reduced motion only), "from" (#from-index hash)
const { execSync } = require('child_process');
const pw = require(execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path');
const OUT = path.resolve(__dirname, '../../_shots');
const rel = process.argv[2] || 'everywhere.html';
const name = process.argv[3] || 'everywhere';
const extra = process.argv[4] || '';
const URL = 'http://127.0.0.1:8791/' + rel + (extra === 'from' ? '#from-index' : '');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run(browser, kind) {
  const phone = kind === 'phone';
  const ctx = await browser.newContext(phone
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: extra === 'rm' ? 'reduce' : 'no-preference' }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: extra === 'rm' ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  page.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)/.test(r.url())) logs.push('REQFAIL: ' + r.url().slice(0, 100)); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(URL, { waitUntil: 'load' });
  await sleep(900);
  await page.screenshot({ path: `${OUT}/${name}-${kind}-0intro.png` });
  await sleep(3800);
  await page.screenshot({ path: `${OUT}/${name}-${kind}-1top.png` });
  const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.documentElement.scrollHeight]);
  // walk down the page so scroll-driven things run
  const H = w[2];
  for (let y = 0; y < H; y += 700) { await page.evaluate(v => scrollTo(0, v), y); await sleep(160); }
  await page.evaluate(() => scrollTo(0, 0)); await sleep(500);
  await page.screenshot({ path: `${OUT}/${name}-${kind}-full.png`, fullPage: true });
  console.log(kind, 'scrollWidth/innerWidth/height', w.join('/'), logs.length ? '\n  ' + logs.join('\n  ') : 'no console errors');
  await ctx.close();
}

(async () => {
  const browser = await pw.chromium.launch();
  const kinds = (process.argv[5] || 'desktop,phone').split(',');
  for (const k of kinds) await run(browser, k);
  await browser.close();
})();
