# QA validation report — Mine-Performance-3

**Date:** 2026-02-23  
**Scope:** Standardized validation pass (install, static checks, unit, e2e, runtime smoke).

---

## Commands run

| Step | Command |
|------|--------|
| Install | `npm install` (no package-lock.json; used npm install) |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Build | `npm run build` |
| Unit tests | `npm run test -- --run` |
| E2E smoke | `npx playwright test tests/e2e/smoke.spec.ts` |
| E2E nav | `npx playwright test tests/e2e/nav.spec.ts` |
| E2E start-wizard | `npx playwright test tests/e2e/start-wizard.spec.ts` |
| E2E chat/faq | `npx playwright test tests/e2e/chat-widget.spec.ts tests/e2e/faq-chatbot.spec.ts` |
| E2E full | `npx playwright test` |
| Runtime smoke | Covered by E2E (webServer starts dev server; smoke + chat-widget + faq-chatbot cover /, /coaches, /results, /start, /contact and chat launcher/ESC/FAQ answer). |

---

## Pass/fail summary

| Check | Result |
|-------|--------|
| Install | **PASS** |
| Lint | **PASS** (warnings only: 3× `no-img-element` in admin/results and ResultsPageContent) |
| Typecheck | **PASS** |
| Build | **PASS** |
| Unit tests | **PASS** (51 tests, 7 files) |
| E2E smoke | **PASS** (10 tests, after fix) |
| E2E nav | **PASS** (6 tests, after fix) |
| E2E start-wizard | **PASS** (4 tests) |
| E2E chat-widget / faq-chatbot | **PASS** (14 tests, after fix) |
| E2E full suite | **PASS** (52 passed, 2 skipped) |
| Runtime smoke | **PASS** (validated via E2E routes + chat widget) |

---

## Fixes applied

| File | Change |
|------|--------|
| `tests/e2e/smoke.spec.ts` | Home h1 expectation updated to accept editable hero: `/train smarter\|training, quantified\|Mine Performance/i` (persisted site content uses "Mine Performance Baseball Academy" as hero_heading). |
| `tests/e2e/nav.spec.ts` | Same home h1 pattern so "main nav links work on desktop" passes when hero is "Mine Performance Baseball Academy". |
| `tests/e2e/chat-widget.spec.ts` | Same home h1 pattern so chat test passes when hero is editable. |

---

## Remaining known issues

1. **Lint warnings (non-blocking):**  
   - `app/admin/results/page.tsx` (lines 89, 282) and `app/results/ResultsPageContent.tsx` (line 84): ESLint suggests using `next/image` instead of `<img>`. No change made per "do not redesign UI."

2. **E2E skipped (intentional):**  
   - `tests/e2e/integrations.spec.ts`: test "portal results has StatStak leaderboard link with correct URL" is `test.skip` (route `/portal/results` removed/restructured). Exact snippet:  
     `test.skip('portal results has StatStak leaderboard link with correct URL', ...)`  
