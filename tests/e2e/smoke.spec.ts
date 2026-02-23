import { test, expect } from '@playwright/test';

/**
 * Smoke tests: home loads, each primary route renders, primary CTAs exist and are clickable.
 */
test.describe('Smoke', () => {
  test('home loads and shows hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/train smarter|training, quantified/i);
    await expect(page.getByRole('link', { name: /View memberships|Book an Evaluation/i }).first()).toBeVisible();
    await expect(page.getByTestId('chat-widget-toggle')).toBeVisible();
  });

  test('each primary route renders without error', async ({ page }) => {
    const routes = [
      { path: '/', h1: /train smarter|training, quantified/i },
      { path: '/member-registration', h1: 'Training options' },
      { path: '/about', h1: /About Mine Performance/i },
      { path: '/events', h1: /Events|Scheduling/i },
      { path: '/login', h1: 'Login' },
      { path: '/contact', h1: 'Contact' },
    ];
    for (const { path, h1 } of routes) {
      await page.goto(path);
      await expect(page.locator('h1')).toContainText(h1);
    }
  });

  test('404 shows not-found content', async ({ page }) => {
    await page.goto('/nonexistent-page-404');
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /go home/i })).toBeVisible();
  });

  test('primary CTAs are clickable', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View memberships|Book an Evaluation/i }).first().click();
    await expect(page).toHaveURL(/\/(member-registration|start|login)/);

    await page.goto('/about#coaching-staff');
    await expect(page.getByTestId('page-primary-cta')).toBeVisible();
    await expect(page.getByRole('link', { name: /Contact us/i }).first()).toHaveAttribute('href', /\/contact/);
  });

  test('primary CTA exists on marketing pages that use it', async ({ page }) => {
    const paths = ['/about', '/events'];
    for (const path of paths) {
      await page.goto(path);
      await expect(page.getByTestId('page-primary-cta')).toBeVisible();
    }
  });
});
