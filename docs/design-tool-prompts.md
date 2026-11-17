# Prompts for Claude Design

Three prompts. Run them as separate projects, not one. Each is self-contained.

**Do not use the design tool for the schema markup, llms.txt or the noindex rules.**
Those are invisible `<head>` markup and build config. I handle them here, and anything
the design tool emits for them gets thrown away on conversion.

---

## Shared context — paste this at the top of every prompt below

```
BRAND AND PRODUCT

Avilo is an AI receptionist for allied health clinics in Australia that run on
Cliniko. It answers patient texts, and phone calls on the higher plans, and books,
moves and confirms appointments directly in the Cliniko diary. It chases patients
who do not reply, frees cancelled slots and offers them to the waitlist, and hands
anything clinical, emotional or unclear to a person.

Avilo Health Pty Ltd, ABN 19 698 695 019, Sydney. Founder: Keegan Brady, a
practising physiotherapist. Contact hello@avilo.com.au.

PLANS AND PRICES (AUD per clinic per month, ex GST)

Texts only:
- Confirm $49: reminders and confirmations, quiet patients nudged, at-risk
  flagged, two-way messaging. Texts 7.5c each, pay as you go. No AI replies.
- Automate $99: 100 texts included then 7.5c. Everything in Confirm plus AI
  replies, rescheduling and waitlist.
- Multi-site $179: 250 texts included then 7.5c. Everything in Automate plus
  several sites with a dashboard for each.

Texts and calls (24/7 phone cover, calls and texts in one inbox, unlimited web chat):
- Starter $139: 40 calls, 150 texts included.
- Growth $299: 120 calls, 400 texts included.
- Scale $649: 300 calls, 1,000 texts included, plus priority support.

Over the allowance: $2.50 a call, 7.5c a text. A clinic never pays more in usage
than the next plan up; if it would, we move them across automatically.

Every plan: 14-day free trial, no credit card, month to month, no setup fee,
unlimited practitioners. Setup is one 30-minute call and a Cliniko API key.

HARD RULES

- Never use these retired names: "Avilo Confirmations", "Smart Reminders",
  "Avilo Assistant", "AI front desk", "Notifications plan", "Officially
  integrated". The only plan names that exist are the six above.
- Never name a competitor.
- No em dashes anywhere. Use a comma, a full stop or brackets. An en dash is
  allowed only between two digits (a range).
- Australian spelling throughout.
- Avilo is an independent product and is not endorsed by or affiliated with
  Cliniko. Say so wherever Cliniko is named prominently.
- Avilo handles conversations autonomously and hands over rather than guessing.
  Never describe it as needing approval before it replies. Replying in a thread
  pauses Avilo there, and it checks with the clinic before picking the thread
  back up. That is takeover and hand-back, not approval-by-default.
- Clinical questions are never answered by AI.
- Patient data is hosted in Sydney, encrypted in transit and at rest, and is
  never used to train AI models. No call audio is retained.
- Do not invent features. Do not claim integrations other than Cliniko.

DESIGN SYSTEM

Match the existing Avilo site exactly. Reuse the same components, tokens and
stylesheets as the current pages (SiteNav, SiteFooter, CookieConsent, ds/).

- Navy #172030 (dark sections, headings), teal #0D9488 (primary action),
  mint #4DD9C0 (accent on dark), pearl #ECF2F1 (soft section ground), white cards.
- Plus Jakarta Sans, already loaded. Tight heading tracking (-.03em), generous
  line height on body.
- Light and clinical. White and pearl grounds, hairline borders, soft shadows,
  generous radii.
- Avoid the AI-template look: no gradient icon tiles in a nine-card grid, no pill
  badges scattered through the copy, no pulsing dots, no uppercase letter-spaced
  micro-labels in marketing copy. Uppercase tracked labels are allowed only
  inside a reproduction of the product UI.
- Every page must have exactly one h1.
- Must work at 375px wide with no horizontal scroll.

OUTPUT FORMAT

One file per page, in the same format as the existing Avilo pages: a .dc.html
document using the shared SiteNav, SiteFooter and CookieConsent components and
the ds/ stylesheets. Give every major section a data-screen-label attribute.
Supply for each page a title (60 characters or fewer) and a meta description
(160 characters or fewer).
```

---

## PROMPT 1 — Facebook offer landing page

> Fill in the bracketed parts before sending. I do not have the offer terms.

```
[PASTE SHARED CONTEXT ABOVE]

TASK

Design one standalone landing page for a paid Facebook campaign.

THE OFFER

[WRITE THE OFFER HERE. For example: $29 a month plus 5c a text, for the first
N clinics, for the first N months, ends DD Month. State exactly what is
included, exactly what it costs, who qualifies and when it ends.]

HOW THIS PAGE IS DIFFERENT FROM THE REST OF THE SITE

- It is reached only from the Facebook ad. It is not linked from anywhere on
  the main site and it will not be indexed by search engines.
- It has NO site navigation. No nav bar, no menu, no links to Solutions,
  Pricing, Learn or Contact. A visitor on this page has exactly one thing to do.
- The Avilo logo appears top left and links to https://avilo.com.au. That is the
  only way back to the main site above the fold.
- Keep the footer, but cut it down to: logo, one line of company detail, and
  links to Privacy, Terms and Security only.
- One call to action, repeated. Nothing competes with it.

WHAT GOES ON IT

1. Hero. The offer in the h1, in plain words with the price in it. One short
   paragraph underneath. One button.
2. The problem, in three or four lines. Patients text back and nobody sees it
   until the slot is gone.
3. What they get, as four to six concrete items. Not feature names, outcomes.
4. Proof. Leave a slot for one clinic quote and one logo. Mark it clearly as a
   placeholder so it is obvious what still needs filling.
5. What it costs, stated once and unambiguously, including what happens when
   the offer period ends.
6. How setup works: one 30-minute call, one Cliniko API key, nothing to install.
7. Four or five FAQs that kill the real objections: what happens to my data,
   what if it says the wrong thing to a patient, can I cancel, does it change my
   Cliniko reminders, what happens after the offer ends.
8. Final call to action.

The page should feel like Avilo, not like a generic funnel page. No countdown
timers, no fake scarcity, no stock photos of smiling receptionists. The offer is
real, so state it plainly and let it do the work.
```

---

## PROMPT 2 — Rebuild the six industry and comparison pages

```
[PASTE SHARED CONTEXT ABOVE]

TASK

Six pages on avilo.com.au still use the previous design and still describe a
product ladder that no longer exists. Rebuild all six in the current design,
with current copy.

THE PAGES

1. /for/physiotherapy  — AI receptionist and confirmations for physio clinics
2. /for/chiropractic   — AI receptionist and confirmations for chiro clinics
3. /for/osteopathy     — AI receptionist and confirmations for osteo clinics
4. /for/podiatry       — AI receptionist and confirmations for podiatrists
5. /compare/ai-receptionist-vs-answering-service
6. /compare/ai-receptionist-vs-hiring-front-desk-staff

WHAT IS WRONG WITH THEM TODAY

They mention "Avilo Confirmations", "Smart Reminders" and "Avilo Assistant"
about fifty times between them. Those three tiers were retired. Every sentence
built on that ladder has to be rewritten against the six real plans.

They also look like the old site. Someone who lands on one of these from Google
sees a different website from the one the ads point at.

WHAT TO KEEP

These are the pages that earn organic traffic, so keep what makes them work:

- The specificity. The physio page is about a course of treatment and workers
  compensation approvals. The podiatry page is about recall cycles and older
  patients who phone rather than text. The osteo page is about owner-run clinics
  with no reception. Keep that. A generic page helps nobody.
- Each page's FAQ block, rewritten for the current plans. Four to six questions,
  answered properly, in the clinic's own language.
- The comparison pages must stay fair. Say plainly what a human answering
  service does better, and when hiring a receptionist is the right answer.
  A comparison that never concedes anything reads as advertising and converts
  worse than one that does.
- Each page ends with a clear next step: book a demo, or start the trial.

WHAT TO CHANGE

- Current design, matching the rest of the site.
- Current plan names and prices, used only where a specific plan is genuinely
  the right recommendation for that reader.
- Each page should name the plan that actually suits it rather than listing all
  six. A single-site owner-operated osteo clinic is a Confirm or Automate
  reader. A multi-location group is Multi-site or Scale.
```

---

## PROMPT 3 — Rebuild the three articles

```
[PASTE SHARED CONTEXT ABOVE]

TASK

Three articles on avilo.com.au still use the previous design. Rebuild them, and
design a reusable article template they share.

THE ARTICLES

1. /blog/reduce-no-shows-allied-health
   How to reduce no-shows in your allied health clinic
2. /blog/reminders-are-not-enough
   Your reminder system isn't enough. Silence is an answer.
3. /blog/what-a-missed-call-costs
   What a missed call actually costs your clinic

WHAT I NEED

A clean long-form reading template, in the current design, that works for these
three and for everything written later:

- Title, author (Keegan Brady, physiotherapist), publication date, reading time.
- A comfortable measure for body text. Roughly 65 to 75 characters a line.
- Clear h2 and h3 hierarchy, pull quotes, simple tables, numbered steps and a
  callout box for the practical exercises.
- A small table of contents for the longer pieces.
- One soft call to action at the end. Not a banner, not a popup, not a sticky
  bar. These pages are read by people who are not ready to buy, and the article
  should respect that.
- A "keep reading" block linking the other two articles.

KEEP THE WRITING

The articles are good and the substance should survive. Fix only:
- Any mention of the retired tiers, rewritten against the six real plans.
- Anything that is now factually out of date about what Avilo does.

The third article contains a one-hour exercise for working out what missed calls
cost a clinic. That exercise is the most useful thing on the site. Give it real
design attention: it should be something an owner can actually work through on
the page.
```

---

## What I do here, not in the design tool

| Item | Why not the design tool |
|---|---|
| `SoftwareApplication` + `Offer` schema for all six plans | Invisible head markup; also fixes the fact that the texts-only prices are only visible after JS runs |
| `Organization` schema sitewide | Entity resolution for AI assistants |
| `Person` on /about, `Article` on the three posts | Same |
| `BreadcrumbList` on the v4 pages | The legacy pages already have it; the new ones do not |
| `llms.txt` | Done. Rewritten against the six real plans |
| Pricing h1 `$3.3` to `$3.30 a day` | Done |
| `noindex` plus sitemap and llms.txt exclusion for the offer page | Build config |
| The "Avilo AI" naming | A find and replace, once you tell me what it should say |

## Still waiting on you

**"Avilo AI" appears 23 times across 6 pages** and matches no plan on /pricing.
It needs to be one of:

1. A capability, never a plan. "Avilo AI" becomes "Avilo" everywhere, and the
   pricing FAQ question "What if we go over our Avilo AI allowance?" becomes
   "What if we go over our allowance?"
2. A real umbrella name for the three AI plans, in which case /pricing has to
   introduce it.

Option 1 is less work and less confusing. Either way, decide before Prompt 2
goes out, because those pages have to use the same names.
