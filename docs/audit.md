# UX audit — Mine Performance (StatStak live site)

**Source:** Autonomous Playwright exploration on 2026-02-19.  
**Artifacts:** `artifacts/explore/2026-02-19T03-34-45/` (pages.json, links.json, screenshots/).

**Live site:** https://mine-performance.statstak.io/

---

## 1. Current information architecture

```
/ (index)     → Home: MINE PERFORMANCE ACADEMY, sections Upcoming Events, Packages, Trainers, “JOIN”
/trainers/    → Trainers (minimal content; Filter by category, policy links)
/events/      → Upcoming (events list; search, filters)
/leaderboard/ → Leaderboard (metrics: 60yd, C Velo, Exit Velo, FB Velo; sort/filter)
/privacy/     → Privacy policy
/terms/       → User agreement
/reset_pw/    → Reset password
/support/     → Support
```

- **Primary surfaces:** Home, Trainers, Events, Leaderboard. No dedicated “Programs,” “Start Here,” “Contact,” or “Results” in the IA.
- **Nav:** Icon-based (Home, Scheduling, Leaderboard, Login); no text labels in extracted nav items (evidence: pages.json navItems empty; CTAs show icon names like `keyboard_arrow_down`, `event`). Ref: home-desktop.png, home-mobile.png.
- **Footer:** Policy/support links only; no facility, hours, or contact. Ref: all pages, footerSnippet empty in data.

---

## 2. Top 10 UX issues (severity + impact)

| # | Issue | Severity | Evidence |
|---|--------|----------|----------|
| 1 | **No clear primary CTA** — “Book an Evaluation” / “Get Started” not prominent or absent | High | CTAs extracted are icons (flip_camera_android, event, etc.) and statstak.io; no “Book” or “Start” in pages.json. home-desktop.png |
| 2 | **Unclear next step** — Visitors see Events/Packages/Trainers but no guided path | High | Home has sections but no “Start Here” or wizard. events-desktop.png, home-mobile.png |
| 3 | **Nav not scannable** — Icon-only nav; no “Programs,” “Coaches,” “Events,” “Results,” “Contact” | High | navItems array empty; CTAs show icon material names. trainers-desktop.png |
| 4 | **Trust gaps** — No facility story, credentials, testimonials, or rehab/safety on live site | High | Visible text length 632–982 chars per page; no coach bios or facility copy in extraction |
| 5 | **Leaderboard unexplained** — 60yd, C Velo, Exit Velo, FB Velo with no definitions or “what good looks like” | Medium | leaderboard-desktop.png; headings show metric names only |
| 6 | **Mobile: dense icons** — Many icon-only buttons; no persistent CTA bar | Medium | home-mobile.png, events-mobile.png; CTAs dominated by icon labels |
| 7 | **Events discovery** — “Upcoming” only; no featured vs all, no clear registration path | Medium | events-desktop.png; title “Upcoming”; no “featured” or filter labels in content |
| 8 | **Trainers underdeveloped** — “Trainers” page minimal; no filters by specialty, no credential highlights | Medium | trainers-desktop.png; visibleTextLength 739 (desktop), 556 (mobile) |
| 9 | **Accessibility** — Icon buttons without text; heading structure mixed (e.g. leaderboard h3 before h2) | Medium | pages.json headings: leaderboard has h3 60yd, C Velo… then h2 Home |
| 10 | **No contact/location** — No contact page, hours, or location in main IA | High | links.json and pages show only policy/support; no contact or map |

---

## 3. Conversion issues

- **Unclear next step:** No single “Start Here” or “Book an Evaluation” that’s visible and consistent.
- **Missing CTA:** Primary action (e.g. book evaluation, join program) not clearly labeled; CTAs are generic or icon-only.
- **Trust gaps:** No coach bios, facility story, credentials, or rehab/safety messaging to reduce friction before sign-up.

---

## 4. Mobile-specific problems

- **Icon-heavy UI:** Many controls are icon-only (keyboard_arrow_down, event, location_on, etc.), reducing scannability. Ref: home-mobile.png, events-mobile.png.
- **No sticky CTA:** No persistent “Book an Evaluation” or “Get Started” bar on scroll.
- **Leaderboard:** Metric columns (60yd, C Velo, etc.) may be tight on small viewports. Ref: leaderboard-mobile.png.

---

## 5. Accessibility quick pass

- **Keyboard nav:** Not tested in automation; icon-only buttons suggest focus targets may lack visible labels.
- **Headings:** Inconsistent order (e.g. leaderboard: h3 metric names then h2 “Home”); some empty h2/h3 (e.g. home “”, trainers “”).
- **Labels:** CTAs surfaced as icon names (flip_camera_android, etc.) — likely missing or poor aria-label/text for links and buttons.
- **Contrast:** Not measured; recommend manual check on key screens.

---

## 6. Performance quick pass

- **Images:** Not measured in this run; recommend Lighthouse on home and leaderboard.
- **Scripts:** StatStak platform; no custom heavy scripts in this repo.
- **Layout shift:** Scroll and navigation captured; no CLS metric in this audit. Recommend LCP/CLS on mobile.

---

## 7. Evidence reference (screenshots)

| Page | Desktop | Mobile |
|------|---------|--------|
| Home | screenshots/home-desktop.png | screenshots/home-mobile.png |
| Trainers | screenshots/trainers-desktop.png | screenshots/trainers-mobile.png |
| Events | screenshots/events-desktop.png | screenshots/events-mobile.png |
| Leaderboard | screenshots/leaderboard-desktop.png | screenshots/leaderboard-mobile.png |

All paths relative to `artifacts/explore/2026-02-19T03-34-45/`.
