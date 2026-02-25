import { test, expect } from '@playwright/test';

test.describe('Internal CTAs (standalone site)', () => {
  test('about page coaching section has contact link', async ({ page }) => {
    await page.goto('/about#coaching-staff');
    const contactLink = page.getByRole('link', { name: /Contact us/i }).first();
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute('href', /\/contact/);
  });

  test('events page has contact link', async ({ page }) => {
    await page.goto('/events');
    const contactLink = page.getByRole('link', { name: /Contact us/i }).first();
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute('href', /\/contact/);
  });

  test('contact page has form and location', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();
    await expect(page.getByLabel(/Name/i)).toBeVisible();
    await expect(
      page.getByText(/4999 Houston Rd|Address|Location|Get directions|Location & hours/i).first()
    ).toBeVisible();
  });
});
