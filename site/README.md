# Avilo — Marketing Site

Static multi-page site for **avilo.com.au**. No build step, no framework. Just HTML, CSS, and a sprinkle of vanilla JS (plus React + Babel loaded from CDN for the Tweaks panel on the home page).

## Pages

| Path | File | Purpose |
|---|---|---|
| `/` | `index.html` | Home — hero, problem, how-it-works, ROI, features, founder, CTA |
| `/features` | `features.html` | Deep dive on each capability |
| `/pricing` | `pricing.html` | Pricing tiers + comparison + ROI calc + FAQ |
| `/about` | `about.html` | Founder story + beliefs + contact |
| `/app` | `app.html` | Mockup of the in-product dashboard (not yet wired to a backend) |

## Assets

- `brand/` — logos, favicons, OG image (`avilo_og.png`), founder photo
- `tweaks-panel.jsx` — design-time tweaks panel; only loaded by the home page, harmless if absent

## Forms

Demo / waitlist / contact submissions all POST to a Formspree endpoint:

```
https://formspree.io/f/maqvraqz
```

Swap that string in `index.html`, `pricing.html`, `features.html`, and `about.html` if the endpoint changes.

## Deploying

### Vercel (recommended)

1. `vercel` — drop into the project root, it auto-detects static.
2. The included `vercel.json` enables clean URLs (`/features` instead of `/features.html`) and redirects `/home` → `/`.
3. Set the production domain to `avilo.com.au`.

### Netlify

Drag the `site/` folder onto netlify.com, or `netlify deploy --prod --dir=.` from inside it. Clean URLs are on by default.

### Cloudflare Pages

`wrangler pages deploy .` from inside `site/`. No config needed.

### Any static host

Just upload the contents of `site/` to the web root. Pages link with the `.html` extension, so they'll work even without clean-URL rewrites.

## What's missing before launch

The site asserts a few things that need to be in place before the first paid customer signs up. Reminder list:

- **Privacy Policy, Terms of Service, Data Processing Agreement** — handling patient data in AU, must be published before sign-up.
- **Security / Trust page** — Australian Privacy Principles, AU data residency, encryption, sub-processors, breach process. The home page's "trust" section makes claims that need a real page to back them up.
- **Working `/login` and `/signup` routes** — currently `#login` is an empty anchor.
- **Real contact details** — ABN, registered office, `hello@avilo.com.au` mailbox, support hours.
- **"Officially integrated with Cliniko" badge** — make sure the wording matches what Cliniko's partner team has approved.

## Tweaks panel

The home page (`index.html`) includes a hidden Tweaks panel that lets you cycle the brand palette, headline voice, and page pace at runtime. It's harmless in production — the toggle only appears when the host editor is running. The defaults are committed in the page (`palette: 'teal'`, `voice: 'calm'`, `pace: 'tight'`).
