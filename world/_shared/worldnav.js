/* husam.world — shared "back to the world" button + district switcher.
   Injected into every district page. Lives in a shadow root so it never
   inherits or leaks styles, whatever the page looks like. */
(function () {
  if (customElements.get('husam-world-nav')) return;
  var DISTRICTS = [
    ['bill', 'The Capitol', 'Advocacy & legislation'],
    ['speech', 'The Chamber', 'Debate & speech'],
    ['translation', 'The Bridge', 'Arabic ↔ English'],
    ['n1', 'The Polling Station', 'Research & data'],
    ['triptik', 'The Map Room', 'Fresno → Cambridge'],
    ['os', 'The Garage', 'Things he built'],
    ['depths', 'The Pier', 'Honors, by rarity'],
    ['weeks', 'The Plaza', 'Every week since 2015'],
    ['everywhere', 'The Airport', 'Harvard & travel']
  ];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  class WorldNav extends HTMLElement {
    connectedCallback() {
      var here = this.getAttribute('current') || '';
      var root = this.attachShadow({ mode: 'open' });
      var items = DISTRICTS.map(function (d) {
        return '<li><a href="' + d[0] + '.html"' + (d[0] === here ? ' aria-current="page"' : '') + '><b>' + d[1] + '</b><span>' + d[2] + '</span></a></li>';
      }).join('');
      root.innerHTML =
        '<style>' +
        ':host{all:initial;position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147483000;font:500 14px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;color:#f4f3ef}' +
        '.orb{width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:#15161a;color:#f4f3ef;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 20px -6px rgba(0,0,0,.55),0 0 0 3px rgba(255,255,255,.55);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}' +
        '.orb:hover{transform:scale(1.08) rotate(-8deg)}.orb:active{transform:scale(.94)}' +
        '.orb:focus-visible,a:focus-visible,.back:focus-visible{outline:2px solid #6aa0ff;outline-offset:3px}' +
        '.orb svg{width:26px;height:26px}.orb .spin{transform-origin:12px 12px;animation:spin 14s linear infinite}' +
        '@keyframes spin{to{transform:rotate(360deg)}}' +
        '.tip{position:absolute;left:58px;bottom:12px;white-space:nowrap;background:#15161a;color:#f4f3ef;padding:5px 10px;border-radius:999px;font-size:12px;letter-spacing:.02em;opacity:0;transform:translateX(-6px);pointer-events:none;transition:opacity .2s,transform .25s}' +
        '.orb:hover+.tip,.orb:focus-visible+.tip{opacity:1;transform:none}.orb[aria-expanded=true]+.tip{opacity:0!important}' +
        '.panel{position:absolute;left:0;bottom:60px;width:min(300px,calc(100vw - 24px));max-height:min(72vh,560px);overflow:auto;background:#15161a;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:8px;box-shadow:0 30px 60px -20px rgba(0,0,0,.6);transform-origin:bottom left;animation:pop .28s cubic-bezier(.34,1.4,.64,1)}' +
        '.panel[hidden]{display:none}@keyframes pop{from{opacity:0;transform:scale(.9) translateY(8px)}}' +
        '.back{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:10px;width:100%;padding:12px;border:0;border-radius:10px;background:#f4f3ef;color:#15161a;font:600 14px/1 inherit;cursor:pointer;text-decoration:none;box-sizing:border-box}' +
        '.back:hover{background:#fff}' +
        '.lbl{margin:12px 10px 6px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,243,239,.5)}' +
        'ul{list-style:none;margin:0;padding:0}' +
        'a{display:flex;flex-direction:column;gap:1px;padding:7px 10px;border-radius:9px;color:#f4f3ef;text-decoration:none}' +
        'a:hover{background:rgba(255,255,255,.08)}a b{font-weight:600}a span{font-size:12px;color:rgba(244,243,239,.6)}' +
        'a[aria-current]{background:rgba(255,255,255,.1)}a[aria-current] b::after{content:"  • you are here";font-weight:400;font-size:11px;color:#8fb4ff}' +
        '.wipe{position:fixed;inset:0;background:#15161a;clip-path:circle(0 at 36px calc(100% - 36px));pointer-events:none;transition:clip-path .55s cubic-bezier(.7,0,.3,1)}' +
        '.wipe.go{clip-path:circle(150vmax at 36px calc(100% - 36px))}' +
        '@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}' +
        '</style>' +
        '<button class="orb" type="button" aria-expanded="false" aria-controls="p" aria-label="husam.world: back to the world, or jump to another district">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><g class="spin"><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3.5 9h17M3.5 15h17"/></g></svg></button>' +
        '<span class="tip">husam.world</span>' +
        '<div class="panel" id="p" role="dialog" aria-label="Districts" hidden>' +
        '<a class="back" href="index.html#from-' + here + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>Back to the world</a>' +
        '<p class="lbl">Other districts</p><ul>' + items + '</ul></div>' +
        '<div class="wipe" aria-hidden="true"></div>';
      var orb = root.querySelector('.orb'), panel = root.querySelector('.panel'), wipe = root.querySelector('.wipe');
      function toggle(open) {
        open = open === undefined ? panel.hidden : open;
        panel.hidden = !open; orb.setAttribute('aria-expanded', open);
        if (open) (root.querySelector('.back')).focus({ preventScroll: true });
      }
      orb.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
      document.addEventListener('click', function (e) { if (!panel.hidden && !e.composedPath().includes(this)) toggle(false); }.bind(this));
      root.addEventListener('keydown', function (e) { if (e.key === 'Escape') { toggle(false); orb.focus(); e.stopPropagation(); } });
      root.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || reduce) return;
          e.preventDefault();
          wipe.classList.add('go');
          setTimeout(function () { location.href = a.getAttribute('href'); }, 520);
        });
      });
      // coming back via the browser's back button: undo the wipe
      addEventListener('pageshow', function () { wipe.classList.remove('go'); toggle(false); });
    }
  }
  customElements.define('husam-world-nav', WorldNav);
})();
