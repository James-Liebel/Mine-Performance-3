'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { canBookEvent } from '@/lib/subscription';
import { getSlotDisplayName, formatTime12h } from '@/lib/slot-display';
import type { EventItem } from '@/lib/events-server';
import { EventCalendar, type CalendarEvent } from '@/components/EventCalendar';
import { EventBookingModal } from '@/components/EventBookingModal';

export type { EventItem };

function isHittingEvent(e: EventItem): boolean {
  const p = (e.program ?? '').toLowerCase();
  return p.includes('hitting') || p.includes('cage');
}

function isPitchingEvent(e: EventItem): boolean {
  const p = (e.program ?? '').toLowerCase();
  return p.includes('pitching') || p.includes('pitch') || p.includes('velo') || p.includes('rehab');
}

function isCatchingEvent(e: EventItem): boolean {
  const p = (e.program ?? '').toLowerCase();
  return p.includes('catching') || p.includes('catcher');
}

function isStrengthEvent(e: EventItem): boolean {
  const p = (e.program ?? '').toLowerCase();
  return p.includes('strength') || p.includes('conditioning') || p.includes('s&c');
}

export type EventTypeFilter = '' | 'available' | 'hitting' | 'pitching' | 'catching' | 'strength';

export function EventsClient({ events }: { events: EventItem[] }) {
  const { tier } = useSubscription();
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showOnlyMyEvents, setShowOnlyMyEvents] = useState(false);
  const [myBookedEventIds, setMyBookedEventIds] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/member/bookings')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const ids = Array.isArray(data) ? data.map((b: { eventId: string }) => b.eventId) : [];
        setMyBookedEventIds(ids);
      })
      .catch(() => setMyBookedEventIds([]))
      .finally(() => setBookingsLoading(false));
  }, []);

  const viewList = useMemo(() => {
    if (showOnlyMyEvents) return events.filter((e) => myBookedEventIds.includes(e.id));
    return events;
  }, [events, showOnlyMyEvents, myBookedEventIds]);

  const filtered = useMemo(() => {
    if (!eventTypeFilter) return viewList;
    if (eventTypeFilter === 'available') return viewList.filter((e) => canBookEvent(tier, e.subscriptionTier));
    if (eventTypeFilter === 'hitting') return viewList.filter(isHittingEvent);
    if (eventTypeFilter === 'pitching') return viewList.filter(isPitchingEvent);
    if (eventTypeFilter === 'catching') return viewList.filter(isCatchingEvent);
    if (eventTypeFilter === 'strength') return viewList.filter(isStrengthEvent);
    return viewList;
  }, [viewList, eventTypeFilter, tier]);

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      filtered.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        type: e.type,
        program: e.program,
        location: e.location ?? '',
        capacity: e.capacity,
        bookedCount: e.bookedCount,
        subscriptionTier: e.subscriptionTier,
      })),
    [filtered]
  );

  const eventsOnSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return filtered
      .filter((e) => e.date === selectedDay)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [filtered, selectedDay]);

  const selectedDayLabel = useMemo(() => {
    if (!selectedDay) return '';
    const [y, m, d] = selectedDay.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDay]);

  const allPrograms = useMemo(
    () => Array.from(new Set(events.map((e) => e.program).filter(Boolean))) as string[],
    [events]
  );

  const [bookFeedback, setBookFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleBook = useCallback(async (eventId: string) => {
    setBookFeedback(null);
    try {
      const res = await fetch('/api/member/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      if (res.status === 401) {
        window.location.href = `/contact?book=${eventId}`;
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBookFeedback({ type: 'error', msg: data.error || 'Booking failed' });
        return;
      }
      setBookFeedback({ type: 'success', msg: 'Booked! View your training slots in Profile → Calendar.' });
      setSelectedEvent(null);
      fetch('/api/member/bookings')
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          const ids = Array.isArray(data) ? data.map((b: { eventId: string }) => b.eventId) : [];
          setMyBookedEventIds(ids);
        })
        .catch(() => {});
    } catch {
      setBookFeedback({ type: 'error', msg: 'Booking failed' });
    }
  }, []);

  return (
    <>
      <section style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Show:</span>
          <label className="scheduling-toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="scheduling-view"
              checked={showOnlyMyEvents}
              onChange={() => setShowOnlyMyEvents(true)}
              disabled={bookingsLoading}
            />
            <span>My slots only</span>
          </label>
          <label className="scheduling-toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="scheduling-view"
              checked={!showOnlyMyEvents}
              onChange={() => setShowOnlyMyEvents(false)}
            />
            <span>All slots</span>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filter by type:</span>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as EventTypeFilter)}
            style={{
              padding: '0.5rem 0.75rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              minWidth: '160px',
            }}
            aria-label="Filter training slots by type"
          >
            <option value="">All slots</option>
            <option value="available">Available to me</option>
            <option value="hitting">Hitting only</option>
            <option value="pitching">Pitching only</option>
            <option value="catching">Catching only</option>
            <option value="strength">Lifting only</option>
          </select>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Green outline = open slot · Red outline = full (each slot is ~1 hr)
        </div>
      </section>

      {bookFeedback && (
        <div
          role="alert"
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            background: bookFeedback.type === 'success' ? 'var(--success-bg, #d4edda)' : 'var(--error-bg, #f8d7da)',
            color: bookFeedback.type === 'success' ? 'var(--success-text, #155724)' : 'var(--error-text, #721c24)',
          }}
        >
          {bookFeedback.msg}
          {bookFeedback.type === 'success' && (
            <Link href="/profile/calendar" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>Go to Calendar</Link>
          )}
        </div>
      )}

      <section className="event-calendar-section" style={{ marginBottom: '2rem' }}>
        {showOnlyMyEvents && !bookingsLoading && myBookedEventIds.length === 0 && (
          <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            You’re not signed up for any training slots yet. Click a day on the calendar to see slots and book.
          </p>
        )}
        <EventCalendar
          events={calendarEvents}
          onSelectEvent={(e) => setSelectedEvent(events.find((ev) => ev.id === e.id) || null)}
          onSelectDay={(dateKey) => setSelectedDay(dateKey)}
          bookedEventIds={myBookedEventIds}
        />
        {!selectedDay ? (
          <p className="text-muted" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            Select a day on the calendar to see training slots on that day and view details or book.
          </p>
        ) : (
          <div className="scheduling-day-panel card card-elevated" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Training slots on {selectedDayLabel}</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedDay(null)}>
                Close
              </button>
            </div>
            {eventsOnSelectedDay.length === 0 ? (
              <p className="text-muted" style={{ margin: 0 }}>No training slots on this day with the current filter. Try another day or change the filter.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {eventsOnSelectedDay.map((e) => {
                  const userCanBook = canBookEvent(tier, e.subscriptionTier);
                  const isFull = e.bookedCount >= e.capacity;
                  const isBooked = myBookedEventIds.includes(e.id);
                  return (
                    <li
                      key={e.id}
                      style={{
                        padding: '0.75rem 0',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block' }}>{getSlotDisplayName(e.program, e.date)}</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          {formatTime12h(e.startTime)} · {e.bookedCount}/{e.capacity} full
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setSelectedEvent(e)}>
                          View details
                        </button>
                        {isBooked && <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>You’re signed up</span>}
                        {!isBooked && userCanBook && !isFull && (
                          <button type="button" className="btn btn-primary" onClick={() => handleBook(e.id)}>
                            Book
                          </button>
                        )}
                        {!isBooked && !userCanBook && (
                          <Link href="/contact" className="btn btn-primary">Upgrade to book</Link>
                        )}
                        {!isBooked && userCanBook && isFull && (
                          <Link href="/contact" className="btn btn-secondary">Waitlist</Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </section>

      <EventBookingModal
        event={selectedEvent ? { ...selectedEvent, location: selectedEvent.location ?? '' } : null}
        userTier={tier}
        allPrograms={allPrograms}
        onClose={() => setSelectedEvent(null)}
        onBook={handleBook}
      />
    </>
  );
}
