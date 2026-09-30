/* husam.world: the shared way home, injected into every district page (bottom-left).
   Closed, it is the hub itself in miniature: the tiny planet, its road, and your car parked at this district.
   Open, the planet leaves its pad and grows into a map of the world (after bruno-simon.com's 2025 map:
   diamond pins where each place really sits; pick one to go there), plus the way back onto the road.
   Everything is drawn here in code, in the hub's own palette, type and toon light. Shadow root: nothing leaks. */
(function () {
  if (customElements.get('husam-world-nav')) return;
  // every district opens at its top: on a fresh visit, on reload, and when the Back button brings it back from the page cache.
  // (a real #section link is still honoured; #from-… is only the hub's return ticket)
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  function toTop() {
    if (location.hash && !/^#from-/.test(location.hash)) return;
    var h = document.documentElement, sb = h.style.scrollBehavior; h.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); h.style.scrollBehavior = sb;
  }
  toTop(); addEventListener('DOMContentLoaded', toTop); addEventListener('load', function () { if (window.scrollY < innerHeight) toTop(); });
  addEventListener('pageshow', function (e) { if (e.persisted) toTop(); });

  // [id, name, short description (a pointer only: no facts a district owns)]
  var DISTRICTS = [
    ['bill', 'The Capitol', 'Advocacy and lawmaking'],
    ['speech', 'The Chamber', 'Debate and speech'],
    ['translation', 'The Bridge', 'Arabic and English, in print'],
    ['n1', 'The Polling Station', 'Research and data'],
    ['triptik', 'The Map Room', 'Home ground'],
    ['os', 'The Garage', 'Things he built'],
    ['depths', 'The Pier', 'Honors, by rarity'],
    ['weeks', 'The Plaza', 'How the weeks fill up'],
    ['everywhere', 'The Airport', 'Campus, and far from it']
  ];
  // where each place really sits in index.html: road parameter t (0 Fresno, 1 Cambridge) and the site's lat/lon,
  // computed with the hub's own road maths (LAT0 -64, LAT1 64, TURNS 2.35, LON0 .4; sites beside the road)
  var SITE = {
    bill: [.1217, -67.83, 137.26], speech: [.2233, -19.5, -151.65], translation: [.3106, -24.27, -74.48],
    n1: [.3911, 3.67, -9.08], triptik: [.4683, -23.31, 61.97], os: [.5444, 24.08, 120.28],
    depths: [.6217, -7.49, -167.61], weeks: [.7033, 45.09, -106.84], everywhere: [.7922, 14.4, -22.53]
  };
  // each district's own ground colour, for the mask on the way in (the hub's wipe uses the same pairs)
  var WIPE = {
    bill: ['#d6d8d3', '#151515'], speech: ['#fcfbf7', '#151513'], translation: ['#edf0ef', '#172029'], n1: ['#fcfcfa', '#111111'],
    triptik: ['#f7f4e8', '#1c2420'], os: ['#101211', '#d9f2d0'], depths: ['#0b2e4a', '#e6f4ff'], weeks: ['#ffffff', '#111111'], everywhere: ['#000000', '#ffffff']
  };
  var HOME_WORD = 'Back on the road', TAG_WORD = 'husam.world';

  var INK = '#23262e', CREAM = '#f5f0e1';
  var DEG = Math.PI / 180, TAU = Math.PI * 2;
  var mq = matchMedia('(prefers-reduced-motion: reduce)');
  function RM() { return mq.matches; }

  // ------------------------------------------------------------------ fonts: the hub's Bungee + Barlow, renamed so no page's own faces are touched
  var fontsAsked = false;
  function loadFonts() {
    if (fontsAsked || !window.fetch) return; fontsAsked = true;
    var chars = TAG_WORD + HOME_WORD + DISTRICTS.map(function (d) { return d[1] + d[2]; }).join('');
    chars = (chars + chars.toUpperCase()).split('').filter(function (c, i, a) { return a.indexOf(c) === i; }).join('');
    fetch('https://fonts.googleapis.com/css2?family=Bungee&family=Barlow:wght@500&display=swap&text=' + encodeURIComponent(chars))
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (css) {
        if (!css) return;
        var s = document.createElement('style'); s.setAttribute('data-world-nav', '');
        s.textContent = css.replace(/font-family:\s*'([^']+)'/g, "font-family: 'hwn $1'");
        document.head.appendChild(s);
      }).catch(function () {});
  }

  // ------------------------------------------------------------------ tiny vector kit
  function v(x, y, z) { return [x, y, z]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function scale(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function rot(p, ax, an) { var c = Math.cos(an), s = Math.sin(an), d = dot(ax, p), x = cross(ax, p); return [p[0] * c + x[0] * s + ax[0] * d * (1 - c), p[1] * c + x[1] * s + ax[1] * d * (1 - c), p[2] * c + x[2] * s + ax[2] * d * (1 - c)]; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function ll(lat, lon) { lat *= DEG; lon *= DEG; return v(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)); }
  function road(t) { return ll(-64 + 128 * t, (.4 + t * 2.35 * TAU) / DEG); }
  function roadTan(t) { return norm(sub(road(t + .002), road(t - .002))); }
  function hex(h) { return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255]; }
  // the hub's value noise, so the gold valley and the green north fall where they do on the real planet
  function hash3(x, y, z) { var s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); }
  function vnoise(x, y, z) {
    var ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = x - ix, fy = y - iy, fz = z - iz;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
    function h(a, b, c) { return hash3(ix + a, iy + b, iz + c); }
    function l(a, b, k) { return a + (b - a) * k; }
    return l(l(l(h(0, 0, 0), h(1, 0, 0), fx), l(h(0, 1, 0), h(1, 1, 0), fx), fy), l(l(h(0, 0, 1), h(1, 0, 1), fx), l(h(0, 1, 1), h(1, 1, 1), fx), fy), fz);
  }
  var GOLD = hex('#e8c46e'), GREEN = hex('#8cc46a'), FIELD = hex('#c99a5c'), SPRING = hex('#a6d67a');
  var LIGHT = hex('#fff6e6'), SHADOW = hex('#8388d8');
  var LDIR = norm([-.55, .75, .45]); // from the camera's upper left, as in the hub

  // trees: fixed points on the planet, kept off the road (seeded, so every page draws the same world)
  var TREES = (function () {
    var out = [], seed = 20251, pts = [];
    for (var i = 0; i <= 400; i++) pts.push(road(i / 400));
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    while (out.length < 46) {
      var p = norm([r() * 2 - 1, r() * 2 - 1, r() * 2 - 1]), near = -1;
      for (var j = 0; j < pts.length; j++) near = Math.max(near, dot(p, pts[j]));
      if (near > Math.cos(7 * DEG)) continue;
      var lat = Math.asin(p[1]) / DEG;
      out.push({ p: p, c: lat < -30 ? (r() < .5 ? '#f6c9d6' : '#6fb35d') : lat > 38 ? (r() < .6 ? '#d9523a' : '#3f8a55') : (r() < .75 ? '#6fb35d' : '#3f8a55'), s: .8 + r() * .5 });
    }
    return out;
  })();

  // ------------------------------------------------------------------ the painter: one orthographic planet, toon-lit, ink-outlined
  function Planet(canvas, opts) {
    this.c = canvas; this.x = canvas.getContext('2d'); this.o = opts;
    this.g = document.createElement('canvas'); this.gx = this.g.getContext('2d');
  }
  Planet.prototype.size = function (css) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    this.css = css; this.dpr = dpr;
    this.c.width = Math.round(css * dpr); this.c.height = Math.round(css * dpr);
    this.c.style.width = this.c.style.height = css + 'px';
    var res = Math.round(css * this.o.planet * Math.min(dpr, this.o.groundMax || 2));
    this.g.width = this.g.height = res; this.img = this.gx.createImageData(res, res);
  };
  Planet.prototype.draw = function (B, extra) {
    var x = this.x, css = this.css, dpr = this.dpr, rad = css * this.o.planet / 2, cx = css / 2, cy = css / 2 + (this.o.dy || 0) * css;
    var f = B.f, u = B.u, r = B.r;
    // ground, per pixel at a low resolution (the hub's colour rules + two-band toon light + coloured shadow)
    var res = this.g.width, d = this.img.data, k = 0, fields = this.o.detail;
    for (var py = 0; py < res; py++) for (var px = 0; px < res; px++, k += 4) {
      var sx = (px + .5) / res * 2 - 1, sy = 1 - (py + .5) / res * 2, rr = sx * sx + sy * sy;
      if (rr > 1) { d[k + 3] = 0; continue; }
      var sz = Math.sqrt(1 - rr), n = [sx * r[0] + sy * u[0] + sz * f[0], sx * r[1] + sy * u[1] + sz * f[1], sx * r[2] + sy * u[2] + sz * f[2]];
      var lat = Math.asin(clamp(n[1], -1, 1)) / DEG, nz = vnoise(n[0] * 3.1 + 7, n[1] * 3.1, n[2] * 3.1) - .5, nz2 = vnoise(n[0] * 9, n[1] * 9 + 3, n[2] * 9);
      var base = lat + nz * 40 < -4 ? GOLD : GREEN; if (fields && nz2 > .7) base = lat < 5 ? FIELD : SPRING; if (lat > 58 + nz * 10) base = GREEN;
      var dl = sx * LDIR[0] + sy * LDIR[1] + sz * LDIR[2], band = smooth(-.01, .05, dl), hi = smooth(.74, .8, dl) * .07, rim = Math.pow(1 - sz, 3) * .16 * band;
      for (var c = 0; c < 3; c++) {
        var lit = base[c] * LIGHT[c], sh = base[c] + (base[c] * SHADOW[c] - base[c]) * .62;
        d[k + c] = clamp((sh + (lit - sh) * band + base[c] * hi + rim) * 255, 0, 255);
      }
      d[k + 3] = clamp((1 - Math.sqrt(rr)) * res * .5 + .5, 0, 1) * 255;
    }
    this.gx.putImageData(this.img, 0, 0);
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, css, css);
    function P(p, lift) { var q = lift ? scale(p, 1 + lift) : p; return [cx + dot(q, r) * rad, cy - dot(q, u) * rad, dot(p, f)]; }
    var lw = this.o.line, tr = rad * .052 * this.o.tree;
    // trees behind the limb first, so the ones on the far side peek over the horizon like on the title planet
    var faceMax = this.o.faceTrees;
    function tree(t, front) {
      var z = dot(t.p, f); if (front ? (z < 0 || z > faceMax) : (z >= 0 || z < -.16)) return;
      var q = P(t.p, .075 * t.s), s = tr * t.s;
      x.beginPath(); x.arc(q[0], q[1], s, 0, TAU); x.fillStyle = t.c; x.fill(); x.lineWidth = lw * .7; x.strokeStyle = INK; x.stroke();
    }
    TREES.forEach(function (t) { tree(t, false); });
    x.imageSmoothingEnabled = true; x.drawImage(this.g, cx - rad, cy - rad, rad * 2, rad * 2);
    // the road: asphalt with cream edges and a dashed gold centre, drawn only where it faces us
    var N = this.o.roadSteps, w = rad * .1125 * this.o.roadScale, pts = [];
    for (var i = 0; i <= N; i++) pts.push(P(road(i / N), .004));
    function pass(width, colour, dash) {
      x.strokeStyle = colour; x.lineCap = dash ? 'butt' : 'round';
      for (var i = 1; i <= N; i++) {
        var a = pts[i - 1], b = pts[i]; if (a[2] < .02 || b[2] < .02) continue;
        if (dash && (i % 4) > 1) continue;
        x.lineWidth = width * (.35 + .65 * Math.sqrt(Math.min(a[2], b[2])));
        x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
      }
    }
    if (this.o.detail) { pass(w + lw * 1.4, INK); pass(w, '#fbf4df'); pass(w * .74, '#4a4b55'); pass(w * .09, '#f2c23a', true); }
    else { pass(w + lw, INK); pass(w, '#4a4b55'); }
    // Fresno and Cambridge: the two round plazas at the road's ends
    [0, 1].forEach(function (t) {
      var p = road(t), q = P(p, .004); if (q[2] < .05) return;
      var e = [], M = 28; for (var j = 0; j <= M; j++) { var a = j / M * TAU, ax = norm(cross(p, [0, 1, 0])), ay = cross(ax, p), off = .16; e.push(P(norm([p[0] + (ax[0] * Math.cos(a) + ay[0] * Math.sin(a)) * off, p[1] + (ax[1] * Math.cos(a) + ay[1] * Math.sin(a)) * off, p[2] + (ax[2] * Math.cos(a) + ay[2] * Math.sin(a)) * off]), .004)); }
      x.beginPath(); e.forEach(function (s, j) { if (j) x.lineTo(s[0], s[1]); else x.moveTo(s[0], s[1]); }); x.closePath();
      x.fillStyle = '#4a4b55'; x.fill(); x.lineWidth = lw * .8; x.strokeStyle = INK; x.stroke();
    });
    TREES.forEach(function (t) { tree(t, true); });
    // ink outline around the planet (the hub's outline pass, as a line)
    x.beginPath(); x.arc(cx, cy, rad, 0, TAU); x.lineWidth = lw; x.strokeStyle = INK; x.stroke();
    // the car, parked on the road at this district, nose along the road
    if (extra && extra.car != null) {
      var t = extra.car, p = road(t), q = P(p, .02);
      if (q[2] > .05) {
        var ahead = P(road(t + .004), .02), ang = Math.atan2(ahead[1] - q[1], ahead[0] - q[0]), L = rad * this.o.car, W = L * .66, hop = extra.hop || 0;
        x.save(); x.translate(q[0], q[1] - hop * L * .9); x.rotate(ang); x.scale(1 + hop * .08, 1 - hop * .08);
        x.fillStyle = 'rgba(35,38,46,.28)'; x.fillRect(-L / 2 + 1, -W / 2 + 1.5 + hop * L * .9, L, W);
        // the hub's car (round 11; blue since round 15): a wagon, cream roof, the trip's luggage on top, nose along the road
        var rr = function (x0, y0, w0, h0, r0) { x.beginPath(); x.moveTo(x0 + r0, y0); x.arcTo(x0 + w0, y0, x0 + w0, y0 + h0, r0); x.arcTo(x0 + w0, y0 + h0, x0, y0 + h0, r0); x.arcTo(x0, y0 + h0, x0, y0, r0); x.arcTo(x0, y0, x0 + w0, y0, r0); x.closePath(); };
        x.fillStyle = '#2f7de1'; x.strokeStyle = INK; x.lineWidth = lw * .8; rr(-L / 2, -W / 2, L, W, W * .28); x.fill(); x.stroke();
        x.fillStyle = '#3b5a78'; x.fillRect(L * .14, -W * .36, L * .1, W * .72);
        x.fillStyle = '#fff4dc'; x.fillRect(-L * .44, -W * .36, L * .58, W * .72);
        x.fillStyle = '#c7672e'; x.fillRect(-L * .36, -W * .3, L * .22, W * .34);
        x.fillStyle = '#2fa39a'; x.fillRect(-L * .08, -W * .32, L * .1, W * .64);
        x.restore();
      }
    }
    return P;
  };

  // an orientation = the point facing us (f) and screen-up (u); r completes it
  function basis(f, u) { f = norm(f); u = norm(sub(u, scale(f, dot(u, f)))); return { f: f, u: u, r: cross(u, f) }; }
  function facing(p, up) { return basis(p, up || [0, 1, 0]); }

  // ------------------------------------------------------------------ the element
  class WorldNav extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      var here = this.getAttribute('current') || '', self = this;
      var root = this.attachShadow({ mode: 'open' });
      var hereSite = SITE[here] || [0, -64, 23];
      var rows = DISTRICTS.map(function (d) {
        var inner = '<i class="dia" aria-hidden="true"></i><b>' + d[1] + '</b><span>' + d[2] + '</span>';
        if (d[0] === here) return '<li><span class="row here" aria-current="page" data-id="' + d[0] + '"><svg class="car" viewBox="0 0 20 14" aria-hidden="true"><rect x="1.5" y="1.5" width="17" height="11" rx="3" fill="#2f7de1" stroke="#23262e" stroke-width="2"/><rect x="12.2" y="3.4" width="2" height="7.2" fill="#3b5a78"/><rect x="3" y="3.4" width="9" height="7.2" fill="#fff4dc"/><rect x="4" y="4" width="3.6" height="3.4" fill="#c7672e"/><rect x="8.6" y="3.8" width="2" height="6.4" fill="#2fa39a"/></svg><b>' + d[1] + '</b><span>' + d[2] + '</span></span></li>';
        return '<li><a class="row" href="' + d[0] + '.html" data-id="' + d[0] + '">' + inner + '</a></li>';
      }).join('');
      var pins = DISTRICTS.map(function (d) {
        return '<a class="pin' + (d[0] === here ? ' is-here' : '') + '" href="' + d[0] + '.html" data-id="' + d[0] + '" tabindex="-1" aria-hidden="true"><i></i><b><span>' + d[1].replace(/^The /, '') + '</span></b></a>';
      }).join('');

      root.innerHTML =
        '<style>' +
        ':host{all:initial;position:fixed;left:max(10px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom));z-index:2147483000;color:' + INK + ';font:500 15px/1.3 "hwn Barlow","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}' +
        '*{box-sizing:border-box}' +
        'button,a{font:inherit;color:inherit;text-decoration:none;-webkit-tap-highlight-color:transparent}' +
        // the trigger: the planet, sitting in its own shadow on a pad
        '.orb{position:relative;display:block;width:56px;height:56px;padding:0;margin:0;border:0;background:none;cursor:pointer;touch-action:manipulation}' +
        '.orb canvas{position:absolute;left:0;top:0;display:block;transition:transform .3s cubic-bezier(.23,1,.32,1),opacity .15s}' +
        '.orb::before{content:"";position:absolute;left:9px;right:9px;bottom:1px;height:7px;border-radius:50%;background:rgba(35,38,46,.3);filter:blur(1px);transition:opacity .2s}' +
        // the pad left behind while the planet is out being a map (the hub pad: a dashed cream ring)
        '.pad{position:absolute;inset:0;width:56px;height:56px;opacity:0;transform:scale(.7);transition:opacity .2s,transform .3s cubic-bezier(.23,1,.32,1)}' +
        '.orb[aria-expanded=true] canvas{opacity:0}.orb[aria-expanded=true]::before{opacity:0}.orb[aria-expanded=true] .pad{opacity:1;transform:none}' +
        '.orb:active canvas{transform:scale(.94)}' +
        '.orb:focus-visible,.home:focus-visible{outline:3px solid #f2c94c;outline-offset:3px}' +
        ':focus{outline:none}' +
        // the tag that slides out of a diamond (the hub\'s landmark tags, in the DOM)
        '.tag{position:absolute;left:52px;bottom:16px;display:flex;align-items:center;height:24px;pointer-events:none;opacity:0;transition:opacity .15s}' +
        '.tag i,.pin i{flex:none;display:block;width:15px;height:15px;background:' + INK + ';transform:rotate(45deg);box-shadow:inset 0 0 0 3px ' + INK + ',inset 0 0 0 4.5px ' + CREAM + ';position:relative;z-index:1}' +
        '.tag b,.pin b{display:block;overflow:hidden;margin-left:-8px}' +
        '.tag b span,.pin b span{display:block;white-space:nowrap;background:' + INK + ';color:' + CREAM + ';font:400 13px/1 "hwn Bungee","Arial Black",Impact,sans-serif;padding:5px 8px 4px 13px;transform:translateX(-101%);transition:transform .26s cubic-bezier(.23,1,.32,1)}' +
        '.orb:hover+.tag,.orb:focus-visible+.tag{opacity:1}.orb:hover+.tag b span,.orb:focus-visible+.tag b span{transform:none}' +
        '.orb[aria-expanded=true]+.tag{opacity:0}' +
        '@media (hover:none){.tag{display:none}}' +
        // the open map: a slab of the hub\'s paper, ink edge, hard drop
        '.panel{position:absolute;left:2.5px;bottom:70px;width:min(540px,calc(100vw - 25px));isolation:isolate}' +
        '.inner{max-height:calc(100vh - 92px);max-height:calc(100dvh - 92px);overflow:auto;overscroll-behavior:contain;padding:14px;display:grid;grid-template-columns:200px 1fr;grid-template-rows:auto 1fr;grid-template-areas:"map list" "home list";gap:14px 16px}' +
        '.panel[hidden]{display:none}' +
        '.paper{position:absolute;inset:0;background:' + CREAM + ';box-shadow:0 0 0 2.5px ' + INK + ',0 5px 0 2.5px ' + INK + ';pointer-events:none;z-index:-1;transform-origin:26px calc(100% + 40px)}' +
                '.map{grid-area:map;position:relative;width:200px;height:200px;background:radial-gradient(120% 90% at 50% 38%,#b4e6f0 0%,#6dbcd6 78%);box-shadow:inset 0 0 0 2.5px ' + INK + ';touch-action:none;cursor:grab}' +
        '.map.drag{cursor:grabbing}' +
        '.map canvas{position:absolute;left:0;top:0;display:block}' +
        '.fly{transform-origin:0 0}' +
        '.pin{position:absolute;left:0;top:0;display:flex;align-items:center;height:22px;margin:-11px 0 0 -8px;cursor:pointer;transition:opacity .2s}' +
        '.pin i{width:13px;height:13px;box-shadow:inset 0 0 0 2.5px ' + INK + ',inset 0 0 0 4px ' + CREAM + ';transition:transform .3s cubic-bezier(.49,2.2,.53,.75)}' +
        '.pin.is-here i{background:#e0533d}' +
        '.pin b span{font-size:12px;padding:4px 7px 3px 11px}' +
        '.pin.on{z-index:3}.pin.on i{transform:rotate(45deg) scale(1.3)}.pin.on b span{transform:none}' +
        '.pin.off{opacity:0;pointer-events:none}' +
        '.home{grid-area:home;align-self:start;display:flex;align-items:center;justify-content:center;min-height:50px;padding:12px 14px 10px;background:#f2c94c;color:' + INK + ';font:400 15px/1.05 "hwn Bungee","Arial Black",Impact,sans-serif;text-align:center;box-shadow:0 0 0 2.5px ' + INK + ',0 5px 0 2.5px ' + INK + ';margin:2.5px 2.5px 8px;transition:transform .15s cubic-bezier(.4,1.6,.65,1),box-shadow .15s}' +
        '.home:hover{transform:translateY(-2px)}' +
        '.home:active{transform:translateY(3px);box-shadow:0 0 0 2.5px ' + INK + ',0 2px 0 2.5px ' + INK + '}' +
        'ul{grid-area:list;list-style:none;margin:0;padding:0;align-self:start}' +
        '.row{display:grid;grid-template-columns:20px 1fr;column-gap:10px;align-items:center;min-height:44px;padding:6px 10px 6px 8px;cursor:pointer}' +
        '.row b{font:400 15px/1.1 "hwn Bungee","Arial Black",Impact,sans-serif}' +
        '.row span{grid-column:2;font-size:14px;line-height:1.25;color:#4b4f5c;margin-top:2px}' +
        '.row .dia{grid-row:1/3;justify-self:center;width:11px;height:11px;background:' + INK + ';transform:rotate(45deg);box-shadow:inset 0 0 0 2px ' + INK + ',inset 0 0 0 3.2px ' + CREAM + ';transition:transform .3s cubic-bezier(.49,2.2,.53,.75)}' +
        '.row .car{grid-row:1/3;justify-self:center;width:20px;height:14px}' +
        'a.row:hover,a.row.on,a.row:focus-visible{background:#fff}' +
        'a.row:focus-visible{box-shadow:inset 0 0 0 2.5px ' + INK + '}' +
        'a.row:hover .dia,a.row.on .dia,a.row:focus-visible .dia{transform:rotate(45deg) scale(1.35)}' +
        '.here{cursor:default}' +
        // the plain page: a quiet row under the places, text face only, no diamond, no wipe (the way out of the game, not another place in it)
        '.pl{margin-top:6px;border-top:1.5px dashed rgba(35,38,46,.35);padding-top:6px}' +
        '.plain{display:grid;grid-template-columns:20px 1fr;column-gap:10px;align-items:center;min-height:44px;padding:6px 10px 6px 8px;color:#4b4f5c}' +
        '.plain svg{grid-row:1/3;justify-self:center;width:14px;height:12px}' +
        '.plain b{font:700 15px/1.2 "hwn Barlow","Helvetica Neue",Arial,sans-serif;color:' + INK + ';text-decoration:underline;text-underline-offset:3px}' +
        '.plain span{grid-column:2;font-size:14px;line-height:1.25;margin-top:1px}' +
        '.plain:hover,.plain:focus-visible{background:#fff}.plain:focus-visible{box-shadow:inset 0 0 0 2.5px ' + INK + '}' +
        // narrow screens: planet and the way home side by side, the list below
        '@media (max-width:560px){.inner{grid-template-columns:136px 1fr;grid-template-rows:auto auto;grid-template-areas:"map home" "list list";gap:10px 12px;padding:12px}.map{width:136px;height:136px}.row{min-height:42px;padding:4px 8px 4px 6px}.row b{font-size:14px}.row span{font-size:13.5px;margin-top:1px}.home{align-self:end;margin-bottom:9px;font-size:14px;padding:12px 10px 10px}}' +
        '@media (max-height:520px) and (min-width:561px){.inner{grid-template-columns:150px 1fr}.map{width:150px;height:150px}}' +
        // stagger the list in (paco.me\'s data-animate: each item a beat after the last)
        '.panel.in li,.panel.in .home{animation:rise .34s cubic-bezier(.23,1,.32,1) both;animation-delay:calc(var(--i) * 22ms + 60ms)}' +
        '@keyframes rise{from{opacity:0;transform:translateY(6px)}}' +
        // going somewhere: the hub\'s own mask, in the colour of where you are going
        '.wipe{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;visibility:hidden;clip-path:circle(0px at var(--wx) var(--wy));color:var(--ink)}' +
        '.wipe.go{visibility:visible;clip-path:circle(150vmax at var(--wx) var(--wy));transition:clip-path .6s cubic-bezier(.7,0,.2,1)}' +
        '.wipe b{font:400 clamp(36px,9vw,110px)/.9 "hwn Bungee","Arial Black",Impact,sans-serif;text-align:center;padding:0 16px;opacity:0;transform:translateY(18px);transition:transform .45s .22s cubic-bezier(.4,1.6,.65,1),opacity .25s .22s}' +
        '.wipe.go b{opacity:1;transform:none}' +
        '@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}' +
        '</style>' +
        '<button class="orb" type="button" aria-expanded="false" aria-controls="p" aria-label="Map of husam.world: go back to the road or to another place"><canvas class="mini" aria-hidden="true"></canvas><svg class="pad" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="21" fill="none" stroke="#23262e" stroke-width="7" opacity=".5"/><circle cx="28" cy="28" r="21" fill="none" stroke="#f5f0e1" stroke-width="4" stroke-dasharray="7.2 4.8"/></svg></button>' +
        '<span class="tag" aria-hidden="true"><i></i><b><span>' + TAG_WORD + '</span></b></span>' +
        '<div class="panel" id="p" role="dialog" aria-label="Map of husam.world" hidden>' +
        '<div class="paper"></div><div class="inner">' +
        '<div class="map" aria-hidden="true"><canvas class="big"></canvas>' + pins + '</div>' +
        '<a class="home" href="index.html#from-' + here + '" style="--i:0">' + HOME_WORD + '</a>' +
        '<ul>' + rows + '<li class="pl"><a class="plain" href="facts.html"><svg viewBox="0 0 14 12" aria-hidden="true"><path d="M1 2h12M1 6h12M1 10h8" stroke="currentColor" stroke-width="1.6"/></svg><b>The short version</b><span>Every fact on one plain page</span></a></li></ul></div></div>' +
        '<div class="wipe" aria-hidden="true"><b></b></div>';

      var $ = function (s) { return root.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
      var orb = $('.orb'), panel = $('.panel'), inner = $('.inner'), map = $('.map'), wipe = $('.wipe');
      $$('li').forEach(function (li, i) { li.style.setProperty('--i', i + 1); });

      // ---------------------------------------------------------- the two planets
      var carT = hereSite[0];
      var mini = new Planet($('.mini'), { planet: .82, line: 1.6, tree: 1.5, roadScale: 1.3, roadSteps: 360, detail: false, car: .34, groundMax: 2, dy: -.02, faceTrees: .3 });
      var big = new Planet($('.big'), { planet: .8, line: 2, tree: 1, roadScale: 1, roadSteps: 700, detail: true, car: .13, groundMax: 1.25, faceTrees: .55 });
      mini.size(56);
      // the trigger looks down at the car, nose up the screen: the planet as you see it while driving
      var miniB = basis(norm(mix(road(carT), roadTan(carT), -.28)), roadTan(carT));
      var hop = 0;
      function drawMini() { mini.draw(miniB, { car: carT, hop: hop }); }
      drawMini();

      var flying = false, cur = null, want = null, raf = 0, last = 0, bigSize = 0, pinEls = $$('.pin'), active = null;
      function homeView() { var s = SITE[here]; return s ? facing(ll(s[1], s[2])) : facing(road(0)); }
      function sizeBig() { var s = Math.round(map.getBoundingClientRect().width) || 200; if (s !== bigSize) { bigSize = s; big.size(s); } }
      function drawBig() {
        var P = big.draw(cur, { car: SITE[here] ? carT : null });
        pinEls.forEach(function (el) {
          var s = SITE[el.getAttribute('data-id')], q = P(ll(s[1], s[2]), .03);
          el.style.transform = 'translate(' + q[0].toFixed(1) + 'px,' + q[1].toFixed(1) + 'px)';
          el.classList.toggle('off', q[2] < .12);
        });
      }
      function tick(now) {
        var dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
        var k = 1 - Math.exp(-dt * 8), moving = false;
        if (want && cur) {
          var f = mix(cur.f, want.f, k), u = mix(cur.u, want.u, k);
          if (Math.hypot.apply(null, f) < .2) f = mix(f, want.r, .3); // never lerp through the centre
          cur = basis(f, u);
          moving = 1 - dot(cur.f, want.f) > 1e-6 || 1 - dot(cur.u, want.u) > 1e-6;
          if (!moving) cur = want;
          drawBig();
        }
        raf = moving ? requestAnimationFrame(tick) : 0;
      }
      function turnTo(b) { want = b; if (RM()) { cur = b; drawBig(); return; } if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
      function focusPlace(id) {
        active = id;
        pinEls.forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-id') === id); });
        $$('a.row').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-id') === id); });
        if (id && SITE[id]) turnTo(facing(ll(SITE[id][1], SITE[id][2])));
      }

      // ---------------------------------------------------------- open / close: the planet leaves its pad and grows into the map
      function isOpen() { return !panel.hidden; }
      function open() {
        if (isOpen()) return;
        loadFonts();
        panel.hidden = false; orb.setAttribute('aria-expanded', 'true');
        sizeBig(); cur = homeView(); want = null; drawBig(); focusPlace(null);
        pinEls.forEach(function (el) { if (el.classList.contains('is-here')) el.classList.add('on'); });
        if (!RM() && panel.animate) {
          var a = orb.getBoundingClientRect(), b = map.getBoundingClientRect(), s = (a.width * .82) / (b.width * .8);
          var dx = (a.left + a.width / 2) - (b.left + b.width / 2), dy = (a.top + a.height / 2) - (b.top + b.height / 2);
          inner.style.overflow = 'visible';
          map.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', background: 'transparent', boxShadow: 'none' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.32,.72,0,1)' })
            .onfinish = function () { inner.style.overflow = ''; flying = false; };
          flying = true;
          $('.paper').animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)' });
          // the map turns from the driver's view to north-up while it grows, then the car hops once
          var from = miniB; cur = from; want = homeView(); drawBig(); last = performance.now(); if (!raf) raf = requestAnimationFrame(tick);
          panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in');
        }
        $('.home').focus({ preventScroll: true });
      }
      function close(refocus) {
        if (!isOpen()) return;
        orb.setAttribute('aria-expanded', 'false');
        var done = function () { panel.hidden = true; panel.classList.remove('in'); inner.style.overflow = ''; };
        if (!RM() && panel.animate) {
          var a = orb.getBoundingClientRect(), b = map.getBoundingClientRect(), s = (a.width * .82) / (b.width * .8);
          var dx = (a.left + a.width / 2) - (b.left + b.width / 2), dy = (a.top + a.height / 2) - (b.top + b.height / 2);
          inner.style.overflow = 'visible';
          var an = map.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', background: 'transparent', boxShadow: 'none', offset: .999 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', opacity: 0 }], { duration: 240, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
          $('.paper').animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.96)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
          $$('li,.home').forEach(function (el) { el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, fill: 'forwards' }); });
          turnTo(miniB);
          an.onfinish = function () { done(); map.getAnimations().forEach(function (x) { x.cancel(); }); $('.paper').getAnimations().forEach(function (x) { x.cancel(); }); $$('li,.home').forEach(function (el) { el.getAnimations().forEach(function (x) { x.cancel(); }); }); };
        } else done();
        if (refocus) orb.focus({ preventScroll: true });
      }
      orb.addEventListener('click', function (e) { e.stopPropagation(); if (isOpen()) close(false); else open(); });
      document.addEventListener('pointerdown', function (e) { if (isOpen() && e.composedPath().indexOf(self) < 0) close(false); }, true);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) { close(true); } });
      root.addEventListener('keydown', function (e) {
        if (!isOpen()) return;
        var list = [$('.home')].concat($$('a.row'), $$('a.plain')), i = list.indexOf(root.activeElement);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); var n = i < 0 ? 0 : (i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length; list[n].focus(); }
        else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); list[e.key === 'Home' ? 0 : list.length - 1].focus(); }
      });
      // tabbing out of the map closes it
      root.addEventListener('focusout', function (e) { var t = e.relatedTarget; if (isOpen() && t && t !== self && !root.contains(t)) close(false); });

      // ---------------------------------------------------------- the station camera: point at a place and the planet turns to show it
      $$('a.row').forEach(function (a) {
        var id = a.getAttribute('data-id');
        a.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !flying) focusPlace(id); });
        a.addEventListener('focus', function () { focusPlace(id); });
      });
      pinEls.forEach(function (a) {
        var id = a.getAttribute('data-id');
        a.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'mouse' || flying) return; pinEls.forEach(function (el) { el.classList.toggle('on', el === a); }); $$('a.row').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-id') === id); }); });
      });
      map.addEventListener('pointerleave', function () { if (active) focusPlace(active); });
      // drag the planet round (the hub's map lets you do the same)
      var drag = null;
      map.addEventListener('pointerdown', function (e) {
        if (e.target.closest && e.target.closest('.pin')) return;
        drag = { x: e.clientX, y: e.clientY, moved: 0 }; map.setPointerCapture(e.pointerId); map.classList.add('drag');
      });
      map.addEventListener('pointermove', function (e) {
        if (!drag || !cur) return;
        var rad = bigSize * .4, dx = (e.clientX - drag.x) / rad, dy = (e.clientY - drag.y) / rad; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
        var f = rot(rot(cur.f, cur.u, -dx), cur.r, dy), u = rot(rot(cur.u, cur.u, -dx), cur.r, dy);
        cur = want = basis(f, u); drawBig();
      });
      function endDrag() { drag = null; map.classList.remove('drag'); }
      map.addEventListener('pointerup', endDrag); map.addEventListener('pointercancel', endDrag);

      // ---------------------------------------------------------- the trigger's one trick: the car hops when you point at it (H on the hub)
      var hopT = 0;
      function doHop() {
        if (RM() || hopT) return;
        var t0 = performance.now();
        (function step(now) {
          var t = (now - t0) / 420; hop = t < 1 ? Math.sin(t * Math.PI) * (1 - t * .3) : 0; drawMini();
          hopT = t < 1 ? requestAnimationFrame(step) : 0;
        })(t0);
      }
      orb.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { doHop(); loadFonts(); } });
      orb.addEventListener('focus', loadFonts);

      // ---------------------------------------------------------- going: the mask opens from where you pointed
      function go(href, id, from, e) {
        if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0)) return;
        if (RM()) return;
        e.preventDefault();
        var r = from.getBoundingClientRect(), c = WIPE[id] || ['#6dbcd6', INK];
        wipe.style.setProperty('--wx', (r.left + r.width / 2) + 'px'); wipe.style.setProperty('--wy', (r.top + r.height / 2) + 'px');
        wipe.style.background = id ? c[0] : 'radial-gradient(120% 90% at 50% 38%,#b4e6f0 0%,#6dbcd6 78%)';
        wipe.style.setProperty('--ink', c[1]);
        wipe.querySelector('b').textContent = id ? DISTRICTS.filter(function (d) { return d[0] === id; })[0][1] : '';
        wipe.classList.add('go');
        setTimeout(function () { location.href = href; }, 560);
      }
      $$('a.row').forEach(function (a) { a.addEventListener('click', function (e) { go(a.getAttribute('href'), a.getAttribute('data-id'), a.querySelector('.dia'), e); }); });
      pinEls.forEach(function (a) { a.addEventListener('click', function (e) { if (drag && drag.moved > .05) { e.preventDefault(); return; } go(a.getAttribute('href'), a.getAttribute('data-id'), a.querySelector('i'), e); }); });
      $('.home').addEventListener('click', function (e) { go(this.getAttribute('href'), null, orb, e); });

      addEventListener('resize', function () { if (isOpen()) { sizeBig(); drawBig(); } });
      // back/forward cache: come back to a clean corner
      addEventListener('pageshow', function () { wipe.classList.remove('go'); if (isOpen()) { panel.hidden = true; orb.setAttribute('aria-expanded', 'false'); } });
    }
  }
  customElements.define('husam-world-nav', WorldNav);
})();
