/**
 * Stripe webhook entry point. Handles events from Stripe (payments, subscriptions, etc.).
 * Configure this URL in Stripe Dashboard: Webhooks → Add endpoint.
 * Must use raw body for signature verification; do not parse JSON before verifying.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer, getStripeWebhookSecret } from '@/lib/stripe/server';
import { recordCreditChange } from '@/lib/credit-transactions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = getStripeServer();
  const webhookSecret = getStripeWebhookSecret();
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    );
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  let event: { type: string; data: { object?: unknown } };
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret) as {
      type: string;
      data: { object?: unknown };
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  // Handle events you care about. Add cases as you add Stripe products.
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data?.object as {
        id?: string;
        customer_email?: string | null;
        client_reference_id?: string | null;
        metadata?: Record<string, string> | null;
      };
      const email =
        session?.customer_email?.trim() ||
        session?.client_reference_id?.trim() ||
        session?.metadata?.email?.trim() ||
        session?.metadata?.userId?.trim();
      const creditsRaw = session?.metadata?.credits;
      const credits = typeof creditsRaw === 'string' ? parseInt(creditsRaw, 10) : Number(creditsRaw);
      if (email && Number.isFinite(credits) && credits > 0) {
        recordCreditChange(email, credits, 'stripe_purchase', session?.id ?? undefined);
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      // Sync subscription status to your DB / user
      break;
    case 'invoice.paid':
    case 'invoice.payment_failed':
      // Handle billing
      break;
    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
