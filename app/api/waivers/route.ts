import { NextResponse } from 'next/server';
import { getWaivers } from '@/lib/waiver-store';

export async function GET() {
  const waivers = getWaivers();
  return NextResponse.json(waivers);
}
