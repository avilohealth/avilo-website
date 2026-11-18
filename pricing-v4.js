/* Pricing page: the Texts + Calls / Texts only toggle swaps the cards.
   Texts + Calls has three plans, Texts only has two, so the third card and
   the grid columns change with the mode. The page ships rendered in the
   Texts + Calls state, so it is complete without JS; this only swaps. */
(function () {
  'use strict';
  var el = document.getElementById('pricing-data');
  if (!el) return;
  var DATA;
  try { DATA = JSON.parse(el.textContent); } catch (e) { return; }

  var CHECK = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function rowHtml(r) {
    return '<li style="display:flex;gap:10px;line-height:1.45;color:' + r.fg + '">' +
      '<span style="width:18px;height:18px;border-radius:50%;background:' + r.dot +
      ';color:#fff;display:flex;align-items:center;justify-content:center;flex:0 0 auto;margin-top:2px">' +
      CHECK + '</span><span>' + esc(r.t) + '</span></li>';
  }

  var buttons = document.querySelectorAll('[data-mode]');
  var note = document.querySelector('[data-mode-note]');
  var voiceOnly = document.querySelectorAll('[data-voice-only]');

  var ACT = { bg: '#fff', fg: '#172030', sh: '0 2px 8px -2px rgba(23,32,48,.18)' };
  var IDLE = { bg: 'transparent', fg: '#475569', sh: 'none' };

  var grid = document.querySelector('[data-grid]');
  var card3 = document.querySelector('[data-card="3"]');

  function render(mode) {
    var plans = DATA[mode];
    if (grid) {
      grid.style.gridTemplateColumns = 'repeat(' + plans.length + ',minmax(0,1fr))';
      grid.style.maxWidth = plans.length > 2 ? 'none' : '800px';
    }
    if (card3) card3.style.display = plans.length > 2 ? 'flex' : 'none';
    plans.forEach(function (p, i) {
      var n = i + 1;
      ['name', 'tag', 'price', 'over'].forEach(function (k) {
        var t = document.querySelector('[data-p="' + n + '-' + k + '"]');
        if (t) t.textContent = p[k];
      });
      var ul = document.querySelector('[data-rows="' + n + '"]');
      if (ul) ul.innerHTML = p.rows.map(rowHtml).join('');
    });
    if (note) note.textContent = DATA.note[mode];
    voiceOnly.forEach(function (v) { v.style.display = mode === 'voice' ? '' : 'none'; });
    buttons.forEach(function (b) {
      var on = b.dataset.mode === mode;
      var s = on ? ACT : IDLE;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = s.bg;
      b.style.color = s.fg;
      b.style.boxShadow = s.sh;
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { render(b.dataset.mode); });
  });
})();
