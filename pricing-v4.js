/* Pricing page: the Texts + Calls / Texts only toggle.
   All five plans are in the HTML, so the prices are readable without
   running any script. This only shows and hides them; it never builds
   a card, which is why $49 and $99 survive in the page source. */
(function () {
  'use strict';
  var d = document;
  var buttons = d.querySelectorAll('[data-mode]');
  if (!buttons.length) return;

  var NOTE = {};
  var dataEl = d.getElementById('pricing-data');
  if (dataEl) { try { NOTE = (JSON.parse(dataEl.textContent) || {}).note || {}; } catch (e) {} }

  var grid = d.querySelector('[data-grid]');
  var note = d.querySelector('[data-mode-note]');
  var voiceOnly = d.querySelectorAll('[data-voice-only]');

  var ACT = { bg: '#fff', fg: '#172030', sh: '0 2px 8px -2px rgba(23,32,48,.18)' };
  var IDLE = { bg: 'transparent', fg: '#475569', sh: 'none' };

  function render(mode) {
    var shown = 0;
    d.querySelectorAll('[data-plan-mode]').forEach(function (card) {
      var on = card.getAttribute('data-plan-mode') === mode;
      card.style.display = on ? 'flex' : 'none';
      if (on) shown++;
    });
    if (grid) {
      grid.style.gridTemplateColumns = 'repeat(' + shown + ',minmax(0,1fr))';
      grid.style.maxWidth = shown > 2 ? 'none' : '800px';
    }
    if (note && NOTE[mode]) note.textContent = NOTE[mode];
    voiceOnly.forEach(function (v) { v.style.display = mode === 'voice' ? '' : 'none'; });
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-mode') === mode;
      var s = on ? ACT : IDLE;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = s.bg;
      b.style.color = s.fg;
      b.style.boxShadow = s.sh;
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { render(b.getAttribute('data-mode')); });
  });
})();
