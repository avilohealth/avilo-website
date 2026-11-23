/* ============================================================
   Avilo v4 — shared site behaviour.
   Nav state, scroll reveal, spotlight cards, cookie consent,
   consent-gated Calendly, and Formspree form submission.
   No dependencies.
   ============================================================ */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- scroll reveal ---------- */
  d.documentElement.classList.add('rv');

  function revealPass() {
    var ih = w.innerHeight, per = new Map();
    d.querySelectorAll('[data-reveal=""]').forEach(function (el) {
      if (el.getBoundingClientRect().top > ih * 0.9) return;
      var p = el.parentElement, i = per.get(p) || 0;
      per.set(p, i + 1);
      var dl = el.dataset.delay != null ? +el.dataset.delay : i * 80;
      el.style.setProperty('transition-delay', dl + 'ms', 'important');
      el.setAttribute('data-reveal', 'in');
      setTimeout(function () {
        el.style.removeProperty('transition-delay');
        el.setAttribute('data-done', '');
      }, dl + 950);
    });
  }

  /* ---------- nav ---------- */
  var nav = d.querySelector('.nv');
  var menu = d.getElementById('nv-menu');
  var toggle = d.querySelector('.nv-toggle');
  var hero = d.querySelector('[data-screen-label="Hero"]');
  var menuOpen = false;

  function navPass() {
    if (!nav) return;
    // With no dark hero to sit over, the pill is the only legible state.
    var solid = hero ? hero.getBoundingClientRect().bottom < 80 : true;
    nav.classList.toggle('is-solid', solid || menuOpen);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menuOpen = !menuOpen;
      menu.classList.toggle('open', menuOpen);
      toggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
      navPass();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menuOpen = false;
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        navPass();
      }
    });
  }

  function tick() { navPass(); revealPass(); }
  w.addEventListener('scroll', tick, { passive: true });
  w.addEventListener('resize', tick);
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) revealPass();
    }, { threshold: 0 });
    d.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  }
  tick();
  // Interval covers layout shifts that fire no scroll or resize event.
  var iv = setInterval(tick, 250);
  // Fallback: never leave content invisible.
  setTimeout(function () {
    clearInterval(iv);
    d.querySelectorAll('[data-reveal=""]').forEach(function (el) {
      el.setAttribute('data-reveal', 'in');
      el.setAttribute('data-done', '');
    });
  }, 2500);

  /* ---------- spotlight ---------- */
  if (!reduce) {
    d.addEventListener('pointermove', function (e) {
      var el = e.target && e.target.closest && e.target.closest('[data-spot]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- cookie consent ---------- */
  var KEY = 'avilo-consent-v1';
  var card = d.getElementById('ck');

  function applyConsent(c) {
    if (c.ads && w.AVILO_META_PIXEL_ID && !w.fbq) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(w, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      w.fbq('init', w.AVILO_META_PIXEL_ID);
      w.fbq('track', 'PageView');
    }
    if (c.analytics && w.AVILO_ANALYTICS_SRC && !d.getElementById('avilo-analytics')) {
      var s = d.createElement('script');
      s.id = 'avilo-analytics';
      // type must be set before src so a module script is parsed as one
      var attrs = w.AVILO_ANALYTICS_ATTRS;
      if (attrs && attrs.type) s.type = attrs.type; else s.defer = true;
      s.src = w.AVILO_ANALYTICS_SRC;
      // Most privacy-first providers need an attribute as well as the src
      // (Plausible: data-domain, Fathom: data-site, Umami: data-website-id).
      if (attrs) for (var a in attrs) { if (a !== 'type') s.setAttribute(a, attrs[a]); }
      d.head.appendChild(s);
    }
  }

  function saveConsent(p) {
    var c = { calendly: !!p.calendly, ads: !!p.ads, analytics: !!p.analytics, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    w.__aviloConsent = c;
    applyConsent(c);
    w.dispatchEvent(new CustomEvent('avilo-consent', { detail: c }));
    if (card) { card.classList.remove('open', 'manage'); }
  }
  w.aviloSaveConsent = saveConsent;

  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (saved) { w.__aviloConsent = saved; applyConsent(saved); }

  if (card) {
    var boxes = card.querySelectorAll('input[type=checkbox][data-cat]');
    if (saved) {
      boxes.forEach(function (b) { b.checked = !!saved[b.dataset.cat]; });
    } else {
      card.classList.add('open');
    }
    card.querySelector('[data-ck=accept]').addEventListener('click', function () {
      saveConsent({ calendly: true, ads: true, analytics: true });
    });
    card.querySelector('[data-ck=essential]').addEventListener('click', function () {
      saveConsent({ calendly: false, ads: false, analytics: false });
    });
    card.querySelector('[data-ck=manage]').addEventListener('click', function () {
      card.classList.add('manage');
    });
    card.querySelector('[data-ck=save]').addEventListener('click', function () {
      var p = {};
      boxes.forEach(function (b) { p[b.dataset.cat] = b.checked; });
      saveConsent(p);
    });

    var onHash = function () {
      if ((location.hash || '') === '#cookies') {
        card.classList.add('open', 'manage');
        try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      }
    };
    w.addEventListener('hashchange', onHash);
    onHash();
  }

  /* ---------- consent-gated Calendly ---------- */
  var CAL = 'https://calendly.com/avilohealth/30min?hide_gdpr_banner=1&primary_color=0d9488';

  function loadCalendly() {
    var slots = d.querySelectorAll('[data-calendly]');
    if (!slots.length) return;
    slots.forEach(function (slot) {
      if (slot.dataset.loaded) return;
      slot.dataset.loaded = '1';
      var gate = slot.querySelector('[data-cal-gate]')
        || (slot.parentNode && slot.parentNode.querySelector('[data-cal-gate]'));
      if (gate) gate.style.display = 'none';
      slot.style.display = '';
      if (slot.querySelector('iframe')) return;
      var frame = d.createElement('iframe');
      frame.src = CAL;
      frame.title = 'Book a 30 minute Avilo demo';
      frame.loading = 'lazy';
      frame.style.cssText = 'width:100%;height:' + (slot.dataset.calHeight || '700') + 'px;border:0;border-radius:16px;background:#F8FAFC;display:block';
      slot.appendChild(frame);
    });
  }

  function calendlyState() {
    var ok = w.__aviloConsent && w.__aviloConsent.calendly;
    if (ok) loadCalendly();
  }
  calendlyState();
  w.addEventListener('avilo-consent', calendlyState);
  d.querySelectorAll('[data-cal-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cur = w.__aviloConsent || {};
      saveConsent({ calendly: true, ads: !!cur.ads, analytics: !!cur.analytics });
    });
  });

  /* ---------- forms ---------- */
  var ENDPOINT = 'https://formspree.io/f/maqvraqz';

  // Every form posts to one Formspree endpoint, so without a subject the email
  // just inherits whatever that form is named in the dashboard and all five
  // look identical in the inbox.
  var SUBJECT = {
    enquiry: 'Website enquiry (contact page)',
    capture: 'Website: practice software, from the home page',
    pms: 'Website: not on Cliniko, practice software',
    newsletter: 'Website: newsletter signup'
  };

  // One inline place to tell the visitor what went wrong, per form.
  function say(form, message) {
    var box = form.querySelector('[data-form-err]');
    if (!box) {
      box = d.createElement('p');
      box.setAttribute('data-form-err', '');
      box.style.cssText = 'margin:10px 0 0;font-size:14px;line-height:1.5;color:#B45309';
      form.appendChild(box);
    }
    box.textContent = message;
    box.style.display = 'block';
    box.setAttribute('role', 'alert');
  }

  d.querySelectorAll('form[data-form]').forEach(function (form) {
    if (!form.getAttribute('action')) form.setAttribute('action', ENDPOINT);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      var wrap = form.closest('[data-form-wrap]') || form;
      var scope = wrap.parentElement || d;
      var ok = scope.querySelector('[data-form-ok]');
      var label = btn ? btn.innerHTML : '';

      // type="email" accepts foo@bar: the HTML spec does not require a dot in
      // the domain, but Formspree rejects it with a 422. Catch it here so the
      // visitor is told which field is wrong instead of "something went wrong".
      var mail = form.querySelector('input[type=email]');
      if (mail && mail.value && !/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(mail.value.trim())) {
        say(form, 'That email address looks incomplete. Check it and try again.');
        mail.focus();
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      var fd = new FormData(form);
      var which = form.getAttribute('data-form');
      // Formspree reads "subject"; "_subject" is the old name it ignores,
      // so notifications fell back to the dashboard form's own title.
      var subj = SUBJECT[which] || ('Website form: ' + which);
      if (!fd.get('subject')) fd.append('subject', subj);
      if (!fd.get('_subject')) fd.append('_subject', subj);
      if (!fd.get('source')) fd.append('source', which + ' form, ' + location.pathname);
      fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) {
          if (!r.ok) {
            // Formspree explains what it rejected; pass that on rather than hide it
            var why = (data.errors && data.errors.length && data.errors[0].message) || '';
            throw new Error(why);
          }
          form.reset();
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
          wrap.style.display = 'none';
          if (ok) ok.style.display = 'block';
        });
      }).catch(function (e) {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
        say(form, (e && e.message)
          ? e.message + ' If it keeps happening, email hello@avilo.com.au.'
          : 'That did not send. Please email hello@avilo.com.au instead.');
      });
    });
  });
})();
