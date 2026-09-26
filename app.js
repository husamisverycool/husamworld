/* app.js — lenses, the panel, command menu, previews, sound and small delights. */
(function () {
  'use strict';

  var html = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  // Nothing is remembered between visits: every open is a first visit.
  var store = { get: function () { return null; }, set: function () {} };
  function pad(n) { return String(n).padStart(2, '0'); }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  // ------------------------------------------------------------------
  // Sound: synthesized, off by default (Josh Comeau taught us restraint)
  // ------------------------------------------------------------------
  var Sound = (function () {
    var ctx = null, on = store.get('hw:sound') === '1';
    function ensure() {
      if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(freq, dur, type, vol, delay) {
      if (!on) return;
      var c = ensure(); if (!c) return;
      var t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.04, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
    }
    return {
      get on() { return on; },
      set: function (v) { on = v; store.set('hw:sound', v ? '1' : '0'); if (v) ensure(); },
      hover: function () { tone(880, 0.06, 'sine', 0.02); },
      step: function (n) { tone(n % 2 ? 200 : 170, 0.05, 'triangle', 0.025); },
      open: function () { tone(523.25, 0.2, 'sine', 0.045); tone(783.99, 0.32, 'sine', 0.04, 0.08); },
      close: function () { tone(659.25, 0.12, 'sine', 0.03); tone(440, 0.2, 'sine', 0.025, 0.06); },
      tick: function () { tone(1320, 0.03, 'triangle', 0.018); },
      chord: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, 0.5, 'sine', 0.03, i * 0.07); }); }
    };
  })();
  var soundBtn = $('#soundBtn');
  function syncSound() { soundBtn.setAttribute('aria-pressed', Sound.on); soundBtn.title = 'Sound (' + (Sound.on ? 'on' : 'off') + ')'; }
  soundBtn.addEventListener('click', function () { Sound.set(!Sound.on); syncSound(); if (Sound.on) Sound.chord(); toast(Sound.on ? 'Sound on' : 'Sound off'); });
  syncSound();

  // ------------------------------------------------------------------
  // Sections (the single source of truth)
  // ------------------------------------------------------------------
  var sections = $$('#reader > [data-building]').map(function (s, i) {
    return { id: s.id, section: s, n: i + 1, place: s.dataset.place, kicker: s.dataset.kicker };
  });
  function sectionById(id) { for (var k = 0; k < sections.length; k++) if (sections[k].id === id) return sections[k]; return null; }

  // ------------------------------------------------------------------
  // Lenses: island ⇄ reader
  // ------------------------------------------------------------------
  var world = $('#world');
  function lens() { return html.dataset.lens; }
  function setLens(l, remember) {
    if (l === lens() && !(l === 'world' && !World.built)) { syncLens(); return; }
    if (l === 'reader') closePanel(true);
    html.dataset.lens = l;
    if (remember !== false) store.set('hw:lens', l);
    syncLens();
    if (l === 'world') { World.init(); updateTimeUI(); }
    else window.scrollTo(0, 0);
  }
  function syncLens() {
    $$('[data-lens-set]').forEach(function (b) { if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', b.dataset.lensSet === lens()); });
    world.setAttribute('aria-hidden', lens() !== 'world');
  }
  $$('[data-lens-set]').forEach(function (b) {
    b.addEventListener('click', function () { Sound.tick(); setLens(b.dataset.lensSet); });
  });

  // ------------------------------------------------------------------
  // The panel (island mode): sections move in, and back out again
  // ------------------------------------------------------------------
  var panel = $('#panel'), pbody = $('.panel-body', panel), current = null, slot = null;

  function freeRect() {
    var W = innerWidth, H = innerHeight, rem = 16;
    if (W <= 800) { var top = H - 0.5 * rem - 0.64 * H; return { x: 0, y: 60, w: W, h: Math.max(80, top - 60) }; }
    var left = W - 0.9 * rem - Math.min(560, 0.46 * W);
    return { x: 0, y: 60, w: left, h: H - 60 };
  }
  function returnSection() {
    if (current && slot) {
      slot.parentNode.insertBefore(current.section, slot);
      slot.remove();
      current.section.classList.remove('enter');
    }
    current = null; slot = null;
  }
  function openSection(id, targetId) {
    var s = sectionById(id);
    if (!s) return;
    if (!current || current.id !== id) {
      returnSection();
      current = s;
      slot = document.createComment('slot:' + id);
      s.section.parentNode.insertBefore(slot, s.section);
      pbody.appendChild(s.section);
      s.section.classList.remove('enter'); void s.section.offsetWidth;
      if (!reduce) s.section.classList.add('enter');
      $('#panelNum').textContent = pad(s.n);
      $('#panelKicker').textContent = s.kicker;
      $('#panelPlace').textContent = s.place;
      pbody.scrollTop = 0;
      Sound.open();
    }
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    history.replaceState(null, '', '#' + (targetId || id));
    World.focus(id, freeRect());
    if (targetId && targetId !== id) {
      var t = document.getElementById(targetId);
      if (t) setTimeout(function () { t.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); flash(t); }, 250);
    } else {
      pbody.focus({ preventScroll: true });
    }
  }
  function closePanel(silent) {
    if (!current && !panel.classList.contains('open')) return;
    returnSection();
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (World.built) World.focus(null);
    if (!silent) { Sound.close(); history.replaceState(null, '', location.pathname + location.search); }
  }
  function visit(id, targetId) {
    if (!World.built) World.init();
    if (current && current.id === id) { openSection(id, targetId); return; }
    if (current) World.focus(id, freeRect());
    World.walkTo(id, function () { openSection(id, targetId); });
  }
  function neighbour(step) {
    if (!current) return;
    var i = sections.indexOf(current);
    visit(sections[(i + step + sections.length) % sections.length].id);
  }
  $('#panelClose').addEventListener('click', function () { closePanel(); });
  $('#panelPrev').addEventListener('click', function () { neighbour(-1); });
  $('#panelNext').addEventListener('click', function () { neighbour(1); });
  window.addEventListener('resize', function () { if (current) World.focus(current.id, freeRect()); });

  World.on('select', function (id) { visit(id); });
  World.on('hover', function () { Sound.hover(); });
  World.on('step', function (n) { Sound.step(n); });

  // ------------------------------------------------------------------
  // Navigation: every in-page link works in both lenses
  // ------------------------------------------------------------------
  function flash(el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  function go(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    var sec = el.closest('[data-building]');
    if (lens() === 'world') {
      if (sec) { visit(sec.id, el === sec ? null : id); return true; }
      setLens('reader');
    }
    history.replaceState(null, '', '#' + id);
    requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: el === sec || el.tagName === 'FOOTER' ? 'start' : 'center' });
      if (el !== sec) flash(el);
    });
    return true;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var href = a.getAttribute('href');
    if (href === '#') { e.preventDefault(); toast('Placeholder link: add the real URL in index.html'); return; }
    if (href.slice(1) && document.getElementById(href.slice(1))) {
      e.preventDefault(); hidePreview(); go(href.slice(1));
    }
  });

  // ------------------------------------------------------------------
  // Time of day
  // ------------------------------------------------------------------
  var timePill = $('#timePill'), timePop = $('#timePop'), timeRange = $('#timeRange');
  function fmt(h) {
    var d = new Date(); d.setHours(Math.floor(h), Math.floor((h % 1) * 60), 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  function updateTimeUI() {
    var h = World.getTime();
    $('#timeLabel').textContent = fmt(h);
    $('#phaseName').textContent = World.phaseName(h) + (World.isLive() ? '' : ' (not live)');
    timeRange.value = h;
    timePill.title = 'On the island it\'s ' + fmt(h) + (World.isLive() ? ' (your local time)' : '');
  }
  World.on('time', updateTimeUI);
  function setTime(h) {
    World.setTime(h);
    updateTimeUI();
  }
  timePill.addEventListener('click', function () {
    var open = timePop.hidden;
    timePop.hidden = !open; timePill.setAttribute('aria-expanded', open);
    Sound.tick();
  });
  timeRange.addEventListener('input', function () { setTime(parseFloat(timeRange.value)); });
  $$('[data-time]', timePop).forEach(function (b) {
    b.addEventListener('click', function () { Sound.tick(); setTime(b.dataset.time === 'now' ? null : parseFloat(b.dataset.time)); });
  });
  document.addEventListener('pointerdown', function (e) {
    if (!timePop.hidden && !timePop.contains(e.target) && !timePill.contains(e.target)) { timePop.hidden = true; timePill.setAttribute('aria-expanded', false); }
  });

  // ------------------------------------------------------------------
  // Command menu (⌘K)
  // ------------------------------------------------------------------
  var pal = $('#palette'), palInput = $('#palInput'), palList = $('#palList'), palItems = [], palShown = [], palIdx = 0, palReturn = null;
  function titleOf(el) {
    var h = el.querySelector('h3, h2, .t');
    return (h ? h.textContent : el.textContent).trim().replace(/\s+/g, ' ');
  }
  function buildPalette() {
    var items = [];
    sections.forEach(function (s) {
      items.push({ g: 'Places', ic: pad(s.n), label: s.place, sub: s.kicker.toLowerCase(), run: function () { go(s.id); } });
    });
    $$('[data-cmd]').forEach(function (el) {
      var sec = el.closest('[data-building]');
      items.push({ g: 'On the island', ic: '↳', label: titleOf(el), sub: sec ? sec.dataset.kicker.toLowerCase() : '', run: function () { go(el.id); } });
    });
    var w = lens() === 'world';
    items.push({ g: 'Do', ic: w ? '¶' : '◆', label: w ? 'Just read (text version)' : 'Explore the island', run: function () { setLens(w ? 'reader' : 'world'); } });
    if (w) {
      [['Dawn', 6.6], ['Noon', 12], ['Golden hour', 17.8], ['Dusk', 19.2], ['Midnight', 0]].forEach(function (t) {
        items.push({ g: 'Do', ic: '◐', label: 'Set the time: ' + t[0].toLowerCase(), run: function () { setTime(t[1]); } });
      });
      items.push({ g: 'Do', ic: '◷', label: 'Follow my clock', sub: 'live', run: function () { setTime(null); } });
    }
    items.push({ g: 'Do', ic: '♪', label: Sound.on ? 'Turn sound off' : 'Turn sound on', run: function () { soundBtn.click(); } });
    items.push({ g: 'Do', ic: '@', label: 'Copy email address', run: copyEmail });
    items.push({ g: 'Do', ic: '⎙', label: 'Print / save as PDF', sub: 'résumé-style', run: function () { setTimeout(function () { window.print(); }, 50); } });
    items.push({ g: 'Do', ic: '✎', label: 'Colophon', sub: 'how this was made', run: function () { go('colophon'); } });
    palItems = items;
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function score(q, text) {
    var t = text.toLowerCase(), i = t.indexOf(q);
    if (i === 0) return 300;
    if (i > 0) return 200 - i - (t[i - 1] === ' ' ? 0 : 50);
    var k = 0;
    for (var c = 0; c < t.length && k < q.length; c++) if (t[c] === q[k]) k++;
    return k === q.length ? 20 : -1;
  }
  function renderPalette() {
    var q = palInput.value.trim().toLowerCase(), out = '', lastG = null;
    if (q) {
      palShown = palItems.map(function (it) { return { it: it, s: Math.max(score(q, it.label), score(q, it.sub || '') - 30) }; })
        .filter(function (x) { return x.s >= 0; }).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.it; });
    } else palShown = palItems.slice();
    palIdx = Math.min(palIdx, Math.max(0, palShown.length - 1));
    palShown.forEach(function (it, i) {
      if (!q && it.g !== lastG) { out += '<li class="grp" role="presentation">' + it.g + '</li>'; lastG = it.g; }
      var label = esc(it.label);
      if (q) { var at = it.label.toLowerCase().indexOf(q); if (at >= 0) label = esc(it.label.slice(0, at)) + '<mark>' + esc(it.label.slice(at, at + q.length)) + '</mark>' + esc(it.label.slice(at + q.length)); }
      out += '<li role="option" id="pal-' + i + '" data-i="' + i + '" aria-selected="' + (i === palIdx) + '"><span class="ic">' + esc(it.ic) + '</span><span>' + label + '</span>' + (it.sub ? '<span class="sub">' + esc(it.sub) + '</span>' : '') + '</li>';
    });
    if (!palShown.length) out = '<li class="empty">Nothing here. Try "work", "night" or "garden".</li>';
    palList.innerHTML = out;
    palInput.setAttribute('aria-activedescendant', palShown.length ? 'pal-' + palIdx : '');
    var sel = palList.querySelector('[aria-selected="true"]');
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  function openPalette() {
    palReturn = document.activeElement;
    buildPalette(); palInput.value = ''; palIdx = 0; renderPalette();
    pal.hidden = false; palInput.focus(); Sound.tick();
  }
  function closePalette() { pal.hidden = true; if (palReturn && palReturn.focus) palReturn.focus({ preventScroll: true }); }
  function runPalette(i) { var it = palShown[i]; if (!it) return; closePalette(); it.run(); }
  palInput.addEventListener('input', function () { palIdx = 0; renderPalette(); });
  palInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); palIdx = (palIdx + 1) % Math.max(1, palShown.length); renderPalette(); Sound.tick(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); palIdx = (palIdx - 1 + palShown.length) % Math.max(1, palShown.length); renderPalette(); Sound.tick(); }
    else if (e.key === 'Enter') { e.preventDefault(); runPalette(palIdx); }
  });
  palList.addEventListener('click', function (e) { var li = e.target.closest('[data-i]'); if (li) runPalette(+li.dataset.i); });
  palList.addEventListener('pointermove', function (e) {
    var li = e.target.closest('[data-i]'); if (!li || +li.dataset.i === palIdx) return;
    palIdx = +li.dataset.i; $$('[aria-selected]', palList).forEach(function (x) { x.setAttribute('aria-selected', x === li); });
  });
  pal.addEventListener('pointerdown', function (e) { if (e.target === pal) closePalette(); });
  $('#cmdBtn').addEventListener('click', openPalette);
  if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $('#cmdBtn kbd').textContent = 'Ctrl K';

  // ------------------------------------------------------------------
  // Keyboard
  // ------------------------------------------------------------------
  var typed = '';
  var EGGS = {
    husam: function () { if (lens() === 'world') World.say('that\'s me 👋', 3000); else toast('hi, it\'s me 👋'); Sound.chord(); },
    hello: function () { if (lens() === 'world') World.say('hi! welcome to the island', 3000); else toast('hello to you too'); },
    night: function () { timeEgg(23); }, dawn: function () { timeEgg(6.6); },
    noon: function () { timeEgg(12); }, dusk: function () { timeEgg(19.2); }
  };
  function timeEgg(h) { if (lens() !== 'world') setLens('world'); setTime(h); toast('It\'s ' + World.phaseName(h) + ' on the island'); }
  document.addEventListener('keydown', function (e) {
    var inField = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || '')) || e.target.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); return; }
    if (e.key === 'Escape') {
      if (!pal.hidden) closePalette();
      else if (!timePop.hidden) { timePop.hidden = true; timePill.setAttribute('aria-expanded', false); }
      else if (current) closePanel();
      return;
    }
    if (inField || e.metaKey || e.ctrlKey || e.altKey || !pal.hidden) return;
    if (e.key === '/') { e.preventDefault(); openPalette(); return; }
    if (lens() === 'world') {
      if (/^[1-9]$/.test(e.key) && sections[+e.key - 1]) { visit(sections[+e.key - 1].id); return; }
      if (current && e.key === 'ArrowRight') { neighbour(1); return; }
      if (current && e.key === 'ArrowLeft') { neighbour(-1); return; }
    }
    if (/^[a-z]$/i.test(e.key)) {
      typed = (typed + e.key.toLowerCase()).slice(-12);
      for (var w in EGGS) if (typed.slice(-w.length) === w) { typed = ''; EGGS[w](); break; }
    }
  });

  // ------------------------------------------------------------------
  // Hover previews for in-site links (à la gwern.net)
  // ------------------------------------------------------------------
  var preview = $('#preview'), pvTimer, pvFor = null;
  function hidePreview() { clearTimeout(pvTimer); preview.hidden = true; pvFor = null; }
  if (matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointerover', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a === pvFor) return;
      var id = a.getAttribute('href').slice(1), t = id && document.getElementById(id);
      if (!t || t.contains(a) || a.closest('.topbar')) return;
      pvFor = a;
      clearTimeout(pvTimer);
      pvTimer = setTimeout(function () { showPreview(a, t); }, 220);
    });
    document.addEventListener('pointerout', function (e) {
      if (pvFor && !pvFor.contains(e.relatedTarget)) hidePreview();
    });
  }
  function showPreview(a, t) {
    var sec = t.closest('[data-building]') || t;
    var kick = sec.dataset && sec.dataset.kicker ? sec.dataset.kicker : 'On this site';
    var stage = t.dataset && t.dataset.stage ? ' · ' + t.dataset.stage : '';
    var p = t.querySelector('p:not(.meta):not(.kicker):not(.links):not(.backlinks), .sec-intro');
    var time = t.querySelector('time');
    var body = p ? p.textContent.trim().replace(/\s+/g, ' ') : time ? time.textContent : '';
    if (body.length > 200) body = body.slice(0, 197).replace(/\s\S*$/, '') + '…';
    preview.innerHTML = '<p class="pv-k">' + esc(kick + stage) + '</p><p class="pv-t">' + esc(titleOf(t)) + '</p>' + (body ? '<p class="pv-p">' + esc(body) + '</p>' : '');
    preview.hidden = false;
    var r = a.getBoundingClientRect(), pw = preview.offsetWidth, ph = preview.offsetHeight;
    var x = Math.min(Math.max(12, r.left + r.width / 2 - pw / 2), innerWidth - pw - 12);
    var y = r.bottom + 10; if (y + ph > innerHeight - 12) y = r.top - ph - 10;
    preview.style.left = x + 'px'; preview.style.top = y + 'px';
  }

  // ------------------------------------------------------------------
  // Garden backlinks, generated automatically
  // ------------------------------------------------------------------
  $$('.note[id]').forEach(function (note) {
    var from = [];
    $$('a[href="#' + note.id + '"]').forEach(function (a) {
      var src = a.closest('article[id], li[id], section[id]');
      if (!src || src === note || note.contains(a) || from.indexOf(src) >= 0) return;
      from.push(src);
    });
    if (!from.length) return;
    var p = document.createElement('p');
    p.className = 'backlinks';
    p.innerHTML = 'Linked from ' + from.map(function (s) { return '<a href="#' + s.id + '">' + esc(titleOf(s)) + '</a>'; }).join(', ');
    note.appendChild(p);
  });

  // ------------------------------------------------------------------
  // Generative project covers (until real images arrive)
  // ------------------------------------------------------------------
  $$('.thumb[data-seed]').forEach(function (t) {
    var h = hashStr(t.dataset.seed);
    t.style.setProperty('--h1', h % 360);
    t.style.setProperty('--h2', (h >>> 9) % 360);
    t.style.setProperty('--a', ((h >>> 18) % 360) + 'deg');
  });

  // ------------------------------------------------------------------
  // "Husam is …" rotator
  // ------------------------------------------------------------------
  var rot = $$('.rotator > span'), ri = 0;
  if (rot.length) {
    rot[0].classList.add('on');
    if (!reduce && rot.length > 1) setInterval(function () {
      if (document.hidden) return;
      var prev = rot[ri]; ri = (ri + 1) % rot.length;
      prev.classList.remove('on'); prev.classList.add('off');
      rot[ri].classList.remove('off'); rot[ri].classList.add('on');
      setTimeout(function () { prev.classList.remove('off'); }, 650);
    }, 2800);
  }

  // ------------------------------------------------------------------
  // Postcard + email
  // ------------------------------------------------------------------
  var card = $('#postcard'), email = card ? card.dataset.email : '';
  function copyEmail() {
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(function () { toast('Copied ' + email); }, function () { toast(email); });
    else toast(email);
  }
  if (card) {
    card.addEventListener('submit', function (e) {
      e.preventDefault();
      var from = card.from.value.trim();
      var subject = 'A postcard' + (from ? ' from ' + from : '') + ' (via husam.world)';
      var body = card.msg.value + (from ? '\n\n— ' + from : '');
      location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      Sound.chord();
      toast('Opening your mail app…');
    });
    $('#copyEmail').addEventListener('click', copyEmail);
  }

  // ------------------------------------------------------------------
  // Small facts
  // ------------------------------------------------------------------
  $('#year').textContent = new Date().getFullYear();
  var nu = $('#nowUpdated');
  if (nu) {
    var days = Math.floor((Date.now() - new Date(nu.getAttribute('datetime')).getTime()) / 864e5);
    if (days >= 0) nu.textContent += days === 0 ? ' (today)' : days === 1 ? ' (yesterday)' : ' (' + days + ' days ago)';
  }

  // ------------------------------------------------------------------
  // Greeting, then start
  // ------------------------------------------------------------------
  function start() {
    syncLens();
    var id = location.hash.slice(1);
    if (lens() === 'world') {
      World.init();
      updateTimeUI();
      if (id && document.getElementById(id)) go(id);
      else if (!store.get('hw:met')) setTimeout(function () { World.say('hi, I\'m Husam 👋 click a building!', 4200); store.set('hw:met', '1'); }, 500);
    } else if (id && document.getElementById(id)) {
      go(id);
    }
  }
  var hello = $('#hello'), seen = false;
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  if (reduce || seen || location.hash) { start(); return; }
  var words = ['hello', 'hola', 'مرحبا', 'bonjour', 'ciao', 'こんにちは', 'olá', 'husam.world'], wi = 0, done = false;
  var span = hello.querySelector('span');
  hello.classList.add('on');
  // build the island underneath while the greeting plays
  if (lens() === 'world') World.init();
  function finish() {
    if (done) return; done = true;
    hello.classList.add('out');
    setTimeout(function () { hello.classList.remove('on', 'out'); }, 550);
    start();
  }
  (function next() {
    if (done) return;
    span.textContent = words[wi];
    span.dir = /[؀-ۿ]/.test(words[wi]) ? 'rtl' : 'ltr';
    wi++;
    if (wi < words.length) setTimeout(next, wi === 1 ? 380 : 170);
    else setTimeout(finish, 520);
  })();
  hello.addEventListener('click', finish);
  document.addEventListener('keydown', function once() { document.removeEventListener('keydown', once); finish(); });
})();
