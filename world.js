/* world.js — builds the island from the <section data-building> elements.
   Nothing here is content: it reads the page and draws a place for each section. */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var HW = 32, HH = 16;          // half tile width / height (2:1 isometric)
  var N = 17, C = 8;              // grid size and centre
  var DEPTH = 14, STEP = 12;      // tile thickness, hill step
  var SKEW = 26.565;              // atan(0.5) — the angle of an iso face
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- small helpers ----------
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function pts(a) { return a.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function hashStr(s) {
    var h = 1779033703 ^ s.length;
    for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function iso(i, j) { return [(i - j) * HW, (i + j) * HH]; }
  function key(i, j) { return i + ',' + j; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hexToRgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, t) {
    var x = hexToRgb(a), y = hexToRgb(b);
    return 'rgb(' + Math.round(lerp(x[0], y[0], t)) + ',' + Math.round(lerp(x[1], y[1], t)) + ',' + Math.round(lerp(x[2], y[2], t)) + ')';
  }
  function anim(parent, attrs) { if (!reduce) el('animateTransform', Object.assign({ attributeName: 'transform', repeatCount: 'indefinite' }, attrs), parent); }

  // ---------- time of day ----------
  // Keyframes: hour -> sky top, sky bottom, shade (multiplied over the island), lights, stars, clouds
  var KEYS = [
    { h: 0,    top: '#0a0f24', bot: '#1d2552', shade: '#39427a', lights: 1,   stars: 1,   clouds: .12 },
    { h: 4.8,  top: '#121838', bot: '#343766', shade: '#454b84', lights: 1,   stars: .85, clouds: .15 },
    { h: 6.2,  top: '#58639f', bot: '#f2ae98', shade: '#d49ea4', lights: .55, stars: .15, clouds: .6 },
    { h: 7.6,  top: '#8cc3e6', bot: '#f5e9dc', shade: '#fbefe4', lights: 0,   stars: 0,   clouds: .9 },
    { h: 12,   top: '#79b9e4', bot: '#def0f8', shade: '#ffffff', lights: 0,   stars: 0,   clouds: .95 },
    { h: 16.4, top: '#83b6de', bot: '#f3e6cf', shade: '#fff4e4', lights: 0,   stars: 0,   clouds: .9 },
    { h: 18.4, top: '#5a6ca6', bot: '#f59f6c', shade: '#efb08a', lights: .45, stars: 0,   clouds: .75 },
    { h: 19.7, top: '#282d61', bot: '#b0647a', shade: '#86699a', lights: .9,  stars: .45, clouds: .35 },
    { h: 21,   top: '#0e1430', bot: '#252e5c', shade: '#3c4580', lights: 1,   stars: 1,   clouds: .15 },
    { h: 24,   top: '#0a0f24', bot: '#1d2552', shade: '#39427a', lights: 1,   stars: 1,   clouds: .12 }
  ];
  function phaseName(h) {
    if (h < 5) return 'night';
    if (h < 7.5) return 'dawn';
    if (h < 11.5) return 'morning';
    if (h < 16.5) return 'afternoon';
    if (h < 18.8) return 'golden hour';
    if (h < 20.5) return 'dusk';
    return 'night';
  }
  function nowHours() { var d = new Date(); return d.getHours() + d.getMinutes() / 60; }

  // ---------- state ----------
  var root, sky, stage, svg, gObjects, gLights, gLabels, gRings, walker, bubble;
  var districts = [], byId = {}, land = new Map(), pathSet = new Set(), buildingSet = new Set();
  var walkerTile, walking = null, built = false;
  var timeOverride = null, hour = nowHours();
  var labelScale = 1, frames = {}, compact = false;
  var listeners = { select: [], step: [], hover: [] };
  function emit(name, arg) { listeners[name].forEach(function (f) { f(arg); }); }

  var SPOTS = {
    hall: [8, 8], workshop: [4, 9], library: [9, 4], observatory: [5, 5],
    lighthouse: [13, 6], post: [7, 12], garden: [11, 11]
  };

  // ---------- map generation ----------
  function generate() {
    var rand = mulberry32(hashStr('husam.world'));
    var ph = [rand() * 6.283, rand() * 6.283, rand() * 6.283];

    var sections = [].slice.call(document.querySelectorAll('#reader [data-building]'));
    var used = {};
    districts = sections.filter(function (s) {
      var t = s.dataset.building;
      if (!SPOTS[t] || used[t]) return false; // one of each building type
      used[t] = true; return true;
    }).map(function (s, idx) {
      var p = SPOTS[s.dataset.building];
      return {
        id: s.id, type: s.dataset.building, place: s.dataset.place || s.id,
        kicker: s.dataset.kicker || '', section: s, n: idx + 1,
        i: p[0], j: p[1], door: [p[0], p[1] + 1]
      };
    });
    districts.forEach(function (d) { byId[d.id] = d; buildingSet.add(key(d.i, d.j)); });

    function islandShape(i, j) {
      var di = i - C, dj = j - C, d = Math.hypot(di, dj), a = Math.atan2(dj, di);
      var r = 5.9 + 0.7 * Math.sin(3 * a + ph[0]) + 0.5 * Math.sin(5 * a + ph[1]) + 0.35 * Math.sin(2 * a + ph[2]);
      return d < r;
    }
    function addLand(i, j) { if (!land.has(key(i, j))) land.set(key(i, j), { i: i, j: j, elev: 0, kind: 'g', alt: rand() < 0.5 }); }
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) if (islandShape(i, j)) addLand(i, j);

    // roads: L-shaped routes from the Town Hall's door to every other door
    var hall = districts.filter(function (d) { return d.type === 'hall'; })[0] || districts[0];
    function lpath(a, b, jFirst) {
      var out = [], i = a[0], j = a[1];
      out.push([i, j]);
      function stepJ() { while (j !== b[1]) { j += Math.sign(b[1] - j); out.push([i, j]); } }
      function stepI() { while (i !== b[0]) { i += Math.sign(b[0] - i); out.push([i, j]); } }
      if (jFirst) { stepJ(); stepI(); } else { stepI(); stepJ(); }
      return out;
    }
    function route(a, b) {
      var opts = [lpath(a, b, true), lpath(a, b, false)];
      for (var k = 0; k < opts.length; k++) {
        if (!opts[k].some(function (p) { return buildingSet.has(key(p[0], p[1])); })) return opts[k];
      }
      return opts[0];
    }
    if (hall) districts.forEach(function (d) {
      route(hall.door, d.door).forEach(function (p) { pathSet.add(key(p[0], p[1])); addLand(p[0], p[1]); });
    });
    districts.forEach(function (d) {
      for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) addLand(d.i + a, d.j + b);
    });

    // a hill under the observatory
    var obs = districts.filter(function (d) { return d.type === 'observatory'; })[0];
    land.forEach(function (t) {
      if (obs && Math.hypot(t.i - obs.i, t.j - obs.j) < 1.6) t.elev = 1;
      var k = key(t.i, t.j);
      if (pathSet.has(k)) t.kind = 'p';
      else {
        var wet = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(function (o) { return !land.has(key(t.i + o[0], t.j + o[1])); }).length;
        if (wet >= 2 || (wet === 1 && rand() < 0.4)) t.kind = 's';
      }
    });

    // decoration: trees and flowers
    var garden = districts.filter(function (d) { return d.type === 'garden'; })[0];
    land.forEach(function (t) {
      var k = key(t.i, t.j);
      t.jx = (rand() - 0.5) * 10; t.jy = (rand() - 0.5) * 5;
      if (pathSet.has(k) || buildingSet.has(k)) return;
      var nearB = districts.some(function (d) { return Math.abs(t.i - d.i) <= 1 && Math.abs(t.j - d.j) <= 1; });
      if (garden && Math.hypot(t.i - garden.i, t.j - garden.j) < 2.3 && !nearB) { t.flowers = true; return; }
      if (garden && Math.abs(t.i - garden.i) <= 1 && Math.abs(t.j - garden.j) <= 1) { t.flowers = true; return; }
      if (nearB || t.kind === 's') { if (t.kind === 's' && rand() < 0.08) t.rock = true; return; }
      var r = rand();
      if (r < 0.34) t.tree = rand() < 0.45 ? 'pine' : 'round';
      else if (r < 0.4) t.rock = true;
    });
    walkerTile = hall ? hall.door.slice() : [C, C];
  }

  // ---------- drawing primitives ----------
  function box(g, cx, cy, hw, H, cls) {
    var hh = hw / 2;
    var L = [cx - hw, cy], B = [cx, cy + hh], R = [cx + hw, cy], T = [cx, cy - hh];
    el('polygon', { points: pts([L, B, [B[0], B[1] - H], [L[0], L[1] - H]]), 'class': cls + ' fl' }, g);
    el('polygon', { points: pts([B, R, [R[0], R[1] - H], [B[0], B[1] - H]]), 'class': cls + ' fr' }, g);
    el('polygon', { points: pts([[L[0], L[1] - H], [T[0], T[1] - H], [R[0], R[1] - H], [B[0], B[1] - H]]), 'class': cls + ' ft' }, g);
    return { L: L, B: B, R: R, T: T, hw: hw, H: H };
  }
  function pyramid(g, cx, cy, hw, rh, cls) {
    var hh = hw / 2, apex = [cx, cy - rh];
    el('polygon', { points: pts([[cx - hw, cy], [cx, cy + hh], apex]), 'class': cls + ' fl' }, g);
    el('polygon', { points: pts([[cx, cy + hh], [cx + hw, cy], apex]), 'class': cls + ' fr' }, g);
    return apex;
  }
  // Draw on a building face. fn(g, lightG) gets coordinates where x runs 0..hw along the
  // face and y runs upward as negative numbers from the ground line.
  function face(g, b, side, fn) {
    var o = side === 'l' ? b.L : b.B;
    var tf = 'translate(' + o[0].toFixed(1) + ',' + o[1].toFixed(1) + ') skewY(' + (side === 'l' ? SKEW : -SKEW) + ')';
    var fg = el('g', { transform: tf }, g);
    var lg = el('g', { transform: tf }, gLights);
    fn(fg, lg);
  }
  function win(fg, lg, x, y, w, h) {
    el('rect', { x: x, y: y, width: w, height: h, 'class': 'win' }, fg);
    el('rect', { x: x, y: y, width: w, height: h, 'class': 'lit' }, lg);
  }
  function door(fg, x, w, h) { el('rect', { x: x, y: -h, width: w, height: h, rx: 1, 'class': 'door' }, fg); }
  function shadow(g, x, y, rx) { el('ellipse', { cx: x + rx * 0.25, cy: y + 2, rx: rx, ry: rx / 2.2, 'class': 'shadow' }, g); }

  // ---------- buildings ----------
  var BUILD = {
    hall: function (g, x, y) {
      shadow(g, x, y, 30);
      var b1 = box(g, x, y, 26, 32, 'wall');
      face(g, b1, 'l', function (f) { door(f, 9, 8, 15); el('rect', { x: 7.5, y: -17, width: 11, height: 2, 'class': 'trim' }, f); });
      face(g, b1, 'r', function (f, l) { win(f, l, 5, -24, 5, 8); win(f, l, 16, -24, 5, 8); win(f, l, 5, -12, 5, 8); win(f, l, 16, -12, 5, 8); });
      var b2 = box(g, x, y - 32, 14, 34, 'wall');
      face(g, b2, 'l', function (f, l) { win(f, l, 4.5, -14, 5, 9); });
      face(g, b2, 'r', function (f) {
        var c = el('g', { transform: 'translate(7,-21)' }, f);
        el('circle', { r: 5.6, 'class': 'clock' }, c);
        var hr = el('line', { x1: 0, y1: 0, x2: 0, y2: -3, 'class': 'hand', id: 'clockH' }, c);
        var mn = el('line', { x1: 0, y1: 0, x2: 0, y2: -4.6, 'class': 'hand', id: 'clockM' }, c);
        el('circle', { r: 0.8, 'class': 'hand-dot' }, c);
        root._hands = [hr, mn];
      });
      var apex = pyramid(g, x, y - 66, 17, 20, 'roof');
      el('line', { x1: apex[0], y1: apex[1], x2: apex[0], y2: apex[1] - 14, 'class': 'pole' }, g);
      var fl = el('g', { transform: 'translate(' + apex[0] + ',' + (apex[1] - 14) + ')' }, g);
      var flag = el('polygon', { points: '0,0 11,2.5 0,5', 'class': 'flag' }, fl);
      anim(flag, { type: 'skewY', values: '0;-8;0;6;0', dur: '2.4s' });
      return y - 100;
    },
    workshop: function (g, x, y) {
      shadow(g, x, y, 30);
      var b = box(g, x, y, 28, 28, 'brick');
      face(g, b, 'l', function (f) {
        el('rect', { x: 5, y: -19, width: 17, height: 19, 'class': 'garage' }, f);
        for (var k = 1; k < 5; k++) el('line', { x1: 5, x2: 22, y1: -19 + k * 3.8, y2: -19 + k * 3.8, 'class': 'garage-line' }, f);
      });
      face(g, b, 'r', function (f, l) { win(f, l, 4, -20, 5, 7); win(f, l, 11.5, -20, 5, 7); win(f, l, 19, -20, 5, 7); });
      // sawtooth roof
      for (var k = 0; k < 3; k++) {
        var cx = x - 14 + k * 9.5, cy = y - 28 - 7 + k * 4.75;
        el('polygon', { points: pts([[cx - 5, cy + 2.5], [cx + 5, cy - 2.5], [cx + 5, cy - 11.5], [cx - 5, cy - 6.5]]), 'class': 'roof2 fl' }, g);
      }
      box(g, x + 12, y - 34, 5, 20, 'brick');
      var sm = el('g', { 'class': 'smoke' }, g);
      for (var s = 0; s < 3; s++) {
        var c = el('circle', { cx: x + 12, cy: y - 58, r: 4 + s, style: 'animation-delay:' + (-s * 1.1) + 's' }, sm);
        if (reduce) c.setAttribute('cy', y - 60 - s * 7);
      }
      return y - 76;
    },
    library: function (g, x, y) {
      shadow(g, x, y, 30);
      var b = box(g, x, y, 26, 30, 'stone');
      face(g, b, 'l', function (f) {
        for (var k = 0; k < 4; k++) el('rect', { x: 2.5 + k * 6.2, y: -27, width: 2.6, height: 27, 'class': 'col' }, f);
        door(f, 10.5, 6, 13);
      });
      face(g, b, 'r', function (f, l) { win(f, l, 5, -24, 5, 16); win(f, l, 15, -24, 5, 16); });
      box(g, x, y - 30, 29, 4, 'stone');
      pyramid(g, x, y - 34, 29, 13, 'slate');
      return y - 58;
    },
    observatory: function (g, x, y) {
      shadow(g, x, y, 24);
      var b = box(g, x, y, 21, 20, 'wall');
      face(g, b, 'l', function (f) { door(f, 7, 7, 12); });
      face(g, b, 'r', function (f, l) { win(f, l, 8, -15, 5, 6); });
      var ty = y - 20, r = 18;
      var defs = svg.querySelector('defs');
      if (!defs.querySelector('#domeGrad')) {
        var lg = el('linearGradient', { id: 'domeGrad', x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
        el('stop', { offset: 0, 'stop-color': '#f4f6fa' }, lg);
        el('stop', { offset: 1, 'stop-color': '#aab5c6' }, lg);
      }
      el('path', { d: 'M' + (x - r) + ',' + ty + ' A' + r + ',' + r + ' 0 0 1 ' + (x + r) + ',' + ty + ' A' + r + ',' + (r / 2) + ' 0 0 1 ' + (x - r) + ',' + ty + 'Z', fill: 'url(#domeGrad)', 'class': 'dome' }, g);
      el('path', { d: 'M' + (x + 1) + ',' + (ty - r + 1) + ' L' + (x + 6) + ',' + (ty - r + 3) + ' L' + (x + 7) + ',' + (ty + 5) + ' L' + (x + 2) + ',' + (ty + 5) + 'Z', 'class': 'slit' }, g);
      el('line', { x1: x + 4, y1: ty - 8, x2: x + 18, y2: ty - 26, 'class': 'scope' }, g);
      return ty - r - 16;
    },
    lighthouse: function (g, x, y) {
      shadow(g, x, y, 16);
      var b = box(g, x, y, 11, 60, 'white');
      function stripes(f) { [-12, -32, -52].forEach(function (sy) { el('rect', { x: 0, y: sy - 8, width: 11, height: 8, 'class': 'stripe' }, f); }); }
      face(g, b, 'l', function (f) { stripes(f); door(f, 3, 5, 9); });
      face(g, b, 'r', stripes);
      box(g, x, y - 60, 15, 3, 'dark');
      box(g, x, y - 63, 9, 10, 'glass');
      var apex = pyramid(g, x, y - 73, 11, 11, 'redroof');
      el('circle', { cx: x, cy: y - 68, r: 3, 'class': 'lamp' }, g);
      // the sweeping beam (drawn above the night shade)
      var defs2 = svg.querySelector('defs');
      if (!defs2.querySelector('#beamGrad')) {
        var bgr = el('linearGradient', { id: 'beamGrad', x1: 0, x2: 1, y1: 0, y2: 0 }, defs2);
        el('stop', { offset: 0, 'stop-color': '#fff1b8', 'stop-opacity': 0.55 }, bgr);
        el('stop', { offset: 1, 'stop-color': '#fff1b8', 'stop-opacity': 0 }, bgr);
        var bgl = el('linearGradient', { id: 'beamGradL', x1: 1, x2: 0, y1: 0, y2: 0 }, defs2);
        el('stop', { offset: 0, 'stop-color': '#fff1b8', 'stop-opacity': 0.55 }, bgl);
        el('stop', { offset: 1, 'stop-color': '#fff1b8', 'stop-opacity': 0 }, bgl);
      }
      var bg = el('g', { transform: 'translate(' + x + ',' + (y - 68) + ') scale(1,0.5)', 'class': 'beam-wrap' }, gLights);
      var rot = el('g', {}, bg);
      el('polygon', { points: '0,0 260,-30 260,30', fill: 'url(#beamGrad)' }, rot);
      el('polygon', { points: '0,0 -260,-30 -260,30', fill: 'url(#beamGradL)' }, rot);
      el('circle', { cx: x, cy: y - 68, r: 9, 'class': 'lamp-glow' }, gLights);
      anim(rot, { type: 'rotate', from: '0', to: '360', dur: '9s' });
      return apex[1] - 8;
    },
    post: function (g, x, y) {
      shadow(g, x, y, 22);
      var b = box(g, x, y, 19, 20, 'wall');
      face(g, b, 'l', function (f) { door(f, 6, 7, 12); el('rect', { x: 4.5, y: -17, width: 10, height: 3, 'class': 'sign' }, f); });
      face(g, b, 'r', function (f, l) { win(f, l, 6, -14, 7, 6); });
      pyramid(g, x, y - 20, 22, 16, 'green');
      // mailbox by the door
      el('line', { x1: x - 16, y1: y + 14, x2: x - 16, y2: y + 5, 'class': 'pole' }, g);
      box(g, x - 16, y + 5, 3.5, 6, 'mail');
      return y - 48;
    },
    garden: function (g, x, y) {
      shadow(g, x, y, 22);
      // plants inside, drawn before the glass so they show through
      [[-6, 2, '#5a9a4a'], [5, 0, '#6db35a'], [0, 5, '#4f8a40'], [-1, -4, '#79b862']].forEach(function (p) {
        el('circle', { cx: x + p[0], cy: y + p[1] - 6, r: 5, fill: p[2] }, g);
      });
      el('circle', { cx: x + 4, cy: y - 12, r: 1.8, fill: '#f3a0b5' }, g);
      el('circle', { cx: x - 5, cy: y - 9, r: 1.6, fill: '#f6d65b' }, g);
      var b = box(g, x, y, 19, 16, 'glass');
      face(g, b, 'l', function (f) { for (var k = 1; k < 3; k++) el('line', { x1: k * 6.3, x2: k * 6.3, y1: -16, y2: 0, 'class': 'frame' }, f); });
      face(g, b, 'r', function (f) { for (var k = 1; k < 3; k++) el('line', { x1: k * 6.3, x2: k * 6.3, y1: -16, y2: 0, 'class': 'frame' }, f); });
      pyramid(g, x, y - 16, 19, 10, 'glass');
      return y - 42;
    }
  };

  function tree(g, x, y, kind) {
    shadow(g, x, y, 9);
    el('rect', { x: x - 1.5, y: y - 9, width: 3, height: 10, 'class': 'trunk' }, g);
    if (kind === 'pine') {
      el('polygon', { points: pts([[x, y - 34], [x + 9, y - 10], [x - 9, y - 10]]), 'class': 'pine' }, g);
      el('polygon', { points: pts([[x, y - 34], [x + 9, y - 10], [x, y - 12]]), 'class': 'pine-d' }, g);
    } else {
      el('circle', { cx: x, cy: y - 17, r: 9.5, 'class': 'leaf' }, g);
      el('circle', { cx: x + 3.5, cy: y - 14, r: 6, 'class': 'leaf-d' }, g);
      el('circle', { cx: x - 3.5, cy: y - 21, r: 4.5, 'class': 'leaf-l' }, g);
    }
  }
  function rock(g, x, y) {
    el('polygon', { points: pts([[x - 6, y + 1], [x - 4, y - 4], [x + 2, y - 6], [x + 6, y - 1], [x + 3, y + 2]]), 'class': 'rock' }, g);
    el('polygon', { points: pts([[x + 2, y - 6], [x + 6, y - 1], [x + 3, y + 2], [x + 1, y - 2]]), 'class': 'rock-d' }, g);
  }

  // ---------- build the scene ----------
  function build() {
    root = document.getElementById('world');
    sky = root.querySelector('.sky');
    stage = root.querySelector('.world-stage');
    generate();

    // stars
    var stars = sky.querySelector('.stars'), srand = mulberry32(7), html = '';
    for (var s = 0; s < 90; s++) {
      html += '<i style="left:' + (srand() * 100).toFixed(2) + '%;top:' + (srand() * 70).toFixed(2) + '%;' +
        'width:' + (1 + srand() * 2).toFixed(1) + 'px;height:auto;animation-delay:' + (-srand() * 5).toFixed(2) + 's"></i>';
    }
    stars.innerHTML = html;

    svg = el('svg', { 'class': 'island', role: 'img', 'aria-label': 'An isometric island with a building for each section of the site' }, stage);
    el('defs', {}, svg);
    var bob = el('g', { 'class': 'bob' }, svg);

    // ocean slab
    var loI = Infinity, hiI = -Infinity, loJ = Infinity, hiJ = -Infinity;
    land.forEach(function (t) { loI = Math.min(loI, t.i); hiI = Math.max(hiI, t.i); loJ = Math.min(loJ, t.j); hiJ = Math.max(hiJ, t.j); });
    loI -= 1.6; loJ -= 1.6; hiI += 1.6; hiJ += 1.6;
    var sea = 8, slab = 46;
    var T = iso(loI, loJ), R = iso(hiI, loJ), B = iso(hiI, hiJ), L = iso(loI, hiJ);
    T[1] -= HH; R[0] += HW; B[1] += HH; L[0] -= HW;
    [T, R, B, L].forEach(function (p) { p[1] += sea; });
    var gSea = el('g', {}, bob);
    el('polygon', { points: pts([L, B, [B[0], B[1] + slab], [L[0], L[1] + slab]]), 'class': 'sea-l' }, gSea);
    el('polygon', { points: pts([B, R, [R[0], R[1] + slab], [B[0], B[1] + slab]]), 'class': 'sea-r' }, gSea);
    el('polygon', { points: pts([T, R, B, L]), 'class': 'sea' }, gSea);
    // waves
    var wr = mulberry32(99);
    for (var w = 0; w < 60; w++) {
      var wi = loI + wr() * (hiI - loI), wj = loJ + wr() * (hiJ - loJ);
      if (land.has(key(Math.round(wi), Math.round(wj))) || land.has(key(Math.floor(wi), Math.floor(wj))) || land.has(key(Math.ceil(wi), Math.ceil(wj)))) continue;
      var wp = iso(wi, wj); wp[1] += sea;
      el('path', { d: 'M' + (wp[0] - 7) + ',' + wp[1] + ' q3.5,-3 7,0 t7,0', 'class': 'wave', style: 'animation-delay:' + (-wr() * 4).toFixed(2) + 's' }, gSea);
    }

    // ground
    var gGround = el('g', {}, bob);
    gRings = el('g', {}, bob);
    var tiles = [];
    land.forEach(function (t) { tiles.push(t); });
    tiles.sort(function (a, b) { return (a.i + a.j) - (b.i + b.j) || a.i - b.i; });
    tiles.forEach(function (t) {
      var p = iso(t.i, t.j), x = p[0], y = p[1], top = y - t.elev * STEP;
      el('polygon', { points: pts([[x - HW, top], [x, top + HH], [x, y + HH + DEPTH], [x - HW, y + DEPTH]]), 'class': 'soil-l' }, gGround);
      el('polygon', { points: pts([[x, top + HH], [x + HW, top], [x + HW, y + DEPTH], [x, y + HH + DEPTH]]), 'class': 'soil-r' }, gGround);
      var cls = t.kind === 'p' ? 'path' : t.kind === 's' ? 'sand' : (t.alt ? 'grass2' : 'grass');
      el('polygon', { points: pts([[x, top - HH], [x + HW, top], [x, top + HH], [x - HW, top]]), 'class': 'tile ' + cls }, gGround);
      if (t.kind === 'p') { // stepping stones
        el('ellipse', { cx: x - 6, cy: top - 1, rx: 4, ry: 2, 'class': 'stone-dot' }, gGround);
        el('ellipse', { cx: x + 7, cy: top + 2, rx: 3, ry: 1.5, 'class': 'stone-dot' }, gGround);
      }
      if (t.flowers) {
        var fr = mulberry32(t.i * 31 + t.j), cols = ['#f3a0b5', '#f6d65b', '#ffffff', '#c59cf0', '#f59f6c'];
        for (var f = 0; f < 7; f++) {
          var fx = x + (fr() - 0.5) * 38, fy = top + (fr() - 0.5) * 18;
          if (Math.abs(fx - x) / HW + Math.abs(fy - top) / HH > 0.85) continue;
          el('circle', { cx: fx, cy: fy, r: 1.8, fill: cols[Math.floor(fr() * cols.length)] }, gGround);
        }
      }
    });

    // objects (depth-sorted so things in front overlap things behind)
    gObjects = el('g', {}, bob);
    // night shade: multiplies over sea + island
    el('polygon', { points: pts([T, R, [R[0], R[1] + slab], [B[0], B[1] + slab], [L[0], L[1] + slab], L]), 'class': 'shade' }, bob);
    gLights = el('g', { 'class': 'lights' }, bob);
    gLabels = el('g', { 'class': 'labels' }, bob);

    var objs = [];
    tiles.forEach(function (t) {
      if (!t.tree && !t.rock) return;
      var p = iso(t.i, t.j);
      objs.push({ depth: t.i + t.j, draw: function (g) { var y = p[1] - t.elev * STEP + t.jy; t.tree ? tree(g, p[0] + t.jx, y, t.tree) : rock(g, p[0] + t.jx, y); } });
    });
    districts.forEach(function (d) {
      objs.push({ depth: d.i + d.j, d: d });
    });
    objs.sort(function (a, b) { return a.depth - b.depth; });
    objs.forEach(function (o) {
      var g = el('g', { 'data-depth': o.depth }, gObjects);
      if (!o.d) { o.draw(g); return; }
      var d = o.d, t = land.get(key(d.i, d.j)), p = iso(d.i, d.j), y = p[1] - (t ? t.elev * STEP : 0);
      g.setAttribute('class', 'bld');
      g.setAttribute('data-id', d.id);
      d.g = g;
      // hover/selection ring on the ground
      d.ring = el('polygon', { points: pts([[p[0], y - HH * 1.25], [p[0] + HW * 1.25, y], [p[0], y + HH * 1.25], [p[0] - HW * 1.25, y]]), 'class': 'ring' }, gRings);
      d.top = BUILD[d.type](g, p[0], y);
      d.x = p[0]; d.y = y;
      makeLabel(d);
    });

    // the walker
    walker = el('g', { 'class': 'walker', 'data-depth': 0 }, gObjects);
    el('ellipse', { cx: 1, cy: 1.5, rx: 5, ry: 2.2, 'class': 'shadow' }, walker);
    var body = el('g', { 'class': 'walker-body' }, el('g', { transform: 'scale(1.35)' }, walker));
    el('rect', { x: -2.6, y: -6, width: 2, height: 6, rx: 1, 'class': 'legs' }, body);
    el('rect', { x: 0.6, y: -6, width: 2, height: 6, rx: 1, 'class': 'legs' }, body);
    el('rect', { x: -4, y: -15, width: 8, height: 10, rx: 3, 'class': 'coat' }, body);
    el('circle', { cx: 0, cy: -18.5, r: 4.2, 'class': 'head' }, body);
    el('path', { d: 'M-4.6,-19.5 a4.6,4.6 0 0 1 9.2,0 z', 'class': 'hat' }, body);
    bubble = el('g', { 'class': 'bubble' }, gLabels);
    el('rect', { x: 0, y: 0, width: 10, height: 20, rx: 10, 'class': 'bubble-bg' }, bubble);
    el('text', { x: 10, y: 14, 'class': 'bubble-text' }, bubble);
    placeWalker(walkerTile[0], walkerTile[1]);

    // viewBox: frame the land (and the tallest roofs)
    // two framings: the whole floating slab (wide screens) or just the land (tall screens)
    var topY = T[1];
    districts.forEach(function (d) { topY = Math.min(topY, d.top - 50); });
    frames.wide = [L[0] - 24, topY - 24, R[0] - L[0] + 48, B[1] + slab - topY + 48];
    var lx0 = Infinity, lx1 = -Infinity, ly1 = -Infinity, ly0 = Infinity;
    land.forEach(function (t) { var p = iso(t.i, t.j); lx0 = Math.min(lx0, p[0] - HW); lx1 = Math.max(lx1, p[0] + HW); ly1 = Math.max(ly1, p[1] + HH + DEPTH); });
    districts.forEach(function (d) { ly0 = Math.min(ly0, d.top - 40); });
    frames.tall = [lx0 - 8, ly0 - 10, lx1 - lx0 + 16, ly1 - ly0 + 30];
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // interaction
    districts.forEach(function (d) {
      [d.g, d.label].forEach(function (node) {
        node.addEventListener('click', function () { emit('select', d.id); });
        node.addEventListener('pointerenter', function () { hot(d, true); });
        node.addEventListener('pointerleave', function () { hot(d, false); });
      });
      d.label.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); emit('select', d.id); } });
      d.label.addEventListener('focus', function () { hot(d, true); });
      d.label.addEventListener('blur', function () { hot(d, false); });
    });

    window.addEventListener('resize', layoutLabels);
    root.addEventListener('pointermove', function (e) {
      if (reduce || root.classList.contains('focused')) return;
      var r = root.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
      root.style.setProperty('--px', (-mx * 14).toFixed(1) + 'px');
      root.style.setProperty('--py', (-my * 8).toFixed(1) + 'px');
      root.style.setProperty('--sx', (-mx * 5).toFixed(1) + 'px');
    });

    built = true;
    applyTime();
    layoutLabels();
    setInterval(function () { if (timeOverride === null) { hour = nowHours(); applyTime(); } }, 30000);
  }

  function makeLabel(d) {
    var g = el('g', { 'class': 'label', tabindex: 0, role: 'button', 'aria-label': d.place + ' — ' + d.kicker, 'data-id': d.id }, gLabels);
    var inner = el('g', { 'class': 'label-inner' }, g);
    var bg = el('rect', { 'class': 'label-bg', rx: 13, height: 38, y: -38 }, inner);
    var t1 = el('text', { 'class': 'label-place', y: -18 }, inner);
    t1.textContent = d.place;
    var t2 = el('text', { 'class': 'label-kicker', y: -7 }, inner);
    t2.textContent = String(d.n).padStart(2, '0') + ' · ' + d.kicker.toLowerCase();
    d.stem = el('line', { x1: 0, x2: 0, y1: 0, y2: 8, 'class': 'label-stem' }, g);
    g.insertBefore(d.stem, inner);
    d.label = g; d.labelBg = bg; d.labelTexts = [t1, t2];
  }
  // Labels sit above their building; when two would collide (or a label would hide
  // another building) it gets nudged to the nearest free spot and a stem points home.
  function layoutLabels() {
    if (!built) return;
    var r = svg.getBoundingClientRect(), tall = r.width / (r.height || 1) < 1.1;
    var f = tall ? frames.tall : frames.wide;
    svg.setAttribute('viewBox', f.map(function (v) { return v.toFixed(0); }).join(' '));
    compact = r.width < 700;
    svg.classList.toggle('compact', compact);
    var ppu = Math.min((r.width || 1) / f[2], (r.height || 1) / f[3]);
    labelScale = Math.max(0.55, Math.min(2.6, (compact ? 0.95 : 1.05) / ppu));
    var s = labelScale, placed = [];
    var bodies = districts.map(function (d) { return [d.x - 26, d.top + 6, d.x + 26, d.y + 12, d]; });
    function hits(b, self) {
      // labels colliding with labels count heavily; covering a building a little less
      var n = 0;
      if (b[0] < f[0] + 4 || b[2] > f[0] + f[2] - 4 || b[1] < f[1] - 40) n += 10;
      placed.forEach(function (o) { if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) n += 3; });
      bodies.forEach(function (o) { if (o[4] !== self && b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) n += 1; });
      return n;
    }
    var cands = [];
    for (var dy = 0; dy <= 150; dy += 6) for (var dx = -120; dx <= 120; dx += 12) cands.push([dx, -dy, Math.abs(dx) * 0.8 + dy]);
    cands.sort(function (a, b) { return a[2] - b[2]; });
    districts.slice().sort(function (a, b) { return a.top - b.top; }).forEach(function (d) {
      var tw = 0;
      d.labelTexts.forEach(function (t) { tw = Math.max(tw, t.getComputedTextLength ? t.getComputedTextLength() : 60); });
      var lh = compact ? 26 : 38;
      if (compact) tw = d.labelTexts[0].getComputedTextLength();
      var pw = tw + (compact ? 20 : 26);
      d.labelBg.setAttribute('x', -pw / 2);
      d.labelBg.setAttribute('width', pw);
      d.labelBg.setAttribute('height', lh);
      d.labelBg.setAttribute('y', -lh);
      d.labelTexts[0].setAttribute('y', compact ? -8 : -18);
      var hw = pw / 2 * s + 3, h = lh * s + 3, ax = d.x, ay = d.top - 4, best = cands[0];
      var fewest = Infinity;
      for (var k = 0; k < cands.length; k++) {
        var c = cands[k], box = [ax + c[0] - hw, ay + c[1] - h - 8 * s, ax + c[0] + hw, ay + c[1] + 2];
        var n = hits(box, d);
        if (n === 0) { best = c; break; }
        if (n < fewest) { fewest = n; best = c; }
      }
      placed.push([ax + best[0] - hw, ay + best[1] - h - 8 * s, ax + best[0] + hw, ay + best[1] + 2, null]);
      d.label.setAttribute('transform', 'translate(' + (ax + best[0]).toFixed(1) + ',' + (ay + best[1] - 8 * s).toFixed(1) + ') scale(' + s.toFixed(3) + ')');
      d.stem.setAttribute('x2', (-best[0] / s).toFixed(1));
      d.stem.setAttribute('y2', ((8 * s - best[1]) / s).toFixed(1));
    });
    if (bubble && bubble.classList.contains('show')) positionBubble();
  }
  function hot(d, on) {
    d.label.classList.toggle('hot', on);
    d.ring.classList.toggle('hot', on);
    if (on) emit('hover', d.id);
  }

  // ---------- time ----------
  function applyTime() {
    if (!root) return;
    var h = ((hour % 24) + 24) % 24, a, b;
    for (var k = 0; k < KEYS.length - 1; k++) if (h >= KEYS[k].h && h <= KEYS[k + 1].h) { a = KEYS[k]; b = KEYS[k + 1]; break; }
    var t = (h - a.h) / (b.h - a.h || 1);
    var s = root.style;
    s.setProperty('--sky-top', mix(a.top, b.top, t));
    s.setProperty('--sky-bot', mix(a.bot, b.bot, t));
    s.setProperty('--shade', mix(a.shade, b.shade, t));
    var lights = lerp(a.lights, b.lights, t);
    s.setProperty('--lights', lights.toFixed(3));
    s.setProperty('--stars', lerp(a.stars, b.stars, t).toFixed(3));
    s.setProperty('--clouds', lerp(a.clouds, b.clouds, t).toFixed(3));
    root.classList.toggle('is-night', lights > 0.5);
    document.documentElement.classList.toggle('world-night', lights > 0.5);

    // sun and moon ride an arc across the sky
    var sa = (h - 6) / 12 * Math.PI, ma = ((h + 12) % 24 - 6) / 12 * Math.PI;
    s.setProperty('--sun-x', (50 - Math.cos(sa) * 42).toFixed(2) + '%');
    s.setProperty('--sun-y', (78 - Math.sin(sa) * 64).toFixed(2) + '%');
    s.setProperty('--moon-x', (50 - Math.cos(ma) * 42).toFixed(2) + '%');
    s.setProperty('--moon-y', (78 - Math.sin(ma) * 64).toFixed(2) + '%');

    if (root._hands) {
      var mins = (h % 1) * 60;
      root._hands[0].setAttribute('transform', 'rotate(' + ((h % 12) * 30).toFixed(1) + ')');
      root._hands[1].setAttribute('transform', 'rotate(' + (mins * 6).toFixed(1) + ')');
    }
    emit('time', h);
  }
  listeners.time = [];

  // ---------- walking ----------
  function tileY(i, j) { var t = land.get(key(i, j)); return iso(i, j)[1] - (t ? t.elev * STEP : 0); }
  function placeWalker(fi, fj) {
    var ri = Math.round(fi), rj = Math.round(fj);
    var p = iso(fi, fj), y = lerp(tileY(Math.floor(fi), Math.floor(fj)), tileY(Math.ceil(fi), Math.ceil(fj)), (fi % 1) || (fj % 1));
    walker.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ',' + y.toFixed(1) + ')');
    walker._x = p[0]; walker._y = y;
    // keep the walker in the right place in the draw order
    var depth = ri + rj + 0.5;
    if (walker._depth !== depth) {
      walker._depth = depth;
      var kids = gObjects.children, before = null;
      for (var k = 0; k < kids.length; k++) {
        if (kids[k] !== walker && +kids[k].getAttribute('data-depth') > depth) { before = kids[k]; break; }
      }
      if (before) gObjects.insertBefore(walker, before); else gObjects.appendChild(walker);
    }
    if (bubble.classList.contains('show')) positionBubble();
  }
  function bfs(from, to) {
    var start = key(from[0], from[1]), goal = key(to[0], to[1]);
    if (!pathSet.has(start)) return [to];
    var prev = {}, q = [from], seen = {}; seen[start] = true;
    while (q.length) {
      var c = q.shift(), ck = key(c[0], c[1]);
      if (ck === goal) break;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (o) {
        var n = [c[0] + o[0], c[1] + o[1]], nk = key(n[0], n[1]);
        if (!seen[nk] && pathSet.has(nk)) { seen[nk] = true; prev[nk] = c; q.push(n); }
      });
    }
    if (!seen[goal]) return [to];
    var out = [], cur = to;
    while (key(cur[0], cur[1]) !== start) { out.unshift(cur); cur = prev[key(cur[0], cur[1])]; }
    return out;
  }
  function walkTo(id, done) {
    var d = byId[id];
    if (!d) return;
    if (walking) cancelAnimationFrame(walking.raf);
    var route = bfs(walkerTile, d.door);
    if (reduce || !route.length) {
      walkerTile = d.door.slice(); placeWalker(walkerTile[0], walkerTile[1]);
      walking = null; walker.classList.remove('walking');
      if (done) done();
      return;
    }
    var from = walkerTile.slice(), idx = 0, t0 = performance.now(), per = Math.max(70, Math.min(150, 1300 / route.length));
    walker.classList.add('walking');
    walking = { raf: 0 };
    function frame(now) {
      var t = (now - t0) / per;
      while (t >= 1 && idx < route.length) {
        from = route[idx]; walkerTile = from.slice(); idx++; t0 += per; t -= 1;
        emit('step', idx);
      }
      if (idx >= route.length) {
        placeWalker(walkerTile[0], walkerTile[1]);
        walker.classList.remove('walking'); walking = null;
        if (done) done();
        return;
      }
      var to = route[idx], e = t;
      placeWalker(lerp(from[0], to[0], e), lerp(from[1], to[1], e));
      walker.classList.toggle('face-left', to[0] < from[0] || to[1] > from[1]);
      walking.raf = requestAnimationFrame(frame);
    }
    walking.raf = requestAnimationFrame(frame);
  }

  var bubbleTimer;
  function say(text, ms) {
    if (!built) return;
    var tx = bubble.querySelector('text');
    tx.textContent = text;
    var w = tx.getComputedTextLength() + 20;
    bubble.querySelector('rect').setAttribute('width', w);
    tx.setAttribute('x', 10);
    bubble._w = w;
    positionBubble();
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.classList.remove('show'); }, ms || 3200);
  }
  function positionBubble() {
    var s = labelScale;
    bubble.setAttribute('transform', 'translate(' + (walker._x - (bubble._w || 20) * s / 2).toFixed(1) + ',' + (walker._y - 30 - 22 * s).toFixed(1) + ') scale(' + s.toFixed(3) + ')');
  }

  // Move the camera so a building sits in the middle of the space left over by the panel.
  function focus(id, free) {
    if (!built) return;
    var d = byId[id];
    districts.forEach(function (x) { x.ring.classList.toggle('sel', x === d); });
    if (!d || !free) {
      root.classList.remove('focused');
      stage.style.setProperty('--fx', '0px'); stage.style.setProperty('--fy', '0px');
      return;
    }
    root.classList.add('focused');
    var m = svg.getScreenCTM();
    if (!m) return;
    var cur = [parseFloat(stage.style.getPropertyValue('--fx')) || 0, parseFloat(stage.style.getPropertyValue('--fy')) || 0];
    var sx = m.a * d.x + m.e - cur[0], sy = m.d * (d.y - 30) + m.f - cur[1];
    var tx = free.x + free.w / 2, ty = free.y + free.h / 2;
    stage.style.setProperty('--fx', (tx - sx).toFixed(0) + 'px');
    stage.style.setProperty('--fy', (ty - sy).toFixed(0) + 'px');
  }

  window.World = {
    init: function () { if (!built) build(); else layoutLabels(); },
    get built() { return built; },
    districts: function () { return districts; },
    walkTo: walkTo,
    say: say,
    focus: focus,
    on: function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); },
    setTime: function (h) { timeOverride = h === null ? null : h; hour = h === null ? nowHours() : h; applyTime(); },
    getTime: function () { return hour; },
    isLive: function () { return timeOverride === null; },
    phaseName: phaseName,
    nowHours: nowHours
  };
})();
