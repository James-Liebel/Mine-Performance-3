import { test, expect } from '@playwright/test';

test.describe('Filters', () => {
  test('about page coaching section has coach list', async ({ page }) => {
    await page.goto('/about#coaching-staff');
    await expect(page.getByRole('heading', { name: /Coaching staff/i })).toBeVisible();
    await expect(
      page.locator('.coach-grid, .coaches-empty-state, .coach-card').first()
    ).toBeVisible();
  });

  test('results page has college commits and CTAs', async ({ page }) => {
    await page.goto('/results', { waitUntil: 'networkidle' });
    const heading = page.getByTestId('results-heading').or(page.locator('h1')).first();
    await expect(heading).toContainText(/College commits|Athletes|Results|colleges/i, { timeout: 15000 });
    await expect(page.getByRole('link', { name: /View memberships/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Contact us/i })).toBeVisible();
  });
});
