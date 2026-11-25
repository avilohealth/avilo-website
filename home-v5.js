/* Homepage v5.
   The handoff drove this page from React state: every animated value was a
   {{ hole }} inside a style attribute. Those became CSS custom properties, so
   this file only has to compute the same values and set them in one place.
   Everything ships rendered, so the page reads fine with JS off. */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* avilo-v4.css still carries a .hv block from the previous homepage that
     pins every hero variable to its initial state. A rule on .hv beats one on
     :root, so the hero's values have to be written to that element or the
     chips stay at opacity 0 for ever. Everything else goes on the root. */
  var hv = d.querySelector('.hv') || root;

  function setVars(v, el) {
    var target = el || root;
    for (var k in v) target.style.setProperty('--' + k, String(v[k]));
  }

  /* ============================ hero ============================
     Five cards light in turn, each over four phases: card in, line
     drawn, dot landed, caption shown. Then the whole thing resets. */
  var EASE = 'cubic-bezier(.65,0,.35,1)';
  var TIMES = ['5:52pm', '7:12pm', '7:13pm', '8:05pm', '8:40pm'];
  var h = { i: -1, ph: 0, out: false, nt: true };

  function heroVals() {
    var i = h.i, out = h.out, nt = h.nt, live = !nt && !out;
    function at(k, p) { return live && (k < i || (k === i && h.ph >= p)); }

    var v = {
      clockDot: '#10B981',
      noahOp: 1,
      fOp: (at(1, 2) && !at(2, 2)) ? 1 : 0
    };
    var clock = d.querySelector('[data-v="clock"]');
    if (clock) clock.textContent = 'With Avilo · ' + TIMES[Math.max(1, Math.min(i, 4))];

    for (var k = 1; k <= 4; k++) {
      var on = at(k, 0), cur = live && k === h.i && h.ph < 3;
      v['c' + k + 'Op'] = on ? 1 : 0;
      v['c' + k + 'Tf'] = on ? 'translateY(-50%)' : 'translate(-14px,-50%)';
      v['c' + k + 'Bd'] = cur ? 'rgba(13,148,136,.6)' : 'rgba(23,32,48,.10)';
      v['c' + k + 'Sh'] = cur
        ? '0 0 0 4px rgba(77,217,192,.14), 0 14px 30px -14px rgba(77,217,192,.5)'
        : 'none';
      var ln = at(k, 1);
      v['l' + k + 'Off'] = ln ? 0 : 1;
      v['l' + k + 'Tr'] = live ? 'stroke-dashoffset .9s ' + EASE : 'stroke-dashoffset .5s';
      v['p' + k + 'Off'] = ln ? -1.05 : 0.16;
      v['p' + k + 'Tr'] = ln ? 'stroke-dashoffset .9s ' + EASE : 'none';
      v['d' + k + 'Op'] = at(k, 2) ? 1 : 0;
      v['d' + k + 'Sh'] = (live && k === h.i && h.ph === 2)
        ? '0 0 0 9px rgba(77,217,192,0)' : '0 0 0 4px rgba(77,217,192,.25)';
    }

    /* the appointment chip that slides from Thursday to Friday */
    var moved = !nt && (i > 1 || (i === 1 && h.ph >= 2));
    v.mvL = moved ? 'calc(50% + 19px)' : '40px';
    v.mvT = moved ? '98px' : '150px';
    v.mvOp = out ? 0 : 1;
    v.mvTf = (live && i === 1 && h.ph === 2) ? 'scale(1.04)' : 'none';
    v.mvTr = nt ? 'opacity .4s'
                : 'top .9s ' + EASE + ', left .9s ' + EASE + ', opacity .5s, transform .4s';
    v.mvgOp = at(1, 3) ? 1 : 0;
    v.mvgTf = at(1, 3) ? 'none' : 'translateY(4px)';
    var sub = d.querySelector('[data-v="mvSub"]');
    if (sub) sub.textContent = moved ? 'Fri 8:15am' : 'Thu 10:00am';

    [['w', 2], ['r', 3], ['n', 4]].forEach(function (pair) {
      var p = pair[0], k = pair[1];
      v[p + 'Op'] = at(k, 2) ? 1 : 0;
      v[p + 'Tf'] = at(k, 2) ? 'none' : 'scale(.85)';
      v[p + 'gOp'] = at(k, 3) ? 1 : 0;
      v[p + 'gTf'] = at(k, 3) ? 'none' : 'translateY(4px)';
    });

    d.querySelectorAll('[data-card]').forEach(function (el) {
      var k = +el.getAttribute('data-card');
      el.setAttribute('data-live', (live && k === Math.min(i, 4)) ? '1' : '0');
    });
    return v;
  }

  var ht;
  function heroTick() {
    var N = 4, n;
    if (h.nt) n = { i: 1, ph: 0, out: false, nt: false };
    else if (h.out) n = { i: -1, ph: 0, out: false, nt: true };
    else if (h.ph < 3) n = { i: h.i, ph: h.ph + 1, out: false, nt: false };
    else if (h.i < N) n = { i: h.i + 1, ph: 0, out: false, nt: false };
    else n = { i: h.i, ph: h.ph, out: true, nt: false };
    h = n;
    setVars(heroVals(), hv);
    var dur = n.nt ? 500 : n.out ? 800
      : n.i === 0 ? [800, 1100, 1300, 1500][n.ph]
      : [600, 900, 900, n.i < N ? 1200 : 3200][n.ph];
    ht = setTimeout(heroTick, dur);
  }

  /* ======================= leaks and costs ======================= */
  var LEAKS = [
    ['No-shows', [0, 1, 3]],
    ['Missed messages', [1, 2, 3]],
    ['Missed calls', [0, 2, 4]],
    ['The ones who said they’d rebook', [0, 1, 4]]
  ];
  var COSTS = [
    ['Lost revenue', 'A consult that was booked and never billed.'],
    ['Empty slots', 'A gap in the diary nobody had time to fill.'],
    ['Reputation', 'A patient who felt ignored tells other people.'],
    ['Reception time wasted', 'Chasing, calling back and apologising.'],
    ['Paying again to replace the patient', 'You already paid to get them the first time.']
  ];
  var leak = 0, leakAt = 5, lt = 5, leakStop = false;
  var costList = null, costTpl = '';

  function paintLeaks() {
    var v = {}, settled = reduce || (lt - leakAt) >= 1;
    for (var i = 0; i < 4; i++) {
      var on = i === leak, b = on && settled;
      v['ls' + i] = on ? 1 : 0;
      v['lv' + i + 'a'] = on ? 1 : 0;
      v['lv' + i + 'aT'] = on ? 'none' : 'translateY(8px)';
      v['lv' + i + 'b'] = b ? 1 : 0;
      v['lv' + i + 'bT'] = b ? 'none' : 'translateY(6px) scale(.96)';
    }
    setVars(v);

    d.querySelectorAll('[data-leak]').forEach(function (btn) {
      var on = +btn.getAttribute('data-leak') === leak;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.style.background = on ? '#fff' : 'transparent';
      btn.style.borderColor = on ? 'rgba(13,148,136,.45)' : 'transparent';
      btn.style.boxShadow = on ? '0 24px 48px -28px rgba(23,32,48,.35)' : 'none';
    });

    var title = d.querySelector('[data-v="leakTitle"]');
    if (title) title.textContent = LEAKS[leak][0];

    if (costList && costTpl) {
      costList.innerHTML = LEAKS[leak][1].map(function (k) {
        return costTpl.replace('__LABEL__', COSTS[k][0]).replace('__BODY__', COSTS[k][1]);
      }).join('');
    }
  }

  /* ===================== the five job scenes =====================
     One counter drives all of them, each reading it at a different
     offset so the scenes do not move in lockstep. */
  function paintJobs() {
    var st = reduce;
    var q = st ? 7 : lt % 9,
        wl = st ? 8 : (lt + 3) % 10,
        s3 = st ? 9 : (lt + 6) % 9,
        r4 = st ? 9 : (lt + 1) % 10,
        r5 = st ? 9 : (lt + 5) % 10;

    var ns = q < 2 ? ['No reply', '#FEE2E2', '#B91C1C']
           : q < 5 ? ['Nudged 4:10pm', '#FEF3E2', '#B45309']
                   : ['Confirmed', '#DCFCE7', '#166534'];
    var label = d.querySelector('[data-v="nsLabel"]');
    if (label) label.textContent = ns[0];

    var v = {
      nsBg: ns[1], nsFg: ns[2],
      wlFill: wl >= 6 ? 1 : 0,
      wlFillT: wl >= 6 ? 'none' : 'scale(.94)',
      wlFreed: wl < 6 ? 1 : 0
    };
    function set(k, on) { v[k] = on ? 1 : 0; v[k + 'T'] = on ? 'none' : 'translateY(8px)'; }
    set('wlA', wl >= 2); set('wlB', wl >= 4);
    set('so0', s3 >= 1); set('so1', s3 >= 2); set('so2', s3 >= 3);
    set('n4a', r4 >= 1); set('n4b', r4 >= 3); set('n4c', r4 >= 4); set('n4d', r4 >= 6);
    set('r5a', r5 >= 1); set('r5b', r5 >= 3); set('r5c', r5 >= 5);
    setVars(v);
  }

  function visible(id) {
    var el = d.getElementById(id);
    if (!el) return false;
    var r = el.getBoundingClientRect(), vh = w.innerHeight;
    return r.bottom > vh * 0.2 && r.top < vh * 0.8;
  }

  var ticks = 0;
  function accTick() {
    ticks++;
    if (!visible('leaks') && !visible('system')) return;
    lt++;
    /* below 720px the tabs scroll horizontally, so auto-rotation fights the reader */
    if (!leakStop && w.innerWidth >= 720 && lt % 5 === 0 && visible('leaks')) {
      leak = (leak + 1) % 4;
      leakAt = lt;
    }
    paintLeaks();
    paintJobs();
  }

  /* ==================== conversation replay ==================== */
  var CONVS = null, conv = 0, playTimer = null, played = false;
  var msgBox = d.querySelector('[data-conv-msgs]');
  var variants = {};
  d.querySelectorAll('template[data-kind]').forEach(function (t) {
    variants[t.getAttribute('data-kind')] = t.innerHTML;
  });

  function renderConv(upTo) {
    if (!CONVS || !msgBox) return;
    var c = CONVS[conv];
    msgBox.innerHTML = '';
    c.m.forEach(function (pair, idx) {
      var kind = pair[0], text = pair[1];
      var tpl = variants[kind];
      if (!tpl) return;
      var wrap = d.createElement('div');
      wrap.innerHTML = tpl.replace('<span data-v="m.t"></span>', escapeHtml(text));
      var el = wrap.firstElementChild;
      if (!el) return;
      var shown = idx < upTo;
      el.style.setProperty('--m-op', shown ? '1' : '0');
      el.style.setProperty('--m-tf', shown ? 'none' : 'translateY(6px)');
      msgBox.appendChild(el);
    });
    ['ini', 'name', 'sub', 'cap'].forEach(function (k) {
      var el = d.querySelector('[data-v="conv.' + k + '"]');
      if (el) el.textContent = c[k];
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, function (ch) {
      return ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : '&gt;';
    });
  }

  function play() {
    if (!CONVS) return;
    clearTimeout(playTimer);
    var total = CONVS[conv].m.length;
    if (reduce) { renderConv(total); return; }
    renderConv(0);
    (function step(n) {
      renderConv(n);
      if (n < total) playTimer = setTimeout(function () { step(n + 1); }, 1200);
    })(1);
  }

  d.querySelectorAll('[data-conv]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      conv = +btn.getAttribute('data-conv');
      d.querySelectorAll('[data-conv]').forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.style.background = on ? '#172030' : '#fff';
        b.style.color = on ? '#fff' : '#2B3A52';
        b.style.borderColor = on ? '#172030' : '#E2E8F0';
        b.style.boxShadow = on ? '0 10px 24px -14px rgba(23,32,48,.8)' : 'none';
      });
      played = true;
      play();
    });
  });

  /* ======================== scroll reveal ======================== */
  function revealPass() {
    var vh = w.innerHeight, per = new Map();
    d.querySelectorAll('[data-reveal=""]').forEach(function (el) {
      if (el.getBoundingClientRect().top >= vh * 0.9) return;
      var p = el.parentElement, i = per.get(p) || 0;
      per.set(p, i + 1);
      var delay = el.dataset.delay != null ? +el.dataset.delay : i * 90;
      el.style.setProperty('transition-delay', delay + 'ms', 'important');
      el.setAttribute('data-reveal', 'in');
      setTimeout(function () {
        el.style.removeProperty('transition-delay');
        el.setAttribute('data-done', '');
      }, delay + 950);
    });
    var chat = d.querySelector('[aria-live]');
    if (chat && !played) {
      var r = chat.getBoundingClientRect();
      if (r.top < vh * 0.75 && r.bottom > vh * 0.2) { played = true; play(); }
    }
  }

  /* ===================== spotlight on cards ===================== */
  d.addEventListener('pointermove', function (e) {
    var el = e.target && e.target.closest && e.target.closest('[data-spot]');
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ============================ boot ============================ */
  costList = d.querySelector('[data-costs]');
  var tplCost = d.querySelector('template[data-cost-tpl]');
  if (tplCost) costTpl = tplCost.innerHTML;

  d.querySelectorAll('[data-leak]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      leakStop = true;
      leak = +btn.getAttribute('data-leak');
      leakAt = lt;
      paintLeaks();
    });
  });

  var convData = d.getElementById('avilo-convs');
  if (convData) {
    try { CONVS = JSON.parse(convData.textContent); } catch (e) { CONVS = null; }
  }

  setVars(heroVals(), hv);
  paintLeaks();
  paintJobs();
  revealPass();

  w.addEventListener('scroll', revealPass, { passive: true });
  w.addEventListener('resize', revealPass);
  setInterval(revealPass, 200);

  if (!reduce) {
    ht = setTimeout(heroTick, 1300);
    setInterval(accTick, 1100);
  } else {
    h = { i: 9, ph: 3, out: false, nt: false };
    setVars(heroVals(), hv);
  }

  setTimeout(function () {
    d.querySelectorAll('[data-reveal=""]').forEach(function (el) {
      if (el.getBoundingClientRect().top < w.innerHeight * 1.1) {
        el.setAttribute('data-reveal', 'in');
        el.setAttribute('data-done', '');
      }
    });
  }, 2500);
})();
