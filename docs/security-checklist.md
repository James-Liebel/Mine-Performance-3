# Security checklist — before release

Use this list before shipping or deploying to production.

## Secrets and environment

- [ ] No secrets or API keys committed (run `npm run security:check`).
- [ ] `.env.local` (or production env) sets `NEXT_PUBLIC_SITE_URL` to the real canonical URL.
- [ ] Production env has no `.env` or `.env*.local` committed; use platform env (e.g. Vercel, Netlify).

## Dependencies

- [ ] `npm audit` shows no high or critical vulnerabilities (or they are accepted and documented).
- [ ] Lockfile is committed (`package-lock.json`); use `npm ci` in CI.

## Headers and HTTPS

- [ ] App is served over HTTPS in production.
- [ ] Security headers are present: run `curl -I https://yoursite.com/` and confirm:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy`
  - `Strict-Transport-Security`
  - `Permissions-Policy`

## Content and links

- [ ] All outbound links (StatStak, etc.) use intended URLs; no open redirects from user input.
- [ ] No user-supplied HTML or script rendered without sanitization (current app has none).

## If you add later

- **Forms / API routes:** Add server-side validation (e.g. Zod), CSRF where applicable, rate limiting.
- **Auth:** Use secure cookies (HttpOnly, Secure, SameSite), no tokens in localStorage for sensitive data.
- **File upload:** Validate type and size server-side; store outside web root or with non-executable permissions.
- **CSP:** Move from report-only to enforce after testing; add nonces or hashes for required inline scripts.

## Commands

```bash
npm run security:check   # Audit (fail on high+) + optional secret scan
npm run build            # Must pass
npm run pre-push         # Lint, typecheck, build
```

**CI:** Run `npm run security:check` in CI. To fail only on critical (e.g. while tracking high in dev deps): `SECURITY_AUDIT_LEVEL=critical npm run security:check`. For secret scanning, install gitleaks and run `RUN_GITLEAKS=1 npm run security:check`.
