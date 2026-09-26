/* Procedural Haeckel-style forms. Class comes from the honor's kind; elaboration (symmetry order,
   rings, spines) grows with rarity, so the rarer a thing is, the more intricate it is drawn.
   form(item, size) -> SVG markup string (viewBox -100..100). */
(function () {
  var PAL = {
    Scholarship: { cls: 'Medusae', a: '#c8475c', b: '#f1b7a8', c: '#8fa6bd', d: '#e9a23b' },
    'Leadership program': { cls: 'Radiolaria', a: '#5e7fa3', b: '#cfe0ea', c: '#2f4d6e', d: '#d9b45a' },
    'National recognition': { cls: 'Diatomea', a: '#b0843a', b: '#f2dca4', c: '#6f5a2e', d: '#7f9f6a' },
    Academic: { cls: 'Thalamophora', a: '#8a6aa8', b: '#e6d6ef', c: '#4e3a66', d: '#c8475c' }
  };
  function rng(seed) { var s = 0; for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0; return function () { s = (s * 1103515245 + 12345) | 0; return ((s >>> 16) & 32767) / 32767; }; }
  function f(n) { return n.toFixed(1); }
  function level(n) { return n ? Math.max(0, Math.min(1, Math.log(n) / Math.log(1628))) : 0.25; }

  function radiolarian(it, p, r, L) {
    var k = 5 + Math.round(L * 11), o = [], i, a;
    var R = 58 + r() * 6, inner = R * (0.55 + r() * 0.1);
    for (i = 0; i < k; i++) { // spines
      a = i / k * Math.PI * 2 - Math.PI / 2;
      var len = R + 18 + L * 22 + (i % 2 ? 0 : 6);
      o.push('<line x1="' + f(Math.cos(a) * R) + '" y1="' + f(Math.sin(a) * R) + '" x2="' + f(Math.cos(a) * len) + '" y2="' + f(Math.sin(a) * len) + '" stroke="' + p.c + '" stroke-width="1.6" stroke-linecap="round"/>');
      o.push('<circle cx="' + f(Math.cos(a) * len) + '" cy="' + f(Math.sin(a) * len) + '" r="' + f(2 + L * 1.6) + '" fill="' + p.d + '"/>');
    }
    o.push('<circle r="' + f(R) + '" fill="' + p.b + '" stroke="' + p.c + '" stroke-width="1.4"/>');
    var rings = 1 + Math.round(L * 3);
    for (var ring = 0; ring < rings; ring++) {
      var rr = R * (0.86 - ring * 0.2), holes = k * (ring + 1);
      for (i = 0; i < holes; i++) {
        a = (i + (ring % 2) * 0.5) / holes * Math.PI * 2;
        o.push('<circle cx="' + f(Math.cos(a) * rr) + '" cy="' + f(Math.sin(a) * rr) + '" r="' + f(Math.max(1.6, (Math.PI * rr / holes) * 0.55)) + '" fill="#fbf6ea" stroke="' + p.a + '" stroke-width=".9"/>');
      }
    }
    var st = [];
    for (i = 0; i < k * 2; i++) { a = i / (k * 2) * Math.PI * 2 - Math.PI / 2; var q = i % 2 ? inner * 0.32 : inner * 0.62; st.push(f(Math.cos(a) * q) + ',' + f(Math.sin(a) * q)); }
    o.push('<polygon points="' + st.join(' ') + '" fill="' + p.a + '" opacity=".85"/>');
    o.push('<circle r="' + f(inner * 0.18) + '" fill="' + p.d + '"/>');
    return o.join('');
  }

  function medusa(it, p, r, L) {
    var o = [], i, k = 4 + Math.round(L * 10), W = 62 + L * 8, top = -54, rim = 4;
    var tent = 3 + Math.round(L * 9);
    for (i = 0; i < tent; i++) { // tentacles
      var x = -W * 0.9 + (i + 0.5) / tent * W * 1.8, len = 44 + r() * 40 + L * 30, w = 6 + r() * 8;
      o.push('<path d="M' + f(x) + ',' + rim + ' C' + f(x - w) + ',' + f(rim + len * 0.35) + ' ' + f(x + w) + ',' + f(rim + len * 0.65) + ' ' + f(x + r() * 6 - 3) + ',' + f(rim + len) + '" stroke="' + p.a + '" stroke-width="' + f(1.1 + L) + '" fill="none" stroke-linecap="round" opacity=".85"/>');
    }
    var arms = 2 + Math.round(L * 3);
    for (i = 0; i < arms; i++) { // oral arms, frilled
      var ax = -18 + i * (36 / Math.max(1, arms - 1)), al = 40 + L * 36;
      o.push('<path d="M' + f(ax - 6) + ',' + rim + ' C' + f(ax - 14) + ',' + f(rim + al * .5) + ' ' + f(ax + 10) + ',' + f(rim + al * .7) + ' ' + f(ax) + ',' + f(rim + al) + ' C' + f(ax + 12) + ',' + f(rim + al * .6) + ' ' + f(ax + 2) + ',' + f(rim + al * .3) + ' ' + f(ax + 6) + ',' + rim + ' Z" fill="' + p.b + '" stroke="' + p.a + '" stroke-width=".9"/>');
    }
    o.push('<path d="M' + f(-W) + ',' + rim + ' C' + f(-W) + ',' + f(top) + ' ' + f(W) + ',' + f(top) + ' ' + f(W) + ',' + rim + ' Z" fill="' + p.c + '" opacity=".9"/>');
    o.push('<path d="M' + f(-W * 0.8) + ',' + (rim - 4) + ' C' + f(-W * 0.8) + ',' + f(top * 0.8) + ' ' + f(W * 0.8) + ',' + f(top * 0.8) + ' ' + f(W * 0.8) + ',' + (rim - 4) + ' Z" fill="' + p.b + '" opacity=".55"/>');
    for (i = 0; i < k; i++) { // radial canals
      var t = (i + 0.5) / k, bx = -W + t * 2 * W;
      o.push('<path d="M0,' + f(top * 0.62) + ' Q' + f(bx * 0.5) + ',' + f(top * 0.3) + ' ' + f(bx * 0.95) + ',' + (rim - 1) + '" stroke="' + p.a + '" stroke-width="1.2" fill="none"/>');
    }
    for (i = 0; i <= k * 2; i++) { var sx = -W + i / (k * 2) * 2 * W; o.push('<circle cx="' + f(sx) + '" cy="' + rim + '" r="' + f(1.6 + L) + '" fill="' + p.d + '"/>'); }
    o.push('<ellipse cx="0" cy="' + f(top * 0.55) + '" rx="' + f(10 + L * 8) + '" ry="' + f(6 + L * 5) + '" fill="' + p.d + '" opacity=".9"/>');
    return '<g transform="translate(0,-18)">' + o.join('') + '</g>';
  }

  function diatom(it, p, r, L) {
    var o = [], i, k = 8 + Math.round(L * 24), R = 70;
    o.push('<circle r="' + R + '" fill="' + p.b + '" stroke="' + p.c + '" stroke-width="1.6"/>');
    o.push('<circle r="' + (R - 7) + '" fill="none" stroke="' + p.a + '" stroke-width="1" stroke-dasharray="2 3"/>');
    for (i = 0; i < k; i++) {
      var a = i / k * Math.PI * 2;
      o.push('<line x1="' + f(Math.cos(a) * 16) + '" y1="' + f(Math.sin(a) * 16) + '" x2="' + f(Math.cos(a) * (R - 10)) + '" y2="' + f(Math.sin(a) * (R - 10)) + '" stroke="' + p.a + '" stroke-width="' + (i % 2 ? 0.8 : 1.6) + '"/>');
      if (i % 2 === 0) for (var j = 1; j <= 1 + Math.round(L * 3); j++) { var rr = 16 + j * (R - 26) / (2 + L * 3); o.push('<circle cx="' + f(Math.cos(a + Math.PI / k) * rr) + '" cy="' + f(Math.sin(a + Math.PI / k) * rr) + '" r="' + f(1.4 + j * 0.5) + '" fill="' + p.d + '" opacity=".8"/>'); }
    }
    o.push('<circle r="16" fill="' + p.a + '" opacity=".75"/><circle r="7" fill="#fbf6ea"/>');
    return o.join('');
  }

  function shell(it, p, r, L) {
    var o = [], turns = 3.2, n = 26;
    for (var i = n; i >= 0; i--) {
      var t = i / n, a = t * turns * Math.PI * 2, rr = 6 + t * 60, cr = 3 + t * 16;
      o.push('<circle cx="' + f(Math.cos(a) * rr * 0.9) + '" cy="' + f(Math.sin(a) * rr * 0.9) + '" r="' + f(cr) + '" fill="' + (i % 2 ? p.b : '#fbf6ea') + '" stroke="' + p.a + '" stroke-width="1"/>');
    }
    return o.join('');
  }

  function form(it, size) {
    var p = PAL[it.kind] || PAL.Academic, r = rng(it.id), L = level(it.n);
    var body = p.cls === 'Medusae' ? medusa(it, p, r, L) : p.cls === 'Radiolaria' ? radiolarian(it, p, r, L) : p.cls === 'Diatomea' ? diatom(it, p, r, L) : shell(it, p, r, L);
    return '<svg viewBox="-100 -100 200 200" width="' + (size || 200) + '" height="' + (size || 200) + '" aria-hidden="true" focusable="false">' + body + '</svg>';
  }
  window.PierForms = { form: form, cls: function (kind) { return (PAL[kind] || PAL.Academic).cls; }, PAL: PAL };
})();
