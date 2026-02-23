import { NextRequest, NextResponse } from 'next/server';
import { getStoredMemberships, setStoredMemberships } from '@/lib/membership-store';
import { requireAdmin } from '@/lib/auth';
import { membershipsPutSchema } from '@/lib/api-schemas';
import { rateLimitMutation, getClientIdentifier } from '@/lib/rate-limit';
import type { Membership } from '@/lib/memberships';

/** GET: current memberships list (for admin pricing page load) */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
  }
  const memberships = getStoredMemberships();
  return NextResponse.json(memberships);
}

/** PUT: save full memberships list (add/remove/edit) */
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
  }
  const limiter = rateLimitMutation(getClientIdentifier(req));
  if (!limiter.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  try {
    const body = await req.json();
    const parsed = membershipsPutSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join('; ');
      return NextResponse.json({ error: `Validation failed: ${msg}` }, { status: 400 });
    }
    setStoredMemberships(parsed.data.memberships as Membership[]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
