# Features page revamp: capability grid + dashboard section

Date: 2026-08-04
Page: `features.html`

## Goal

Add a dashboard/metrics section to the features page, and make the page's full
surface area scannable before the deep feature rows begin.

Two questions were settled up front:

**Should the page become a Lyngo-style "how it works" page?** No. Lyngo's page is
a breadth play: roughly 25 one-line capability cards across five grid sections.
Our page is a depth play, and each feature carries a working SMS or call mockup
that runs a real conversation to a real outcome. Card grids do not survive that
comparison. We keep the alternating narrative rows and borrow only the structural
pieces we are missing.

**What is the dashboard section for?** Both ROI and proof of control, weighted to
ROI. Metrics lead; oversight follows underneath.

## Scope

Three changes to `features.html`, plus one new stylesheet.

1. Replace the icon jump bar with a capability grid
2. Add a dashboard section between the last feature row and the Cliniko comparison
3. Update page title and meta description

Explicitly out of scope: setup steps, an FAQ block, homepage changes, footer
changes, and new feature rows for anything not already on the page.

## 1. Capability grid

Replaces the existing `.feat-nav` jump bar. That bar navigates but does not sell.
The grid does both: nine capabilities in three themed columns, every line
anchoring to its feature row.

| Conversations | Keeping the diary full | Oversight & control |
|---|---|---|
| Two-way patient texting → `#messages` | Appointment confirmations → `#confirmations` | Smart triage & escalation → `#escalation` |
| Practice questions answered → `#questions` | Waitlist auto-fill *(soon)* → `#waitlist` | Dashboard & reporting → `#dashboard` |
| AI call answering *(soon)* → `#calls` | Recalls & reactivation *(soon)* → `#recalls` | Real-time Cliniko write-back → `cliniko-integration.html` |

Two entries have no feature row today. Dashboard & reporting points at the new
section. Cliniko write-back points at the existing integration page; it is a real
capability currently buried inside other sections' bullet lists.

Coming-soon chips reuse the existing `.chip.chip-soon`.

### Styling

Not icon-tile cards. Three columns, a small column heading each, hairline-separated
capability lines with a thin teal tick, whole line clickable. A nine-card grid with
gradient icon chips is the most template-looking pattern on the modern web and the
rest of this site deliberately avoids it.

Responsive: 3 columns → 2 at tablet → 1 at mobile.

## 2. Dashboard section

New `<section id="dashboard">`, placed after the waitlist row and before the
Cliniko comparison. The rows prove Avilo does the work; the dashboard shows the
owner watching it happen; the comparison then closes the gap argument.

Background: soft tint. The Cliniko comparison flips from `.sec.soft` to `.sec` so
the two do not merge into one grey slab.

### Structure

1. Section head — eyebrow "Oversight", headline, lede
2. Hero: Dashboard mockup, full width, built in HTML/CSS
3. Three pulled-out numbers as copy
4. A standard `.feat-row` pairing the Needs you mockup with the control copy

### Ship status

The dashboard is live today. No coming-soon chip on this section.

### Dashboard mockup content

Reproduces the real app closely. Numbers are illustrative and labelled as such:
a visible "Example clinic · illustrative figures" marker on the frame.

**Chrome.** Header row only. Left: "Dashboard" / "Tuesday 4 August". Right:
"Date · 30 days" and "Owner view".

No sidebar. The real sidebar lists Calls, Lapsed patients, Waitlist, Campaigns and
Cancellation fees, none of which are shipped; reproducing it would advertise five
unavailable features. Omitting it also gives a better aspect ratio for a marketing
section than a full app window.

No Location switcher. Multi-location is not shipped.

**Stat tiles** — four across, tinted header strips, matching the app:

| Label | Value | Sub |
|---|---|---|
| NEEDS REPLY (amber) | 5 | waiting on the clinic |
| HANDLED BY AVILO (mint) | 65% | 15 of 23 conversations · 30 days |
| SLOTS FREED UP (teal) | 6 | reschedules and cancellations handled |
| MEDIAN RESPONSE (periwinkle) | 12m | across every patient message |

**Conversations handled panel** — 23, avg response 22m, 30 days, line/area chart
from 5 July to Today with a late spike.

**Revenue captured panel** — $3,240, pill `ESTIMATE · BOOKED BASIS`, subtitle
"REVENUE CAPTURED · 30 DAYS", and "at $135 average consult fee — click to adjust"
with $135 rendered as an editable-looking underlined value. Breakdown bars:

- New bookings $1,485
- Reschedules $1,080
- Recovered appointments $675

**Appointments booked panel** — 24 over 30 days. Bars: new bookings 11,
reschedules 8, recovered appointments 5.

**Conversation intent panel** — donut reading 23 CONVERSATIONS, link
"See handled conversations ›", and the list: general enquiries 10 / 43%,
reschedules 4 / 17%, new bookings 3 / 13%, handovers 3 / 13%, cancellations
2 / 9%, other 1 / 4%.

### Edits against the real screenshot

Three surfaces are cut because the features page chips them as coming soon.
Showing them would advertise features clinics cannot buy.

| Element | Change | Reason |
|---|---|---|
| Calls / Texts / Total tabs | Drop Calls | Call answering not shipped |
| Text / Call chart legend | Drop | Same |
| Recall appointments $405 | Removed from revenue breakdown | Recalls not shipped |
| Revenue total | $3,645 → $3,240 | 1485 + 1080 + 675 |
| Appointments booked | 27 → 24 | 11 + 8 + 5 |

The arithmetic reconciles: 24 appointments × $135 = $3,240, and each breakdown
line is its appointment count × $135. A prospect who checks the maths finds it
correct.

### Pulled-out numbers

Three, as running copy beneath the mockup:

- 65% handled without anyone touching it
- 12 minute median reply
- 6 slots freed

### Needs you row

**Removed 2026-08-04, after implementation, at the user's request.** The section
below is kept as a record of what was built. The control story it carried is no
longer told on the features page; the escalation feature row is the only place
that touches it. If it is ever revived, the mockup styles were `.appshot-ny` and
`.ny-*` in `avilo-app.css` and can be recovered from commit `0bcc0a3`.

A standard `.feat-row`. Mockup on one side, copy on the other.

Mockup reproduces the "Conversations waiting on a person" card only, including its
subtitle "Avilo handed each of these over rather than guess. Most urgent first."
That line is the clearest statement of the control story on either the product or
the site, and it is used close to as-is.

The "Your list" panel is cropped out. It is an empty local-only todo widget and
sells nothing.

Rows:

| Patient | Reason | Urgent | Note |
|---|---|---|---|
| Margaret Chen | Urgent same-day request | yes | |
| Raj Mehta | Billing complaint | yes | Avilo is paused here |
| Ella Thompson | Clinical question (swelling/strapping) | yes | |
| Daniel Okafor | Not confident enough to answer | no | |
| Grace Kim | Patient asked for a human | no | Avilo is paused here |

Two deliberate changes from the screenshot. The `/ext · Low confidence (0.10,
intent UNCLEAR)` row is test data and becomes a real-looking patient with a
plain-English reason. Waiting times change from dates in July to same-day
durations; a queue showing items untouched for twelve days undercuts the argument
the section is making.

### Copy: the control mechanic

Avilo handles conversations autonomously. What it cannot handle confidently, it
hands to Needs you rather than guessing. Replying in a thread pauses Avilo there,
and when it is ready to pick the thread back up it checks with the clinic before
sending.

This is takeover and hand-back. It is explicitly **not** approval-by-default: the
auto-handler does not require approval, and the site must not imply it does.

Supporting points, each grounded in something the app actually does:

1. Nothing happens invisibly — every conversation readable in full, handled or handed over
2. Take over any thread — replying pauses Avilo, and it checks before resuming
3. Per-practitioner view — each therapist sees only their own patients

No claims about emailed summaries, CSV export or custom date-range reporting.
Those have not been confirmed to exist.

## 3. Metadata

Title and meta description currently list calls, texts, confirmations, recalls,
waitlist and escalation. Both gain dashboard and reporting.

## Visual language

The mockups match the app, not the marketing site: off-white ground, white cards
at generous radii, mint conversation accents, thin line icons, deep green
(darker and less cyan than the site's `--teal`). An authentic-looking product
shot is worth more than a perfectly on-brand one, and it makes the demo feel
continuous with the site.

The app leans on uppercase tracked micro-labels. Inside product chrome that is
reproduction rather than styling and it stays. It does not leak into the
surrounding marketing copy.

Type needs no work: the app already runs Plus Jakarta Sans, same as the site.

## Implementation notes

**New file `avilo-app.css`**, loaded only by `features.html`. The mockup needs
roughly 300 lines and is used on one page; appending to the 46KB shared
`avilo.css` would tax every other page for nothing. A separate file also leaves
the mockup reusable if the homepage wants it later.

Mockup colours are declared as CSS custom properties scoped to the mockup root so
they do not fight the site palette.

**Responsive.** The advantage of building rather than screenshotting is that it
genuinely reflows. Stat tiles 4 → 2 → 1. The two panel rows stack. The donut and
its legend stack at mobile. Nothing relies on horizontal scrolling.

**Motion.** Stat tiles rise in on scroll and the four headline numbers count up
once over roughly 600ms, consistent with how the SMS threads already animate.
The chart line draws in on the same trigger. No looping, no pulsing. Respects
`prefers-reduced-motion`.

**Accessibility.** The mockup is decorative but readable: real text, not images,
so it scales and can be selected. Chart and donut get `aria-hidden` with a text
summary alongside. Nothing in the mockup is focusable, since none of it is
interactive.

## Known concerns

**Reschedules count as captured revenue.** $1,080 of the $3,240 is appointments
the patient was moving rather than losing, and a sharp clinic owner will say they
would have kept that anyway. The `ESTIMATE · BOOKED BASIS` label and the visible
breakdown cover it, and it is the product's own logic, so it stays as-is. Worth
having an answer ready for demo calls.

**No setup steps or FAQ on this page.** Someone landing on `/features` from search
still has to go to the homepage to learn how long setup takes. Deliberate, per
scope. Easy to add later.

## Not doing

- Converting the feature rows to a card grid
- Cancellation fees and multi-location in the capability grid — built but not shipped
- Any change to the coming-soon chips on calls, waitlist and recalls — none have shipped
- Approval-mode framing anywhere on the site
