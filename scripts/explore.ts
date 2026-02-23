/**
 * Autonomous exploration of mine-performance.statstak.io (live) and local app.
 * - Headed run first, then headless
 * - Visits target URLs, clicks nav, scrolls for lazy content
 * - Captures desktop + mobile full-page screenshots
 * - Extracts headings, CTAs, nav, footer, internal link graph, copy.txt
 * Run: npx tsx scripts/explore.ts
 * Output: artifacts/explore/{timestamp}/
 */

import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const LIVE_BASE = 'https://mine-performance.statstak.io';
const LOCAL_BASE = 'http://localhost:3000';

const LIVE_TARGETS = [
  { url: LIVE_BASE + '/', name: 'home' },
  { url: LIVE_BASE + '/index/mine-performance-academy', name: 'home-index' },
  { url: LIVE_BASE + '/trainers/', name: 'trainers' },
  { url: LIVE_BASE + '/events/', name: 'events' },
  { url: LIVE_BASE + '/leaderboard/', name: 'leaderboard' },
];

const LOCAL_TARGETS = [
  { url: LOCAL_BASE + '/', name: 'home' },
  { url: LOCAL_BASE + '/programs', name: 'programs' },
  { url: LOCAL_BASE + '/events', name: 'events' },
  { url: LOCAL_BASE + '/coaches', name: 'coaches' },
  { url: LOCAL_BASE + '/member-registration', name: 'member-registration' },
  { url: LOCAL_BASE + '/rentals', name: 'rentals' },
  { url: LOCAL_BASE + '/about', name: 'about' },
  { url: LOCAL_BASE + '/contact', name: 'contact' },
  { url: LOCAL_BASE + '/start', name: 'start' },
];

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.join(process.cwd(), 'artifacts', 'explore', timestamp);
const screenshotsDir = path.join(outDir, 'screenshots');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function scrollPage(page: Page) {
  try {
    await page.evaluate(async () => {
      const sh = document.documentElement.scrollHeight;
      for (let p = 0; p < sh; p += 400) {
        window.scrollTo(0, p);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    });
  } catch {
    /* scroll may fail on some pages */
  }
  await page.waitForTimeout(500);
}

async function clickNavItems(page: Page, baseUrl: string) {
  const navSelector = 'nav a, header a, [role="navigation"] a, .nav-menu a, .nav-dropdown a';
  const navLinks = await page.$$eval(navSelector, (els, base: string) => {
    return els
      .map((a) => {
        const href = (a as HTMLAnchorElement).href;
        const text = (a as HTMLAnchorElement).innerText?.trim() || '';
        return { href, text };
      })
      .filter((x) => x.href && (x.href.startsWith(base) || x.href.startsWith('/')));
  }, baseUrl);

  const visited = new Set<string>();
  const toVisit: { href: string; text: string }[] = [];
  for (const lnk of navLinks) {
    try {
      const u = new URL(lnk.href, baseUrl);
      const pathKey = u.pathname;
      if (!visited.has(pathKey) && pathKey.startsWith(new URL(baseUrl).pathname) !== false) {
        visited.add(pathKey);
        toVisit.push(lnk);
      }
    } catch {
      /* skip */
    }
  }
  return toVisit.slice(0, 12);
}

interface PageData {
  url: string;
  name: string;
  timestamp: string;
  headings: { tag: string; text: string }[];
  ctas: { text: string; href: string | null; role: string }[];
  navItems: { text: string; href: string }[];
  footerLinks: { text: string; href: string }[];
  internalLinks: string[];
  bodyText: string;
}

async function extractPageData(page: Page, url: string, name: string): Promise<PageData> {
  const data: PageData = {
    url,
    name,
    timestamp: new Date().toISOString(),
    headings: [],
    ctas: [],
    navItems: [],
    footerLinks: [],
    internalLinks: [],
    bodyText: '',
  };

  data.headings = await page.$$eval('h1, h2, h3, h4', (els) =>
    els.map((e) => ({ tag: e.tagName, text: (e as HTMLElement).innerText.trim().slice(0, 200) }))
  );
  data.ctas = await page.$$eval('a[href], button', (els) =>
    (els as (HTMLAnchorElement | HTMLButtonElement)[])
      .map((el) => {
        const text = el.innerText?.trim().slice(0, 100) || '';
        const href = 'href' in el ? (el as HTMLAnchorElement).href : null;
        const role = el.getAttribute('role') || (el.tagName === 'BUTTON' ? 'button' : 'link');
        return { text, href, role };
      })
      .filter((x) => x.text || x.href)
  );
  data.navItems = await page.$$eval('nav a, header a, [role="navigation"] a', (els) =>
    els.map((a) => ({ text: (a as HTMLAnchorElement).innerText.trim(), href: (a as HTMLAnchorElement).href }))
  );
  data.footerLinks = await page.$$eval('footer a[href]', (els) =>
    els.map((a) => ({ text: (a as HTMLAnchorElement).innerText.trim(), href: (a as HTMLAnchorElement).href }))
  );
  data.internalLinks = await page.$$eval('a[href]', (els, baseUrl: string) => {
    const base = new URL(baseUrl);
    return els
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((href) => {
        try {
          const u = new URL(href, baseUrl);
          return u.origin === base.origin || href.startsWith('/');
        } catch {
          return false;
        }
      });
  }, url);
  data.bodyText = await page.evaluate(() => document.body?.innerText?.trim() || '');

  return data;
}

function buildLinkGraph(pages: PageData[], baseUrl: string) {
  const nodes: Record<string, { url: string; name: string }> = {};
  const edges: { from: string; to: string; count?: number }[] = [];
  const base = new URL(baseUrl);

  for (const p of pages) {
    const fromPath = new URL(p.url).pathname || '/';
    nodes[fromPath] = { url: p.url, name: p.name };
    const toCounts = new Map<string, number>();
    for (const href of p.internalLinks) {
      try {
        const u = new URL(href, baseUrl);
        if (u.origin !== base.origin) continue;
        const toPath = u.pathname || '/';
        if (toPath !== fromPath) toCounts.set(toPath, (toCounts.get(toPath) || 0) + 1);
      } catch {
        /* skip */
      }
    }
    toCounts.forEach((count, toPath) => edges.push({ from: fromPath, to: toPath, count }));
  }
  return { nodes, edges };
}

async function runExploration(
  baseUrl: string,
  targets: { url: string; name: string }[],
  prefix: string,
  headed: boolean,
  clickNav: boolean
) {
  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const allPages: PageData[] = [];
  const exploreNotes: string[] = [];
  const discoveredByNav = new Map<string, PageData>();

  for (const { url, name } of targets) {
    const page = await context.newPage();
    try {
      const res = await page.goto(url, { waitUntil: 'load', timeout: 25000 });
      if (res && res.status() >= 400) {
        exploreNotes.push(`${prefix}${name}: HTTP ${res.status()}`);
        await page.close();
        continue;
      }
      await page.waitForTimeout(3000);
      await scrollPage(page);

      if (clickNav) {
        const navToClick = await clickNavItems(page, baseUrl);
        for (const lnk of navToClick.slice(0, 6)) {
          try {
            const r = await page.goto(lnk.href, { waitUntil: 'domcontentloaded', timeout: 10000 });
            if (r && r.status() < 400) {
              await page.waitForTimeout(1000);
              await scrollPage(page);
              const u = new URL(lnk.href);
              const pathKey = u.pathname;
              if (!discoveredByNav.has(pathKey)) {
                const pd = await extractPageData(page, lnk.href, pathKey.replace(/\//g, '-') || 'root');
                discoveredByNav.set(pathKey, pd);
              }
            }
          } catch {
            /* skip */
          }
        }
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(500);
      }

      const pageData = await extractPageData(page, url, name);
      allPages.push(pageData);

      await page.setViewportSize({ width: 1280, height: 720 });
      await page.screenshot({
        path: path.join(screenshotsDir, `${prefix}${name}-desktop.png`),
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({
        path: path.join(screenshotsDir, `${prefix}${name}-mobile.png`),
        fullPage: true,
      });
      await page.close();
    } catch (e) {
      exploreNotes.push(`${prefix}${name}: ${e instanceof Error ? e.message : String(e)}`);
      await page.close();
    }
  }

  for (const [pathKey, pd] of Array.from(discoveredByNav)) {
    if (!allPages.some((p) => new URL(p.url).pathname === pathKey)) {
      allPages.push(pd);
    }
  }

  await context.close();
  await browser.close();

  return { allPages, exploreNotes };
}

async function main() {
  const useLive = process.env.EXPLORE_LIVE !== '0';
  const useLocal = process.env.EXPLORE_LOCAL === '1';
  const headedFirst = process.env.HEADED === '1';

  ensureDir(outDir);
  ensureDir(screenshotsDir);

  const allPages: PageData[] = [];
  const exploreNotes: string[] = [];

  if (useLive) {
    console.log(headedFirst ? 'Running LIVE (headed)...' : 'Running LIVE (headless)...');
    const { allPages: livePages, exploreNotes: liveNotes } = await runExploration(
      LIVE_BASE,
      LIVE_TARGETS,
      'live-',
      headedFirst,
      true
    );
    allPages.push(...livePages);
    exploreNotes.push(...liveNotes.map((n) => '[live] ' + n));
  }

  if (useLocal) {
    console.log(headedFirst ? 'Running LOCAL (headed)...' : 'Running LOCAL (headless)...');
    const { allPages: localPages, exploreNotes: localNotes } = await runExploration(
      LOCAL_BASE,
      LOCAL_TARGETS,
      'local-',
      headedFirst,
      true
    );
    allPages.push(...localPages);
    exploreNotes.push(...localNotes.map((n) => '[local] ' + n));
  }

  const livePages = allPages.filter((p) => p.url.startsWith(LIVE_BASE));
  const localPages = allPages.filter((p) => p.url.startsWith(LOCAL_BASE));
  const linkGraphs: Record<string, ReturnType<typeof buildLinkGraph>> = {};
  if (livePages.length) linkGraphs.live = buildLinkGraph(livePages, LIVE_BASE);
  if (localPages.length) linkGraphs.local = buildLinkGraph(localPages, LOCAL_BASE);

  fs.writeFileSync(
    path.join(outDir, 'pages.json'),
    JSON.stringify({
      timestamp,
      live: livePages.length ? { base: LIVE_BASE, pages: livePages } : null,
      local: localPages.length ? { base: LOCAL_BASE, pages: localPages } : null,
    }, null, 2),
    'utf8'
  );
  fs.writeFileSync(
    path.join(outDir, 'links.json'),
    JSON.stringify({ timestamp, ...linkGraphs }, null, 2),
    'utf8'
  );

  const copyLines: string[] = [];
  for (const p of allPages) {
    copyLines.push(`\n--- PAGE: ${p.name} (${p.url}) ---\n`);
    copyLines.push(p.bodyText);
    copyLines.push('');
  }
  fs.writeFileSync(path.join(outDir, 'copy.txt'), copyLines.join('\n'), 'utf8');

  fs.writeFileSync(path.join(outDir, 'explore-notes.txt'), exploreNotes.join('\n'), 'utf8');

  const nodeCount = Object.values(linkGraphs).reduce((sum, g) => sum + Object.keys(g.nodes).length, 0);
  console.log('Explore done. Output:', outDir);
  console.log('Pages:', allPages.length, 'Link nodes:', nodeCount);
  return { outDir, pages: allPages.length, linkGraphs };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
