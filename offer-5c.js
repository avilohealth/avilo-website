/* /offer/inbox-5c-texts: the 5c Avilo Inbox funnel.
   Three steps: saving calculator, details, Calendly. The page ships rendered
   on step 1 with a worked example, so it reads fine with JS off.

   The handoff expressed all of this as React state. Rebuilt here as DOM work
   so nothing but this file has to load. */
(function () {
  'use strict';
  var d = document, w = window;

  var form = d.querySelector('[data-offer-form]');
  if (!form) return;

  var FORMSPREE = 'https://formspree.io/f/maqvraqz';
  var CALENDLY  = 'https://calendly.com/avilohealth/30min';

  /* The offer is capped at 10 clinics, stated on the page as a plain cap.
     The handoff also shipped a "9 of 26 places taken" counter and progress
     bar; both were removed, because no place had been taken and a made-up
     count is a false claim to the people reading it. If a real count is ever
     wanted, it needs a real source, not a constant in here. */

  var PER_TEXT_TODAY = 0.10, PER_TEXT_INBOX = 0.05;   /* no monthly fee on this offer */

  var booked = false;

  function money(n) { return '$' + Math.round(n).toLocaleString('en-AU'); }
  function show(el, on) { if (el) el.hidden = !on; }
  function setV(key, text) {
    d.querySelectorAll('[data-v="' + key + '"]').forEach(function (el) { el.textContent = text; });
  }

  /* ---------------- calculator ---------------- */
  var vol = 2000;

  function recalc() {
    setV('yearSave',  money(vol * PER_TEXT_INBOX * 12));
    setV('monthSave', money(vol * PER_TEXT_INBOX));
    setV('volLabel',  vol.toLocaleString('en-AU'));
    setV('year10',    money(vol * PER_TEXT_TODAY * 12));
    setV('year5',     money(vol * PER_TEXT_INBOX * 12));

    d.querySelectorAll('[data-vol]').forEach(function (b) {
      var on = +b.getAttribute('data-vol') === vol;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.style.background = on ? '#172030' : '#fff';
      b.style.color      = on ? '#fff'    : '#2B3A52';
      b.style.borderColor = on ? '#172030' : '#CBD5E1';
    });

    var ft = form.elements.texts;
    if (ft && !ft.dataset.touched) ft.value = vol;
  }

  d.querySelectorAll('[data-vol]').forEach(function (b) {
    b.addEventListener('click', function () { vol = +b.getAttribute('data-vol'); recalc(); });
  });
  var ftex = form.elements.texts;
  if (ftex) ftex.addEventListener('input', function () { ftex.dataset.touched = '1'; });

  /* ---------------- steps ---------------- */
  var step = 1;
  var panels = {
    1: d.querySelector('[data-step="1"]'),
    2: d.querySelector('[data-step="2"]'),
    3: d.querySelector('[data-step="3"]')
  };

  function paintSteps() {
    [1, 2, 3].forEach(function (n) { show(panels[n], n === step); });
    d.querySelectorAll('[data-prog]').forEach(function (li) {
      var n = +li.getAttribute('data-prog');
      var done = step > n, cur = step === n;
      li.setAttribute('aria-current', cur ? 'step' : 'false');
      var bar = li.firstElementChild;
      if (bar) bar.style.background = (done || cur) ? '#0D9488' : '#E2E8F0';
      var label = li.children[1];
      if (label) {
        label.style.color = cur ? '#172030' : done ? '#0A7A70' : '#64748B';
        var chip = label.firstElementChild;
        if (chip) {
          chip.style.background = (done || cur) ? '#0D9488' : '#F1F5F9';
          chip.style.color      = (done || cur) ? '#fff'    : '#64748B';
          chip.textContent = done ? '✓' : String(n);
        }
      }
    });
  }

  function goTo(n) {
    if (step === 3) n = 3;                /* never send anyone back off the booking step */
    step = n;
    paintSteps();
    if (n === 3) loadCalendly();
  }

  function toCard() {
    var card = d.getElementById('book');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  d.querySelectorAll('[data-act]').forEach(function (el) {
    var act = el.getAttribute('data-act');
    el.addEventListener('click', function (e) {
      if (act === 'toForm') {
        if (el.tagName === 'A') e.preventDefault();
        goTo(2); toCard();
      } else if (act === 'toCalc') {
        goTo(1);
      } else if (act === 'loadCal') {
        askConsent();
      } else if (act === 'openCookies') {
        e.preventDefault();
        askConsent();
      }
    });
  });

  /* ---------------- consent ----------------
     site-v4.js owns the banner and the avilo-consent-v1 record for the whole
     site, so this page asks it rather than running a second one. The handoff
     shipped its own banner; it was removed so a visitor is never asked twice
     and the Pixel stays gated by one decision. */
  function consentAllows() {
    var c = w.__aviloConsent;
    return !!(c && c.calendly);
  }
  function askConsent() {
    location.hash = '#cookies';          /* site-v4.js opens its panel on this */
  }

  /* ---------------- details form ---------------- */
  function say(message) {
    var box = form.querySelector('[data-form-err]');
    if (!box) {
      box = d.createElement('p');
      box.setAttribute('data-form-err', '');
      form.appendChild(box);
    }
    box.textContent = message;
    box.style.display = 'block';
    box.setAttribute('role', 'alert');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.website && form.elements.website.value) return;   /* honeypot */

    /* type="email" accepts foo@bar, which Formspree rejects with a 422 */
    var mail = form.elements.email;
    if (mail && !/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(String(mail.value).trim())) {
      mail.setCustomValidity('Enter a complete email address, like you@clinic.com.au');
      mail.reportValidity();
      setTimeout(function () { mail.setCustomValidity(''); }, 50);
      return;
    }

    var fd = new FormData(form);
    /* the markup carries these as hidden inputs for the no-JS path, so set
       rather than append or Formspree receives each one twice */
    fd.set('_subject', 'Avilo Inbox 5c: details submitted (step 2 of 3)');
    fd.set('source', 'offer page, ' + location.pathname);
    fd.set('stage', 'details submitted, calendar not yet booked');
    fd.delete('_next');
    try { (w.dataLayer = w.dataLayer || []).push({ event: 'setup_form_submitted' }); } catch (err) {}

    goTo(3);                              /* never block the visitor on the network */

    fetch(FORMSPREE, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (r.ok) return;
        /* a silent failure here loses the lead and nobody finds out */
        return r.json().catch(function () { return {}; }).then(function (data) {
          var why = (data.errors && data.errors.length && data.errors[0].message) || r.status;
          if (w.console) console.warn('Avilo: setup-call details were not delivered:', why);
          say('We could not send those details. Please email hello@avilo.com.au and we will book you in.');
        });
      })
      .catch(function (err) {
        if (w.console) console.warn('Avilo: setup-call details were not delivered:', err);
        say('We could not send those details. Please email hello@avilo.com.au and we will book you in.');
      });
  });

  /* ---------------- Calendly ----------------
     Built here rather than shipped in the markup: the handoff's iframe carried
     loading="lazy" inside a hidden box, and a lazy frame in a hidden box never
     loads. */
  function loadCalendly() {
    var slot = d.querySelector('[data-cal-slot]');
    if (!slot || slot.firstChild) return;
    var gate = d.querySelector('[data-cal-gate]');
    if (!consentAllows()) { show(gate, true); return; }
    show(gate, false);

    var name  = (form.elements.name  && form.elements.name.value)  || '';
    var email = (form.elements.email && form.elements.email.value) || '';
    var frame = d.createElement('iframe');
    frame.title = 'Book your 15-minute setup call (Calendly)';
    frame.src = CALENDLY + '?hide_gdpr_banner=1&embed_type=Inline'
      + '&embed_domain=' + encodeURIComponent(location.hostname || 'avilo.com.au')
      + '&name='  + encodeURIComponent(name)
      + '&email=' + encodeURIComponent(email);
    slot.appendChild(frame);
  }

  w.addEventListener('avilo-consent', function () {
    if (step === 3) loadCalendly();
  });

  w.addEventListener('message', function (e) {
    var ev = e && e.data && e.data.event;
    if (ev !== 'calendly.event_scheduled' || booked) return;
    booked = true;
    show(d.querySelector('[data-cal-booked]'), true);
    show(d.querySelector('[data-bottom-bar]'), false);

    /* a second, separate email, so form fills and real bookings can be compared */
    try {
      var bf = new FormData();
      bf.append('_subject', 'Avilo Inbox 5c: CALL BOOKED');
      bf.append('stage', 'booked a time in Calendly');
      bf.append('source', 'offer page, ' + location.pathname);
      ['name', 'email', 'clinic', 'phone'].forEach(function (k) {
        bf.append(k, (form.elements[k] && form.elements[k].value) || '');
      });
      fetch(FORMSPREE, { method: 'POST', body: bf, headers: { Accept: 'application/json' } })
        .catch(function () {});
    } catch (err) {}

    try {
      if (w.fbq) w.fbq('track', 'Schedule');        /* only defined after ad consent */
      if (w.gtag) w.gtag('event', 'setup_call_booked');
      (w.dataLayer = w.dataLayer || []).push({ event: 'setup_call_booked' });
    } catch (err) {}
  });

  /* ---------------- FAQ ---------------- */
  var faqBtns = d.querySelectorAll('[data-faq]');
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      faqBtns.forEach(function (b) {
        var on = b === btn && !wasOpen;
        b.setAttribute('aria-expanded', on ? 'true' : 'false');
        var panel = d.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
        var chev = b.querySelector('svg');
        if (chev) chev.style.transform = on ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    });
  });

  /* ---------------- nav state and sticky bar ---------------- */
  var nav = d.querySelector('[data-nav]');
  var hero = d.querySelector('[data-hero]');
  var bar = d.querySelector('[data-bottom-bar]');

  function onScroll() {
    var past = hero ? hero.getBoundingClientRect().bottom < 80 : w.scrollY > 700;
    if (nav) nav.classList.toggle('is-solid', past || w.scrollY > 24);
    show(bar, past && !booked);
  }
  w.addEventListener('scroll', onScroll, { passive: true });
  w.addEventListener('resize', onScroll);

  recalc();
  paintSteps();
  onScroll();
})();
