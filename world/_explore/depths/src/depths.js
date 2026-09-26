(function () {
  'use strict';
  var D = document, H = D.documentElement, W = window;
  var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hash = location.hash || '';
  var fromReturn = hash.indexOf('#from-') === 0;
  var NMAX = 1627.906977;
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  function $(id) { return D.getElementById(id); }
  var scale = $('scale'), depthLine = $('depthLine'), depthText = $('depthText');
  var floorSec = $('bottom'), surfaceSec = $('surface'), live = $('live');

  /* ------------------------------------------------ stable viewport height */
  var vhW = -1, vhH = -1;
  function setVH(force) {
    var w = W.innerWidth, h = W.innerHeight;
    if (force || w !== vhW || Math.abs(h - vhH) > 140) {
      vhW = w; vhH = h;
      H.style.setProperty('--vh', (h / 100) + 'px');
      return true;
    }
    return false;
  }
  setVH(true);
  function surfacePageY() { return vhH * 0.778; }

  /* ------------------------------------------------ layout: depth = odds, linear */
  var K = 60, LANES = 4, scaleTop = 0;
  function lanePlan(w) { return w >= 1080 ? [4, 60] : w >= 660 ? [3, 68] : [2, 96]; }
  function nToY(n) { return scaleTop + (n - 1) * K; }

  /* Placement. Every item has an exact depth y = (n-1)*K. Zone titles and the floor are pinned
     there. Specimens hang above their "1 in N" tag and take the lane that moves them least (up or
     down, tags kept in depth order); any that must move get a tether back to their true depth.
     Blurbs are commentary and fill the nearest free gap. */
  function layout() {
    var cs = getComputedStyle(scale), pad = parseFloat(cs.paddingLeft) || 0;
    var inner = scale.clientWidth - pad * 2;
    var p = lanePlan(inner); LANES = p[0]; K = p[1];
    var laneW = inner / LANES, GAP = LANES === 2 ? 26 : 34;
    scale.style.height = ((NMAX - 1) * K) + 'px';
    var occ = [], i;
    for (i = 0; i < LANES; i++) occ.push([]);
    function hits(s, span, top, h) {
      var lo = null, hi = null;
      for (var q = s; q < s + span; q++) {
        var L = occ[q];
        for (var k = 0; k < L.length; k++) {
          var iv = L[k];
          if (iv[0] < top + h + GAP && iv[1] + GAP > top) {
            if (lo === null || iv[0] < lo) lo = iv[0];
            if (hi === null || iv[1] > hi) hi = iv[1];
          }
        }
      }
      return lo === null ? null : [lo, hi];
    }
    function nearest(s, span, want, h, allowUp, minTop) {
      var down = want, g = 0, c;
      while (g++ < 400 && (c = hits(s, span, down, h))) down = c[1] + GAP;
      var up = null;
      if (allowUp) {
        up = want; g = 0;
        while (g++ < 400 && (c = hits(s, span, up, h))) { up = c[0] - GAP - h; }
        if (up < minTop || g >= 400) up = null;
      }
      if (!allowUp) return down;
      return up === null ? down : up;
    }
    function put(el, s, span, top, h) {
      el.style.left = (pad + s * laneW) + 'px';
      el.style.top = top + 'px';
      for (var q = s; q < s + span; q++) occ[q].push([top, top + h]);
    }
    var all = [].slice.call(scale.querySelectorAll('[data-n]'));
    var zones = [], specs = [], blurbs = [];
    all.forEach(function (el) {
      var kind = el.getAttribute('data-kind') || 'spec';
      el.classList.remove('shifted');
      (kind === 'zone' || kind === 'floor' || kind === 'head' || kind === 'pool') ? zones.push(el) : kind === 'spec' ? specs.push(el) : blurbs.push(el);
    });
    // 1. pinned: zone titles (centre lanes on wide screens), the header above 1 in 1, the floor
    var headH = 0;
    zones.forEach(function (el) {
      var kind = el.getAttribute('data-kind'), n = parseFloat(el.getAttribute('data-n'));
      var span = kind === 'zone' ? 2 : LANES;
      if (kind === 'pool') {
        var side = Math.min(LANES * laneW, 640, W.innerHeight * 0.72);
        var cvs = el.querySelector('canvas');
        cvs.style.width = side + 'px'; cvs.style.height = side + 'px';
      }
      var s = Math.floor((LANES - span) / 2);
      el.style.width = (span * laneW) + 'px';
      var h = el.offsetHeight, y = (n - 1) * K, top;
      if (kind === 'head') { top = -h - 28; headH = h + 28; }
      else if (kind === 'floor') top = y - h;
      else if (kind === 'pool') top = y - el.querySelector('canvas').offsetHeight / 2;
      else top = Math.max(0, y - h / 2);
      put(el, s, span, top, h);
    });
    scale.style.marginTop = headH + 'px';
    // 2. specimens, zone by zone. A tag must stay between its own zone line and the next one.
    var zl = zones.filter(function (el) { return el.getAttribute('data-kind') === 'zone'; })
      .map(function (el) { return { n: parseFloat(el.getAttribute('data-n')), line: (parseFloat(el.getAttribute('data-n')) - 1) * K }; });
    var bands = {};
    specs.forEach(function (el) {
      var n = parseFloat(el.getAttribute('data-n'));
      el.style.width = laneW + 'px';
      var h = el.offsetHeight, o = el.querySelector('.spec-odds'), a = o.offsetTop + o.offsetHeight / 2;
      var zi = -1; for (var z = 0; z < zl.length; z++) if (zl[z].n <= n) zi = z;
      var it = { el: el, h: h, a: a, want: (n - 1) * K - a,
        pref: Math.round(parseFloat(el.getAttribute('data-lane') || '0') * (LANES - 1)),
        tagMin: zi >= 0 ? zl[zi].line + 4 : 0, tagMax: zl[zi + 1] ? zl[zi + 1].line - 4 : 1e12 };
      (bands[zi] = bands[zi] || []).push(it);
    });
    var TOL = 0.4 * K;
    function packBand(list, reverse, prefs) {
      var res = [], viol = 0, last = reverse ? 1e12 : -1e12;
      var idx = list.map(function (_, i) { return i; });
      if (reverse) idx.reverse();
      idx.forEach(function (i) {
        var it = list[i], pref = prefs[i], best = null, bestCost = 1e18;
        for (var s = 0; s < LANES; s++) {
          var cands = [nearest(s, 1, it.want, it.h, false, 0), nearest(s, 1, it.want, it.h, true, 0)];
          for (var c = 0; c < 2; c++) {
            var top = cands[c], shift = top - it.want, tag = top + it.a;
            var cost = Math.abs(shift) * ((reverse ? shift > 0 : shift < 0) ? 1.1 : 1) + Math.abs(s - pref) * 6;
            var v = (tag > it.tagMax || tag < it.tagMin) ? 1 : 0;
            if (reverse ? tag > last + TOL : tag < last - TOL) cost += 1e6;
            cost += v * 1e8;
            if (cost < bestCost) { bestCost = cost; best = [s, top, shift, v]; }
          }
        }
        occ[best[0]].push([best[1], best[1] + it.h]);
        res[i] = [it, best]; viol += best[3]; last = best[1] + it.a;
      });
      return { res: res, viol: viol };
    }
    function snap() { return occ.map(function (L) { return L.slice(); }); }
    function repair(r) {
      r.res.forEach(function (pr) {
        var it = pr[0], b = pr[1];
        if (!b[3]) return;
        var L = occ[b[0]];
        for (var k = 0; k < L.length; k++) if (L[k][0] === b[1] && L[k][1] === b[1] + it.h) { L.splice(k, 1); break; }
        var best = null, bestCost = 1e18;
        for (var s = 0; s < LANES; s++) {
          [nearest(s, 1, it.want, it.h, false, 0), nearest(s, 1, it.want, it.h, true, 0)].forEach(function (top) {
            var tag = top + it.a, v = (tag > it.tagMax || tag < it.tagMin) ? 1 : 0;
            var cost = Math.abs(top - it.want) + v * 1e8;
            if (cost < bestCost) { bestCost = cost; best = [s, top, top - it.want, v]; }
          });
        }
        occ[best[0]].push([best[1], best[1] + it.h]);
        r.viol += best[3] - 1; pr[1] = best;
      });
      return r;
    }
    function score(r) {
      var shift = 0, inv = 0, last = -1e12;
      r.res.forEach(function (pr) {
        shift += Math.abs(pr[1][2]);
        var tag = pr[1][1] + pr[0].a;
        if (tag < last - TOL) inv++;
        last = Math.max(last, tag);
      });
      return r.viol * 1e9 + inv * 1e6 + shift;
    }
    // deterministic search over lane preferences (seeded), so the layout is stable between visits
    var seed = 20260926;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    Object.keys(bands).sort(function (x, y) { return x - y; }).forEach(function (k) {
      var list = bands[k], base = snap(), best = null;
      var tries = list.length > 2 ? 60 : 4;
      for (var t = 0; t < tries; t++) {
        occ = base.map(function (L) { return L.slice(); });
        var prefs = list.map(function (it) { return t === 0 ? it.pref : Math.floor(rnd() * LANES); });
        var rr = packBand(list, t % 6 === 5, prefs);
        if (rr.viol) rr = repair(rr);
        var sc = score(rr);
        if (!best || sc < best.sc) best = { sc: sc, r: rr, occ: occ };
      }
      occ = best.occ;
      var r = best.r;
      r.res.forEach(function (pr) {
        var it = pr[0], b = pr[1], el = it.el;
        el.style.left = (pad + b[0] * laneW) + 'px';
        el.style.top = b[1] + 'px';
        el.classList.toggle('up', b[2] < 0);
        if (Math.abs(b[2]) > 14) { el.classList.add('shifted'); el.style.setProperty('--shift', Math.abs(b[2]).toFixed(1) + 'px'); }
      });
    });
    // 3. blurbs fill the gaps near where they belong
    blurbs.forEach(function (el) {
      var n = parseFloat(el.getAttribute('data-n'));
      var span = LANES === 2 ? 2 : Math.min(LANES, parseInt(el.getAttribute('data-span') || '2', 10));
      el.style.width = (span * laneW) + 'px';
      var h = el.offsetHeight, want = Math.max(0, (n - 1) * K - h / 2);
      var pref = Math.round(parseFloat(el.getAttribute('data-lane') || '.5') * (LANES - span));
      var best = null, bestCost = 1e12;
      for (var s = 0; s <= LANES - span; s++) {
        var top = nearest(s, span, want, h, true, 0);
        var cost = Math.abs(top - want) + Math.abs(s - pref) * 30;
        if (cost < bestCost) { bestCost = cost; best = [s, top]; }
      }
      put(el, best[0], span, best[1], h);
    });
    var d = $('descender');
    if (d) { d.style.top = ((1000 - 1) * K) + 'px'; d.style.height = ((NMAX - 1000) * K) + 'px'; d.style.left = '0'; d.style.width = '100%'; }
    measure();
    var sc = scale.querySelector('[data-screens]');
    if (sc) {
      var host = sc.closest('[data-n]');
      var n2 = Math.round((scaleTop + parseFloat(host.style.top)) / (W.innerHeight || 800));
      sc.textContent = n2.toLocaleString('en-US');
    }
  }
  function measure() { scaleTop = scale.getBoundingClientRect().top + W.scrollY; }

  /* ------------------------------------------------ the scene: pier, raft, diver */
  var sceneSvg = $('scene'), gPier = $('pier'), gRaft = $('raft'), gDiver = $('diver'), gBoard = $('board');
  var gSplash = $('splash'), gUnder = $('under'), aboveRect = $('above-rect');
  var S = 1, WL = 240, tipX = 446, tipY = 136;
  function placeScene() {
    if (!sceneSvg) return;
    var w = Math.max(320, W.innerWidth);
    S = Math.max(0.42, Math.min(1, w / 1400));
    sceneSvg.setAttribute('viewBox', '0 0 ' + w + ' 340');
    gPier.setAttribute('transform', 'translate(0,' + WL + ') scale(' + S + ')');
    tipX = 440 * S; tipY = WL - 104 * S;
    var entryX = tipX + 170 * S;
    var raftX = Math.max(w * 0.72, entryX + 160 * S);
    if (raftX + 112 * S > w - 8) raftX = w - 8 - 112 * S;
    gRaft.setAttribute('transform', 'translate(' + raftX.toFixed(1) + ',' + WL + ') scale(' + S + ')');
    aboveRect.setAttribute('width', w);
    if (!introRunning) setDiver(tipX, tipY, 0);
  }
  function setDiver(x, y, rot) {
    gDiver.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + S + ') rotate(' + rot.toFixed(1) + ' 0 -33)');
  }
  function setBoard(angle) { gBoard.setAttribute('transform', 'rotate(' + angle.toFixed(2) + ' 296 -100)'); }

  var introRunning = false, introStart = 0, introLast = 0, splashed = false, parts = [], introRaf = 0;
  function ns(tag, attrs, parent) {
    var e = D.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e); return e;
  }
  function splash(x) {
    var i;
    for (i = 0; i < 14; i++) {
      var c = ns('circle', { r: (1.6 + Math.random() * 2.4) * Math.max(S, .6), fill: '#effcff' }, gSplash);
      parts.push({ el: c, kind: 'drop', x: x + (Math.random() - .5) * 10 * S, y: WL - 2, vx: (Math.random() - .5) * 150 * S, vy: -(120 + Math.random() * 150) * Math.max(S, .7), t: 0 });
    }
    for (i = 0; i < 3; i++) {
      var r = ns('ellipse', { cx: x, cy: WL + 2, rx: 1, ry: 1, fill: 'none', stroke: '#ffffff', 'stroke-width': 2 }, gSplash);
      parts.push({ el: r, kind: 'ring', x: x, delay: i * .22, t: 0 });
    }
    for (i = 0; i < 10; i++) {
      var b = ns('circle', { r: (2 + Math.random() * 3.5) * Math.max(S, .6), fill: 'none', stroke: '#e6fbff', 'stroke-width': 1.3 }, gUnder);
      parts.push({ el: b, kind: 'bub', x: x + (Math.random() - .5) * 26 * S, y: WL + (30 + Math.random() * 50) * S, v: 34 + Math.random() * 40, delay: Math.random() * .5, t: 0 });
    }
  }
  function stepParts(dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.t += dt;
      if (p.kind === 'drop') {
        p.vy += 520 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        p.el.setAttribute('cx', p.x.toFixed(1)); p.el.setAttribute('cy', p.y.toFixed(1));
        if (p.y > WL + 2 && p.vy > 0) { p.el.remove(); parts.splice(i, 1); }
      } else if (p.kind === 'ring') {
        var u = (p.t - p.delay) / 1.1;
        if (u < 0) { p.el.setAttribute('opacity', 0); continue; }
        if (u >= 1) { p.el.remove(); parts.splice(i, 1); continue; }
        var rx = (8 + 70 * u) * S;
        p.el.setAttribute('rx', rx.toFixed(1)); p.el.setAttribute('ry', (rx * .16).toFixed(1));
        p.el.setAttribute('opacity', (0.8 * (1 - u)).toFixed(2));
      } else {
        var t = p.t - p.delay;
        if (t < 0) { p.el.setAttribute('opacity', 0); continue; }
        var yy = p.y - p.v * t;
        p.el.setAttribute('cx', (p.x + Math.sin(t * 7 + p.v) * 2.5).toFixed(1));
        p.el.setAttribute('cy', yy.toFixed(1));
        p.el.setAttribute('opacity', Math.max(0, Math.min(1, (yy - WL) / 20)).toFixed(2));
        if (yy < WL + 1) { p.el.remove(); parts.splice(i, 1); }
      }
    }
  }
  function introFrame(now) {
    var t = now - introStart, dt = Math.min(.05, Math.max(0, (now - (introLast || now)) / 1000)); introLast = now;
    var x = tipX, y = tipY, rot = 0, board = 0;
    if (t < 450) {
      rot = Math.sin(t / 140) * 1.5;
    } else if (t < 1550) {
      var ph = ((t - 450) % 550) / 550;
      var lift = Math.sin(Math.PI * ph);
      board = (1 - lift) * 4.2;
      y = tipY + Math.sin(board * Math.PI / 180) * 150 * S - lift * 22 * S;
    } else if (t < 2500) {
      var u = (t - 1550) / 950;
      var X = 185 * u;
      var a = 0.0142, c0 = a * 3600 - 55;
      var Y = a * (X - 60) * (X - 60) - 55 - c0 * (1 - u);
      x = tipX + X * S; y = tipY + Y * S;
      rot = 18 * u + 190 * u * u;
      board = Math.sin(u * 22) * 3.5 * (1 - u);
      if (!splashed && y - 30 * S > WL) { splashed = true; splash(x); }
    } else {
      x = tipX + 185 * S; y = tipY + 300 * S; rot = 208;
    }
    setDiver(x, y, rot); setBoard(board);
    stepParts(dt);
    if (t < 4200 || parts.length) introRaf = requestAnimationFrame(introFrame);
    else endIntro(true);
  }
  function startIntro() {
    introRunning = true; splashed = false;
    H.classList.add('intro-on');
    introStart = performance.now();
    introRaf = requestAnimationFrame(introFrame);
  }
  function endIntro(played) {
    cancelAnimationFrame(introRaf);
    introRunning = false;
    H.classList.remove('intro-on');
    parts.forEach(function (p) { p.el.remove(); }); parts = [];
    setBoard(0);
    if (played) gDiver.setAttribute('opacity', 0);
    else setDiver(tipX, tipY, 0);
  }
  function skipIntro() { if (introRunning) endIntro(true); }

  /* ------------------------------------------------ smooth jumps */
  var jumpRaf = 0;
  function cancelJump() { if (jumpRaf) { cancelAnimationFrame(jumpRaf); jumpRaf = 0; } }
  function maxScroll() { return Math.max(0, H.scrollHeight - W.innerHeight); }
  function jumpTo(y) {
    y = Math.max(0, Math.min(Math.round(y), maxScroll()));
    cancelJump();
    var start = W.scrollY, dist = y - start;
    if (reduce || Math.abs(dist) < 2) { W.scrollTo(0, y); return; }
    var dur = Math.min(2600, 480 + Math.sqrt(Math.abs(dist)) * 6.5), t0 = performance.now();
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      W.scrollTo(0, start + dist * e);
      jumpRaf = p < 1 ? requestAnimationFrame(step) : 0;
    }
    jumpRaf = requestAnimationFrame(step);
  }
  ['wheel', 'touchstart'].forEach(function (ev) { W.addEventListener(ev, cancelJump, { passive: true }); });
  W.addEventListener('keydown', function (e) {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].indexOf(e.key) > -1) cancelJump();
    if (introRunning) skipIntro();
  });
  function floorY() { return floorSec.getBoundingClientRect().top + W.scrollY; }
  function targetY(key) {
    var vh = W.innerHeight;
    if (key === 'top') return 0;
    if (key === 'surface') return surfaceSec.getBoundingClientRect().top + W.scrollY - 10;
    if (key === 'bottom') return floorY() - vh * 0.74;
    if (key === 'end') return floorY();
    if (key === 'collection') return $('collection').getBoundingClientRect().top + W.scrollY - 70;
    var el = $(key);
    if (!el) return null;
    if (el.hasAttribute('data-n')) return scaleTop + parseFloat(el.style.top || 0) - vh * 0.28;
    var h = el.querySelector('[data-n]');
    if (h) return scaleTop + parseFloat(h.style.top || 0) - vh * 0.28;
    return el.getBoundingClientRect().top + W.scrollY - vh * 0.2;
  }
  function go(key) { var y = targetY(key); if (y != null) jumpTo(y); }

  /* ------------------------------------------------ counter + page state */
  var lastTxt = '', gaugePip = $('gaugePip'), gauge = $('gauge'), gaugeOn = false;
  function checkGauge() { gaugeOn = !!gauge && getComputedStyle(gauge).display !== 'none'; }
  function fmtN(n) {
    if (n < 1.05) return '1';
    if (n < 9.95) return n.toFixed(1);
    return Math.round(n).toLocaleString('en-US');
  }
  var state = { sy: 0, vh: 800, nTop: 0, dark: 0, surf: .222, depth: 0, frac: 0 };
  function update() {
    var sy = W.scrollY, vh = W.innerHeight;
    state.sy = sy; state.vh = vh;
    var r = depthLine.getBoundingClientRect();
    var lineY = r.bottom + sy;
    var n = 1 + (lineY - scaleTop) / K;
    var on = n >= 1;
    if (introRunning && sy > vhH * 0.6) endIntro(true);
    var nc = Math.min(NMAX, Math.max(1, n));
    var txt = '1 IN ' + fmtN(nc);
    if (txt !== lastTxt) { depthText.textContent = txt; lastTxt = txt; }
    depthLine.classList.toggle('on', on);
    H.classList.toggle('under', sy > vhH * 0.62);
    H.classList.toggle('sand', floorSec.getBoundingClientRect().top < 70);
    var nTop = 1 + (sy - scaleTop) / K;
    state.nTop = nTop;
    state.dark = nTop <= 1 ? 0 : (nTop - 1) / 11;
    state.surf = 1 - (surfacePageY() - sy) / vh;
    state.depth = sy / vh;
    state.frac = n < 1 ? 0 : Math.min(1, Math.log(nc) / Math.log(NMAX));
    if (gauge && gaugePip && gaugeOn) {
      var mid = sy + vh * 0.5, fy = floorY();
      var bps = [0, surfaceSec.getBoundingClientRect().top + sy, nToY(1), nToY(10), nToY(100), nToY(1000), fy, H.scrollHeight];
      var seg = 0;
      for (var i = 0; i < bps.length - 1; i++) if (mid >= bps[i]) seg = i;
      seg = Math.min(seg, 6);
      var f = Math.max(0, Math.min(1, (mid - bps[seg]) / Math.max(1, bps[seg + 1] - bps[seg])));
      gaugePip.style.top = (((seg + f) / 7) * 100).toFixed(2) + '%';
    }
  }

  /* ------------------------------------------------ the water (WebGL port of Neal's shader) */
  var canvas = $('water-canvas'), gl = null, progW, progP, bufQ, bufP, uW = {}, uP = {}, glOK = false;
  var VS_W = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var NOISE = [
    'float random(in vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}',
    'float noise(in vec2 st){vec2 i=floor(st);vec2 f=fract(st);float a=random(i);float b=random(i+vec2(1.,0.));float c=random(i+vec2(0.,1.));float d=random(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}',
    'float fbm(in vec2 st){float v=0.;float a=.5;for(int i=0;i<OCT;i++){v+=a*noise(st);st*=2.;a*=.7;}return v;}'
  ].join('\n');
  var FS_W = [
    'precision highp float;',
    'uniform vec2 resolution;uniform float time;uniform float depth;uniform float dark;uniform float surf;',
    'vec3 hsb2rgb(in vec3 c){vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);rgb=rgb*rgb*(3.-2.*rgb);return c.z*mix(vec3(1.),rgb,c.y);}',
    '#define OCT 7', NOISE,
    'void main(){',
    ' vec2 st=gl_FragCoord.xy/resolution.xy;',
    ' if(dark>12.){gl_FragColor=vec4(0.,0.,0.,1.);return;}',
    ' float diff=st.y-.025*fbm(st+time*.0005)-.016*sin(st.y+16.*st.x+time*.006);',
    ' if(diff>surf){gl_FragColor=mix(vec4(1.,.929,.678,1.),vec4(.612,.878,1.,1.),st.y);return;}',
    ' float foam=step(surf-.006,diff);',
    ' float edgeShade=-.3*(smoothstep(0.,.5,st.x-.8)+smoothstep(0.,.5,.2-st.x));',
    ' float lightBeams=.04*sin(time*.01+st.x*15.)+(.5*(st.y-.99));',
    ' float waterEffect=.008*(fbm(vec2(st.x,st.y-.6*depth)+time*.0003)*2.-1.);',
    ' float topWaterEffect=-.03*smoothstep(-.1,.25,st.y-depth);',
    ' vec3 col=hsb2rgb(vec3(.55+waterEffect+topWaterEffect,1.,1.-dark*.1+edgeShade+lightBeams));',
    ' float below=surf-st.y;',
    ' float sh=.5+.5*sin((st.x*1.25+st.y*.52)*12.+sin(time*.0032+st.x*2.3)*1.4);',
    ' sh=pow(sh,9.)*.17*exp(-below*1.5)*(1.-smoothstep(0.,2.4,dark));',
    ' col+=vec3(.72,.95,1.)*sh;',
    ' gl_FragColor=vec4(max(col,0.)+vec3(foam),1.);',
    '}'
  ].join('\n');
  var VS_P = [
    'attribute vec2 pos;attribute float size;attribute float alpha;attribute float kind;',
    'uniform float pr;varying float va;varying float vk;',
    'void main(){va=alpha;vk=kind;gl_PointSize=size*pr;gl_Position=vec4(pos,0.,1.);}'
  ].join('\n');
  var FS_P = [
    'precision mediump float;',
    'uniform vec2 resolution;uniform float time;uniform float surf;varying float va;varying float vk;',
    '#define OCT 4', NOISE,
    'void main(){',
    ' vec2 st=gl_FragCoord.xy/resolution.xy;',
    ' float diff=st.y-.025*fbm(st+time*.0005)-.016*sin(st.y+16.*st.x+time*.006);',
    ' if(diff>surf-.004)discard;',
    ' vec2 pc=gl_PointCoord-.5;float r=length(pc);',
    ' if(vk<.5){float a=max(0.,.5-r)*va;gl_FragColor=vec4(vec3(.8)*a,a);}',
    ' else if(vk<1.5){float ring=smoothstep(.5,.43,r)-smoothstep(.37,.3,r);float hi=smoothstep(.14,0.,length(pc-vec2(-.15,-.17)));float a=clamp(ring*.62+hi*.6,0.,1.)*va;gl_FragColor=vec4(vec3(.92,.98,1.)*a,a);}',
    ' else{float a=pow(max(0.,1.-r*2.),2.)*va;gl_FragColor=vec4(vec3(.55,1.,.86)*a,a);}',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  function initGL() {
    if (!canvas) return false;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: true, preserveDrawingBuffer: false }) ||
           canvas.getContext('experimental-webgl');
      if (!gl) return false;
      progW = program(VS_W, FS_W); progP = program(VS_P, FS_P);
      bufQ = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufQ);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      bufP = gl.createBuffer();
      ['resolution', 'time', 'depth', 'dark', 'surf'].forEach(function (k) { uW[k] = gl.getUniformLocation(progW, k); });
      ['resolution', 'time', 'surf', 'pr'].forEach(function (k) { uP[k] = gl.getUniformLocation(progP, k); });
      uW.p = gl.getAttribLocation(progW, 'p');
      ['pos', 'size', 'alpha', 'kind'].forEach(function (k) { uP['a_' + k] = gl.getAttribLocation(progP, k); });
      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); glOK = false; paintFallback(); });
      return true;
    } catch (err) { gl = null; return false; }
  }
  var PR = 1;
  function sizeCanvas() {
    if (!canvas) return;
    PR = Math.min(W.devicePixelRatio || 1, 1.5);
    var w = Math.round(W.innerWidth * PR), h = Math.round(W.innerHeight * PR);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  // marine snow (as Neal's: 250 points, re-seeded 10 at a time), rising bubbles, deep sparks
  var snow = { x: [], y: [], size: [], phase: [], scroll: [], par: [], t: [] };
  var tick = 0, lastSeed = -1;
  function reseed() {
    var k;
    while (snow.x.length > 240) for (k in snow) snow[k].shift();
    while (snow.x.length < 250) {
      snow.x.push(Math.random() * 2 - 1); snow.y.push(Math.random() * 2 - 1);
      snow.size.push(Math.random() * 10); snow.phase.push(Math.random() * 100);
      snow.scroll.push(W.scrollY); snow.par.push(Math.random() + .2); snow.t.push(tick);
    }
  }
  var bubbles = [], spawnAcc = 0;
  function stepBubbles(dt) {
    var sy = state.sy, vh = state.vh, rate = state.dark < 1.5 ? 2.6 : state.dark < 6 ? 1.1 : 0.3;
    spawnAcc += dt * rate;
    while (spawnAcc >= 1 && bubbles.length < 60) {
      spawnAcc -= 1;
      bubbles.push({ x: Math.random(), y: sy + vh + 10 + Math.random() * 60, r: 2 + Math.random() * 5.5, v: 38 + Math.random() * 64, w: Math.random() * 6.28 });
    }
    if (spawnAcc > 1) spawnAcc = 0;
    var sp = surfacePageY();
    for (var i = bubbles.length - 1; i >= 0; i--) {
      var b = bubbles[i];
      b.y -= b.v * dt; b.w += dt * 2.2;
      if (b.y < sp + 4 || b.y < sy - 80 || b.y > sy + vh + 260) bubbles.splice(i, 1);
    }
  }
  function hash1(n) { var s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }
  var pData = new Float32Array((250 + 60 + 40) * 5);
  function drawGL() {
    if (!glOK) return;
    var w = canvas.width, h = canvas.height, t = tick;
    gl.viewport(0, 0, w, h);
    gl.disable(gl.BLEND);
    gl.useProgram(progW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufQ);
    gl.enableVertexAttribArray(uW.p);
    gl.vertexAttribPointer(uW.p, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uW.resolution, w, h); gl.uniform1f(uW.time, t);
    gl.uniform1f(uW.depth, state.depth); gl.uniform1f(uW.dark, state.dark); gl.uniform1f(uW.surf, state.surf);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(uW.p);
    if (state.dark > 12.5 && state.nTop > NMAX + 40) return;
    // points
    var o = 0, i, vh = state.vh, sy = state.sy;
    for (i = 0; i < snow.x.length; i++) {
      var sz = Math.max(2, snow.size[i] * Math.sin((t - snow.t[i]) / 80));
      pData[o++] = snow.x[i] + .01 * Math.sin(snow.phase[i] + t * .01);
      pData[o++] = snow.y[i] + snow.par[i] * 2 * ((sy - snow.scroll[i]) / vh);
      pData[o++] = sz; pData[o++] = 1; pData[o++] = 0;
    }
    for (i = 0; i < bubbles.length; i++) {
      var b = bubbles[i];
      pData[o++] = (b.x + .004 * Math.sin(b.w)) * 2 - 1;
      pData[o++] = 1 - 2 * (b.y - sy) / vh;
      pData[o++] = b.r * 2; pData[o++] = state.dark > 8 ? .45 : .8; pData[o++] = 1;
    }
    if (state.dark > 3) {
      var fade = Math.min(1, (state.dark - 3) / 4), cell = 460, c0 = Math.floor(sy / cell), c1 = Math.floor((sy + vh) / cell);
      for (var c = c0; c <= c1 && o < pData.length - 10; c++) {
        for (var j = 0; j < 2; j++) {
          var seed = c * 2 + j, py = c * cell + hash1(seed + .3) * cell;
          var fl = Math.pow(Math.max(0, Math.sin(t * .018 + hash1(seed + .7) * 40)), 3);
          pData[o++] = hash1(seed + .1) * 2 - 1;
          pData[o++] = 1 - 2 * (py - sy) / vh;
          pData[o++] = 5 + hash1(seed + .9) * 7; pData[o++] = fl * fade * .9; pData[o++] = 2;
        }
      }
    }
    var count = o / 5;
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(progP);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufP);
    gl.bufferData(gl.ARRAY_BUFFER, pData.subarray(0, o), gl.DYNAMIC_DRAW);
    var st = 20;
    gl.enableVertexAttribArray(uP.a_pos); gl.vertexAttribPointer(uP.a_pos, 2, gl.FLOAT, false, st, 0);
    gl.enableVertexAttribArray(uP.a_size); gl.vertexAttribPointer(uP.a_size, 1, gl.FLOAT, false, st, 8);
    gl.enableVertexAttribArray(uP.a_alpha); gl.vertexAttribPointer(uP.a_alpha, 1, gl.FLOAT, false, st, 12);
    gl.enableVertexAttribArray(uP.a_kind); gl.vertexAttribPointer(uP.a_kind, 1, gl.FLOAT, false, st, 16);
    gl.uniform2f(uP.resolution, w, h); gl.uniform1f(uP.time, t); gl.uniform1f(uP.surf, state.surf); gl.uniform1f(uP.pr, PR);
    gl.drawArrays(gl.POINTS, 0, count);
    gl.disableVertexAttribArray(uP.a_pos); gl.disableVertexAttribArray(uP.a_size);
    gl.disableVertexAttribArray(uP.a_alpha); gl.disableVertexAttribArray(uP.a_kind);
  }
  // CSS fallback when WebGL is missing: same colour maths, as a gradient
  function hsb(h, s, b) {
    var r = [0, 4, 2].map(function (o) {
      var x = Math.min(1, Math.max(0, Math.abs(((h * 6 + o) % 6) - 3) - 1));
      x = x * x * (3 - 2 * x);
      return Math.round(Math.max(0, b) * (1 + (x - 1) * s) * 255);
    });
    return 'rgb(' + r.join(',') + ')';
  }
  var waterEl = $('water');
  function paintFallback() {
    if (glOK) return;
    var bTop = 1 - state.dark * .1, sp = (1 - state.surf) * 100;
    if (state.dark > 12) { waterEl.style.background = '#000'; return; }
    var top = hsb(.55, 1, bTop), bot = hsb(.55, 1, bTop - .5);
    if (sp > 0) waterEl.style.background = 'linear-gradient(180deg,#9ee0fe 0%,#e2e9c5 ' + sp.toFixed(1) + '%,#fff ' + sp.toFixed(1) + '%,' + top + ' ' + (sp + .6).toFixed(1) + '%,' + bot + ' 100%)';
    else waterEl.style.background = 'linear-gradient(180deg,' + top + ',' + bot + ')';
  }

  /* ------------------------------------------------ loop */
  var running = false, lastNow = 0, rafId = 0;
  function frame(now) {
    rafId = requestAnimationFrame(frame);
    var dt = Math.min(.05, (now - (lastNow || now)) / 1000); lastNow = now;
    if (!reduce) tick += dt * 60;
    var seedStep = Math.floor(tick / 10);
    if (seedStep !== lastSeed) { lastSeed = seedStep; reseed(); }
    update();
    if (!reduce) stepBubbles(dt);
    if (glOK) drawGL(); else paintFallback();
    drawPool(now);
  }
  function start() { if (!running) { running = true; lastNow = 0; rafId = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(rafId); }
  var pending = false;
  function renderOnce() {
    if (pending) return; pending = true;
    requestAnimationFrame(function (now) { pending = false; update(); if (glOK) drawGL(); else paintFallback(); drawPool(now); });
  }

  /* ------------------------------------------------ jump menu, gauge, buttons */
  var jumpBtn = $('jumpBtn'), jumpMenu = $('jumpMenu');
  function closeMenu(focusBtn) { jumpMenu.hidden = true; jumpBtn.setAttribute('aria-expanded', 'false'); if (focusBtn) jumpBtn.focus(); }
  jumpBtn.addEventListener('click', function () {
    var open = jumpMenu.hidden;
    jumpMenu.hidden = !open; jumpBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var f = jumpMenu.querySelector('button'); if (f) f.focus(); }
  });
  jumpMenu.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]'); if (!b) return;
    closeMenu(false); skipIntro(); go(b.getAttribute('data-go'));
  });
  jumpMenu.addEventListener('keydown', function (e) {
    var items = [].slice.call(jumpMenu.querySelectorAll('button')), i = items.indexOf(D.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  });
  D.addEventListener('click', function (e) { if (!jumpMenu.hidden && !e.target.closest('.controls')) closeMenu(false); });
  if (gauge) gauge.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) { skipIntro(); go(b.getAttribute('data-go')); } });
  $('diveBtn').addEventListener('click', function () { skipIntro(); go('surface'); });
  $('skipBottom').addEventListener('click', function () { skipIntro(); go('bottom'); });
  $('backTop').addEventListener('click', function () { go('top'); });
  $('skipIntro').addEventListener('click', function () { skipIntro(); });

  /* ------------------------------------------------ the plate's legend swims you back */
  var plateSec = $('collection');
  plateSec.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]'); if (!b) return;
    stopSink(); go(b.getAttribute('data-go'));
  });

  /* ------------------------------------------------ let go: sink at a steady pace (after pixelspace's light-speed button) */
  var sinkBtn = $('sinkBtn'), sinking = false, sinkRaf = 0, sinkLast = 0, sinkAcc = 0;
  function sinkSpeed() { return Math.max(260, W.innerHeight * 0.55); }
  function sinkStep(now) {
    var dt = Math.min(.05, (now - (sinkLast || now)) / 1000); sinkLast = now;
    sinkAcc += sinkSpeed() * dt;
    var whole = Math.floor(sinkAcc); sinkAcc -= whole;
    var stopAt = floorY() - W.innerHeight * 0.74;
    if (W.scrollY + whole >= stopAt) { W.scrollTo(0, stopAt); stopSink(); return; }
    if (whole) W.scrollBy(0, whole);
    sinkRaf = requestAnimationFrame(sinkStep);
  }
  function startSink() {
    if (sinking) return;
    skipIntro(); cancelJump();
    if (W.scrollY < surfaceSec.getBoundingClientRect().top + W.scrollY - 40) W.scrollTo(0, surfaceSec.getBoundingClientRect().top + W.scrollY - 10);
    sinking = true; sinkLast = 0; sinkAcc = 0;
    sinkBtn.setAttribute('aria-pressed', 'true'); sinkBtn.textContent = 'Stop sinking';
    H.classList.add('sinking');
    sinkRaf = requestAnimationFrame(sinkStep);
  }
  function stopSink() {
    if (!sinking) return;
    sinking = false; cancelAnimationFrame(sinkRaf);
    sinkBtn.setAttribute('aria-pressed', 'false'); sinkBtn.textContent = 'Let go';
    H.classList.remove('sinking');
  }
  if (reduce) sinkBtn.hidden = true;
  sinkBtn.addEventListener('click', function () { sinking ? stopSink() : startSink(); });
  ['wheel', 'touchstart', 'mousedown'].forEach(function (ev) {
    W.addEventListener(ev, function (e) { if (sinking && !(e.target.closest && e.target.closest('#sinkBtn'))) stopSink(); }, { passive: true });
  });
  W.addEventListener('keydown', function (e) { if (sinking && e.key !== 'Tab' && e.key !== 'Enter' && e.key !== ' ') stopSink(); });

  /* ------------------------------------------------ the pool: 1,628 points, one lit (after neal.fun/size-of-space) */
  var poolFig = $('pool'), poolCv = $('poolCanvas'), pctx = poolCv ? poolCv.getContext('2d') : null, POOLN = 1628, poolLast = -1;
  var GA = Math.PI * (3 - Math.sqrt(5));
  function drawPool(t) {
    if (!pctx) return;
    var r = poolCv.getBoundingClientRect(), vh = W.innerHeight;
    if (r.bottom < -40 || r.top > vh + 40) { poolLast = -1; return; }
    var side = r.width, dpr = Math.min(2, W.devicePixelRatio || 1), px = Math.round(side * dpr);
    if (poolCv.width !== px) { poolCv.width = px; poolCv.height = px; }
    // zoom: close in on the lit point as it rises from the bottom, fully out by the time it's centred
    var c = r.top + side / 2, u = reduce ? 1 : Math.max(0, Math.min(1, (vh - c) / (vh * 0.5)));
    var e = u * u * (3 - 2 * u);
    var R = side * 0.46, zoom = Math.exp(Math.log(9) * (1 - e));
    var key = Math.round(e * 400) + ':' + Math.round(t / 90);
    if (key === poolLast) return; poolLast = key;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pctx.clearRect(0, 0, side, side);
    var cx = side / 2, cy = side / 2, step = R / Math.sqrt(POOLN), dot = Math.max(1.1, step * 0.34) * Math.min(3, zoom);
    for (var i = 1; i < POOLN; i++) {
      var rr = Math.sqrt(i) * step * zoom; if (rr > side * 0.75) break;
      var a = i * GA, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      if (x < -4 || y < -4 || x > side + 4 || y > side + 4) continue;
      var tw = reduce ? .5 : .42 + .18 * Math.sin(t * .0012 + i * 1.7);
      pctx.fillStyle = 'rgba(190,214,236,' + (tw * (rr > R * zoom * .98 ? .5 : 1)).toFixed(3) + ')';
      pctx.beginPath(); pctx.arc(x, y, dot, 0, 6.2832); pctx.fill();
    }
    var g = pctx.createRadialGradient(cx, cy, 0, cx, cy, dot * 9 + 8);
    g.addColorStop(0, 'rgba(255,243,176,.95)'); g.addColorStop(.3, 'rgba(255,227,107,.35)'); g.addColorStop(1, 'rgba(255,227,107,0)');
    pctx.fillStyle = g; pctx.beginPath(); pctx.arc(cx, cy, dot * 9 + 8, 0, 6.2832); pctx.fill();
    pctx.fillStyle = '#fff3a0'; pctx.beginPath(); pctx.arc(cx, cy, dot * 1.6 + 1, 0, 6.2832); pctx.fill();
  }

  /* ------------------------------------------------ boot */
  function relayout() { layout(); placeScene(); sizeCanvas(); checkGauge(); if (!running) renderOnce(); }
  layout();
  placeScene();
  checkGauge();
  glOK = initGL();
  if (!glOK && canvas) canvas.style.display = 'none';
  sizeCanvas();
  var target = null;
  if (hash.length > 1 && !fromReturn) {
    var key = hash.slice(1);
    if (key === 'bottom' || key === 'surface' || key === 'top' || $(key)) target = key;
  }
  var playIntro = !reduce && !fromReturn && !target;
  function snapToTarget() { var y = targetY(target === 'bottom' ? 'end' : target); if (y != null) W.scrollTo(0, Math.max(0, y)); }
  if (target) snapToTarget();
  else W.scrollTo(0, 0);
  if (playIntro) startIntro(); else setDiver(tipX, tipY, 0);
  if (reduce) { update(); if (glOK) drawGL(); else paintFallback(); W.addEventListener('scroll', renderOnce, { passive: true }); }
  else start();
  D.addEventListener('visibilitychange', function () { if (reduce) return; if (D.hidden) stop(); else start(); });
  var rT = 0;
  W.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () { var big = setVH(false); sizeCanvas(); if (big) { relayout(); } else if (!running) renderOnce(); }, 120);
  });
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { layout(); if (target && !jumpRaf) snapToTarget(); });
  W.addEventListener('load', function () { layout(); });
})();
