import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getUserByEmail } from '@/lib/user-service';
import { getTransactionsByEmail } from '@/lib/credit-transactions';

/** GET: current user profile (credits, name, membership, credit history) for logged-in member. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = getUserByEmail(session.user.email);
  const transactions = getTransactionsByEmail(session.user.email, 30);
  return NextResponse.json({
    email: session.user.email,
    name: user?.name ?? session.user.name ?? null,
    credits: user?.credits ?? 0,
    membershipId: user?.membershipId ?? '',
    creditHistory: transactions,
  });
}
