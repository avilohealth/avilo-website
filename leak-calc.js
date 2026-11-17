/* The cost-of-a-missed-call calculator on /blog/what-a-missed-call-costs.
   Ported from the design handoff's component. Values persist per browser;
   nothing is sent anywhere. The page renders complete without this file. */
(function () {
  'use strict';
  var d = document;
  var root = d.querySelector('[data-calc-out="total"]');
  if (!root) return;

  var LS = 'avilo-leak-count-v1';
  var KEYS = ['fee', 'npv', 'calls', 'share', 'waited', 'empty', 'noshow'];
  var BLANK = { fee: '', npv: '', calls: '', share: '33', waited: '', empty: '', noshow: '' };
  var v = {}, done = [false, false, false];

  for (var i = 0; i < KEYS.length; i++) v[KEYS[i]] = BLANK[KEYS[i]];

  function money(x) { return '$' + Math.round(x).toLocaleString('en-AU'); }
  function num(k) { var n = parseFloat(v[k]); return n > 0 ? n : 0; }
  function out(k) { return d.querySelector('[data-calc-out="' + k + '"]'); }
  function set(k, text) { var el = out(k); if (el) el.textContent = text; }

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(LS) || 'null');
      if (s && s.v) { for (var k in BLANK) if (typeof s.v[k] === 'string') v[k] = s.v[k]; }
      if (s && s.d && s.d.length === 3) done = s.d.map(Boolean);
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(LS, JSON.stringify({ v: v, d: done })); } catch (e) {}
  }

  function render() {
    var fee = num('fee'), npv = num('npv'), calls = num('calls');
    var share = num('share') / 100, empty = num('empty'), nsh = num('noshow');
    var l = [calls * share * npv, empty * fee, nsh * fee];
    var total = l[0] + l[1] + l[2];
    var max = Math.max(l[0], l[1], l[2], 1);

    set('c1', calls && npv
      ? calls + ' calls × ' + Math.round(share * 100) + '% new × ' + money(npv) + ' = ' + money(l[0])
      : 'Calls × share that were new × new patient value');
    set('c2', empty && fee ? empty + ' empty slots × ' + money(fee) + ' = ' + money(l[1])
                           : 'Empty slots × consult fee');
    set('c3', nsh && fee ? nsh + ' no-shows × ' + money(fee) + ' = ' + money(l[2])
                         : 'Unconfirmed no-shows × consult fee');

    set('total', money(total));
    set('yearly', total ? 'About ' + money(total * 12) + ' a year'
                        : 'Fill in the steps to see your number');
    set('verdict',
      !total ? 'For a typical two-to-four practitioner clinic, this lands somewhere between $2,000 and $6,000 a month.'
      : total < 2000 ? 'Below the usual $2,000 to $6,000 a month. If your number is small, congratulations, close this tab.'
      : total <= 6000 ? 'Right in the usual range of $2,000 to $6,000 a month for a two-to-four practitioner clinic. Not because anyone is bad at their job. The work arrives faster than the desk can absorb it.'
      : 'Above the usual $2,000 to $6,000 a month. Worth an hour this week, not someday.');

    for (var i = 0; i < 3; i++) {
      set('m' + (i + 1), money(l[i]));
      var bar = d.querySelector('[data-calc-w="' + (i + 1) + '"]');
      if (bar) bar.style.width = Math.round(l[i] / max * 100) + '%';
      var sb = d.querySelector('[data-calc-sb="' + (i + 1) + '"]');
      if (sb) sb.style.background = done[i] ? '#0D9488' : '#fff';
      var sf = d.querySelector('[data-calc-sf="' + (i + 1) + '"]');
      if (sf) sf.style.color = done[i] ? '#fff' : '#0B7A70';
    }
    var n = done.filter(Boolean).length;
    set('progress', n + ' of 3 steps done');
  }

  load();

  d.querySelectorAll('[data-calc-in]').forEach(function (el) {
    var k = el.getAttribute('data-calc-in');
    el.value = v[k];
    el.addEventListener('input', function () { v[k] = el.value; save(); render(); });
  });

  d.querySelectorAll('[data-calc-step]').forEach(function (el) {
    var i = parseInt(el.getAttribute('data-calc-step'), 10) - 1;
    el.checked = done[i];
    el.addEventListener('change', function () { done[i] = el.checked; save(); render(); });
  });

  var pr = d.querySelector('[data-calc-print]');
  if (pr) pr.addEventListener('click', function () { window.print(); });

  var cl = d.querySelector('[data-calc-clear]');
  if (cl) cl.addEventListener('click', function () {
    for (var k in BLANK) v[k] = BLANK[k];
    done = [false, false, false];
    d.querySelectorAll('[data-calc-in]').forEach(function (el) { el.value = v[el.getAttribute('data-calc-in')]; });
    d.querySelectorAll('[data-calc-step]').forEach(function (el) { el.checked = false; });
    save(); render();
  });

  render();
})();
