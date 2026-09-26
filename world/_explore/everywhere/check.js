// Interaction, reduced-motion and #from- checks for the Airport.
const { execSync } = require('child_process');
const pw = require(execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path');
const OUT = path.resolve(__dirname, '../../_shots');
const U = 'http://127.0.0.1:8791/everywhere.html';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await pw.chromium.launch();
  const logs = [];
  async function page(opts, url) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage();
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') { if (!/ERR_FAILED/.test(m.text())) logs.push(m.type() + ': ' + m.text()); } });
    p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.goto(url || U); return p;
  }
  const D = { viewport: { width: 1440, height: 900 } };
  const PH = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
  // desktop: pick KOR
  let p = await page(D); await sleep(4200);
  await p.click('.codes button[data-i="1"]'); await sleep(700);
  await p.screenshot({ path: OUT + '/ev-chk-d-kor-mid.png' });
  await sleep(3200); await p.screenshot({ path: OUT + '/ev-chk-d-kor.png' });
  await p.click('.codes button[data-i="4"]'); await sleep(3800); await p.screenshot({ path: OUT + '/ev-chk-d-hun.png' });
  await p.click('.codes button[data-i="6"]'); await sleep(3800); await p.screenshot({ path: OUT + '/ev-chk-d-eur.png' });
  // board
  await p.evaluate(() => document.querySelector('#departures').scrollIntoView()); await sleep(2500);
  await p.click('#departures .row >> nth=3'); await sleep(2500);
  await p.screenshot({ path: OUT + '/ev-chk-d-board.png' });
  await p.evaluate(() => document.querySelector('#gates .board').scrollIntoView()); await sleep(2500);
  await p.screenshot({ path: OUT + '/ev-chk-d-gates.png' });
  // auto cycle
  p = await page(D); await sleep(4000 + 7000 + 3500);
  console.log('auto-cycle code after ~14s:', await p.evaluate(() => window.__ev.G.code));
  await p.screenshot({ path: OUT + '/ev-chk-d-auto.png' });
  // phone: tap PRI
  p = await page(PH); await sleep(4000);
  await p.tap('.codes button[data-i="5"]'); await sleep(3800);
  await p.evaluate(() => scrollTo(0, 330)); await sleep(600);
  await p.screenshot({ path: OUT + '/ev-chk-p-pri.png' });
  // reduced motion
  p = await page({ ...D, reducedMotion: 'reduce' }); await sleep(1200);
  await p.screenshot({ path: OUT + '/ev-chk-d-rm.png' });
  await p.click('.codes button[data-i="1"]'); await sleep(600);
  await p.screenshot({ path: OUT + '/ev-chk-d-rm-kor.png' });
  console.log('rm intro class:', await p.evaluate(() => document.documentElement.className));
  p = await page({ ...PH, reducedMotion: 'reduce' }); await sleep(1200);
  await p.screenshot({ path: OUT + '/ev-chk-p-rm.png' });
  // #from- hash
  p = await page(D, U + '#from-index'); await sleep(500);
  console.log('from- intro class:', await p.evaluate(() => document.documentElement.className), 'scrollY', await p.evaluate(() => scrollY));
  await p.screenshot({ path: OUT + '/ev-chk-d-from.png' });
  // keyboard focus
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  await p.screenshot({ path: OUT + '/ev-chk-d-focus.png' });
  console.log(logs.length ? logs.join('\n') : 'no console errors');
  await b.close();
})();
