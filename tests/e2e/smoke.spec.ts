import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('home loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mine Performance Academy/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('nav works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const methodLink = page.locator('a[href="/method"]').first();
    await methodLink.click();
    await page.waitForURL(/\/method/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { level: 1, name: /method/i })).toBeVisible();
  });

  test('primary routes render', async ({ page }) => {
    const routes = [
      { path: '/', h1: /train|smarter|peak/i },
      { path: '/method', h1: /method/i },
      { path: '/programs', h1: /programs/i },
      { path: '/coaches', h1: /coaches/i },
      { path: '/facility', h1: /facility/i },
      { path: '/results', h1: /results/i },
      { path: '/events', h1: /events/i },
      { path: '/rehab', h1: /rehab/i },
      { path: '/contact', h1: /contact/i },
    ];
    for (const { path, h1 } of routes) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1, { timeout: 10_000 });
    }
  });

  test('primary CTAs exist and are clickable', async ({ page }) => {
    await page.goto('/');
    const bookEval = page.getByTestId('cta-book-eval');
    await expect(bookEval).toBeVisible();
    await expect(bookEval).toHaveAttribute('href', '/contact');
    const viewPrograms = page.getByTestId('cta-view-programs');
    await expect(viewPrograms).toBeVisible();
    await expect(viewPrograms).toHaveAttribute('href', '/programs');
  });

  test('StatStak deep links open in new tab', async ({ page }) => {
    await page.goto('/results', { waitUntil: 'domcontentloaded' });
    const leaderboard = page.getByRole('link', { name: /view leaderboard/i });
    await expect(leaderboard).toHaveAttribute('target', '_blank', { timeout: 10_000 });
    await expect(leaderboard).toHaveAttribute('href', 'https://mine-performance.statstak.io/leaderboard');
    await page.goto('/events', { waitUntil: 'domcontentloaded' });
    const schedule = page.getByRole('link', { name: /view full schedule/i });
    await expect(schedule).toHaveAttribute('target', '_blank', { timeout: 10_000 });
  });

  test('404 for unknown route', async ({ page }) => {
    const res = await page.goto('/no-such-page-404');
    expect(res?.status()).toBe(404);
  });
});
