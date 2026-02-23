import { NextRequest, NextResponse } from 'next/server';
import {
  addEvent,
  addRecurring,
  getAllEvents,
  getEventById,
  deleteEvent,
  updateEvent,
  type RecurringSpec,
  type StoredEvent,
} from '@/lib/event-store';
import { requireAdmin } from '@/lib/auth';
import {
  eventPostSchema,
  recurringPostSchema,
  eventPatchSchema,
} from '@/lib/api-schemas';
import { rateLimitMutation, getClientIdentifier } from '@/lib/rate-limit';

/** GET: list only admin-created (managed) events for the admin UI */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
  }
  const events = getAllEvents();
  return NextResponse.json(events);
}

/** DELETE: remove one event by id (only events created via admin can be deleted) */
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
  }
  const id = req.nextUrl.searchParams.get('id');
  if (!id || id.length > 50) {
    return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 });
  }
  const limiter = rateLimitMutation(getClientIdentifier(req));
  if (!limiter.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const ok = deleteEvent(id);
  if (!ok) {
    return NextResponse.json({ error: 'Event not found or cannot be deleted' }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}

/** PATCH: update one event by id */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
  }
  const limiter = rateLimitMutation(getClientIdentifier(req));
  if (!limiter.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = eventPatchSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => e.message).join('; ');
    return NextResponse.json({ error: `Validation failed: ${msg}` }, { status: 400 });
  }
  const { id, ...patch } = parsed.data;
  const existing = getEventById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  const updatePayload: Partial<StoredEvent> = {};
  if (patch.title !== undefined) updatePayload.title = patch.title;
  if (patch.date !== undefined) updatePayload.date = patch.date;
  if (patch.startTime !== undefined) updatePayload.startTime = patch.startTime;
  if (patch.endTime !== undefined) updatePayload.endTime = patch.endTime;
  if (patch.type !== undefined) updatePayload.type = patch.type;
  if (patch.program !== undefined) updatePayload.program = patch.program;
  if (patch.location !== undefined) updatePayload.location = patch.location;
  if (patch.capacity !== undefined) updatePayload.capacity = patch.capacity;
  if (patch.featured !== undefined) updatePayload.featured = patch.featured;
  if (patch.subscriptionTier !== undefined) updatePayload.subscriptionTier = patch.subscriptionTier;
  const updated = updateEvent(id, updatePayload);
  return NextResponse.json(updated);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
  }
  const limiter = rateLimitMutation(getClientIdentifier(req));
  if (!limiter.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const isRecurring =
    body &&
    typeof body === 'object' &&
    'repeat' in body &&
    (body as { repeat?: string }).repeat &&
    (body as { repeat?: string }).repeat !== 'none';

  if (isRecurring) {
    const parsed = recurringPostSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join('; ');
      return NextResponse.json({ error: `Validation failed: ${msg}` }, { status: 400 });
    }
    const spec: RecurringSpec = {
      title: parsed.data.title,
      program: parsed.data.program,
      type: parsed.data.type,
      location: parsed.data.location,
      subscriptionTier: parsed.data.subscriptionTier,
      capacity: parsed.data.capacity,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      repeat: parsed.data.repeat,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      daysOfWeek: parsed.data.daysOfWeek,
    };
    const created = addRecurring(spec);
    return NextResponse.json({ created: created.length, events: created });
  }

  const parsed = eventPostSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => e.message).join('; ');
    return NextResponse.json({ error: `Validation failed: ${msg}` }, { status: 400 });
  }
  const event = addEvent({
    title: parsed.data.title,
    date: parsed.data.date,
    startTime: parsed.data.startTime,
    endTime: parsed.data.endTime,
    type: parsed.data.type,
    program: parsed.data.program,
    location: parsed.data.location,
    subscriptionTier: parsed.data.subscriptionTier,
    capacity: parsed.data.capacity,
    featured: parsed.data.featured,
  });
  return NextResponse.json({ created: 1, events: [event] });
}
