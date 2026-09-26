/* Pictograms for the Airport, after Otl Aicher (Munich 1972 / Frankfurt Airport 1972):
   a 48-unit square, every stroke at 0°, 45° or 90°, round heads, thick limbs.
   PICTO[name]() returns the inner SVG (white on the sign colour). Shared by prototypes b and c. */
(function () {
  var W = 'fill="currentColor"', S = 'stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  function head(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 4.4) + '" ' + W + '/>'; }
  function limb(pts, w) { return '<polyline points="' + pts + '" ' + S + ' stroke-width="' + (w || 5.2) + '"/>'; }
  function box(x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" ' + W + '/>'; }
  /* a standing figure: head at (x, y); body from neck to hip */
  function figure(x, y, o) {
    o = o || {};
    var s = '' + head(x, y, o.r);
    var ny = y + 7, hy = y + 20;
    s += limb(x + ',' + ny + ' ' + x + ',' + hy, 6.4);
    s += o.arms || limb((x - 7) + ',' + (ny + 9) + ' ' + x + ',' + (ny + 2) + ' ' + (x + 7) + ',' + (ny + 9));
    s += o.legs || limb((x - 5) + ',' + (hy + 13) + ' ' + x + ',' + (hy + 1) + ' ' + (x + 5) + ',' + (hy + 13));
    return s;
  }
  window.PICTO = {
    /* Frankfurt's departures sign: the aircraft climbing at 45° */
    depart: function () {
      return '<g transform="rotate(-45 24 24)">' +
        '<path ' + W + ' d="M22 6 h4 l1.5 12 L42 26 v4 l-14.5 -4.5 L26.5 36 l5 4 v3 L24 41 l-7.5 2 v-3 l5 -4 L20.5 25.5 L6 30 v-4 l14.5 -8 z"/></g>' +
        box(6, 42, 36, 2.6);
    },
    /* Model Congress: a chamber of seats around a well */
    chamber: function () {
      var s = '';
      [[8, 30], [16, 22], [24, 19], [32, 22], [40, 30]].forEach(function (p) { s += head(p[0], p[1] - 8, 3.4) + box(p[0] - 3.4, p[1] - 3, 6.8, 6); });
      s += '<path ' + W + ' d="M4 36 h40 v4 H4z"/>';
      return s;
    },
    /* the newspaper: a folded front page, masthead bar and columns */
    paper: function () {
      return '<path ' + W + ' d="M8 8 h32 v32 H8z M11 12 v4 h26 v-4z M11 19 v18 h7 V19z M20.5 19 v18 h7 V19z M30 19 v18 h7 V19z" fill-rule="evenodd"/>';
    },
    /* a research tour: a walker with a book */
    tour: function () {
      var x = 20, y = 8;
      return head(x, y) +
        limb(x + ',' + (y + 7) + ' ' + (x - 2) + ',' + (y + 20), 6.4) +
        limb((x - 9) + ',' + (y + 16) + ' ' + (x - 1) + ',' + (y + 9) + ' ' + (x + 7) + ',' + (y + 14)) +
        box(x + 6, y + 10, 9, 11) +
        limb((x - 10) + ',' + (y + 34) + ' ' + (x - 2) + ',' + (y + 21) + ' ' + (x + 6) + ',' + (y + 34));
    },
    /* sustainability: the sun over water */
    sun: function () {
      var s = '<path ' + W + ' d="M13 26 a11 11 0 0 1 22 0z"/>';
      [[24, 6, 24, 11], [9, 12, 12.5, 15.5], [39, 12, 35.5, 15.5], [4, 26, 8, 26], [44, 26, 40, 26]].forEach(function (l) { s += limb(l[0] + ',' + l[1] + ' ' + l[2] + ',' + l[3], 3.6); });
      s += limb('4,34 10,30 16,34 22,30 28,34 34,30 40,34 44,31.5', 3.6) + limb('4,42 10,38 16,42 22,38 28,42 34,38 40,42 44,39.5', 3.6);
      return s;
    },
    /* Europe: the continent is too big for a pin, so a ring of stars */
    ring: function () {
      var s = '';
      for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2, x = 24 + 15 * Math.sin(a), y = 24 - 15 * Math.cos(a); s += '<rect ' + W + ' x="' + (x - 2.4).toFixed(2) + '" y="' + (y - 2.4).toFixed(2) + '" width="4.8" height="4.8" transform="rotate(45 ' + x.toFixed(2) + ' ' + y.toFixed(2) + ')"/>'; }
      return s;
    },
    /* First-Year Outdoor Program: a tent, 45° roof */
    tent: function () {
      return '<path ' + W + ' d="M24 8 L44 40 H4z M24 22 L17 40 H31z" fill-rule="evenodd"/>' + box(2, 40, 44, 3);
    },
    /* Honor Council: the raised hand of an oath */
    oath: function () {
      return figure(22, 8, { arms: limb('15,24 22,17') + limb('22,17 30,17 30,4') }) ;
    },
    /* SPARK: a four-point spark, 0/45/90 */
    spark: function () {
      return '<path ' + W + ' d="M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20z"/>' +
        '<path ' + W + ' d="M36 8 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z"/>';
    },
    /* Fong public service: a figure carrying a box */
    carry: function () {
      return figure(18, 8, { arms: limb('18,17 26,21 18,25') }) + box(25, 16, 14, 12);
    },
    /* Radcliffe mentoring: a tall figure and a younger one */
    mentor: function () {
      return figure(15, 7) + head(34, 17, 3.6) + limb('34,23 34,33', 5.4) + limb('29,30 34,25 39,30', 4.4) + limb('30,42 34,34 38,42', 4.4) + limb('22,18 29,27', 4.6);
    },
    /* China Forum: two delegations across a table */
    table: function () {
      return head(10, 12) + limb('10,19 10,30', 6.2) + limb('10,23 18,27', 5) +
             head(38, 12) + limb('38,19 38,30', 6.2) + limb('38,23 30,27', 5) +
             box(4, 30, 40, 4) + box(8, 34, 3.5, 10) + box(36.5, 34, 3.5, 10);
    },
    /* Model UN: flags on three poles */
    flags: function () {
      var s = '';
      [8, 21, 34].forEach(function (x, i) { var y = 6 + (i === 1 ? 0 : 4); s += box(x, y, 2.6, 44 - y - 2) + box(x + 2.6, y, 9, 7); });
      return s + box(4, 41, 40, 3);
    },
    /* Leadership Institute: a speaker on a stage, arm raised at 45° */
    stage: function () {
      return figure(22, 6, { arms: limb('14,21 22,14 30,6'), legs: limb('17,38 22,27 27,38') }) + box(4, 38, 40, 4) + box(8, 42, 3, 4) + box(37, 42, 3, 4);
    },
    /* Harvard College: an open book */
    book: function () {
      return '<path ' + W + ' d="M4 12 L22 16 V40 L4 36z M44 12 L26 16 V40 L44 36z"/>';
    },
    /* the direction arrow of a sign, in its own square (Vignelli) */
    arrow: function (deg) {
      return '<g transform="rotate(' + (deg || 0) + ' 24 24)"><path ' + W + ' d="M8 21.5 H30 L20 11.5 L23.5 8 L39.5 24 L23.5 40 L20 36.5 L30 26.5 H8z"/></g>';
    }
  };
  window.pictoSVG = function (name, cls, label, arg) {
    return '<svg class="' + (cls || 'pic') + '" viewBox="0 0 48 48" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + '>' + window.PICTO[name](arg) + '</svg>';
  };
})();
