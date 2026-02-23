import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getEndorsements, addEndorsement, updateEndorsement, removeEndorsement } from '@/lib/results-store';

function isAdmin(session: unknown): boolean {
  return (session as { user?: { role?: string } } | null)?.user?.role === 'admin';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(getEndorsements());
}

export async function POST(req: NextRequest) {
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
  const o = body as { quote?: string; athleteName?: string; college?: string };
  const e = addEndorsement({
    quote: typeof o.quote === 'string' ? o.quote : '',
    athleteName: typeof o.athleteName === 'string' ? o.athleteName : '',
    college: typeof o.college === 'string' ? o.college : undefined,
  });
  return NextResponse.json(e);
}

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
  const o = body as { id?: string; quote?: string; athleteName?: string; college?: string };
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const updated = updateEndorsement(id, {
    quote: o.quote,
    athleteName: o.athleteName,
    college: o.college,
  });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  if (!removeEndorsement(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
