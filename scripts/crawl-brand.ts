/**
 * Brand discovery crawl: screenshot pages and extract visible copy.
 * Run: npm run crawl
 * Outputs: artifacts/brand-crawl/*.png, artifacts/brand-crawl/copy.txt
 */

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE = 'https://mine-performance.statstak.io';
const OUT_DIR = path.join(process.cwd(), 'artifacts', 'brand-crawl');

const PAGES: { url: string; name: string }[] = [
  { url: BASE + '/', name: 'home' },
  { url: BASE + '/trainers', name: 'trainers' },
  { url: BASE + '/events', name: 'events' },
  { url: BASE + '/leaderboard', name: 'leaderboard' },
];

async function extractVisibleText(page: import('@playwright/test').Page): Promise<string> {
  return page.evaluate(() => {
    const getText = (el: Element): string => {
      let out = '';
Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) out += node.textContent;
      else if (node.nodeType === Node.ELEMENT_NODE) {
        const e = node as HTMLElement;
        if (e.tagName !== 'SCRIPT' && e.tagName !== 'STYLE') out += getText(e);
      }
    });
      return out;
    };
    return getText(document.body).replace(/\s+/g, ' ').trim();
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const copySections: string[] = [];
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    for (const { url, name } of PAGES) {
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(OUT_DIR, `${name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log('Screenshot:', screenshotPath);

        const text = await extractVisibleText(page);
        copySections.push(`\n--- ${name} (${url}) ---\n${text}`);
      } catch (e) {
        console.warn(`Failed ${name} (${url}):`, e);
        copySections.push(`\n--- ${name} (${url}) [ERROR] ---\n(load failed)\n`);
      } finally {
        await page.close();
      }
    }

    // Try to find article-like pages
    const page = await context.newPage();
    try {
      await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
      const links = await page.$$eval('a[href*="mine-performance"]', (as) =>
        as.map((a) => (a as HTMLAnchorElement).href).filter((h) => !h.includes('privacy') && !h.includes('terms') && !h.includes('reset') && !h.includes('support'))
      );
      const seen = new Set(PAGES.map((p) => p.url));
      for (const href of links) {
        const norm = href.split('?')[0].replace(/\/$/, '') || BASE + '/';
        if (seen.has(norm)) continue;
        seen.add(norm);
        const slug = norm.replace(BASE, '').replace(/^\//, '') || 'home';
        const name = slug.replace(/\//g, '-') || 'index';
        try {
          const p = await context.newPage();
          await p.goto(norm, { waitUntil: 'networkidle', timeout: 10000 });
          await p.waitForTimeout(1000);
          await p.screenshot({ path: path.join(OUT_DIR, `article-${name}.png`), fullPage: true });
          const text = await extractVisibleText(p);
          copySections.push(`\n--- ${name} (${norm}) ---\n${text}`);
          await p.close();
        } catch {
          // skip
        }
      }
      await page.close();
    } catch {
      // ignore
    }

    const copyPath = path.join(OUT_DIR, 'copy.txt');
    fs.writeFileSync(copyPath, copySections.join('\n'), 'utf-8');
    console.log('Copy saved:', copyPath);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
