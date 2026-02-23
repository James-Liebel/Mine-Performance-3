import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getBookingsForMember, addBooking, updateBooking, canCancelBooking } from '@/lib/booking-store';
import { getMergedEventById, getMergedEvents } from '@/lib/events-server';

export interface MemberBookingItem {
  eventId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  type: string;
  program?: string;
  location: string;
  athleteName: string;
  bookedAt: string;
  status: 'past' | 'upcoming';
  canCancel: boolean;
}

function formatTime(s: string | undefined): string {
  if (!s) return '—';
  const [h, m] = s.split(':');
  const hour = parseInt(h, 10);
  const am = hour < 12;
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m || '00'} ${am ? 'am' : 'pm'}`;
}

function isPast(date: string, startTime: string): boolean {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (startTime || '00:00').split(':').map(Number);
  const start = new Date(y, m - 1, d, hh, mm, 0);
  return start.getTime() < Date.now();
}

/** GET: list current member's bookings with event details and canCancel. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const memberId = session.user.email;
  const bookings = getBookingsForMember(memberId);
  const result: MemberBookingItem[] = [];
  for (const b of bookings) {
    const event = getMergedEventById(b.eventId);
    if (!event) continue;
    const startTime = event.startTime ?? '00:00';
    const past = isPast(event.date, startTime);
    const cancelAllowed = canCancelBooking(event.date, startTime);
    result.push({
      eventId: event.id,
      date: event.date,
      startTime: formatTime(event.startTime),
      endTime: formatTime(event.endTime),
      title: event.title,
      type: event.type,
      program: event.program,
      location: event.location ?? '',
      athleteName: b.athleteName,
      bookedAt: b.bookedAt,
      status: past ? 'past' : 'upcoming',
      canCancel: !past && cancelAllowed,
    });
  }
  // Sort by date then start time (upcoming first in calendar order)
  result.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
  return NextResponse.json(result);
}

/** POST: book an event (add booking for current member). */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const o = body as { eventId?: string; athleteName?: string };
  const eventId = typeof o.eventId === 'string' ? o.eventId : null;
  if (!eventId) {
    return NextResponse.json({ error: 'eventId required' }, { status: 400 });
  }
  const events = getMergedEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  const athleteName = typeof o.athleteName === 'string' && o.athleteName.trim()
    ? o.athleteName.trim()
    : (session.user.name as string) || 'My Athlete';
  const memberId = session.user.email;
  const result = addBooking(memberId, eventId, athleteName);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'Failed to book' }, { status: 400 });
  }
  return NextResponse.json({ booked: true });
}

/** PATCH: update a booking (e.g. athlete name) for an upcoming event. */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const o = body as { eventId?: string; athleteName?: string };
  const eventId = typeof o.eventId === 'string' ? o.eventId : null;
  if (!eventId) {
    return NextResponse.json({ error: 'eventId required' }, { status: 400 });
  }
  const memberId = session.user.email;
  const updated = updateBooking(memberId, eventId, {
    athleteName: typeof o.athleteName === 'string' ? o.athleteName : undefined,
  });
  if (!updated) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}
