/**
 * Autonomous exploration of Mine Performance StatStak site.
 * Run: npx tsx scripts/explore.ts
 * Outputs: artifacts/explore/{timestamp}/pages.json, links.json, screenshots/
 */

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE = 'https://mine-performance.statstak.io';
const TARGETS = [
  { url: BASE + '/', name: 'home' },
  { url: BASE + '/trainers/', name: 'trainers' },
  { url: BASE + '/events/', name: 'events' },
  { url: BASE + '/leaderboard/', name: 'leaderboard' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

interface PageSummary {
  url: string;
  name: string;
  viewport: string;
  title: string;
  headings: { level: number; text: string }[];
  navItems: string[];
  ctas: { text: string; href?: string }[];
  footerSnippet: string;
  visibleTextLength: number;
  internalLinks: string[];
  screenshot: string;
}

async function extractPageData(page: import('@playwright/test').Page, name: string, viewport: string): Promise<Partial<PageSummary> & { internalLinks: string[] }> {
  const data = await page.evaluate(() => {
    const headings: { level: number; text: string }[] = [];
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
      const match = el.tagName.match(/^H(\d)$/i);
      if (match) headings.push({ level: parseInt(match[1], 10), text: (el.textContent || '').trim() });
    });
    const navItems: string[] = [];
    document.querySelectorAll('nav a, [role="navigation"] a, header a').forEach((a) => {
      const t = (a as HTMLAnchorElement).textContent?.trim();
      if (t) navItems.push(t);
    });
    const ctas: { text: string; href?: string }[] = [];
    document.querySelectorAll('a[href], button').forEach((el) => {
      const text = (el.textContent || '').trim();
      if (text.length > 0 && text.length < 80) {
        const href = (el as HTMLAnchorElement).href;
        ctas.push({ text, href: href || undefined });
      }
    });
    const footer = document.querySelector('footer');
    const footerSnippet = footer ? (footer.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 500) : '';
    const internalLinks: string[] = [];
    document.querySelectorAll('a[href*="mine-performance.statstak.io"]').forEach((a) => {
      const href = (a as HTMLAnchorElement).href;
      if (href && !href.includes('privacy') && !href.includes('terms') && !href.includes('reset') && !href.includes('support'))
        internalLinks.push(href.split('?')[0]);
    });
    const bodyText = document.body?.innerText?.replace(/\s+/g, ' ')?.trim() || '';
    return {
      title: document.title,
      headings,
      navItems: Array.from(new Set(navItems)),
      ctas: ctas.slice(0, 50),
      footerSnippet,
      visibleTextLength: bodyText.length,
      internalLinks: Array.from(new Set(internalLinks)),
    };
  });
  return { ...data, url: page.url(), name, viewport, internalLinks: data.internalLinks };
}

function getTimestamp(): string {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

async function main() {
  const timestamp = getTimestamp();
  const outDir = path.join(process.cwd(), 'artifacts', 'explore', timestamp);
  const screenshotsDir = path.join(outDir, 'screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const allLinks = new Set<string>();
  const pagesData: PageSummary[] = [];
  const exploreNotes: string[] = [];

  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });
      for (const { url, name } of TARGETS) {
        const page = await context.newPage();
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
          await page.waitForTimeout(2500);
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(800);
          await page.evaluate(() => window.scrollTo(0, 0));

          const screenshotPath = path.join(screenshotsDir, `${name}-${vp.name}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          const extracted = await extractPageData(page, name, vp.name);
          extracted.internalLinks.forEach((l) => allLinks.add(l));
          pagesData.push({
            ...extracted,
            screenshot: `screenshots/${name}-${vp.name}.png`,
          } as PageSummary);

          const nav = await page.$('nav a, [role="navigation"] a');
          if (nav) {
            const links = await page.$$eval('nav a, [role="navigation"] a', (as) =>
              (as as HTMLAnchorElement[]).map((a) => ({ href: a.href, text: a.textContent?.trim() }))
            );
            for (const { href, text } of links.slice(0, 15)) {
              if (href && href.startsWith(BASE) && text) allLinks.add(href.split('?')[0]);
            }
          }
        } catch (e) {
          exploreNotes.push(`${new Date().toISOString()} ERROR ${name} (${vp.name}): ${String(e)}`);
          console.warn(`Failed ${name} ${vp.name}:`, e);
        } finally {
          await page.close();
        }
      }
      await context.close();
    }

    fs.writeFileSync(path.join(outDir, 'pages.json'), JSON.stringify(pagesData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(outDir, 'links.json'), JSON.stringify({ links: Array.from(allLinks).sort() }, null, 2), 'utf-8');
    console.log('Artifacts saved to', outDir);
  } finally {
    await browser.close();
  }

  const notesPath = path.join(process.cwd(), 'docs', 'explore-notes.md');
  fs.mkdirSync(path.dirname(notesPath), { recursive: true });
  const notesContent = `# Explore notes — ${timestamp}\n\n- Output: \`artifacts/explore/${timestamp}/\`\n- Pages: ${TARGETS.map((t) => t.name).join(', ')}\n- Viewports: desktop (1440x900), mobile (390x844)\n\n## Automation notes\n\n${exploreNotes.length ? exploreNotes.join('\n') : 'No blocking or errors recorded.'}\n`;
  fs.writeFileSync(notesPath, notesContent, 'utf-8');
  console.log('Notes written to', notesPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
