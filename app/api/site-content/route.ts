import { NextResponse } from 'next/server';
import { getContent } from '@/lib/site-content-store';

/** GET: public site content (key-value map for hero, features, about, CTA, etc.) */
export async function GET() {
  const content = getContent();
  return NextResponse.json(content);
}
