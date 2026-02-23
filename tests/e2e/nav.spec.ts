import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('main nav links work on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/train smarter|training, quantified/i);

    const nav = page.locator('nav[aria-label="Main navigation"]');
    await nav.getByRole('link', { name: 'Programs' }).click();
    await expect(page).toHaveURL(/\/member-registration/);
    await expect(page.locator('h1')).toContainText('Training options');

    await page.goto('/');
    await nav.getByRole('link', { name: 'Scheduling' }).click();
    await expect(page).toHaveURL(/\/events/);

    await page.goto('/');
    await nav.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact/);

    await page.goto('/');
    await nav.getByRole('link', { name: /Login · Sign up/i }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/');
    await expect(page.getByTestId('chat-widget-toggle')).toBeVisible();
  });

  test('nav works on mobile (toggle menu)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('nav').getByRole('link', { name: 'Programs' }).first()).toBeVisible();
    await page.locator('nav').getByRole('link', { name: 'Contact' }).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('skip link moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await skip.click();
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
