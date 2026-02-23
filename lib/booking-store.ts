/**
 * Store for member event bookings.
 * Persisted to data/persisted/bookings.json when the filesystem is writable.
 */

import { getEventById, updateEvent } from './event-store';
import { loadJSON, saveJSON } from './persist';

export interface Booking {
  memberId: string;
  eventId: string;
  athleteName: string;
  bookedAt: string; // ISO
}

const loaded = loadJSON<Booking[]>('bookings.json');
let bookings: Booking[] = loaded ?? [];

function persist(): void {
  saveJSON('bookings.json', bookings);
}

export function getBookingsForMember(memberId: string): Booking[] {
  return bookings.filter((b) => b.memberId === memberId);
}

export function getBooking(memberId: string, eventId: string): Booking | null {
  return bookings.find((b) => b.memberId === memberId && b.eventId === eventId) ?? null;
}

export function addBooking(
  memberId: string,
  eventId: string,
  athleteName: string = 'My Athlete'
): { ok: boolean; error?: string } {
  const existing = getBooking(memberId, eventId);
  if (existing) {
    return { ok: false, error: 'Already booked for this event' };
  }
  const event = getEventById(eventId);
  if (event) {
    if (event.bookedCount >= event.capacity) {
      return { ok: false, error: 'Event is full' };
    }
    updateEvent(eventId, { bookedCount: event.bookedCount + 1 });
  }
  bookings.push({
    memberId,
    eventId,
    athleteName,
    bookedAt: new Date().toISOString(),
  });
  persist();
  return { ok: true };
}

/** Returns true if event start is at least 24 hours from now. */
export function canCancelBooking(eventDate: string, eventStartTime: string): boolean {
  const [y, m, d] = eventDate.split('-').map(Number);
  const [hh, mm] = (eventStartTime || '00:00').split(':').map(Number);
  const eventStart = new Date(y, m - 1, d, hh, mm, 0);
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() + 24);
  return eventStart.getTime() >= cutoff.getTime();
}

export function updateBooking(
  memberId: string,
  eventId: string,
  patch: { athleteName?: string }
): Booking | null {
  const b = bookings.find((x) => x.memberId === memberId && x.eventId === eventId);
  if (!b) return null;
  if (typeof patch.athleteName === 'string' && patch.athleteName.trim()) {
    b.athleteName = patch.athleteName.trim();
    persist();
  }
  return b;
}

export function cancelBooking(memberId: string, eventId: string): { ok: boolean; error?: string } {
  const idx = bookings.findIndex((b) => b.memberId === memberId && b.eventId === eventId);
  if (idx === -1) {
    return { ok: false, error: 'Booking not found' };
  }
  const event = getEventById(eventId);
  if (event && event.bookedCount > 0) {
    updateEvent(eventId, { bookedCount: event.bookedCount - 1 });
  }
  bookings.splice(idx, 1);
  persist();
  return { ok: true };
}

export function getAllBookings(): Booking[] {
  return [...bookings];
}
