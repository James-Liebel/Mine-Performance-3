# Deploy to GitHub Pages

Each repo can be deployed as its own static site on GitHub Pages.

## One-time setup per repo

1. **Enable GitHub Pages**
   - Repo → **Settings** → **Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.

2. **Default branch**
   - The workflow runs on push to `main`. If your default branch is `master`, edit `.github/workflows/deploy-pages.yml` and change `branches: [main]` to `branches: [master]`.

## How it works

- **Build**: The workflow sets `GITHUB_PAGES_DEPLOY=1` and `BASE_PATH=/<repo-name>` (e.g. `/Mine-Performance-3`), then runs a static export. API routes and dynamic admin routes are not supported; the workflow temporarily moves `app/api` and `app/admin` aside so the build succeeds. The exported site is in `out/`.
- **Deploy**: The `out/` folder is deployed to GitHub Pages. Your site will be at:
  - **Project page**: `https://<username>.github.io/<repo-name>/`
  - **User/org page** (if this repo is `username.github.io`): set `BASE_PATH` to `''` in the workflow and your site is at the root.

## Local static build (optional)

To build the static export locally (e.g. to preview `out/`):

```bash
# Unix/macOS
GITHUB_PAGES_DEPLOY=1 BASE_PATH=/Mine-Performance-3 npm run build

# Windows (PowerShell)
$env:GITHUB_PAGES_DEPLOY="1"; $env:BASE_PATH="/Mine-Performance-3"; npm run build
```

Or use the script (on Windows, install cross-env first: `npm install -D cross-env`):

```bash
npm install
npm run build:pages
```

Then serve the `out/` folder (e.g. `npx serve out` or any static server). Replace `Mine-Performance-3` with your repo name for MP1/MP2.

## Limitations on GitHub Pages

- **No API routes**: Contact form, health check, auth, and other `/api/*` endpoints do not run. Use an external service (e.g. Formspree, serverless function elsewhere) if you need forms or backend.
- **No admin section**: The `/admin` area is excluded from the static export (it uses server-side auth). Use a Node-capable host (e.g. Vercel) for full admin access.
- **Static only**: All pages are pre-rendered at build time. Dynamic server features are not available.
