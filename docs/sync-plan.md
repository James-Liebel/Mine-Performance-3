# Sync plan: Mine-Performance-3 ← Mine-Performance-2 (source of truth)

**MP2 is read-only.** This doc lists what MP2 contains so MP3 can mirror logic/structure; only presentation/theme differs in MP3.

## Framework & tooling (MP2)

- **Framework:** Next.js 14.2.35, **App Router** (root `app/`, not `src/app/`)
- **Package manager:** npm
- **Test runner (unit):** Vitest (`lib/**/*.test.ts`, `packages/core/**/*.test.ts`, `src/**/*.test.ts`)
- **Test runner (e2e):** Playwright (`tests/e2e/*.spec.ts`)
- **TypeScript:** paths `@/*` → `./*`, `@mine-performance/core` → `./packages/core/src`, `@mine-performance/core/hooks` → `./packages/core/src/hooks`

## Routes (MP2 app/)

| Route | File(s) |
|-------|--------|
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx`, `app/about/AboutPageContent.tsx` |
| `/contact` | `app/contact/page.tsx`, `ContactForm.tsx`, `ContactPageContent.tsx`, `BookingBanner.tsx` |
| `/coaches` | `app/coaches/page.tsx`, `app/coaches/CoachesClient.tsx` |
| `/events` | `app/events/page.tsx`, `EventsClient.tsx`, `EventsPageContent.tsx` |
| `/faq` | `app/faq/page.tsx` |
| `/programs` | `app/programs/page.tsx` |
| `/rentals` | `app/rentals/page.tsx` |
| `/results` | `app/results/page.tsx`, `ResultsClient.tsx`, `ResultsPageContent.tsx` |
| `/start` | `app/start/page.tsx` |
| `/login` | `app/login/page.tsx` |
| `/member-registration` | `app/member-registration/page.tsx` |
| `/profile` | `app/profile/layout.tsx`, `page.tsx`, `calendar/page.tsx`, `payments/page.tsx`, `stats/page.tsx` |
| `/admin` | `app/admin/` (layout, AdminNav, pages, components) |
| **API** | `app/api/admin/*`, `app/api/contact`, `app/api/coaches`, `app/api/events`, `app/api/health`, `app/api/member/*`, `app/api/memberships`, `app/api/results`, `app/api/site-content`, `app/api/stripe/*`, `app/api/waivers/*`, `app/api/webhooks/stripe` |
| **Root** | `app/layout.tsx`, `globals.css`, `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts` |

## Shared libraries & content

- **content/** — `content/faq.ts`
- **lib/** — `faq-matcher.ts`, `faq-matcher.test.ts`, plus utils, nav-config, seo, auth, stores, supabase, stripe, etc. (see MP2 `lib/`)
- **Chat widget:** `components/ChatWidget.tsx`; layout in `app/layout.tsx`
- **Start wizard:** `app/start/page.tsx`; core logic in `packages/core/src/wizard.ts`
- **Results:** `app/results/`, `lib/results-store.ts`, `lib/percentiles.ts`, `ProgressChart.tsx`, `MetricCard.tsx`
- **Integrations:** `src/integrations/` (index, noop, statstak, types + tests)
- **Core package:** `packages/core/` (full package)

## Tests (MP2)

- **E2E:** `tests/e2e/smoke.spec.ts`, `chat-widget.spec.ts`, `deep-links.spec.ts`, `faq-chatbot.spec.ts`, `filters.spec.ts`, `integrations.spec.ts`, `nav.spec.ts`, `start-wizard.spec.ts`
- **Unit:** `lib/faq-matcher.test.ts`, `lib/percentiles.test.ts`, `packages/core` tests, `src/integrations` tests

## Configs to align (MP3)

- `next.config.js`, `tsconfig.json`, `playwright.config.ts`, `vitest.config.ts`, `.env.example`, `package.json` (scripts + deps to match MP2)
