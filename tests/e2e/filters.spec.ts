import { test, expect } from '@playwright/test';

test.describe('Filters', () => {
  test('about page coaching section has coach list', async ({ page }) => {
    await page.goto('/about#coaching-staff');
    await expect(page.locator('#coaching-staff h2')).toContainText('Coaching staff');
    await expect(page.locator('.coach-card:not(.coach-card-add)')).toHaveCount(6);
    await expect(page.locator('.coach-title').first()).toBeVisible();
  });

  test('results page has college commits and CTAs', async ({ page }) => {
    await page.goto('/results');
    await expect(page.locator('h1')).toContainText('College commits');
    await expect(page.getByRole('link', { name: /View memberships/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Contact us/i })).toBeVisible();
  });
});
