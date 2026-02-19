# Recommendations — Mine Performance Academy

**Based on:** [audit.md](./audit.md) (live StatStak exploration) and [competitive-benchmark.md](./competitive-benchmark.md).

---

## MVP (1–2 weeks)

| # | User problem | Proposed solution | Expected outcome | UI change | Dependencies | Validation |
|---|--------------|-------------------|------------------|-----------|--------------|------------|
| 1 | Unclear next step; no single CTA | Persistent primary CTA: “Book an Evaluation” | Higher click-through to contact/booking | Sticky CTA bar on mobile (existing); ensure same CTA in header and hero on all pages | StatStak or external booking URL | CTR on CTA; conversions |
| 2 | No guided path for new visitors | “Start Here” wizard: goal + age + schedule → recommended program/trainer + next action | Fewer bounces; more qualified leads | New `/start` page: 3–4 steps (goal, age/level, schedule), then result card + “Book an Evaluation” / “View Programs” | Copy for goals and program names; optional backend to store choices | Wizard completions; CTA clicks from result |
| 3 | Nav not scannable on StatStak (icon-only) | Front-door site with clear nav: Programs, Coaches, Events, Results, Start Here, Contact | Better discovery from our domain | Already in place in this repo; ensure nav order and labels match recommendations | None | Nav clicks; time on site |
| 4 | Trust gaps (no facility, credentials, rehab) | Facility page; coach bios with credentials; Rehab page with responsible copy | Higher trust before sign-up | Facility: placeholders for photos + tech list; Coaches: bios + credentials (placeholders where needed); Rehab: existing page | Client content: facility photos, coach bios, credentials | Scroll depth; CTA clicks from /facility, /coaches, /rehab |
| 5 | Leaderboard metrics unexplained | Results page: metric definitions + “what good looks like” + deep link to StatStak leaderboard | Less confusion; more engagement with leaderboard | Definitions block on /results; optional age-band benchmarks (placeholder) | Client definitions and benchmarks | Clicks to StatStak leaderboard; time on /results |
| 6 | Events: no featured vs all, registration unclear | Events page: featured section + “View full schedule” to StatStak | Clear path to register | Featured events (placeholder or API if available); CTA to StatStak events | StatStak events URL; optional featured list | Clicks to StatStak events |
| 7 | Coaches: no filters or specialty | Coaches page: filters by specialty; credential badges | Better match between athlete and coach | Filter pills (e.g. Pitching, Hitting, S&C); credential tags on cards | Coach data with specialty and credentials | Filter usage; coach profile clicks |

---

## V2 (1–2 months)

| # | User problem | Proposed solution | Expected outcome | UI change | Dependencies | Validation |
|---|--------------|-------------------|------------------|-----------|--------------|------------|
| 8 | No contact form on front-door | Contact page: form (name, email, message, optional program interest) + map + hours | More leads without leaving site | Form with server action or API; map embed; hours from content | Backend or form service; address/hours from client | Form submits |
| 9 | Programs not discoverable by outcome | Program cards by outcome (e.g. “Get evaluated,” “In-season,” “Return from injury”) with short copy and CTA | Clear program discovery | Program cards with outcome, description, CTA; optional “Start Here” result linking to a program | Program list and copy from client | Program card clicks; CTA clicks |
| 10 | Testimonials absent | Testimonials section on home and/or Results | Trust and social proof | Carousel or grid; quote + name + title/team (placeholder) | Client-approved testimonials | Engagement; correlation with conversions |
| 11 | Mobile: no persistent CTA on scroll | Sticky CTA bar (already present); ensure visible after hero | More mobile conversions | Verify CTA bar visibility and contrast | None | Mobile CTA clicks |
| 12 | Accessibility (icons, headings) | Headings order; aria-labels on icon links; focus states | Compliance and usability | Audit and fix headings; add aria-label where needed; focus styles | None | a11y audit score; keyboard nav |
| 13 | Performance (images, LCP) | Optimize images; lazy-load below fold | Better LCP and CLS | next/image; sizes; priority on hero | Asset pipeline | Lighthouse LCP/CLS |

---

## Minimum scope for implementation (this repo)

- **Clear nav:** Programs, Coaches, Events, Results, Start Here, Contact — already in place; add “Start Here” if not present.
- **Persistent primary CTA:** “Book an Evaluation” in header and/or bar — already in place; verify on every page.
- **Start Here wizard:** Goal + age + schedule → recommended program/trainer + next action — **to build** (`/start`).
- **Coaches:** Filters by specialty + credential highlights — enhance existing /coaches with filters and tags.
- **Events:** Featured + filter + clear registration — enhance /events with featured block and CTA to StatStak.
- **Results:** Metric definitions + “what good looks like” + deep links — enhance /results with definitions block.
- **Trust:** Facility story, credentials, testimonials, rehab, location/hours — facility and rehab pages exist; add placeholders for testimonials and hours where needed.

All flows that lead to registration or booking must preserve StatStak (deep links); no breaking of existing registrations.
