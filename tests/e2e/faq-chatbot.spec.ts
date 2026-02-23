import { test, expect } from '@playwright/test';

/**
 * FAQ chatbot via the site-wide chat widget.
 * Does NOT assume /faq exists (chat is in widget).
 */
test.describe('FAQ Chatbot (via widget)', () => {
  test('open chat, ask known question, verify answer', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('chat-widget-launcher').click();
    const input = page.getByTestId('chat-input');
    await expect(input).toBeVisible();
    await input.fill('How do I get started?');
    await page.getByTestId('chat-send').click();
    const assistantMessage = page.getByTestId('chat-message-assistant').first();
    await expect(assistantMessage).toBeVisible();
    await expect(assistantMessage).toContainText(
      /Book an evaluation|match you with the right program/i
    );
  });

  test('suggested question chips populate input', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('chat-widget-launcher').click();
    const chip = page.getByTestId('chat-suggested-question').first();
    await expect(chip).toBeVisible();
    await chip.click();
    const input = page.getByTestId('chat-input');
    await expect(input).toHaveValue(
      /How do I get started|What ages|Where|drop-in|progress|remote/i
    );
  });

  test('low confidence shows related topics and contact link', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('chat-widget-launcher').click();
    const input = page.getByTestId('chat-input');
    await input.fill('xyzzy nothing related');
    await page.getByTestId('chat-send').click();
    const assistantMessage = page.getByTestId('chat-message-assistant').first();
    await expect(assistantMessage).toContainText(/not sure|related topics/i);
    const panel = page.getByTestId('chat-widget-panel');
    await expect(panel.getByRole('link', { name: /contact us/i })).toBeVisible();
  });
});
