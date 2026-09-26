// node shoot.js <file relative to world/> <outprefix> <desktop|phone|rm> [js steps as JSON: [[label, scrollExpr, waitMs, actionJs?]]]
const { execSync, execFileSync } = require('child_process');
const pw = require(execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const CACHE = '/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/fontcache';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
function get(url) { const f = path.join(CACHE, crypto.createHash('md5').update(url).digest('hex')); if (!fs.existsSync(f)) execFileSync('curl', ['-sS', '-f', '-A', UA, '-o', f, url], { timeout: 30000 }); return fs.readFileSync(f); }
const [file, out, mode, stepsJson] = process.argv.slice(2);
const steps = stepsJson ? JSON.parse(fs.readFileSync(stepsJson, 'utf8')) : [['top', '0', 1500]];
fs.mkdirSync(path.dirname(out), { recursive: true });
(async () => {
  const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const phone = mode === 'phone';
  const ctx = await browser.newContext(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 }, reducedMotion: mode === 'rm' ? 'reduce' : 'no-preference' });
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, async route => {
    const url = route.request().url();
    try { const body = get(url); const ct = url.includes('googleapis') ? 'text/css; charset=utf-8' : 'font/woff2'; await route.fulfill({ status: 200, body, headers: { 'content-type': ct, 'access-control-allow-origin': '*' } }); } catch (e) { await route.abort(); }
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto('http://127.0.0.1:8871/' + file, { waitUntil: 'load' });
  for (const [label, expr, wait, act] of steps) {
    if (act) await page.evaluate(act);
    if (expr !== null) await page.evaluate(`window.scrollTo(0, ${expr})`);
    await page.waitForTimeout(wait || 500);
    await page.screenshot({ path: `${out}-${label}.png` });
  }
  const info = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  console.log(mode, JSON.stringify(info), 'errors:', errs.length ? '\n' + errs.join('\n') : 'none');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
