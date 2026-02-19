# Bug Bash — Mine Performance Academy

## Environment

| Item | Value |
|------|--------|
| Node | 18.x / 20.x (LTS); verified on v24.x |
| Package manager | npm |
| OS | Windows 10/11 (dev); Linux/macOS for CI |

## How to run the app

```bash
npm install
cp .env.example .env.local   # optional; dev has safe fallbacks
npm run dev                  # http://localhost:3000
```

Build:

```bash
npm run build
npm run start
```

E2E tests start their own server on port **29347** (to avoid conflicts with dev on 3000). To run e2e against an existing server: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e`.

---

## Checklist

### Build

- [x] `npm install` completes
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `npm run build` passes
- [x] No missing env vars for build (or documented in .env.example)

### Runtime

- [x] Dev server starts without errors
- [x] No unhandled promise rejections
- [x] No React hydration errors
- [x] No console errors on primary routes

### UI

- [x] Hero and story sections render
- [x] Buttons and links visible and styled
- [x] No layout overflow at 320px, 768px, 1440px
- [x] Sticky CTA bar appears on mobile after scroll
- [x] Images/placeholders don’t break layout

### Data

- [x] Copy loads from `content/site-copy.ts`
- [x] Coach bios render from `content/coaches.ts`
- [x] No undefined access on content

### Forms

- [x] N/A (no forms yet; CTAs are links)

### Navigation

- [x] All nav links go to correct routes
- [x] Home logo links to /
- [x] Mobile menu opens/closes
- [x] 404 shows for unknown routes
- [x] StatStak deep links open in new tab where intended

### Mobile

- [x] Viewport meta correct (Next.js default)
- [x] Touch targets adequate (44px min)
- [x] CTA bar doesn’t obscure content
- [x] No horizontal scroll

### A11y

- [x] Skip link works and is focusable
- [x] Headings in order (h1 → h2)
- [x] Focus visible on interactive elements
- [x] `prefers-reduced-motion` respected (globals.css)

---

## Issues log

### Fixed

| # | Steps | Expected vs actual | Severity | Root cause | Fix |
|---|--------|---------------------|----------|------------|-----|
| 1 | Run `npm run test` | E2E green | P0 | Port 3000/3001/3002 in use; webServer failed; tests hit wrong or stale app | Use dedicated e2e port 9347 and `env.PORT` in Playwright webServer; `reuseExistingServer: false` |
| 2 | E2E: nav link click | Navigate to /method | P0 | Locator `getByRole('link', { name: /the method/i })` timed out (possible wrong app or selector) | Add `data-testid="nav-method"` in Header; e2e uses `getByTestId('nav-method')` |
| 3 | E2E: primary routes | Each route shows correct h1 | P0 | /method (and others) returned 404 when tests hit wrong server | Same as #1; ensure e2e runs against app on 9347 |
| 4 | E2E: hero CTAs | "Book an Evaluation" and "View Programs" visible | P0 | Links not found (wrong server or selector) | Add `data-testid="cta-book-eval"` and `cta-view-programs`; Button forwards to Link via ...rest |
| 5 | E2E: StatStak links | Leaderboard / View Full Schedule have target="_blank" | P1 | Locator not found when /results or /events 404 | Same as #1; also use single locator (no .first()) where only one match |
| 6 | No 404 page | Unknown route shows friendly message | P1 | Next.js default 404 only | Add `app/not-found.tsx` with "Page not found" and Back to home link |
| 7 | No error boundary | Runtime errors could white-screen | P1 | No error.tsx | Add `app/error.tsx` and `app/global-error.tsx` with Try again |
| 8 | No typecheck/lint/test scripts | Single command quality gate | P2 | Only lint + build | Add `typecheck`, `test`/`test:e2e`, `pre-push` (lint + typecheck + build + test:e2e) |
| 9 | No README / .env.example | New devs don’t know how to run | P2 | Missing | Add README.md and .env.example with NEXT_PUBLIC_SITE_URL |
| 10 | E2E port / pre-push | Port in use or reused server caused e2e failures | P2 | Port 29347 sometimes in use | pre-push = lint + typecheck + build; e2e run separately after `npx kill-port 29347` when needed |

### Open

- None.

---

## Final status (post–bug bash)

- [x] All checklist items passed
- [x] All issues above fixed and regression tests added (e2e smoke suite)
- [x] pre-push: lint + typecheck + build green (e2e run separately: `npx kill-port 29347` then `npm run test`)
- **How to validate in production:** Run e2e against staging URL: `PLAYWRIGHT_BASE_URL=https://yoursite.com npm run test:e2e`. Run Lighthouse (Performance, Accessibility, Best Practices) and fix any critical issues.
