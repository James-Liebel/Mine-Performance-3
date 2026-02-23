/**
 * Entry point: create Stripe Checkout Session (e.g. for one-time purchase or subscription).
 * POST with { priceId?, successUrl?, cancelUrl?, customerId?, clientReferenceId? }
 * Protected by session; call from server action or authenticated API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getStripeServer } from '@/lib/stripe/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const o = body as Record<string, unknown>;
  const priceId = typeof o.priceId === 'string' ? o.priceId : null;
  const successUrl = typeof o.successUrl === 'string' ? o.successUrl : null;
  const cancelUrl = typeof o.cancelUrl === 'string' ? o.cancelUrl : null;
  const customerId = typeof o.customerId === 'string' ? o.customerId : undefined;
  const clientReferenceId = typeof o.clientReferenceId === 'string' ? o.clientReferenceId : session.user.email;
  const credits = typeof o.credits === 'number' && o.credits >= 0 ? o.credits : undefined;

  if (!priceId) {
    return NextResponse.json({ error: 'priceId required' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000';
  const success = successUrl ?? `${baseUrl}/profile?checkout=success`;
  const cancel = cancelUrl ?? `${baseUrl}/profile?checkout=cancelled`;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment', // or 'subscription'
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success,
      cancel_url: cancel,
      customer_email: customerId ? undefined : session.user.email,
      customer: customerId,
      client_reference_id: clientReferenceId,
      metadata: {
        userId: (session.user as { id?: string }).id ?? session.user.email,
        email: session.user.email,
        ...(typeof credits === 'number' ? { credits: String(credits) } : {}),
      },
    });
    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
