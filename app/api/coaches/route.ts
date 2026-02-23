import { NextResponse } from 'next/server';
import { getCoaches } from '@/lib/coach-store';

export async function GET() {
  const coaches = getCoaches();
  return NextResponse.json(coaches);
}
