/**
 * Playwright crawl of StatStak pages for Mine Performance Academy.
 * Screenshots and HTML saved to /artifacts/crawl2/.
 *
 * Usage:
 *   STATSTAK_BASE_URL=https://yoursite.statstaklabs.com npm run crawl
 *   (Windows) $env:STATSTAK_BASE_URL="https://yoursite.statstaklabs.com"; npm run crawl
 *
 * If athlete profile pages are behind auth, the script stops and documents in audit.
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts', 'crawl2');
const BASE_URL = process.env.STATSTAK_BASE_URL || 'https://defined-baseball-academy.statstaklabs.com';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/trainers', name: 'trainers' },
  { path: '/events', name: 'events' },
  { path: '/leaderboard', name: 'leaderboard' },
];

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function crawl() {
  await ensureDir(ARTIFACTS_DIR);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'MinePerformanceCrawl/1.0 (Discovery)',
  });

  const results: { route: string; name: string; ok: boolean; authBlock?: boolean; error?: string }[] = [];

  for (const { path: routePath, name } of ROUTES) {
    const url = `${BASE_URL.replace(/\/$/, '')}${routePath}`;
    const page = await context.newPage();

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      const status = response?.status() ?? 0;

      if (status === 401 || status === 403 || page.url().toLowerCase().includes('login')) {
        results.push({ route: routePath, name, ok: false, authBlock: true });
        fs.writeFileSync(
          path.join(ARTIFACTS_DIR, `${name}-AUTH-BLOCKED.txt`),
          `URL: ${url}\nStatus: ${status}\nRedirected to: ${page.url()}\n\nAthlete/profile pages may be behind auth. Document in /docs/audit.md.`
        );
        await page.close();
        continue;
      }

      if (status >= 400) {
        results.push({ route: routePath, name, ok: false, error: `HTTP ${status}` });
        await page.close();
        continue;
      }

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, `${name}.png`),
        fullPage: true,
      });

      const html = await page.content();
      fs.writeFileSync(path.join(ARTIFACTS_DIR, `${name}.html`), html, 'utf8');

      results.push({ route: routePath, name, ok: true });

      // Try to discover athlete profile links (same origin only)
      if (routePath === '/' || routePath === '/leaderboard') {
        const profileLinks = await page.$$eval('a[href*="athlete"], a[href*="profile"], a[href*="player"]', (nodes) =>
          nodes
            .map((a) => (a as HTMLAnchorElement).href)
            .filter((href) => href && !href.includes('logout'))
            .slice(0, 5)
        );
        if (profileLinks.length > 0) {
          fs.writeFileSync(
            path.join(ARTIFACTS_DIR, 'discovered-profile-links.txt'),
            profileLinks.join('\n'),
            'utf8'
          );
          // Optionally visit first profile to check auth
          const profileUrl = profileLinks[0];
          const profilePage = await context.newPage();
          const profileRes = await profilePage.goto(profileUrl, { waitUntil: 'networkidle', timeout: 15000 });
          const profileStatus = profileRes?.status() ?? 0;
          if (profileStatus === 401 || profileStatus === 403 || profilePage.url().toLowerCase().includes('login')) {
            fs.writeFileSync(
              path.join(ARTIFACTS_DIR, 'athlete-profiles-AUTH-BLOCKED.txt'),
              `Profile URL sample: ${profileUrl}\nStatus: ${profileStatus}\n\nAthlete profile pages are behind auth. Document in /docs/audit.md.`
            );
          } else {
            await profilePage.screenshot({
              path: path.join(ARTIFACTS_DIR, 'athlete-profile-sample.png'),
              fullPage: true,
            });
          }
          await profilePage.close();
        }
      }
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      results.push({ route: routePath, name, ok: false, error: err });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, `${name}-error.txt`), err, 'utf8');
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'crawl-results.json'),
    JSON.stringify({ baseUrl: BASE_URL, routes: ROUTES, results, timestamp: new Date().toISOString() }, null, 2),
    'utf8'
  );

  console.log('Crawl complete. Results:', results);
  console.log('Artifacts saved to', ARTIFACTS_DIR);
  return results;
}

crawl().catch((e) => {
  console.error(e);
  process.exit(1);
});
