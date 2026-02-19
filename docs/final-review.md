# Final review — Mine Performance Academy

## Upgrades completed

- **Next.js / eslint-config-next:** 14.2.18 → 14.2.35 (security patches; critical CVEs addressed).
- **Security:** Headers added in `next.config.mjs`; `security:check` and `security:release` scripts; `.gitleaks.toml` for secret scanning; `docs/security-audit.md` and `docs/security-checklist.md`.
- **Release pipeline:** `npm run release` runs lint → typecheck → build → security (audit at critical only) → e2e.

## No breaking upgrades

- **React 19 / Next 16 / ESLint 10 / Tailwind 4:** Not upgraded; remain on current majors for stability. Revisit when ready for migration.
- **High audit findings:** Remain in ESLint tooling (dev only) and Next (documented mitigations). Use `npm run security:release` or `SECURITY_AUDIT_LEVEL=critical` for a green pipeline.

## Final run (expected)

```bash
npm run release
```

Expected: lint ✔, typecheck ✔, build ✔, security:release ✔ (no critical vulns), e2e 6 passed.

If e2e fails with "port already in use", run `npx kill-port 29347` then `npm run test` (or run `release` again).

## Commands summary

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev |
| `npm run pre-push` | Quick gate: lint, typecheck, build |
| `npm run release` | Full gate: + security (critical), e2e |
| `npm run security:check` | Audit at high+ (fails on current high) |
| `npm run security:release` | Audit at critical only (for CI/release) |

## Docs

- **QA:** `docs/bugbash.md`
- **Security:** `docs/security-audit.md`, `docs/security-checklist.md`
- **Brand:** `docs/brand-platform.md`, `docs/pitch-3-narrative.md`
- **Launch:** `docs/launch-checklist.md`
