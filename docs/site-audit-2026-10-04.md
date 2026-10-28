# Avilo website audit

Date: 4 October 2026
Scope: avilo.com.au as deployed (live files match the repo at commit dc6c76c). Every page, robots/sitemap, live HTTP headers, DNS, structured data, legal pages.
Method: full read of every HTML file, live probes of the production host, no SEO tool connected (keyword difficulty figures below are estimates, not tool data).

---

## 1. Executive summary

The site is well above average for a founder-built static site. Copy is specific and human, the legal pages are unusually thorough for a company this size, there are zero third-party requests on page load, and the technical basics (canonicals, OG tags, JSON-LD, sitemap, HTTPS, Brotli, caching) are mostly in place.

The problems are not polish problems. They are consistency and trust problems, and four of them are doing real damage right now:

1. **The pricing page is blocked in robots.txt.** It is public, linked from every footer, in the sitemap, and quoted in the homepage meta description, yet `Disallow: /pricing.html` stops Google and every AI assistant from reading it. Anyone asking ChatGPT, Perplexity or Google AI Mode "how much does Avilo cost" gets a competitor's answer or a guess.
2. **The site tells three different stories about what is live and what it costs.** The Cliniko page says calls, recalls and waitlist are "Coming soon". The pricing, features and home pages sell them as live today. The contact FAQ says pricing is a bespoke quote. The Terms describe a "Notifications plan" that no longer exists. A buyer who reads two pages will notice.
3. **"Officially integrated with Cliniko" vs Terms §5 "not affiliated with or endorsed by any specific PMS".** Six pages use the word "Officially". The legal page says the opposite. That is both a Cliniko partner risk and an Australian Consumer Law risk.
4. **There is no social proof anywhere.** No named clinic, no quote, no logo, no case study, no review link. The stats band says "Real clinics, real numbers" with no attribution. For software that reads patient data, this is the single biggest conversion blocker on the site.

Fix those four and the site goes from "credible founder project" to "safe to recommend to my practice manager". Everything else below is ranked behind them.

**Overall assessment: strong foundation, needs work on trust and consistency.**

### Scorecard

| Area | Score | One-line verdict |
|---|---|---|
| Messaging clarity | 6/10 | Great sentences, four competing category labels, audience buried |
| Speed to value | 6/10 | Hero is good; the page then says the same thing three more times |
| Trust and proof | 3/10 | Zero social proof, status contradictions, "Officially" claim |
| Conversion path | 5/10 | One CTA (demo) for a $79 product; no video, trial or phone line |
| Privacy and cookies | 8/10 | Compliant for Australia, cookieless, Calendly gated; two APP 5 gaps |
| Legal consistency | 5/10 | Terms reference retired plan names and an unpublished DPA |
| Technical SEO | 6/10 | Pricing blocked, www not redirected, og:url points at 404s |
| Agentic search readiness | 4/10 | No llms.txt, thin entity data, no comparison pages, pricing unreadable |
| Content depth | 4/10 | Three ~900-word posts, no cluster, no interlinking |
| Accessibility and performance | 6/10 | Fast and light; emoji icons, no skip link, no ARIA on tabs, CLS on founder photo |

---

## 2. Messaging: does it convey value as well as it could?

### What works
- The lede under the H1 is excellent: "answers overflow and after-hours messages, confirms appointments and revives lapsed patients, so your team can focus on the people in the room." Concrete, outcome-led, human.
- The "same Tuesday, with and without Avilo" split is the best section on the site. It sells the pain and the fix in one glance.
- The founder story is specific and credible. "Replying to the reminder that literally says do not reply" is a line a real physio wrote.
- "Most tools only answer the phone. Avilo is where every conversation lives." is a real differentiator in one breath.

### What is holding it back

**Four category labels for one product.** Across titles, H1s and footers the site calls itself: "AI receptionist and communication hub" (title), "the front desk that never misses a message" (hero), "One AI front desk" (features grid), "the communication hub for allied health clinics" (home footer), "One receptionist for your phone and your texts" (pricing hero). Buyers and LLMs both need one noun phrase repeated everywhere. Your own strategy doc already picked it: **communication hub for clinics, with AI on top.** The title tag is the right compromise. Make every H1, footer blurb and schema description agree with it.

**The audience is not in the hero.** "Allied health" and "Cliniko" only appear in the small grey line under the buttons. In a 5-second test a physio owner should know this is for them before they scroll. The lede should open with the audience: "For allied health clinics on Cliniko: Avilo answers..."

**The rotating word in the H1 costs more than it earns.** "Texts, handled" → "Reminders, handled" → "Reschedules, handled" is cute but the first frame a visitor sees is random, and it makes the H1 unquotable for AI summaries. Keep it if you love it, but make the first word the strongest one ("Messages") and consider stopping after one cycle.

**The homepage repeats itself.** Section order is: hero → stats → "What Avilo handles" (6 cards) → breaker → "What it handles" (5 clickable tabs) → "A look inside" (dashboard) → Tuesday → setup → founder → FAQ → newsletter → CTA. Two consecutive sections have near-identical headings and cover the same five capabilities. The nav link "How it works" lands on a section titled "What it handles". Cut the 6-card grid (the tabs do its job better and show the product) or demote it to a compact row of six links.

**"Real clinics, real numbers" is unattributed.** 3,000+ messages a month, 450+ confirmations a week, 1 to 2 hours a day. If these come from your own clinic and early users, say so: "From the founder's clinic and first customers, last 90 days." Specific and modest beats vague and grand, and it becomes social proof instead of a claim.

**The dashboard mock says "real clinic, last 30 days" while the features page says "Example clinic, illustrative figures."** Pick one disclosure and use it everywhere the dashboard appears.

**Emoji as icons** (📍 ✋ 📖 ☎ 💬 🇦🇺) appear six times on the home page alone. You flagged this yourself as a template tell. Swap for the same line icons used in the feature cards.

### Fix list (messaging)
| # | Change | Where | Effort |
|---|---|---|---|
| M1 | One category phrase site-wide: "the communication hub for allied health clinics, with AI that handles the routine" | all H1s, footers, meta, JSON-LD | 1 hr |
| M2 | Lead the hero lede with audience + integration | index.html hero | 10 min |
| M3 | Remove the 6-card "What Avilo handles" grid or compress to a single row of six links into the tabs | index.html | 30 min |
| M4 | Rename the tabs section heading to match the nav ("How it works") | index.html | 5 min |
| M5 | Attribute the stats band honestly | index.html | 10 min |
| M6 | Replace emoji icons with SVG line icons | index.html, features.html | 30 min |
| M7 | Unify dashboard disclosure wording | index.html, features.html | 10 min |

---

## 3. Trust and conversion

### Status contradictions (fix before anything else)

| Page | Says | Conflicts with |
|---|---|---|
| cliniko-integration.html table | Calls, recalls, waitlist = "Coming soon" | pricing.html, features.html, index.html sell all three as live |
| contact.html FAQ "How much does Avilo cost?" | "we'll quote a package" | pricing.html, index FAQ, meta descriptions quote $79 and $149 |
| terms.html §2 and §5 | "Notifications plan" | pricing.html calls it "Reminders" |
| terms.html §2, §12, §13, §16 | DPA "available on request", cites DPA §6, §11, §12 | No DPA exists yet |
| 6 pages | "Officially integrated with Cliniko" | terms.html §5 "not affiliated with or endorsed by any specific PMS" |
| index hero lede | "revives lapsed patients" | Your own shipped-vs-marketed note says recalls are not shipped |

**Recommendation on the "live vs coming soon" question.** You made a call on 29 August to present voice and waitlist as live. That is your decision and this audit does not relitigate it. But it has to be one decision applied everywhere. Right now the Cliniko page undoes it, and a careful buyer will trust the page that says "coming soon" over the one that says "live". Either update the Cliniko table to match, or reintroduce honest staging ("Available now / Rolling out") everywhere. Half and half is the worst of both.

**"Officially" must go unless Cliniko has signed off in writing.** Replace with "Integrates with Cliniko via the official API" on all six pages. Keep the Cliniko page eyebrow as "Built on the official Cliniko API". Add the standard disclaimer in the footer of the Cliniko page: "Cliniko is a trademark of Red Guava Pty Ltd. Avilo is an independent product."

### Social proof (the biggest gap)

Nothing on the site shows that any clinic other than yours uses Avilo. Ranked by effort:

1. **Attribute the stats band** (10 minutes, see M5).
2. **One founder-clinic case study.** You have real data (the 30-day dashboard in the hero). Turn it into a 400-word page: clinic size, before, after, what surprised you. Name the clinic if you can.
3. **Two quotes from early users**, first name, role, clinic type, suburb. Even "practice manager, 3-practitioner physio clinic, Inner West" is enough. No patient testimonials (AHPRA advertising rules do not apply to Avilo itself, but clinic-side quotes about patient outcomes could drag your customers into them, so keep quotes about admin time and bookings).
4. **The iMove DNA analysis** (if they consent) is a strong "revenue at risk" case study and lead magnet.
5. **A Cliniko marketplace / integrations listing** and a Google Business Profile for Avilo Health Pty Ltd. Both are third-party entity signals that AI search weighs heavily.

### Conversion path

Every CTA on every page is "Book a demo". For a $79 to $149 a month product that is a lot of friction, and a 30-minute call is a big ask for a busy clinic owner.

- **Add a live demo phone number.** You sell phone answering. Put an Avilo-answered number in the hero: "Call 02 xxxx xxxx and book a fake appointment. Avilo will answer." It is the most convincing demo possible, it costs you nothing, and no competitor does it. (Set it up against a sandbox Cliniko diary.)
- **Add a 90-second product video** to the hero or "A look inside" section. Screen recording of a real reschedule thread and the Cliniko write-back. Host it on YouTube unlisted and gate the embed the same way you gate Calendly, or self-host an MP4.
- **Secondary CTA in the hero: "See pricing"** instead of "See what it handles". Pricing is public now; use it.
- **Consider a self-serve trial on the Reminders tier.** It is one-way and low risk. "Try Reminders free for 14 days" converts the people who will never book a call.
- **Add a "Log in" link** to the nav for app.avilo.com.au. Existing customers need it, and it signals a shipped product.
- **The newsletter promises "weekly tips".** If no weekly email exists yet, change to "occasional" or remove the box. A promise you cannot keep on the homepage undermines the rest.

---

## 4. Privacy, cookies and legal compliance

### Verdict: compliant for Australia, with two gaps to close

Australia has no cookie-consent law. The obligations are Privacy Act 1988 / APPs disclosure obligations, plus the Spam Act for the newsletter and campaign SMS. Against those:

| Check | Status | Notes |
|---|---|---|
| Cookie banner required? | **Not required** | No analytics, no tracking, no third-party scripts on load. Fonts self-hosted. Calendly loads only on click with an explicit notice. This is genuinely best practice and better than most enterprise sites. |
| Privacy policy covers APP 1 content (what, why, who, overseas, access, complaints) | **Pass** | Unusually thorough. Part C (automated decisions) is ahead of the 10 Dec 2026 APP 1.7 requirement. |
| Overseas disclosure (APP 8) | **Pass** | Sub-processor table with countries. Treats US-incorporated AU-hosted providers as overseas recipients. Correct. |
| Health information handling | **Pass** | Correctly identifies sensitive information, state health records acts, no audio, no clinical notes. |
| Notifiable Data Breaches | **Pass** | 72-hour clinic notification commitment, OAIC process referenced. |
| **APP 5 collection notice at point of collection** | **Gap** | The contact form, newsletter form and Calendly gate do not link to the privacy policy or say what the data is used for. Add one line under each: "We use this only to reply to you. See our privacy policy." |
| **Web host not listed as a provider** | **Gap** | A1 says server logs (IP, browser, pages) are collected. The host (Hostinger) is not in the B5 table and its data location is not stated. Add a row. |
| Part A retention period | **Gap (minor)** | B8 gives retention for patient data. Nothing says how long enquiry emails, form submissions or server logs are kept. Add one sentence. |
| privacy@ and support@ mailboxes | **Verify** | The policy and terms rely on three addresses (hello@, privacy@, support@). MX records exist on Hostinger, so they are configurable. Confirm all three receive mail, or alias them to hello@. |
| Spam Act (newsletter) | **Pass with caveat** | Opt-in checkbox not required for a dedicated subscribe form, but every email sent must identify Avilo Health Pty Ltd and carry an unsubscribe link. Make sure the sending tool does that before the first send. |
| Spam Act (recall SMS) | **Pass** | Terms §9 and privacy B4 handle this well. |
| ACL "No credit card · No commitment" | **Pass** | Accurate for a demo. Would need revisiting if a trial with card capture is added. |
| Email authentication | **Improve** | SPF present, DMARC is `p=none`. Move to `p=quarantine` once DKIM is confirmed for Hostinger mail and Resend. Protects hello@ replies from spoofing and improves deliverability of transactional email to clinic staff. |

### Legal page staleness
- Terms: replace "Notifications plan" with "Reminders plan" in §2 and §5.
- Terms §11 says "as set out in your order form or as quoted". Now that pricing is public, say "as published at avilo.com.au/pricing or in your order form".
- Terms §2 and §12: either publish the DPA or change "incorporated into these Terms" to "will be provided before onboarding and forms part of these Terms once signed". Citing clause numbers of a document that does not exist is a problem if a clinic ever asks for it.
- Privacy "Last updated 2 August 2026" predates public pricing, the stats band and the newsletter. Bump the date when you make the changes above.
- Security page: fine and honest. Add a line on sub-processors linking to privacy B5, and a line on security headers once they are set (see section 6).

---

## 5. SEO

### Keyword opportunity table

No SEO tool is connected, so difficulty and demand are estimates from the competitive landscape (Lyngo, Aeva, Cliniq Apps, BookedSolid, Routiq, Rebookr). Connect Ahrefs or Semrush via MCP to replace these with real numbers.

| Keyword | Est. difficulty | Opportunity | Current ranking | Intent | Recommended content |
|---|---|---|---|---|---|
| Cliniko AI receptionist | Easy | **High** | Likely page 1-2 | Commercial | cliniko-integration.html (retitle) |
| Cliniko two-way SMS / reply to Cliniko reminders | Easy | **High** | Unknown | Commercial | New page: "Two-way SMS for Cliniko" |
| AI receptionist for physio clinic Australia | Moderate | **High** | Unknown | Commercial | Home page title/H1 |
| allied health answering service | Moderate | **High** | Unknown | Commercial | Features or new landing page |
| after hours phone answering physio | Easy | **High** | None | Commercial | New landing page |
| Lyngo alternative / Lyngo vs | Easy | **High** | None | Commercial | Publish the archived comparison page |
| Aeva alternative | Easy | **High** | None | Commercial | Publish the archived comparison page |
| Cliniq Apps alternative | Easy | Medium | None | Commercial | Archived comparison page |
| BookedSolid alternative Australia | Easy | Medium | None | Commercial | Archived comparison page |
| reduce no shows physiotherapy | Moderate | **High** | Unknown | Informational | Existing post; expand to 1,800+ words |
| no show rate allied health Australia | Easy | Medium | None | Informational | New data post (use DNA tool output) |
| appointment confirmation SMS template physio | Easy | **High** | None | Informational | New post with copy-paste templates |
| patient recall SMS template allied health | Easy | **High** | None | Informational | New post with templates |
| what does a missed call cost a clinic | Easy | Medium | Existing post | Informational | Add a calculator |
| Cliniko integrations | Moderate | Medium | Unknown | Navigational | Cliniko page |
| Cliniko reminders not tracked / confirmation status | Easy | Medium | None | Informational | New post |
| AI phone answering privacy Australia health | Easy | Medium | None | Informational | Expand security.html into a guide |
| virtual receptionist physio Australia | Moderate | Medium | None | Commercial | Landing page |
| waitlist software Cliniko | Easy | Medium | None | Commercial | Feature page section |
| podiatry / chiro / osteo receptionist AI | Easy | Medium | None | Commercial | Three thin profession pages |

### On-page issues

| Page | Issue | Severity | Fix |
|---|---|---|---|
| robots.txt | `Disallow: /pricing.html` while pricing is public and in sitemap | **Critical** | Delete the line |
| features.html, about.html, contact.html | `og:url` points to extensionless URLs that return 404 on Hostinger | High | Match canonical (`.html`) or implement clean URLs (section 6) |
| www.avilo.com.au | Returns 200, no redirect to apex | High | 301 www → apex in .htaccess |
| app.html | Live, indexable, no canonical, `lang="en"`, mock data | High | Add `noindex` or remove from deploy |
| pricing.html | Title "Pricing \| Avilo" carries no keyword; no OG tags; no Offer schema | High | "Avilo pricing: AI receptionist for Cliniko clinics from $79/month" + OG + Offer JSON-LD |
| features.html | Meta description is ~330 characters | Medium | Trim to 155 |
| security.html | No OG tags | Low | Add |
| sitemap.xml | No `lastmod` | Medium | Add dates; AI crawlers use them for freshness |
| blog posts | BlogPosting lacks `dateModified`, `image`, `mainEntityOfPage` on 2 of 3 | Medium | Add to all and to the template |
| blog/index.html | No `Blog` or `ItemList` schema; nav label "Learn" hides it from "blog" intent | Low | Add schema; consider "Blog" or "Guides" |
| all pages | No `BreadcrumbList` | Low | Add on blog and sub-pages |
| index.html JSON-LD Organization | No `sameAs`, `legalName`, ABN; founder Person has no `sameAs` | Medium | Add LinkedIn, legalName "Avilo Health Pty Ltd", `identifier` ABN |
| cliniko-integration.html | Title could target the money keyword | Medium | "AI receptionist for Cliniko: calls, SMS and confirmations \| Avilo" |

### Content gaps

| Topic | Why | Format | Priority | Effort |
|---|---|---|---|---|
| Comparison pages (Lyngo, Aeva, Cliniq Apps, BookedSolid) | Highest-intent queries in the category; four drafts already exist in `_archive/` | Comparison page each | **High** | Half day (verify competitor claims first) |
| "Two-way SMS for Cliniko" landing page | The one thing Cliniko cannot do and your strongest wedge | Landing page | **High** | Half day |
| SMS template packs (confirmations, recalls, waitlist offers) | Easy wins, high shareability, naturally link to features | Blog post each | **High** | 2 hrs each |
| No-show benchmark post using DNA tool data | Original data earns links and AI citations | Data post | High | Half day |
| Founder-clinic case study | Social proof and a citable entity fact | Case study page | **High** | 2 hrs |
| Profession pages (physio, chiro, osteo, podiatry, exercise phys) | Long-tail commercial intent, thin pages OK | Landing page each | Medium | 1 hr each |
| "How Avilo decides when a human sees a message" explainer | Unique trust content; Part C of the privacy policy is already written | Guide | Medium | 2 hrs |
| Glossary (DNA, recall, reactivation, overflow, confirmation rate) | Entity definitions LLMs love to cite | Glossary page | Medium | 2 hrs |
| Expand existing 3 posts to 1,800+ words with internal links | Currently ~900 words, no cross-links | Edit | Medium | 1 hr each |

---

## 6. Technical and performance

| Check | Status | Details |
|---|---|---|
| HTTPS, HTTP → HTTPS | Pass | 301 in place |
| www → apex redirect | **Fail** | www serves a 200 duplicate |
| Compression | Pass | Brotli on CSS |
| Caching | Pass | 7-day `Cache-Control` on static assets |
| Security headers | **Fail** | No HSTS, X-Content-Type-Options, X-Frame-Options / frame-ancestors, Referrer-Policy or Permissions-Policy. All settable in `.htaccess` on LiteSpeed. A Security page with no security headers is an easy thing for a prospect's IT person to ding. |
| Clean URLs | Fail | `/features` 404s; `vercel.json` is dead config. Either implement rewrites in `.htaccess` and 301 `.html` → clean, or delete `vercel.json` and fix the `og:url`s |
| 404 page | Pass | Custom, branded, correct status |
| Page weight | Pass | Home 62 KB HTML, ~60 KB CSS, fonts ~50 KB on first load |
| Image dimensions | **Fail** | `founder-keegan.jpg` is 374 KB, no `width`/`height`, no `loading="lazy"`, used on 5 pages. Causes CLS and wasted bytes. Resize to 480px, WebP, add dimensions |
| OG image | Pass (size) | 807 KB PNG is fine for OG, but a 200 KB JPEG would be kinder |
| Mobile viewport | Pass | |
| `prefers-reduced-motion` | Pass | Honoured in CSS and the rotating-word JS |
| Skip link | Fail | None |
| Nav toggle | Fail | `aria-label` present but no `aria-expanded` / `aria-controls` |
| Clickable tabs (fn-card) | Fail | No `role="tablist"`, `aria-selected`, or keyboard arrow support |
| Rotating H1 word | Warn | Screen readers get a shifting heading; acceptable, but consider `aria-live="off"` on the span |
| Micro text | Warn | Dashboard mock labels at 0.56rem (~9px), uppercase tracked, light grey. Decorative, but contrast-fails if read |
| Forms spam protection | Warn | Formspree with no honeypot field. Add `<input type="text" name="_gotcha" style="display:none">` |
| `app.html` | Fail | Deployed and indexable |
| Email auth | Improve | DMARC `p=none` |

---

## 7. Agentic search readiness

AI assistants (ChatGPT search, Perplexity, Google AI Mode, Claude) build answers from (a) pages they can fetch, (b) consistent entity facts across your site and third parties, (c) structured data, and (d) definitional, quotable sentences. Scored against that:

| Factor | Status | Fix |
|---|---|---|
| AI crawlers allowed | Pass | `Allow: /` covers GPTBot, ClaudeBot, PerplexityBot, Google-Extended |
| Pricing fetchable | **Fail** | Blocked by robots.txt |
| `llms.txt` | Missing | Add a 40-line plain-text summary: what Avilo is, who for, pricing, integration, data residency, links to key pages |
| One consistent product definition | **Fail** | Four category phrases (section 2) |
| Definitional paragraph | Missing | A single sentence LLMs can lift: "Avilo is a communication hub and AI receptionist for Australian allied health clinics that use Cliniko. It answers calls and texts, confirms appointments, and writes bookings back to the Cliniko diary. Plans from $79 a month." Put it in the About page, the home FAQ, `llms.txt` and the Organization `description`. |
| Entity data | Partial | Organization lacks `sameAs` (LinkedIn), `legalName`, ABN; no Person `sameAs`; no Google Business Profile; no Cliniko marketplace listing; no Crunchbase/LinkedIn company page link |
| FAQ coverage | Partial | 4 + 4 + 5 questions. Add the questions buyers actually ask an assistant: "Does Avilo work without Cliniko?", "Is Avilo HIPAA / Privacy Act compliant?", "Does Avilo record calls?", "Can patients tell it's AI?", "How does Avilo compare to Lyngo?" |
| Comparison content | Missing | Four drafts in `_archive/`. "X vs Y" and "X alternative" are the most-asked commercial queries in AI search |
| Original data | Missing | The DNA tool can produce a benchmark no one else has |
| Third-party mentions | Weak | LinkedIn only. Cliniko marketplace, Australian Physiotherapy Association partner directory, Capterra/G2 listing, a guest post on a Cliniko-adjacent blog |
| `dateModified` freshness | Missing | Blog and legal pages |
| Blocking of training crawlers | n/a | You allow them; that is the right call for a site that wants to be cited |

---

## 8. Prioritised action plan

### Quick wins (this week, under 2 hours each)

| # | Action | Impact | Effort |
|---|---|---|---|
| Q1 | Delete `Disallow: /pricing.html` from robots.txt | **High** | 1 min |
| Q2 | 301 www → apex, add security headers, noindex `app.html`, honeypot on forms (all in `.htaccess` and HTML) | High | 30 min |
| Q3 | Replace "Officially integrated" with "Integrates with Cliniko via the official API" on 6 pages; add Cliniko trademark line | **High** | 20 min |
| Q4 | Fix the Cliniko page "Coming soon" rows to match the rest of the site (or restore honest staging everywhere) | **High** | 30 min |
| Q5 | Fix contact FAQ pricing answer to match pricing.html | High | 5 min |
| Q6 | Terms: "Notifications plan" → "Reminders plan"; §11 → link pricing; DPA wording | Medium | 20 min |
| Q7 | APP 5 one-liner under contact form, newsletter and Calendly gate; add Hostinger to the B5 table; Part A retention sentence; bump dates | Medium | 30 min |
| Q8 | Fix `og:url` on features/about/contact; add OG to pricing and security; trim features meta description; retitle pricing and Cliniko pages | Medium | 30 min |
| Q9 | Attribute the stats band; unify dashboard disclosure | Medium | 10 min |
| Q10 | Add `sameAs`, `legalName`, ABN to Organization; `dateModified`, `image`, `mainEntityOfPage` to all BlogPosting; `lastmod` to sitemap | Medium | 45 min |
| Q11 | Publish `llms.txt` | Medium | 30 min |
| Q12 | Resize founder photo, add dimensions and lazy loading | Low | 15 min |
| Q13 | Add "Log in" to nav; newsletter copy honesty | Low | 10 min |

### Strategic (this quarter)

| # | Action | Impact | Effort | Depends on |
|---|---|---|---|---|
| S1 | One category phrase site-wide and audience-first hero lede | **High** | Half day | Your decision on the noun |
| S2 | Live demo phone number in the hero | **High** | Half day | Sandbox Cliniko diary |
| S3 | Founder-clinic case study + two user quotes | **High** | 1 day | Permissions |
| S4 | Publish the four comparison pages after verifying competitor claims | **High** | 1 day | Claim verification |
| S5 | "Two-way SMS for Cliniko" landing page | High | Half day | S1 |
| S6 | 90-second product video, gated embed | High | 1 day | Screen recording |
| S7 | Cut or compress the 6-card grid; rename tabs section | Medium | 2 hrs | S1 |
| S8 | SMS template posts (confirmation, recall, waitlist) + no-show benchmark from DNA data | High | 2 days | DNA data consent |
| S9 | Clean URLs via `.htaccess` rewrites with 301s, or delete `vercel.json` | Medium | 2 hrs | Decide |
| S10 | Accessibility pass: skip link, `aria-expanded`, tablist semantics, replace emoji icons | Medium | Half day | |
| S11 | Publish the DPA; reconcile clause numbers with Terms | Medium | 1 day (legal review) | |
| S12 | Cookieless analytics (Plausible or Cloudflare Web Analytics) + update privacy A3 in the same commit | Medium | 1 hr | |
| S13 | Google Business Profile, Cliniko marketplace listing, APA partner directory | Medium | 2 hrs + waiting | |
| S14 | DMARC to `p=quarantine` after DKIM verified | Low | 30 min | DKIM |

---

## 9. Ready-to-paste prompts

Each prompt is scoped so it can run on its own in Claude Code from the repo root. Run them in order; the first three are the ones that matter most.

### P1. Unblock pricing and fix crawl hygiene
```
In the Avilo site repo: (1) remove the `Disallow: /pricing.html` line from robots.txt, keep the template disallow. (2) Add `<meta name="robots" content="noindex,nofollow">` to app.html. (3) In .htaccess, add a 301 from www.avilo.com.au to https://avilo.com.au preserving the path, and add these headers: Strict-Transport-Security max-age=31536000; includeSubDomains, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy camera=(), microphone=(), geolocation=(), and a Content-Security-Policy frame-ancestors 'self'. Hostinger runs LiteSpeed with .htaccess support, so use mod_headers and mod_rewrite syntax. (4) Add `<lastmod>` to every sitemap.xml entry using each file's last git commit date. (5) Fix og:url on features.html, about.html and contact.html to match each page's canonical. Add og:title/description/image/url to pricing.html and security.html. Trim the features.html meta description to under 160 characters. Do not change any visible copy. Show me the diff before committing.
```

### P2. Make every page tell the same product story
```
Audit every HTML page in the Avilo site for claims about what is live, what it costs, and the Cliniko relationship, and make them consistent with pricing.html, which is the source of truth. Specifically: (a) cliniko-integration.html comparison table currently says calls, recalls and waitlist are "Coming soon" while pricing.html sells them as included; update the three rows to match pricing.html. (b) contact.html FAQ "How much does Avilo cost?" says pricing is quoted per package; rewrite it to match the index.html FAQ answer and link to pricing.html. (c) Replace every instance of "Officially integrated with Cliniko" with "Integrates with Cliniko via the official API" and add this line to the cliniko-integration.html footer: "Cliniko is a trademark of Red Guava Pty Ltd. Avilo is an independent product and is not endorsed by Cliniko." (d) In terms.html replace "Notifications plan" with "Reminders plan" in §2 and §5, and in §11 change "as set out in your order form or as quoted to you" to "as published at avilo.com.au/pricing.html or as set out in your order form". Do not use em dashes anywhere. List every change you made with file and line.
```

### P3. Close the privacy gaps
```
In the Avilo site: (1) Under the contact form submit button in contact.html, under the newsletter form in index.html, and inside the Calendly gate text, add a one-line APP 5 collection notice in sentence case, e.g. "We use these details only to reply to you. See our Privacy Policy." linking to privacy.html. (2) In privacy.html section B5 add a table row for Hostinger (website hosting and server logs, state the data location as "European Union / United States, website logs only, no patient data" unless I tell you otherwise). (3) In privacy.html Part A add a sentence after A1 giving retention for enquiry and newsletter data (24 months unless we are in an ongoing conversation) and server logs (90 days). (4) Add a hidden honeypot input named _gotcha to both Formspree forms. (5) Update the "Last updated" dates on privacy.html to today's date. Keep the existing voice, no em dashes, and show the diff.
```

### P4. One category phrase and an audience-first hero
```
I want one consistent category phrase across the Avilo site: "the communication hub for allied health clinics, with AI that handles the routine conversations". Keep the existing hero H1 exactly as it is. Rewrite the hero lede on index.html so it opens with the audience and integration ("For allied health clinics on Cliniko: ..."), then the three outcomes already in the current lede. Update the footer blurb on every page, the pricing.html H1, the features.html grid heading "One AI front desk..." and the JSON-LD SoftwareApplication and Organization description fields so they use the category phrase or a close variant. Avoid "front desk handled" or replacement language. No em dashes. Show me each before/after pair before applying.
```

### P5. Social proof section
```
Add a social proof section to index.html between the stats band and the features section. Design it in the existing glass-card style from aether-blend.css, restrained, no pill badges, no pulsing dots, no uppercase micro-labels. It should hold: a one-line attribution for the stats band ("From the founder's clinic and first customers, last 90 days"), two quote cards with placeholders for first name, role, clinic type and suburb, and a link to a new case-study page at /case-study-founder-clinic.html. Create that case study page from the existing page template (nav, footer, ElevenLabs grant credit) with placeholder headings: The clinic, Before Avilo, What changed, The numbers (reuse the dashboard figures from the hero mock), What surprised me. Mark every placeholder with {{ }} so I can fill it in. Add the page to sitemap.xml.
```

### P6. llms.txt and entity schema
```
Create /llms.txt for avilo.com.au following the llmstxt.org format: an H1 with the company name, a blockquote one-sentence definition ("Avilo is a communication hub and AI receptionist for Australian allied health clinics that use Cliniko. It answers calls and texts, confirms appointments and writes bookings back to the Cliniko diary."), then sections for Product, Pricing (pull exact figures from pricing.html), Integration, Data and privacy (Australian hosting, no model training, no call audio), Company (Avilo Health Pty Ltd, ABN 19 698 695 019, Sydney, founder Keegan Brady, physiotherapist), and Key pages with absolute URLs. Then update the index.html JSON-LD: add legalName "Avilo Health Pty Ltd", an identifier for the ABN, sameAs with the LinkedIn URL from about.html, and add sameAs to the founder Person. Add dateModified, image (the OG image) and mainEntityOfPage to every BlogPosting in blog/ including the template. Add a Blog schema to blog/index.html. Add an Offer-based JSON-LD block to pricing.html with the four plans. Validate every JSON-LD block parses.
```

### P7. Publish comparison pages
```
The folder _archive/ holds four unpublished comparison pages: avilo-vs-lyngo.html, avilo-vs-aeva.html, avilo-vs-cliniq-apps.html, avilo-vs-bookedsolid.html. Each has an amber "verify" list of unconfirmed competitor claims. For each page: list the unverified claims for me to confirm; do not publish anything until I answer. Then, once I confirm, move the page to the site root, remove the verify list and any noindex, match the current nav/footer from index.html (including the ElevenLabs grant credit), add FAQPage JSON-LD with three questions per page ("Is Avilo a Lyngo alternative?", "What does Avilo do that Lyngo does not?", "Which is cheaper for a 3-practitioner clinic?"), add each to sitemap.xml and link all four from a new "Compare" row in the Product footer column. Keep the tone fair and factual: say what the competitor does well. No em dashes.
```

### P8. Homepage de-duplication
```
On index.html, the "What Avilo handles" six-card grid and the clickable "What it handles" tab section cover the same capabilities. Remove the six-card grid section and its CSS, and replace the heading of the tabs section with "How it works" so it matches the nav link that already points to #how. Move the breaker band ("Most tools only answer the phone...") to sit directly under the stats band. Make sure the #features anchor still resolves (point it at the tabs section). Replace every emoji used as an icon on the page (pin, hand, book, phone, speech bubble) with inline SVG line icons in the same style as the feature-card icons, keeping the Australian flag only in the footer. Verify in the browser at mobile and desktop widths and screenshot both.
```

### P9. Accessibility pass
```
Do an accessibility pass on every HTML page in the Avilo site without changing visual design: add a visually hidden "Skip to content" link as the first element in body that targets the first <main> or the hero section; add aria-expanded and aria-controls to the nav toggle button and update aria-expanded in the toggle JS; give the fn-card buttons on index.html proper tab semantics (role="tablist" on the container, role="tab" and aria-selected on each button, role="tabpanel" and aria-labelledby on each panel, arrow-key navigation); add aria-live="off" to the rotating word span in the hero; add width and height attributes to every <img> that lacks them and loading="lazy" to every image below the fold; resize brand/founder-keegan.jpg to 480px wide WebP with a JPEG fallback. Run a quick contrast check on text under 0.75rem and report any failures rather than changing them.
```

### P10. Two-way SMS for Cliniko landing page
```
Create cliniko-two-way-sms.html using the page shell from cliniko-integration.html. Target the query "two-way SMS for Cliniko" and "reply to Cliniko reminders". Structure: H1 "Two-way SMS for Cliniko clinics", a one-paragraph definition, a "What Cliniko does today" vs "What Avilo adds" comparison (reuse the ctable style), a real reschedule thread example reused from index.html, a short FAQ with FAQPage JSON-LD (Does it replace Cliniko reminders? Which number do patients text? What happens to clinical messages? How fast is a reply?), and the standard demo CTA. 600 to 800 words, Australian spelling, no em dashes, honest about current scope (SMS only in the inbox today). Add to sitemap.xml and link from the Cliniko page and the Product footer column.
```

### P11. Content: SMS template post
```
Write a new blog post from blog/_post-template.html with slug appointment-confirmation-sms-templates-allied-health.html. Title: "Appointment confirmation SMS templates for allied health clinics (and why most get ignored)". 1,500 to 1,800 words, author Keegan Brady, Australian spelling, no em dashes, practitioner voice matching the existing posts. Include eight copy-paste templates (first reminder, 48-hour confirmation, no-reply nudge, day-before chase, reschedule offer, waitlist offer, post-cancellation reschedule, lapsed-patient check-in), each with a one-line note on timing. Add an H2 on Spam Act and APP considerations (identify the clinic, opt-out line, no clinical detail). Link to the existing no-shows and reminders posts and to features.html#confirmations. Fill in all JSON-LD fields including dateModified and image, remove noindex, add to blog/index.html and sitemap.xml.
```

---

## 10. What is already good (keep it)

- Zero third-party requests on load, self-hosted fonts, gated Calendly. Rare and valuable. Do not reintroduce CDN fonts or auto-loading embeds.
- Privacy policy Part C (automated decisions) is ahead of the law and written in plain language.
- No em dashes, no AI-template visual tells in most places. The copy sounds like a person.
- The Tuesday before/after section and the clickable tab demos.
- Custom 404 with product voice.
- Brotli, 7-day caching, 62 KB HTML.
- ElevenLabs grant credit on every footer (grant condition, keep it).
