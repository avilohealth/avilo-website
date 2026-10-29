# Avilo marketing site

Static site for **avilo.com.au**, deployed from this repo to Hostinger. No framework. One small build script assembles the pages.

## How the site is built

```
src/partials/   head.html, nav.html, footer.html   shared on every page
src/pages/      one file per page: a <!--meta--> block, an optional <!--head--> block, then the page body
src/llms.txt    template for /llms.txt (page list is generated)
build.js        assembles src/pages + partials into finished HTML at the repo root, writes sitemap.xml and llms.txt
```

Run the build after any change under `src/`:

```bash
npm run build
```

The finished HTML at the root is committed. Hostinger deploys the root exactly as before, so nothing changes on the server.

### Page meta block

```
<!--meta
title: Under 60 characters | Avilo
description: Under 160 characters.
path: /clean-url
robots: noindex,nofollow     (optional)
og_type: article             (optional, default website)
nav: none                    (optional, 404 page only)
-->
```

Everything inside an optional `<!--head ... -->` block (schema JSON-LD, page styles) is injected into `<head>`.

### Build guard

The build fails, and writes nothing, if any page: contains an em or en dash; links internally to a `.html` address; is missing a title, description or path; has a title over 60 or a description over 160 characters; has more or fewer than one `<h1>`; or uses a retired phrase (see `RETIRED` in `build.js`: competitor names, "AI front desk", "Coming soon" and so on).

## URLs and redirects

Pages are served at clean URLs (`/confirmations`, not `/confirmations.html`). `.htaccess` rewrites `/page` to `page.html` internally, 301s any `.html` request to the clean address, 301s `www` to the apex, maps the retired `features` and `cliniko-integration` pages, wires the 404 page, and sets the security headers.

Files starting with `_` under `src/pages` are templates and are skipped by the build.

## Pages

| URL | Role |
|---|---|
| `/` | Home: Avilo Confirmations hero, how it works, colour legend, features, the three layers, setup, FAQ |
| `/confirmations`, `/smart-reminders`, `/assistant` | One page per product layer |
| `/pricing` | Built but hidden: `noindex`, unlinked, not in the sitemap. Prices are `{{PLACEHOLDER}}`s |
| `/cliniko` | Integration page |
| `/for/physiotherapy`, `/for/chiropractic`, `/for/osteopathy`, `/for/podiatry` | Profession pages |
| `/compare/...` | Two category comparison pages |
| `/start`, `/start/thanks` | Trial request form (Formspree) and confirmation |
| `/contact`, `/about`, `/security`, `/privacy`, `/terms`, `/blog/` | As named |

## Forms

The trial request, contact and newsletter forms all POST to Formspree endpoint `https://formspree.io/f/maqvraqz` with a hidden `form` field to tell them apart and a `_gotcha` honeypot. Swap the endpoint in `src/pages/start.html` and `src/pages/contact.html` if it changes.

## Placeholders waiting on Keegan

Search the `src/` tree for `{{` to find them: price figures on `/pricing`, the YouTube `{{VIDEO_ID}}` block on the home page, and app screenshots marked `{{SCREENSHOT}}`.

## Blog posts

Copy `src/pages/blog/_post-template.html`, fill the placeholders, add a card and a `blogPost` entry to `src/pages/blog/index.html`, run the build. The sitemap and `llms.txt` update on their own.

## Deploying

Commit the built output and push `main`. Hostinger auto-deploys on push (hPanel → Website → Git → Auto Deployment). Manual fallback: hPanel → Git → Deploy. Verify with a hard refresh. After a deploy that touches `.htaccess`, check `/features.html` (expect 301 to `/confirmations`), `www.avilo.com.au` (expect 301), `/pricing` (expect 200 with `noindex`) and a missing path (expect the 404 page).

## Obligations to keep

- The ElevenLabs Grants logo and link in the footer partial are a grant condition. Keep them.
- The site loads nothing from third parties except the YouTube embed on the home page (privacy-enhanced mode) and Calendly, which only loads on click. The privacy policy says so; keep them in step.
- No em dashes anywhere. No competitor names anywhere.
