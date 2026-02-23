import { test, expect } from '@playwright/test';

test.describe('Start redirect and login', () => {
  test('/start redirects to /login', async ({ page }) => {
    await page.goto('/start');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toContainText('Login');
  });

  test('login page has sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Login');
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
  });
});
