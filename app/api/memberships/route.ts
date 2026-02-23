import { NextResponse } from 'next/server';
import { getStoredMemberships } from '@/lib/membership-store';

/** GET: current memberships (for public member-registration / training options) */
export async function GET() {
  const memberships = getStoredMemberships();
  return NextResponse.json(memberships);
}
