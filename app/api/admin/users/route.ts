import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getUsers, getUsersPaginated, updateUser, getUserByEmail } from '@/lib/user-service';
import { recordCreditChange } from '@/lib/credit-transactions';

function isAdmin(session: unknown): boolean {
  return (session as { user?: { role?: string } } | null)?.user?.role === 'admin';
}

/** GET: list users (admin only). Supports ?page=1&limit=20&q=search for pagination and search. */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = req.nextUrl;
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const q = searchParams.get('q') ?? undefined;

  const usePaginated = page !== null || limit !== null || q !== undefined;
  if (usePaginated) {
    const result = getUsersPaginated({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      q,
    });
    return NextResponse.json(result);
  }
  const users = getUsers();
  return NextResponse.json(users);
}

/** PATCH: update user name or role (admin only) */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const o = body as {
    email?: string;
    name?: string;
    role?: string;
    credits?: number;
    creditsDelta?: number;
    membershipId?: string;
  };
  const email = typeof o.email === 'string' ? o.email.trim() : null;
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  let creditAlreadyApplied = false;
  if (typeof o.creditsDelta === 'number' && o.creditsDelta !== 0) {
    recordCreditChange(email, o.creditsDelta, 'admin_adjustment');
    creditAlreadyApplied = true;
  } else if (typeof o.credits === 'number' && o.credits >= 0) {
    const user = getUserByEmail(email);
    if (user && user.credits !== o.credits) {
      const delta = o.credits - user.credits;
      recordCreditChange(email, delta, 'admin_adjustment');
      creditAlreadyApplied = true;
    }
  }

  const updated = updateUser(email, {
    name: typeof o.name === 'string' ? o.name : undefined,
    role: o.role === 'admin' || o.role === 'user' ? o.role : undefined,
    credits: !creditAlreadyApplied && typeof o.credits === 'number' && o.credits >= 0 ? o.credits : undefined,
    creditsDelta: !creditAlreadyApplied && typeof o.creditsDelta === 'number' ? o.creditsDelta : undefined,
    membershipId: typeof o.membershipId === 'string' ? o.membershipId : undefined,
  });
  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}
