import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getCollegeCommits, addCollegeCommit, updateCollegeCommit, removeCollegeCommit } from '@/lib/results-store';

function isAdmin(session: unknown): boolean {
  return (session as { user?: { role?: string } } | null)?.user?.role === 'admin';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(getCollegeCommits());
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
  const o = body as { athleteName?: string; college?: string; division?: string; year?: string; position?: string; imageUrl?: string };
  const division = o.division === 'd2' || o.division === 'd3' || o.division === 'juco_naia' ? o.division : 'd1';
  const commit = addCollegeCommit({
    athleteName: typeof o.athleteName === 'string' ? o.athleteName : '',
    college: typeof o.college === 'string' ? o.college : '',
    division,
    year: typeof o.year === 'string' ? o.year : undefined,
    position: typeof o.position === 'string' ? o.position : undefined,
    imageUrl: typeof o.imageUrl === 'string' ? o.imageUrl : undefined,
  });
  return NextResponse.json(commit);
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
  const o = body as { id?: string; athleteName?: string; college?: string; division?: string; year?: string; position?: string; imageUrl?: string };
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const division = o.division === 'd2' || o.division === 'd3' || o.division === 'juco_naia' ? o.division : o.division === 'd1' ? 'd1' : undefined;
  const updated = updateCollegeCommit(id, {
    athleteName: o.athleteName,
    college: o.college,
    division,
    year: o.year,
    position: o.position,
    imageUrl: o.imageUrl,
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
  if (!removeCollegeCommit(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
