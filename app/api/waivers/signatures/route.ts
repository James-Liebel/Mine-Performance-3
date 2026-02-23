import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getSignaturesForMember, setSignature, getWaiverById } from '@/lib/waiver-store';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const memberId = session.user.email;
  const signatures = getSignaturesForMember(memberId);
  return NextResponse.json(signatures);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const waiverId = body?.waiverId;
  if (!waiverId || typeof waiverId !== 'string') {
    return NextResponse.json({ error: 'waiverId required' }, { status: 400 });
  }
  const waiver = getWaiverById(waiverId);
  if (!waiver) {
    return NextResponse.json({ error: 'Waiver not found' }, { status: 404 });
  }
  const memberId = session.user.email;
  const signedAt = new Date().toISOString();
  setSignature(memberId, waiverId, signedAt);
  return NextResponse.json({ signedAt });
}
