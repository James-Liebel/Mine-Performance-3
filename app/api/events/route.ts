import { NextResponse } from 'next/server';
import { getMergedEvents } from '@/lib/events-server';

export async function GET() {
  const events = getMergedEvents();
  return NextResponse.json(events);
}
