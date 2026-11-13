/* Home page: the hero diary choreography and the example-conversation demo.
   Both ship rendered in a sensible static state, so the page reads fine
   without JS; this adds the motion. */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ============ hero diary animation ============ */
  var hv = d.querySelector('.hv');

  // Text and phone are live today, so the hero runs the two-channel sequence.
  var CHANNELS_LIVE = false;

  var EASE = 'cubic-bezier(.65,0,.35,1)';
  var L0 = '40px', L1 = 'calc(50% + 19px)';

  function heroVals(B, h) {
    var N = B ? 4 : 2;
    var i = Math.min(h.i, N), out = h.out, nt = h.nt;
    var M = B
      ? [{ mv: 1, from: [L0, 222], to: [L1, 50], s: ['Thu 11:00am', 'Fri 8:15am'] },
         { at: [L0, 150] },
         { mv: 1, from: [L1, 172], to: [L1, 250], s: ['Fri 10:15am', 'Fri 12:00pm'] },
         { at: [L0, 350] }]
      : [{ mv: 1, from: [L0, 150], to: [L1, 100], s: ['Thu 10:00am', 'Fri 8:15am'] },
         { at: [L0, 278] }];
    var times = B ? ['7:12pm', '7:51pm', '8:20pm', '9:05pm', '9:14pm'] : ['7:12pm', '7:51pm', '8:03pm'];
    function at(k, p) { return k < i || (k === i && h.ph >= p); }

    var v = { clock: 'Tonight · ' + (i >= 0 && !nt ? times[i] : '6:00pm') };
    for (var k = 0; k < 4; k++) {
      var m = M[k] || { at: [L0, 0] };
      var on = !nt && !out && at(k, 0), live = !nt && !out && k === i;
      v['c' + k + 'Op'] = on ? 1 : 0;
      v['c' + k + 'Tf'] = on ? 'translateY(-50%)' : 'translate(-14px,-50%)';
      v['c' + k + 'Bd'] = live && h.ph < 3 ? 'rgba(77,217,192,.7)' : 'rgba(255,255,255,.16)';
      v['c' + k + 'Sh'] = live && h.ph < 3 ? '0 0 0 4px rgba(77,217,192,.14), 0 14px 30px -14px rgba(77,217,192,.5)' : 'none';
      var ln = !nt && !out && at(k, 1);
      v['l' + k + 'Off'] = ln ? 0 : 1;
      v['l' + k + 'Tr'] = nt || out ? 'stroke-dashoffset .5s' : 'stroke-dashoffset .9s ' + EASE;
      v['p' + k + 'Off'] = ln ? -1.05 : 0.16;
      v['p' + k + 'Tr'] = ln ? 'stroke-dashoffset .9s ' + EASE : 'none';
      var done = at(k, 2) && !nt;
      v['d' + k + 'Op'] = done && !out ? 1 : 0;
      v['d' + k + 'Sh'] = live && h.ph === 2 ? '0 0 0 9px rgba(77,217,192,.0)' : '0 0 0 4px rgba(77,217,192,.25)';
      var tag = !nt && !out && at(k, 3);
      v['g' + k + 'Op'] = tag ? 1 : 0;
      v['g' + k + 'Tf'] = tag ? 'none' : 'translateY(4px)';
      if (m.mv) {
        var p = done ? m.to : m.from;
        v['m' + k + 'L'] = p[0];
        v['m' + k + 'T'] = p[1] + 'px';
        v['m' + k + 'Op'] = out ? 0 : 1;
        v['m' + k + 'Tf'] = done && !out && live && h.ph === 2 ? 'scale(1.04)' : 'none';
        v['m' + k + 'Sub'] = done ? m.s[1] : m.s[0];
        v['m' + k + 'Tr'] = nt ? 'opacity .4s' : 'top .9s ' + EASE + ', left .9s ' + EASE + ', opacity .5s, transform .4s';
        v['f' + k + 'Op'] = done && !out ? 1 : 0;
      } else {
        v['m' + k + 'L'] = m.at[0];
        v['m' + k + 'T'] = m.at[1] + 'px';
        v['m' + k + 'Op'] = done && !out ? 1 : 0;
        v['m' + k + 'Tf'] = done && !out ? 'none' : 'scale(.85)';
        v['m' + k + 'Tr'] = 'opacity .5s, transform .6s cubic-bezier(.34,1.4,.64,1)';
      }
    }
    var fl = !nt && !out && i === N && h.ph >= 1, fg = !nt && !out && i === N && h.ph >= 2;
    v.wT = M[0].from[1] + 'px';
    v.wOp = fl ? 1 : 0;
    v.wTf = fl ? 'none' : 'scale(.85)';
    v.wgOp = fg ? 1 : 0;
    v.wgTf = fg ? 'none' : 'translateY(4px)';
    if (fl) v.f0Op = 0;
    return v;
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = { heroVals: heroVals }; return; }

  var TEXT_KEYS = { clock: 1, m0Sub: 1, m1Sub: 1, m2Sub: 1, m3Sub: 1 };

  function applyHero(v) {
    if (!hv) return;
    for (var k in v) {
      if (TEXT_KEYS[k]) {
        var t = hv.querySelector('[data-hv="' + k + '"]');
        if (t) t.textContent = v[k];
      } else {
        hv.style.setProperty('--' + k, String(v[k]));
      }
    }
  }

  var hState = { i: -1, ph: 0, out: false, nt: true };
  var hTimer = null;

  function heroTick() {
    var N = CHANNELS_LIVE ? 4 : 2, h = hState, n;
    if (h.nt) n = { i: 0, ph: 0, out: false, nt: false };
    else if (h.out || h.i > N) n = h.out ? { i: -1, ph: 0, out: false, nt: true } : { i: h.i, ph: h.ph, out: true, nt: h.nt };
    else if (h.ph < 3) n = { i: h.i, ph: h.ph + 1, out: h.out, nt: h.nt };
    else if (h.i < N) n = { i: h.i + 1, ph: 0, out: false, nt: false };
    else n = { i: h.i, ph: h.ph, out: true, nt: h.nt };
    hState = n;
    applyHero(heroVals(CHANNELS_LIVE, n));
    var dur = n.nt ? 450 : n.out ? 700 : [600, 900, 900, n.i < N ? 1100 : 3000][n.ph];
    hTimer = setTimeout(heroTick, dur);
  }

  if (hv) {
    if (reduce) {
      applyHero(heroVals(CHANNELS_LIVE, { i: 9, ph: 3, out: false, nt: false }));
    } else {
      applyHero(heroVals(CHANNELS_LIVE, hState));
      hTimer = setTimeout(heroTick, 1300);
      // Pause the loop while the hero is off screen.
      if ('IntersectionObserver' in w) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting && !hTimer) hTimer = setTimeout(heroTick, 300);
            else if (!e.isIntersecting && hTimer) { clearTimeout(hTimer); hTimer = null; }
          });
        }, { threshold: 0 }).observe(hv);
      }
    }
  }

  /* ============ example conversations ============ */
  var dataEl = d.getElementById('home-convs');
  var msgs = d.querySelector('[data-conv-msgs]');
  if (!dataEl || !msgs) return;
  var CONVS;
  try { CONVS = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var TPL = {
    p: '<div style="align-self:flex-start;max-width:84%;background:#fff;border:1px solid #E6EEEC;color:#172030;border-radius:14px;padding:9px 13px;box-shadow:0 1px 2px rgba(23,32,48,.05);transition:opacity .4s,transform .4s;opacity:{op};transform:{tf}">{t}</div>',
    a: '<div style="align-self:flex-end;max-width:86%;background:#E4F1EE;border:1px solid #D3E7E2;color:#17594F;border-radius:14px;padding:9px 13px;transition:opacity .4s,transform .4s;opacity:{op};transform:{tf}">{t}</div>',
    l: '<span style="display:block;margin-top:6px;padding-top:12px;border-top:1px dashed #CBD5E1;font-size:12px;color:#64748B;font-weight:600;transition:opacity .4s,transform .4s;opacity:{op};transform:{tf}">{t}</span>',
    s: '<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:#0B7A70;padding:2px;transition:opacity .4s,transform .4s;opacity:{op};transform:{tf}"><span style="width:20px;height:20px;border-radius:6px;background:#E8F8F6;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></span>{t}</div>',
    f: '<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:#B45309;padding:2px;transition:opacity .4s,transform .4s;opacity:{op};transform:{tf}"><span style="width:20px;height:20px;border-radius:6px;background:#FEF3E2;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01"></path><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path></svg></span>{t}</div>',
    d: '<div style="display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:10px 12px;box-shadow:0 6px 16px -10px rgba(23,32,48,.3);transition:opacity .4s,transform .4s;opacity:{op};transform:{tf}"><span style="width:26px;height:26px;border-radius:50%;background:#DCFCE7;color:#166534;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></span><b style="font-size:13.5px;font-weight:600;color:#172030">{t}</b></div>'
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var cur = 0, step = 0, cTimer = null, played = false;
  var tabs = d.querySelectorAll('[data-conv]');

  function paint() {
    var C = CONVS[cur];
    msgs.innerHTML = C.m.map(function (m, i) {
      var on = step > i;
      return TPL[m[0]]
        .replace('{op}', on ? '1' : '0')
        .replace('{tf}', on ? 'none' : 'translateY(8px)')
        .replace('{t}', esc(m[1]));
    }).join('');
    ['ini', 'name', 'sub', 'cap'].forEach(function (k) {
      var el = d.querySelector('[data-conv-' + k + ']');
      if (el) el.textContent = C[k];
    });
    tabs.forEach(function (b, i) {
      var on = i === cur;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.style.background = on ? '#fff' : 'rgba(255,255,255,.06)';
      b.style.color = on ? '#172030' : '#E2E8F0';
      b.style.borderColor = on ? '#fff' : 'rgba(255,255,255,.2)';
      b.style.boxShadow = on ? '0 8px 22px -10px rgba(77,217,192,.6)' : 'none';
    });
  }

  function play() {
    clearTimeout(cTimer);
    var L = CONVS[cur].m.length;
    if (reduce) { step = L; paint(); return; }
    step = 0; paint();
    function tick(n) { step = n; paint(); if (n < L) cTimer = setTimeout(function () { tick(n + 1); }, 1200); }
    cTimer = setTimeout(function () { tick(1); }, 400);
  }

  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () {
      if (i === cur) return;
      cur = i; played = true; play();
    });
  });
  var replay = d.querySelector('[data-conv-replay]');
  if (replay) replay.addEventListener('click', function () { played = true; play(); });

  if ('IntersectionObserver' in w) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !played) { played = true; play(); cio.disconnect(); }
      });
    }, { threshold: 0.25 });
    cio.observe(msgs);
  } else {
    play();
  }
})();
