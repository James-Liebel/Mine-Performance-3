/**
 * Stripe server-only instance. Use in API routes, Server Actions, webhooks.
 * Returns null if Stripe is not configured.
 */

import Stripe from 'stripe';

let stripeInstance: Stripe | null | undefined = undefined;

export function getStripeServer(): Stripe | null {
  if (stripeInstance !== undefined) return stripeInstance;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || secret.length === 0) {
    stripeInstance = null;
    return null;
  }
  stripeInstance = new Stripe(secret, {
    typescript: true,
  });
  return stripeInstance;
}

/** Webhook signing secret for verifying Stripe webhook events. */
export function getStripeWebhookSecret(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  return secret && secret.length > 0 ? secret : null;
}
