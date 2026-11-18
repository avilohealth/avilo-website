/* /inbox: the Avilo Inbox setup-call funnel.
   Three steps: saving calculator, details, Calendly. The page ships rendered
   on step 1 with a worked example, so it reads fine without JS. */
(function () {
  'use strict';
  var d = document, w = window;
  var form = d.querySelector('[data-funnel-form]');
  if (!form) return;

  var FORMSPREE = 'https://formspree.io/f/maqvraqz';
  var CALENDLY = 'https://calendly.com/avilohealth/30min';
  var PER_TEXT_TODAY = 0.10, BASE = 29, PER_TEXT_INBOX = 0.05;

  var booked = false;

  function money(n) { return '$' + Math.round(n).toLocaleString('en-AU'); }
  function out(k) { return d.querySelector('[data-calc-out="' + k + '"]'); }
  function set(k, v) { var el = out(k); if (el) el.textContent = v; }
  function show(el, on) { if (el) el.hidden = !on; }

  /* ---------------- calculator ---------------- */
  var input = d.querySelector('[data-calc-texts]');
  var texts = 2000;

  function recalc() {
    var today = texts * PER_TEXT_TODAY;
    var inbox = BASE + texts * PER_TEXT_INBOX;
    var save = today - inbox;
    var max = Math.max(today, inbox, 1);

    set('todayLabel', money(today));
    set('payLabel', money(inbox));
    set('saveLabel', money(save));
    set('yearLabel', money(Math.round(save) * 12));
    set('textsLabel', texts.toLocaleString('en-AU'));
    set('diffLabel', Math.abs(save) < 1 ? 'about the same as today'
                                        : money(-save) + ' a month more than today');

    var bt = d.querySelector('[data-bar="today"]'), bi = d.querySelector('[data-bar="inbox"]');
    if (bt) bt.style.width = (today / max * 100).toFixed(1) + '%';
    if (bi) bi.style.width = (inbox / max * 100).toFixed(1) + '%';

    var saves = Math.round(save) >= 1;
    d.querySelectorAll('[data-save="yes"]').forEach(function (el) { show(el, saves); });
    d.querySelectorAll('[data-save="no"]').forEach(function (el) { show(el, !saves); });

    var ft = d.querySelector('[data-form-texts]');
    if (ft && !ft.dataset.touched) ft.value = texts;
  }

  if (input) {
    input.addEventListener('input', function () {
      var digits = String(input.value).replace(/\D/g, '').slice(0, 9);
      texts = digits ? parseInt(digits, 10) : 0;
      var pos = input.selectionStart, before = input.value.length;
      input.value = digits ? Number(digits).toLocaleString('en-AU') : '';
      if (pos !== null) {
        var shift = input.value.length - before;
        try { input.setSelectionRange(pos + shift, pos + shift); } catch (e) {}
      }
      recalc();
    });
  }
  var formTexts = d.querySelector('[data-form-texts]');
  if (formTexts) formTexts.addEventListener('input', function () { formTexts.dataset.touched = '1'; });

  /* ---------------- steps ---------------- */
  var step = 1;
  var panels = {
    1: d.querySelector('[data-step="1"]'),
    2: d.querySelector('[data-step="2"]'),
    3: d.querySelector('[data-step="3"]')
  };

  function paintSteps() {
    [1, 2, 3].forEach(function (n) { show(panels[n], n === step); });
    d.querySelectorAll('[data-prog]').forEach(function (el) {
      var n = +el.getAttribute('data-prog');
      var done = step > n, cur = step === n;
      el.setAttribute('aria-current', cur ? 'step' : 'false');
      var bar = el.querySelector('[style*="height"]') || el;
      var chip = el.querySelector('span,div');
      el.style.color = cur ? '#172030' : done ? '#0A7A70' : '#64748B';
      if (chip) {
        chip.style.background = (done || cur) ? '#0D9488' : '#F1F5F9';
        chip.style.color = (done || cur) ? '#fff' : '#64748B';
        if (done) chip.textContent = '✓';
        else if (!chip.querySelector('*')) chip.textContent = String(n);
      }
    });
  }

  function goto(n) {
    if (step === 3) n = 3;                 // never send anyone back off the booking step
    step = n;
    paintSteps();
    if (n === 3) loadCalendly();
  }

  d.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var to = el.getAttribute('data-go');
      if (to === 'form') {
        if (el.tagName === 'A') { e.preventDefault(); }
        goto(2);
        var card = d.getElementById('book');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        goto(1);
      }
    });
  });

  d.querySelectorAll('[data-pick]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var want = el.getAttribute('data-pick');
      d.querySelectorAll('input[name="interest"]').forEach(function (r) {
        if (r.value === want) r.checked = true;
      });
      goto(2);
      var card = d.getElementById('book');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------------- details form ---------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    if (fd.get('website')) return;                       // honeypot
    fd.append('_subject', 'Avilo Inbox: details submitted (step 2 of 3)');
    fd.append('source', 'offer page, ' + location.pathname);
    fd.append('stage', 'details submitted, calendar not yet booked');
    try { (w.dataLayer = w.dataLayer || []).push({ event: 'setup_form_submitted' }); } catch (err) {}
    goto(3);                                             // never block on the network
    fetch(FORMSPREE, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      .catch(function () {});
  });

  /* ---------------- Calendly ---------------- */
  var frame = d.querySelector('[data-cal-frame]');
  function loadCalendly() {
    if (!frame || frame.getAttribute('src')) return;
    var name = (form.elements.name && form.elements.name.value) || '';
    var email = (form.elements.email && form.elements.email.value) || '';
    frame.src = CALENDLY + '?hide_gdpr_banner=1&embed_type=Inline'
      + '&embed_domain=' + encodeURIComponent(location.hostname || 'avilo.com.au')
      + '&name=' + encodeURIComponent(name)
      + '&email=' + encodeURIComponent(email);
  }

  w.addEventListener('message', function (e) {
    var ev = e && e.data && e.data.event;
    if (ev !== 'calendly.event_scheduled' || booked) return;
    booked = true;
    show(d.querySelector('[data-booked]'), true);
    // a second, separate email so form fills and actual bookings can be counted
    try {
      var bf = new FormData();
      bf.append('_subject', 'Avilo Inbox: CALL BOOKED');
      bf.append('stage', 'booked a time in Calendly');
      bf.append('source', 'offer page, ' + location.pathname);
      bf.append('name', (form.elements.name && form.elements.name.value) || '');
      bf.append('email', (form.elements.email && form.elements.email.value) || '');
      bf.append('clinic', (form.elements.clinic && form.elements.clinic.value) || '');
      bf.append('phone', (form.elements.phone && form.elements.phone.value) || '');
      fetch(FORMSPREE, { method: 'POST', body: bf, headers: { Accept: 'application/json' } })
        .catch(function () {});
    } catch (err) {}
    var bar = d.querySelector('.sticky-cta');
    if (bar) bar.classList.remove('is-on');
    try {
      if (w.fbq) w.fbq('track', 'Schedule');          // only defined after ad consent
      if (w.gtag) w.gtag('event', 'setup_call_booked');
      (w.dataLayer = w.dataLayer || []).push({ event: 'setup_call_booked' });
    } catch (err) {}
  });

  /* ---------------- FAQ ---------------- */
  var faqBtns = d.querySelectorAll('[data-faq]');
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      faqBtns.forEach(function (b) {
        var on = b === btn && !open;
        b.setAttribute('aria-expanded', on ? 'true' : 'false');
        var panel = d.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
        var chev = b.querySelector('svg');
        if (chev) chev.style.transform = on ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    });
  });

  /* ---------------- sticky mobile CTA ---------------- */
  var bar = d.querySelector('.sticky-cta');
  var hero = d.querySelector('[data-screen-label="Hero"]');
  function barPass() {
    if (!bar) return;
    var past = hero ? hero.getBoundingClientRect().bottom < 80 : (w.scrollY > 700);
    bar.classList.toggle('is-on', past && !booked);
  }
  w.addEventListener('scroll', barPass, { passive: true });
  w.addEventListener('resize', barPass);

  recalc();
  paintSteps();
  barPass();
})();
