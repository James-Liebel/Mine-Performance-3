import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getContent, updateContent, SITE_CONTENT_DEFAULTS } from '@/lib/site-content-store';

function isAdmin(session: unknown): boolean {
  return (session as { user?: { role?: string } } | null)?.user?.role === 'admin';
}

/** GET: site content (admin only; same shape as public GET) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const content = getContent();
  return NextResponse.json(content);
}

/** PATCH: update one content key (admin only). Body: { key: string, value: string } */
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
  const o = body as { key?: string; value?: string };
  const key = typeof o.key === 'string' ? o.key.trim() : null;
  const value = typeof o.value === 'string' ? o.value : '';
  if (!key) {
    return NextResponse.json({ error: 'key required' }, { status: 400 });
  }
  if (!Object.prototype.hasOwnProperty.call(SITE_CONTENT_DEFAULTS, key)) {
    return NextResponse.json({ error: 'Unknown content key' }, { status: 400 });
  }
  updateContent(key, value);
  const content = getContent();
  return NextResponse.json(content);
}
