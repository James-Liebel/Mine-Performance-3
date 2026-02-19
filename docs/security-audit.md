# Security Audit — Mine Performance Academy

## 1. Threat model

### 1.1 Assets

| Asset | Sensitivity | Location / flow |
|-------|-------------|------------------|
| Site content (copy, coach bios) | Low | Static content in repo; no PII |
| Canonical URL / brand | Low | `NEXT_PUBLIC_SITE_URL` (public) |
| User data | None in-app | No forms, auth, or analytics in codebase; CTAs link to StatStak |
| Session / auth | N/A | No authentication in this app |
| Build artifacts | Low | `.next`, images; no secrets |

### 1.2 Actors

- **Visitors:** Read-only; browse marketing pages, click through to StatStak (events, leaderboard, contact).
- **Attacker:** May try XSS, open redirect, dependency abuse, or header/configuration misuse.
- **Deployer:** Has env (e.g. `NEXT_PUBLIC_SITE_URL`); no server-side secrets required for current feature set.

### 1.3 Entry points

| Entry point | Type | Trust boundary |
|-------------|------|-----------------|
| Marketing pages (/, /method, /coaches, etc.) | Static / SSG | Public; content from repo |
| External links (StatStak) | Outbound | User clicks; no server-side redirect from user input |
| Sitemap / robots | Generated | Uses `NEXT_PUBLIC_SITE_URL` only |
| JSON-LD (layout) | Server-rendered | Built from site name, tagline, env URL; no user input |
| Scripts (crawl, extract-trainers) | Dev/CLI | Not exposed to web; fixed URLs |

No API routes, no form POST handlers, no file upload, no server-side redirects from query/body.

### 1.4 Dependencies and external services

- **Runtime:** Next.js, React, Framer Motion, Tailwind, lucide-react, clsx, tailwind-merge, class-variance-authority.
- **Dev:** Playwright, TypeScript, ESLint, kill-port, tsx.
- **External:** StatStak (mine-performance.statstak.io) linked for events, leaderboard, contact; no server-side fetch of user-controlled URLs.

### 1.5 Deployment surface

- Next.js static export or Node server (SSG).
- No API gateway or serverless functions in repo.
- Images: allowlisted remote patterns (mine-performance.statstak.io, statstak.io) in `next.config.mjs`.

---

## 2. Findings and remediation

### 2.1 Critical

| ID | Finding | Status |
|----|---------|--------|
| C1 | No hard-coded secrets or API keys in repo | Confirmed; `.env*.local` gitignored; only `NEXT_PUBLIC_SITE_URL` used |

### 2.2 High

| ID | Finding | Rationale | Remediation |
|----|---------|------------|-------------|
| H1 | Missing security headers | Default responses lack HSTS, CSP, X-Frame-Options, etc. | Add headers in `next.config.mjs`: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security; CSP in report-only initially |
| H2 | Dependency vulnerabilities | Unpinned or vulnerable deps can be exploited | Run `npm audit`; add `security:check` and fail CI on high/critical |

### 2.3 Medium

| ID | Finding | Rationale | Remediation |
|----|---------|------------|-------------|
| M1 | `dangerouslySetInnerHTML` in layout | Used for JSON-LD only; content is site name, tagline, env URL (no user input) | Acceptable; document that schema is not user-controlled. Optional: generate JSON-LD in a route handler and serve as JSON |
| M2 | No automated secret scanning | Accidental commit of secrets | Add gitleaks (or similar) config and run in CI / `security:check` |
| M3 | No explicit CSP | XSS defense incomplete | Add Content-Security-Policy (report-only first); tighten after testing |

### 2.4 Low

| ID | Finding | Rationale | Remediation |
|----|---------|------------|-------------|
| L1 | Env not validated at startup | Misconfiguration could leak placeholder URLs | Document `NEXT_PUBLIC_SITE_URL` in `.env.example`; optional runtime check in layout or middleware |
| L2 | No rate limiting | No API or forms; future forms could be abused | N/A for current app; add rate limiting when adding forms/API |
| L3 | Scripts fetch external URL | extract-trainers.ts fetches fixed StatStak URL; not web-exposed | No change; document as dev-only and fixed URL |

---

## 3. What was changed

1. **Security headers (next.config.mjs)**  
   - `X-Content-Type-Options: nosniff`  
   - `X-Frame-Options: DENY`  
   - `Referrer-Policy: strict-origin-when-cross-origin`  
   - `Permissions-Policy` (camera, mic, geolocation disabled; others restricted)  
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (HTTPS only)  
   - `Content-Security-Policy-Report-Only` with a minimal policy and report-uri placeholder (no enforcement yet to avoid breakage)

2. **Secrets and env**  
   - No secrets removed (none found).  
   - `.env.example` already documents `NEXT_PUBLIC_SITE_URL`.  
   - `.gitignore` already excludes `.env`, `.env*.local`.

3. **Dependency and secret checks**  
   - `security:check` script runs `npm audit --audit-level=high` and optional secret scanner.  
   - `docs/security-checklist.md` added for pre-release.  
   - CI can run `npm run security:check` and fail on high/critical.

4. **Documentation**  
   - This audit (threat model, findings, remediation).  
   - `docs/security-checklist.md` for release.

5. **Dependency upgrades**  
   - Next.js and eslint-config-next set to 14.2.35 to address critical CVEs; remaining high in Next (e.g. Image Optimizer, RSC) and in ESLint devDeps are documented in §5.

---

## 4. How to verify

```bash
# Install and build
npm ci
npm run build

# Security check (audit + optional secret scan)
npm run security:check

# Optional: fail only on critical (e.g. CI while dev high are tracked)
SECURITY_AUDIT_LEVEL=critical npm run security:check

# Optional: secret scan (requires gitleaks installed)
RUN_GITLEAKS=1 npm run security:check

# Manual header check (after deploy or local start)
# Start app: npm run start
# Then: curl -I http://localhost:3000/
# Expect: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Strict-Transport-Security, Permissions-Policy, Content-Security-Policy-Report-Only
```

Expected from `security:check`:

- `npm audit` exits 0 when no vulnerabilities at or above the chosen level (default: high).
- Secret scanner (if run) reports no committed secrets.

---

## 5. Dependency audit state

- **Next.js:** Upgraded to 14.2.35 to address critical advisories. Some high advisories may remain (e.g. Image Optimizer DoS, RSC deserialization); they are mitigated by: static export or minimal use of affected features; allowlisted `remotePatterns` only.
- **ESLint tooling (devDependencies):** High findings in glob/minimatch/ajv affect only lint runs, not production runtime. Track for upstream fixes; optional: set `SECURITY_AUDIT_LEVEL=critical` in CI to pass until fixed.
- **CI:** Run `npm run security:check`. To fail only on critical: `SECURITY_AUDIT_LEVEL=critical npm run security:check`.

## 6. Top risks remaining

- **CSP in enforce mode:** Not enabled yet; report-only is set. Moving to enforce requires testing inline scripts (e.g. Next.js, Framer Motion) and possibly nonces or hashes.
- **Supply chain:** Dependency vulnerabilities are addressed by audit in CI; consider Dependabot or similar for automated PRs.
- **If adding later:** Forms, API routes, or auth will need input validation (e.g. Zod), CSRF, secure cookies, and rate limiting—covered in the security checklist.
