import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import {
  getWaivers,
  addWaiver,
  updateWaiver,
  deleteWaiver,
  type Waiver,
} from '@/lib/waiver-store';

function isAdmin(session: unknown): boolean {
  return (session as { user?: { role?: string } } | null)?.user?.role === 'admin';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const waivers = getWaivers();
  return NextResponse.json(waivers);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const title = body?.title?.trim();
  const bodyText = body?.body?.trim();
  if (!title) {
    return NextResponse.json({ error: 'title required' }, { status: 400 });
  }
  const waiver = addWaiver({ title, body: bodyText ?? '' });
  return NextResponse.json(waiver);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const id = body?.id;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const updates: Partial<Pick<Waiver, 'title' | 'body'>> = {};
  if (typeof body.title === 'string') updates.title = body.title.trim();
  if (typeof body.body === 'string') updates.body = body.body.trim();
  const updated = updateWaiver(id, updates);
  if (!updated) return NextResponse.json({ error: 'Waiver not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const ok = deleteWaiver(id);
  if (!ok) return NextResponse.json({ error: 'Waiver not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
