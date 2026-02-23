/**
 * Entry point: create Stripe Customer Portal session (manage subscription, payment methods).
 * POST with optional { returnUrl? }. Requires user to have a Stripe customerId (set after first purchase or when you create customer).
 * Protected by session.
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
    body = await req.json().catch(() => ({}));
  } catch {
    body = {};
  }
  const o = body as Record<string, unknown>;
  const returnUrl = typeof o.returnUrl === 'string' ? o.returnUrl : null;
  const customerId = typeof o.customerId === 'string' ? o.customerId : null;

  // When using Supabase/DB, load customerId from user profile. For now, require in body for portal.
  if (!customerId) {
    return NextResponse.json(
      { error: 'customerId required. Set when user has a Stripe customer record.' },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000';
  const returnTo = returnUrl ?? `${baseUrl}/profile`;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnTo,
    });
    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
