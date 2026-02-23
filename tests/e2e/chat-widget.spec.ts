import { test, expect } from '@playwright/test';

test.describe('Chat widget', () => {
  test('open homepage, click chat button, ask known question, verify answer', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/training, quantified/i);

    const toggle = page.getByTestId('chat-widget-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();

    const panel = page.getByTestId('chat-widget-panel');
    await expect(panel).toBeVisible();

    const input = page.getByTestId('chat-input');
    await expect(input).toBeVisible();
    await input.fill('How do I get started?');

    await page.getByTestId('chat-send').click();

    const assistantMessage = page
      .getByTestId('chat-message-assistant')
      .first();
    await expect(assistantMessage).toBeVisible();
    await expect(assistantMessage).toContainText(
      /Book an evaluation|match you with the right program/i
    );
  });

  test('suggested question chips populate input when clicked', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByTestId('chat-widget-toggle').click();
    await expect(page.getByTestId('chat-widget-panel')).toBeVisible();

    const chip = page.getByTestId('chat-suggested-question').first();
    await expect(chip).toBeVisible();
    await chip.click();

    const input = page.getByTestId('chat-input');
    await expect(input).toHaveValue(
      /How do I get started|What ages|Where|drop-in|progress|remote/i
    );
  });

  test('ESC closes chat panel', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('chat-widget-toggle').click();
    await expect(page.getByTestId('chat-widget-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('chat-widget-panel')).not.toBeVisible();
  });

  test('low confidence shows related topics and contact link', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByTestId('chat-widget-toggle').click();
    const input = page.getByTestId('chat-input');
    await input.fill('xyzzy nothing related');
    await page.getByTestId('chat-send').click();

    const assistantMessage = page
      .getByTestId('chat-message-assistant')
      .first();
    await expect(assistantMessage).toContainText(/not sure|related topics/i);

    const panel = page.getByTestId('chat-widget-panel');
    await expect(panel.getByRole('link', { name: /contact us/i })).toBeVisible();
  });
});
