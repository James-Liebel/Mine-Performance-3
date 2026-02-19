# Mine Performance Academy

Next.js marketing site for Mine Performance Academy — assessment-driven training and rehab.

## Requirements

- **Node.js** 18.x or 20.x (LTS)
- **Package manager:** npm (or pnpm/yarn)

## Install

```bash
npm install
```

## Environment

Copy `.env.example` to `.env.local` and set values as needed. For local dev, defaults are safe.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (sitemap, OG, schema). Default in dev: `http://localhost:3000`. |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server (run after `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run test` | Playwright e2e (starts app on port 9347) |
| `npm run test:e2e` | Same as `test` |
| `npm run pre-push` | lint + typecheck + build (run before pushing) |
| `npm run release` | Full pipeline: lint, typecheck, build, security (critical only), e2e |

## Scripts (optional)

- `npm run crawl` — Brand crawl (screenshots + copy) to `artifacts/brand-crawl/`
- `npm run extract-trainers` — Attempt to extract trainer data from StatStak

## E2E

E2E tests start the built app on **port 29347** (so dev can stay on 3000). If that port is in use, Playwright reuses the existing server. For a fresh e2e run, free the port first: `npx kill-port 29347` then `npm run test`. To run against an existing server: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e`. Full validation (including e2e): run `npx kill-port 29347`, then `npm run test`, after `npm run pre-push`.

## Security

- `npm run security:check` — Runs `npm audit` (fail on high/critical by default). Use `SECURITY_AUDIT_LEVEL=critical` to fail only on critical. Use `RUN_GITLEAKS=1` if gitleaks is installed for secret scanning.
- See `/docs/security-audit.md` for threat model, findings, and remediation.
- See `/docs/security-checklist.md` for the pre-release checklist.

## Release

Run the full pipeline before tagging or deploying: `npm run release`. See `/docs/final-review.md` for upgrade summary and commands.

## QA

See `/docs/bugbash.md` for bug bash checklist and validation steps.
