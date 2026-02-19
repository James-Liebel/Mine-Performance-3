# Ship checklist — Mine Performance Academy front-door

Build and release verification before deploying.

---

## Build

- [ ] `npm ci` (or `npm install`) succeeds
- [ ] `npm run build` succeeds with no errors
- [ ] No TypeScript errors (`npx tsc --noEmit` if applicable)
- [ ] Environment: `NEXT_PUBLIC_SITE_URL` set for production (optional; used in JSON-LD)

---

## E2E (Playwright)

- [ ] `npx playwright install` (one-time)
- [ ] Start dev server: `npm run dev` (or use `reuseExistingServer` in config)
- [ ] `npm run test:e2e` (or `npx playwright test`) — all tests pass
  - [ ] Home loads
  - [ ] Nav works (e.g. Method link)
  - [ ] Primary routes render: /, /start, /method, /programs, /coaches, /facility, /results, /events, /rehab, /contact
  - [ ] Primary CTAs exist and are clickable on home
  - [ ] Start Here wizard: goal → age → schedule → result with “Book an Evaluation” and “View Programs”
  - [ ] Primary CTA exists on /, /programs, /contact
  - [ ] StatStak deep links (leaderboard, events) open in new tab with correct URLs
  - [ ] 404 for unknown route

---

## Content & links

- [ ] Nav order: Start Here, Programs, Coaches, Events, Results, The Method, Facility, Rehab, Contact
- [ ] Footer includes Start Here and matches nav
- [ ] “Book an Evaluation” (or equivalent) present in header/CTABar and points to StatStak or /contact
- [ ] StatStak URLs correct: `https://mine-performance.statstak.io` (contact/booking), `/events`, `/leaderboard`
- [ ] Placeholder copy labeled “Placeholder — needs client content” where applicable (e.g. results “what good looks like”, coach bios)

---

## SEO & technical

- [ ] Metadata (title, description) set on all main pages
- [ ] JSON-LD (LocalBusiness/SportsActivityLocation) in layout
- [ ] Sitemap and robots.txt if configured
- [ ] Security headers (CSP, etc.) not blocking legitimate resources

---

## Accessibility (quick pass)

- [ ] Skip to main content link present and focusable
- [ ] Heading hierarchy (single h1 per page, logical order)
- [ ] Focus visible on interactive elements (buttons, links)
- [ ] Form inputs / wizard steps have associated labels or aria-labelledby

---

## StatStak preservation

- [ ] No changes that break registration or booking flows on StatStak
- [ ] Deep links to StatStak open in new tab and use correct base URL
- [ ] Contact page CTA goes to StatStak (or intended booking URL)

---

## Sign-off

- [ ] Product/design sign-off (if applicable)
- [ ] Deploy to staging and smoke-check
- [ ] Deploy to production and verify live URLs
