/* /blog/what-a-missed-call-costs: the cost-of-a-missed-call worksheet.
   A direct port of the handoff's logic. Everything the reader types stays in
   their own browser; nothing is sent anywhere. */
(function () {
  'use strict';
  var d = document;
  var inputs = d.querySelectorAll('[data-calc]');
  if (!inputs.length) return;

  var LS = 'avilo-leak-count-v1';
  var BLANK = { fee: '', npv: '', calls: '', share: '33', waited: '', empty: '', noshow: '' };
  var v = {}, done = [false, false, false];
  for (var k in BLANK) v[k] = BLANK[k];

  function money(x) { return '$' + Math.round(x).toLocaleString('en-AU'); }
  function num(k) { var n = parseFloat(v[k]); return n > 0 ? n : 0; }
  function setText(key, text) {
    var el = d.querySelector('[data-v="' + key + '"]');
    if (el) el.textContent = text;
  }

  function save() {
    try { localStorage.setItem(LS, JSON.stringify({ v: v, d: done })); } catch (e) {}
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(LS) || 'null');
      if (!s) return;
      if (s.v) for (var k in BLANK) if (s.v[k] != null) v[k] = s.v[k];
      if (s.d && s.d.length === 3) done = s.d;
    } catch (e) {}
  }

  function render() {
    var fee = num('fee'), npv = num('npv'), calls = num('calls');
    var share = num('share') / 100, empty = num('empty'), nsh = num('noshow');
    var l = [calls * share * npv, empty * fee, nsh * fee];
    var total = l[0] + l[1] + l[2];
    var max = Math.max(l[0], l[1], l[2], 1);

    setText('c1', (calls && npv)
      ? calls + ' calls × ' + Math.round(share * 100) + '% new × ' + money(npv) + ' = ' + money(l[0])
      : 'Calls × share that were new × new patient value');
    setText('c2', (empty && fee)
      ? empty + ' empty slots × ' + money(fee) + ' = ' + money(l[1])
      : 'Empty slots × consult fee');
    setText('c3', (nsh && fee)
      ? nsh + ' no-shows × ' + money(fee) + ' = ' + money(l[2])
      : 'Unconfirmed no-shows × consult fee');

    setText('total', money(total));
    setText('yearly', total ? 'About ' + money(total * 12) + ' a year'
                            : 'Fill in the steps to see your number');
    setText('verdict',
      !total ? 'For a typical two-to-four practitioner clinic, this lands somewhere between $2,000 and $6,000 a month.'
      : total < 2000 ? 'Below the usual $2,000 to $6,000 a month. If your number is small, congratulations, close this tab.'
      : total <= 6000 ? 'Right in the usual range of $2,000 to $6,000 a month for a two-to-four practitioner clinic. Not because anyone is bad at their job. The work arrives faster than the desk can absorb it.'
      : 'Above the usual $2,000 to $6,000 a month. Worth an hour this week, not someday.');

    var count = done.filter(Boolean).length;
    setText('progress', count + ' of 3 steps done');

    var root = d.documentElement;
    for (var i = 0; i < 3; i++) {
      setText('m' + (i + 1), money(l[i]));
      root.style.setProperty('--w' + (i + 1), Math.round(l[i] / max * 100) + '%');
      root.style.setProperty('--sb' + (i + 1), done[i] ? '#0D9488' : '#fff');
      root.style.setProperty('--sf' + (i + 1), done[i] ? '#fff' : '#0B7A70');
    }
  }

  load();
  inputs.forEach(function (el) {
    var key = el.getAttribute('data-calc');
    if (v[key] !== '') el.value = v[key];
    el.addEventListener('input', function () {
      v[key] = el.value;
      save();
      render();
    });
  });

  d.querySelectorAll('[data-step]').forEach(function (box) {
    var i = +box.getAttribute('data-step') - 1;
    box.checked = !!done[i];
    box.addEventListener('change', function () {
      done[i] = box.checked;
      save();
      render();
    });
  });

  var clear = d.querySelector('[data-act="clear"]');
  if (clear) clear.addEventListener('click', function () {
    for (var k in BLANK) v[k] = BLANK[k];
    done = [false, false, false];
    inputs.forEach(function (el) { el.value = v[el.getAttribute('data-calc')]; });
    d.querySelectorAll('[data-step]').forEach(function (b) { b.checked = false; });
    save();
    render();
  });

  var print = d.querySelector('[data-act="print"]');
  if (print) print.addEventListener('click', function () { window.print(); });

  render();
})();
