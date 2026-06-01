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

### GitHub → Hostinger (current setup)

The live site at **avilo.com.au** is hosted on Hostinger and deployed from this GitHub repo. To push changes live:

1. Commit and push to the deploy branch (`main`):
   ```
   git add -A
   git commit -m "Update site"
   git push origin main
   ```
2. Hostinger picks up the push automatically (hPanel → **Website → Git → Auto Deployment** is enabled). If auto-deploy is off, open hPanel → **Git** and click **Deploy** to pull the latest commit.
3. Verify at https://avilo.com.au — hard-refresh (Cmd/Ctrl+Shift+R) to bypass cache.

> **Note:** Hostinger serves files by their real path, so pages are reached with the `.html` extension (`/pricing.html`, `/features.html`). The `vercel.json` clean-URL config is **not** applied here — links throughout the site already use `.html`, so everything resolves correctly.

### Any other static host

Upload the contents of `site/` to the web root. Pages link with the `.html` extension, so they work with or without clean-URL rewrites.

## Page versions

The home and pricing pages were redesigned (v2). The v2 designs are now the published pages:

- `index.html` — current published home (formerly `Avilo Home v2.html`)
- `pricing.html` — current published pricing (formerly `Avilo Pricing v2.html`)

The previous live versions are archived in `_archive/` (`index-v1.html`, `pricing-v1.html`) in case a rollback is ever needed.

## What's missing before launch

The site asserts a few things that need to be in place before the first paid customer signs up. Reminder list:

- **Privacy Policy, Terms of Service, Data Processing Agreement** — handling patient data in AU, must be published before sign-up.
- **Security / Trust page** — Australian Privacy Principles, AU data residency, encryption, sub-processors, breach process. The home page's "trust" section makes claims that need a real page to back them up.
- **Working `/login` and `/signup` routes** — currently `#login` is an empty anchor.
- **Real contact details** — ABN, registered office, `hello@avilo.com.au` mailbox, support hours.
- **"Officially integrated with Cliniko" badge** — make sure the wording matches what Cliniko's partner team has approved.

## Tweaks panel

The home page (`index.html`) includes a hidden Tweaks panel that lets you cycle the brand palette, headline voice, and page pace at runtime. It's harmless in production — the toggle only appears when the host editor is running. The defaults are committed in the page (`palette: 'teal'`, `voice: 'calm'`, `pace: 'tight'`).
