# Avilo website restructure: design spec

Date: 29 October 2026
Status: awaiting Keegan's review
Supersedes: the messaging in `index.html`, `features.html` and `pricing.html` as deployed at commit dc6c76c. Incorporates the fixes in `docs/site-audit-2026-10-04.md`.

## 1. Purpose and success criteria

Avilo Confirmations becomes the hero product: a low-friction, one-API-key entry point for Cliniko clinics, with a 14-day free trial. Smart Reminders and the Avilo Assistant are presented as the layers a clinic moves up to when it needs more.

The site succeeds when:

1. A practice manager understands within five seconds that Avilo reads their Cliniko reminder replies and tells them who is coming and who to call.
2. Every page agrees with every other page about what is live, what each layer does and how a clinic starts.
3. A clinic can request a trial in under a minute without a sales call.
4. Google and AI assistants can read every public page, including a clear one-sentence definition of Avilo, and the site has distinct, well-structured pages for each product layer, each of four professions and two decision-stage comparisons.
5. The privacy policy, terms and security page remain truthful after every change in this spec.

Out of scope: the app's own signup flow (the site uses a trial-request form until it exists), analytics, vendor comparison pages, public pricing (built but hidden), the DPA.

## 2. Positioning and messaging system

### 2.1 Product names

| Layer | Name | One-line descriptor |
|---|---|---|
| 1 (hero) | **Avilo Confirmations** | Reads and sorts what comes back from your Cliniko reminders |
| 2 | **Smart Reminders** | Avilo sends the reminders and follow-ups, and your clinic gets a proper communication hub |
| 3 | **Avilo Assistant** | Replies, reschedules, fills the waitlist and chases recalls, and hands anything clinical, emotional or unclear to a person |

Sort / Chase / Handle are retired. "AI receptionist" is used as a search phrase on `/assistant` and the profession pages only, never as the company's category.

### 2.2 Core copy

- **Headline (home):** Stop sorting reminder replies by hand.
- **Lede (home):** Avilo reads every reply to your Cliniko reminders, shows your team who's confirmed, who's cancelled and who's at risk of not showing up, and frees the slot the moment someone says no. Ten minutes to set up. Nothing changes for your patients.
- **CTA pair:** "Start your free trial" (primary, to `/start`) and "See it work" (secondary, scrolls to How it works). Trust line under every CTA: "14-day free trial · No credit card · Works with Cliniko".
- **Category phrase for titles:** Appointment confirmations for Cliniko clinics.
- **Company line (footers, Organization description, llms.txt):** Avilo takes the repetitive patient admin off the front desk of Cliniko clinics. Confirmations first. Smart Reminders and the Avilo Assistant when you need more.
- **Upgrade line:** Start with Confirmations. Move up when you're ready, no re-setup.

### 2.3 Feature list for Avilo Confirmations (the only layer with a trial)

1. Colour-coded diary showing who has confirmed, who needs a person, and who has not replied.
2. Morning list of non-responders for the team to contact.
3. Instant cancellation of "No" replies to free the slot, if the clinic chooses; otherwise flagged.
4. Patient inbox: each patient's message history as a readable thread, sorted by urgency or recency, with a one-click link to the patient's Cliniko profile to reply.
5. Avilo waitlist: the team adds patients in Avilo; when a matching slot opens in the diary, the team is alerted and contacts the patient.
6. Weekly (Monday) list of patients who cancelled and have no future appointment, sortable by location, practitioner or the clinic's preference.
7. Confirmation status written to the appointment note in Cliniko.

Delivery: everything in the app, plus a morning email digest (call list) and the Monday email (cancelled-without-rebook list).

### 2.4 Smart Reminders (summary for copy)

Everything in Confirmations, plus: Avilo sends the reminders and the follow-up nudges (day one, and the day before); a communication hub with one place for every patient message; each practitioner can have their own inbox for their own patients; no clinic mobile phones passed around. Messages come from the clinic's Avilo number. The team writes every reply; the AI does not.

### 2.5 Avilo Assistant (summary for copy)

Everything in Smart Reminders, plus: the Assistant replies to routine messages, reschedules against the live diary, offers cancelled slots to the waitlist automatically, pushes back on cancellations with a reschedule, and runs recalls and reactivation. Anything clinical, emotional or unclear goes to a person, and a staff reply pauses the Assistant on that thread. **Rolling out, labelled as such:** after-hours voice agent (add-on) and a unified inbox across channels.

### 2.6 Where AI appears in copy

- Not above the fold on the home page or `/confirmations`.
- One honest paragraph on both pages, in the detail section: "Most of Confirmations is plain rules. A yes is a yes. When a reply isn't clear, a small AI step reads it, and if it still isn't sure, it goes to your inbox for a person."
- `/assistant` describes AI plainly and says exactly what it will and will not do.

### 2.7 Honesty rules (apply to every page)

- Cliniko API limits (SMS is read-only, no waitlist access) live in FAQs only, never in sales copy.
- No competitor is named anywhere on the site.
- Dashboard or outcome numbers are attributed ("From the founder's clinic, last 90 days") or labelled "example". "Real clinics, real numbers" is retired.
- Voice and the unified inbox carry a "rolling out" label wherever they appear.
- Trial terms are always: 14 days, no credit card, one reminder email on day 12.
- Pricing basis (for the hidden page): per clinic, up to three locations, extra locations at an additional fee. Figures are placeholders until Keegan sets them.
- "Officially integrated with Cliniko" is replaced everywhere by "Integrates with Cliniko via the official API". The Cliniko page footer carries: "Cliniko is a trademark of Red Guava Pty Ltd. Avilo is an independent product and is not endorsed by Cliniko."
- No em dashes in any copy, meta tag, schema or alt text.
- Retired phrases: "AI front desk", "front desk handled", "Your AI front desk", "Officially integrated", "Real clinics, real numbers", "Sort", "Chase", "Handle" as tier names.

## 3. Site map and URLs

### 3.1 Clean URLs

All pages are served at extensionless URLs. `.htaccess` rewrites `/path` to `/path.html` internally and 301-redirects any request for `/path.html` to `/path`. `www.avilo.com.au` 301s to `https://avilo.com.au` preserving the path. `vercel.json` is deleted.

### 3.2 Pages

| URL | Source | Status |
|---|---|---|
| `/` | `src/pages/index.html` | public |
| `/confirmations` | `src/pages/confirmations.html` | public |
| `/smart-reminders` | `src/pages/smart-reminders.html` | public |
| `/assistant` | `src/pages/assistant.html` | public |
| `/pricing` | `src/pages/pricing.html` | **hidden**: `noindex,nofollow`, not linked, not in sitemap, reachable by URL |
| `/cliniko` | `src/pages/cliniko.html` | public |
| `/for/physiotherapy` | `src/pages/for/physiotherapy.html` | public |
| `/for/chiropractic` | `src/pages/for/chiropractic.html` | public |
| `/for/osteopathy` | `src/pages/for/osteopathy.html` | public |
| `/for/podiatry` | `src/pages/for/podiatry.html` | public |
| `/compare/ai-receptionist-vs-answering-service` | `src/pages/compare/ai-receptionist-vs-answering-service.html` | public |
| `/compare/ai-receptionist-vs-hiring-front-desk-staff` | `src/pages/compare/ai-receptionist-vs-hiring-front-desk-staff.html` | public |
| `/start` | `src/pages/start.html` | public |
| `/start/thanks` | `src/pages/start/thanks.html` | `noindex` |
| `/contact` | `src/pages/contact.html` | public |
| `/about` | `src/pages/about.html` | public |
| `/security` | `src/pages/security.html` | public |
| `/privacy`, `/terms` | `src/pages/privacy.html`, `src/pages/terms.html` | public |
| `/blog/`, `/blog/<slug>` | `src/pages/blog/*.html` | public |
| `/404` | `src/pages/404.html` | `noindex`, wired via `ErrorDocument` |

### 3.3 Redirects (301)

| From | To |
|---|---|
| `/features.html`, `/features` | `/confirmations` |
| `/cliniko-integration.html`, `/cliniko-integration` | `/cliniko` |
| `/index.html` | `/` |
| every other `/<page>.html` | `/<page>` |
| `/blog/index.html` | `/blog/` |
| `/app.html` | removed from deploy; returns the 404 page |

### 3.4 Navigation

Nav (all pages): Confirmations · Smart Reminders · Assistant · Pricing (omitted while hidden) · Learn, then "Log in" (to `https://app.avilo.com.au`) and the "Start free trial" button (to `/start`). No dropdowns.

Footer columns: **Product** (Confirmations, Smart Reminders, Avilo Assistant, Cliniko, Security) · **For your clinic** (Physiotherapy, Chiropractic, Osteopathy, Podiatry) · **Compare** (the two comparison pages) · **Company** (About, Learn, Contact, hello@avilo.com.au). Legal row (Privacy, Terms, Security), ABN line, "Made in Sydney", and the ElevenLabs Grants credit with link, which is a grant condition and must remain on every page.

## 4. Page designs

The visual system stays: `avilo.css` plus `aether-blend.css`, Plus Jakarta Sans self-hosted, navy hero, glass cards, teal accents. No pill badges, pulsing dots, uppercase micro-tracked labels or emoji used as icons. Icons are the existing inline SVG line set.

### 4.1 Home (`/`)

1. **Hero.** Headline, lede and CTAs from 2.2. Visual: a diary mock in the app's colour coding (three or four rows: confirmed, needs a person, no reply) beside a small "who to call this morning" card. Gentle one-time reveal, no looping animation, honours `prefers-reduced-motion`.
2. **Three outcomes strip.** "Know who's coming before you open" · "Free the slot the moment someone says no" · "A short list of who to call, not 80 texts to read". Optional attributed figure beneath.
3. **How it works.** Five numbered steps in one row: Cliniko sends your reminder as normal → the patient replies → Avilo reads it within minutes → the diary and appointment note update → your team sees the list.
4. **What the colours mean.** Three cards: They're coming / Needs a person / No reply yet, each with the diary swatch and one sentence.
5. **Everything in Confirmations.** Six cards with mini visuals, one per feature in 2.3 items 1 to 6, each linking to its anchor on `/confirmations`.
6. **The honest paragraph** from 2.6, linking to `/security`.
7. **Video slot.** Full-width card. Until the Sydney clinic video is shot, this holds the existing "same Tuesday" before/after split. When live: YouTube privacy-enhanced embed (see 6.3) with `VideoObject` schema.
8. **When you need more.** The ledger: rows are jobs, columns are Confirmations / Smart Reminders / Avilo Assistant, each cell names the owner (Cliniko, Avilo, Avilo AI, Your team). No prices. Voice and unified inbox rows marked "rolling out". An "Always a human" group at the bottom. Upgrade line beneath.
9. **Set up in ten minutes.** Three steps: paste your Cliniko API key → choose your rules (cancel on no, or flag it) → watch tomorrow's diary light up. "In Sydney? We'll come to you."
10. **Founder** block, trimmed from the current version.
11. **FAQ** (six, with `FAQPage` schema): Does anything change for my patients? Do I have to stop using Cliniko's reminders? What happens to a reply Avilo can't read? Can I reply to patients from Avilo? What does the trial include? What happens after 14 days?
12. **Final CTA** and footer. No newsletter box.

Removed from the current home page: the "what it handles" clickable tabs, the six-card AI feature grid, the hero dashboard mock, the stats band, the trust bubbles, the newsletter section.

### 4.2 `/confirmations`

Hero (pain restated, trial CTA, trust line). Six feature blocks, alternating image and copy, each with an `id` anchor and a real app screenshot where available (placeholders marked `{{SCREENSHOT}}` until supplied). The honest facts list: checks replies every few minutes; writes status to the appointment note; never sends a message on this layer; you choose cancel-on-no or flag; unclear replies always reach a person. Requirements box: a Cliniko account with SMS reminders enabled, an API key from an admin user, nothing to install. The honest AI paragraph. FAQ with schema (includes the Cliniko read-only SMS answer and the Avilo-waitlist answer). Trial CTA.

### 4.3 `/smart-reminders` and `/assistant`

Same skeleton, shorter. Each opens with "Everything in [layer below], plus". One example thread each (Smart Reminders: a day-before nudge and the patient's reply landing in a practitioner's inbox; Assistant: a reschedule handled end to end, then a clinical message routed to a person). A "who writes the replies" line. Assistant page carries the rolling-out labels for voice and the unified inbox. FAQ with schema. CTA is "Book a demo" to `/contact`.

### 4.4 `/pricing` (hidden)

Per-day cards for Confirmations and Smart Reminders with the monthly inc-GST figure one size down and never grey small print; Avilo Assistant as "from". The ledger with prices in the column heads. ROI calculator: five inputs (practitioners, appointments per week, no-show rate, average fee, minutes per day spent on replies) computing monthly hours and dollars client-side, no email gate. Requirements box. FAQ: setup fee, cancel anytime, refunds, multiple locations (up to three per clinic). `noindex,nofollow`. Placeholder figures marked `{{PRICE}}`.

### 4.5 `/cliniko`

Retitled for the search phrase. How the integration works (reads availability and replies, writes notes and appointment changes), what Cliniko does vs what Avilo adds (table, no "coming soon"), three-step setup, Cliniko FAQ with schema, trademark line in the footer.

### 4.6 Profession pages

Shared skeleton, distinct content, no shared paragraphs. Sections: that profession's front-desk pattern (two paragraphs), a typical reminder reply for that profession and what Avilo does with it, the three features that matter most, which layer most clinics of this type start on, a profession-specific FAQ (four questions, schema), trial CTA. Title pattern: "AI receptionist and confirmations for [profession] clinics on Cliniko | Avilo".

### 4.7 Compare pages

Honest category comparisons with no vendor names: what each option costs in broad terms, hours covered, what it can and cannot do, when the other option is the right call, and which Avilo layer it most resembles. `FAQPage` schema. CTA to `/start`.

### 4.8 `/start` and `/start/thanks`

Form fields: name, clinic name, email, phone, number of locations (1, 2, 3, more), on Cliniko (yes/no), optional free text. Posts to Formspree with a hidden `_subject`, a hidden `form=trial-request`, and a hidden `_gotcha` honeypot. APP 5 collection notice under the button. On success, redirect to `/start/thanks`, which says a person will activate the trial within one business day and offers the 20-minute setup call (Calendly, gated as on `/contact`). When the app's self-serve signup exists, the primary CTA target changes to it in one place (the nav partial).

### 4.9 Other pages

`/contact`: Calendly (gated as now) plus enquiry form with APP 5 notice and honeypot; FAQ answers aligned (pricing question removed while pricing is hidden). `/about`: copy aligned, founder surname and LinkedIn present, `Person` schema. `/security`: unchanged claims, plus a line pointing to the sub-processor table and a note on security headers. Legal pages: see 6.4. Blog: template and three posts updated for the new nav, footer, schema fields and clean URLs.

## 5. Build approach

A single Node script, `build.js`, with no dependencies.

- Inputs: `src/pages/**/*.html` (page bodies with a small front-matter block: title, description, canonical path, robots, OG image override, schema JSON), `src/partials/{head,nav,footer}.html`.
- Output: finished HTML written to the repo root at the same relative path (`src/pages/for/physiotherapy.html` → `/for/physiotherapy.html`), with the nav's active state set from the page path.
- Placeholders in partials: `{{title}}`, `{{description}}`, `{{canonical}}`, `{{robots}}`, `{{schema}}`, `{{body}}`, `{{year}}`, `{{active:<path>}}`.
- `npm run build` runs it; the output is committed; Hostinger deploys the root as today. `sitemap.xml` and `llms.txt` are generated by the same script from the page list, excluding `noindex` pages.
- A guard in the build fails on any em dash in output, any `.html` in an internal `href`, any page missing a title, description or canonical, or any retired phrase from 2.7.

## 6. SEO, schema, privacy and technical

### 6.1 On-page

Every page: one H1; title under 60 characters with the target phrase; description under 160 characters; canonical to the clean URL; OG and Twitter tags whose `og:url` equals the canonical; `BreadcrumbList`; descriptive link text (no bare "Learn more"); every image with `alt`, `width`, `height`, and `loading="lazy"` below the fold. The founder image is resized to 480px WebP with a JPEG fallback.

### 6.2 Structured data

- Home: `Organization` (name, legalName "Avilo Health Pty Ltd", `identifier` ABN 19 698 695 019, `sameAs` LinkedIn, founder `Person` with `sameAs`), `SoftwareApplication` with the company line as description and no `offers` while pricing is hidden, `FAQPage`.
- Product pages: `SoftwareApplication` plus `FAQPage`.
- Profession and compare pages: `FAQPage`.
- Blog: `BlogPosting` with `datePublished`, `dateModified`, `image`, `mainEntityOfPage`, author `Person`; blog index `Blog`.
- Video: `VideoObject` on the home page once the embed is live.
- `llms.txt` at the root: definition sentence, the three layers, the Confirmations feature list, integration, data handling, company facts, key URLs.

### 6.3 Video and third-party loading

The testimonial video is uploaded to YouTube and embedded on the home page using `https://www.youtube-nocookie.com/embed/<id>`, visible on page load (not click-gated). This loads scripts from Google on the home page, so Privacy Policy A3 changes from "does not load scripts from third parties" to a disclosure that the home page embeds a YouTube video in privacy-enhanced mode, that loading the page connects the browser to Google, and that Google's privacy policy applies, with a link. No consent banner is added; Australian law does not require one and the site sets no tracking cookies of its own. Calendly remains click-gated on `/contact` and `/start/thanks`.

### 6.4 Legal and privacy edits (same commit as the pages)

- Terms §2 and §5: "Notifications plan" becomes "Confirmations"; §11 keeps "as quoted" while pricing is hidden.
- Terms §5 and all marketing: "Officially integrated" removed; trademark line added on `/cliniko`.
- Privacy A1: add retention for enquiry, trial-request and newsletter data (24 months) and server logs (90 days). A3: YouTube disclosure (6.3). B5: add the web host as a provider with its data location. Dates bumped.
- APP 5 one-line notice under every form and the Calendly gate.
- `/security`: unchanged claims; add sub-processor pointer and a note that the site sets HSTS and related headers.

### 6.5 Server and crawl

`.htaccess`: clean-URL rewrites, the 301 map in 3.3, www redirect, `ErrorDocument 404`, and headers: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Content-Security-Policy: frame-ancestors 'self'`. `robots.txt`: allow all, disallow only the blog template, sitemap line. `sitemap.xml` generated with `lastmod`. `app.html` deleted from the repo root (the mock is preserved under `_archive/`).

### 6.6 Accessibility

Skip link on every page; nav toggle with `aria-expanded` and `aria-controls`; any tabbed component with tablist semantics and arrow-key support; no text below 0.75rem that carries meaning; contrast checked on all small grey text; all decorative images `alt=""`.

## 7. Content inventory to produce

| Item | Count | Notes |
|---|---|---|
| New page bodies | 12 | confirmations, smart-reminders, assistant, pricing (hidden), cliniko, 4 profession, 2 compare, start, start/thanks |
| Rewritten page bodies | 7 | home, contact, about, security, privacy, terms, 404 |
| Updated blog files | 5 | index, template, 3 posts |
| Partials | 3 | head, nav, footer |
| Build script and guard | 1 | `build.js` |
| Server config | 3 | `.htaccess`, `robots.txt`, generated `sitemap.xml` and `llms.txt` |
| Assets | 2 | resized founder image, diary mock SVG/HTML |
| Placeholders for Keegan | | `{{PRICE}}` values, `{{SCREENSHOT}}` app images, `{{VIDEO_ID}}`, testimonial quotes |

## 8. Testing and verification

- Build guard passes (no em dashes, no `.html` internal links, no retired phrases, every page has title, description, canonical).
- Every JSON-LD block parses and validates in Google's Rich Results test for its type.
- Local preview with `npx serve` for visual checks; `.htaccess` behaviour verified on Hostinger after deploy by requesting `/features.html` (expect 301 to `/confirmations`), `/pricing` (expect 200 with `noindex`), `www.avilo.com.au` (expect 301), and a missing path (expect 404 page).
- Mobile and desktop screenshots of every new page.
- Privacy policy text matches actual third-party loading: a network trace of `/` shows only avilo.com.au and youtube-nocookie.com/google domains; a trace of any other page shows avilo.com.au only.
- Accessibility pass with a browser audit on home, confirmations and start.

## 9. Open items for Keegan (do not block the build)

- Price figures for the hidden pricing page.
- App screenshots for the six Confirmations features.
- The testimonial video and its YouTube ID.
- Two short quotes from early users (first name, role, clinic type, suburb).
- Confirmation that `privacy@`, `support@` and `hello@avilo.com.au` all receive mail.
- Whether to publish Confirmations as a Cliniko connected app listing once the trial flow exists.
