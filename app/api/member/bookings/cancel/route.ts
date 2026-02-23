import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getBooking, cancelBooking, canCancelBooking } from '@/lib/booking-store';
import { getMergedEventById } from '@/lib/events-server';

/** POST: cancel a booking. Allowed only if event is at least 24 hours away. */
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
  const eventId = typeof (body as { eventId?: string }).eventId === 'string'
    ? (body as { eventId: string }).eventId
    : null;
  if (!eventId) {
    return NextResponse.json({ error: 'eventId required' }, { status: 400 });
  }
  const memberId = session.user.email;
  const booking = getBooking(memberId, eventId);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  const event = getMergedEventById(eventId);
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  const startTime = event.startTime ?? '00:00';
  if (!canCancelBooking(event.date, startTime)) {
    return NextResponse.json(
      { error: 'Cancellation is only allowed at least 24 hours before the event.' },
      { status: 400 }
    );
  }
  const result = cancelBooking(memberId, eventId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'Failed to cancel' }, { status: 400 });
  }
  return NextResponse.json({ cancelled: true });
}
