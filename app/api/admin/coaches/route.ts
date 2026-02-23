import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getCoaches, getCoachById, addCoach, updateCoach, removeCoach } from '@/lib/coach-store';

function isAdmin(session: unknown): boolean {
  return (session as { user?: { role?: string } } | null)?.user?.role === 'admin';
}

/** GET: list coaches (admin) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const coaches = getCoaches();
  return NextResponse.json(coaches);
}

/** POST: add coach. Body: { name, specialty?, title?, bio?, image? } */
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
  const o = body as { name?: string; specialty?: string; title?: string; bio?: string; image?: string | null };
  const name = typeof o.name === 'string' ? o.name.trim() : 'New Coach';
  const coach = addCoach({
    name,
    specialty: typeof o.specialty === 'string' ? o.specialty : '',
    title: typeof o.title === 'string' ? o.title : '',
    bio: typeof o.bio === 'string' ? o.bio : '',
    image: typeof o.image === 'string' ? o.image : null,
  });
  return NextResponse.json(coach);
}

/** PATCH: update coach. Body: { id, name?, specialty?, title?, bio?, image? } */
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
  const o = body as { id?: string; name?: string; specialty?: string; title?: string; bio?: string; image?: string | null };
  const id = typeof o.id === 'string' ? o.id.trim() : null;
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const updated = updateCoach(id, {
    name: typeof o.name === 'string' ? o.name : undefined,
    specialty: typeof o.specialty === 'string' ? o.specialty : undefined,
    title: typeof o.title === 'string' ? o.title : undefined,
    bio: typeof o.bio === 'string' ? o.bio : undefined,
    image: o.image !== undefined ? (typeof o.image === 'string' ? o.image : null) : undefined,
  });
  if (!updated) {
    return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

/** DELETE: remove coach. Query: id=... */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const removed = removeCoach(id);
  if (!removed) {
    return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
