import { test, expect } from '@playwright/test';

/**
 * Integration contract tests:
 * - Health endpoint
 * - CTA → correct outbound URL (StatStak)
 * - Form success/failure with mocks
 */

test.describe('Integration contracts', () => {
  test('GET /api/health returns status and integrations', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('integrations');
    expect(body.integrations).toHaveProperty('statstak');
    expect(body.integrations).toHaveProperty('noop');
  });

  test.skip('portal results has StatStak leaderboard link with correct URL', async ({ page }) => {
    // Route /portal/results removed; portal restructured. Re-enable when portal results exists.
    await page.goto('/portal/results');
    const link = page.getByTestId('statstak-leaderboard-link');
    await expect(link).toBeVisible();
  });

  test('primary CTA flows to correct routes', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /Book an Evaluation|View memberships/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/start|\/member-registration/);

    await page.goto('/start');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('link', { name: /Contact us/i })).toBeVisible();
  });

  test('contact form success — submit shows confirmation', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel(/Name/i).fill('Test User');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Message/i).fill('Test message');
    await page.getByTestId('contact-form-submit').click();
    await expect(page.getByText(/Message sent!/i)).toBeVisible();
  });

  test('contact form failure — mocked 500 shows error', async ({ page }) => {
    await page.route('**/api/contact', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'Service unavailable' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/contact');
    await page.getByLabel(/Name/i).fill('Test User');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Message/i).fill('Test message');
    await page.getByTestId('contact-form-submit').click();
    await expect(page.getByText(/Service unavailable|Something went wrong|Unable to send/i)).toBeVisible();
  });
});
