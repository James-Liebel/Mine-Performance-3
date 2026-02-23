'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface MemberBookingItem {
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ProfileCalendarPage() {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [events, setEvents] = useState<MemberBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/member/bookings');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to load events');
      }
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = MONTHS[month];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setViewDate(new Date(year, month - 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1));

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  const hasEvent = (day: number) =>
    events.some((e) => {
      const [y, m, d] = e.date.split('-').map(Number);
      return y === year && m === month + 1 && d === day;
    });

  const startEdit = (ev: MemberBookingItem) => {
    setEditingId(ev.eventId);
    setEditName(ev.athleteName);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };
  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    setMessage(null);
    try {
      const res = await fetch('/api/member/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: editingId, athleteName: editName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update');
      }
      setMessage({ type: 'success', text: 'Updated successfully.' });
      cancelEdit();
      await fetchBookings();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed to update' });
    }
  };

  const confirmCancel = (ev: MemberBookingItem) => {
    if (!ev.canCancel) return;
    setCancellingId(ev.eventId);
  };
  const doCancel = async () => {
    if (!cancellingId) return;
    setMessage(null);
    try {
      const res = await fetch('/api/member/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: cancellingId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel');
      }
      setMessage({ type: 'success', text: 'Event cancelled.' });
      setCancellingId(null);
      await fetchBookings();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed to cancel' });
    }
  };

  return (
    <div className="container profile-calendar-page" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="profile-calendar-layout">
        <section className="profile-calendar-section card card-elevated">
          <div className="profile-calendar-header">
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{monthName} {year}</h2>
            <div className="profile-calendar-nav">
              <button type="button" onClick={prevMonth} className="profile-calendar-nav-btn" aria-label="Previous month">
                ‹
              </button>
              <button type="button" onClick={nextMonth} className="profile-calendar-nav-btn" aria-label="Next month">
                ›
              </button>
            </div>
          </div>
          <div className="profile-calendar-grid">
            {DAYS.map((d) => (
              <div key={d} className="profile-calendar-dow" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {d}
              </div>
            ))}
            {blanks.map((_, i) => (
              <div key={`b-${i}`} className="profile-calendar-day profile-calendar-day--blank" />
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={`profile-calendar-day ${isToday(day) ? 'profile-calendar-day--today' : ''} ${hasEvent(day) ? 'profile-calendar-day--has-event' : ''}`}
              >
                {day}
              </div>
            ))}
          </div>
          <Link href="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Camps & clinics
          </Link>
        </section>

        <section className="profile-events-section card card-elevated">
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>My events</h2>
          {message && (
            <p
              role="alert"
              style={{
                marginBottom: '1rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                background: message.type === 'success' ? 'var(--success-bg, #d4edda)' : 'var(--error-bg, #f8d7da)',
                color: message.type === 'success' ? 'var(--success-text, #155724)' : 'var(--error-text, #721c24)',
              }}
            >
              {message.text}
            </p>
          )}
          {loading && <p className="text-muted">Loading events…</p>}
          {error && <p className="text-muted" style={{ color: 'var(--error, #c00)' }}>{error}</p>}
          {!loading && !error && events.length === 0 && (
            <p className="text-muted">You have no booked events. <Link href="/events">Browse camps & clinics</Link> to book.</p>
          )}
          {!loading && !error && events.length > 0 && (
            <>
              <div className="profile-events-table-wrap">
                <table className="profile-events-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Athlete / Team</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.eventId}>
                        <td>
                          <span className="profile-event-dot" aria-hidden />
                          {formatDateShort(ev.date)}
                        </td>
                        <td>{ev.startTime}</td>
                        <td>{ev.endTime}</td>
                        <td>
                          {editingId === ev.eventId ? (
                            <span style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="input"
                                style={{ width: '10rem', padding: '0.25rem 0.5rem' }}
                                aria-label="Athlete name"
                              />
                              <button type="button" className="btn btn-primary" onClick={saveEdit} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>Save</button>
                              <button type="button" className="btn" onClick={cancelEdit} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>Cancel</button>
                            </span>
                          ) : (
                            ev.athleteName
                          )}
                        </td>
                        <td>{ev.title}</td>
                        <td>
                          <span style={{ textTransform: 'capitalize' }}>{ev.status}</span>
                          {ev.status === 'upcoming' && !ev.canCancel && (
                            <span className="text-muted" style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                              Cancel not allowed within 24 hours
                            </span>
                          )}
                        </td>
                        <td>
                          {ev.status === 'past' && '—'}
                          {ev.status === 'upcoming' && (
                            <span style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {editingId !== ev.eventId && (
                                <button type="button" className="btn" onClick={() => startEdit(ev)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                                  Edit
                                </button>
                              )}
                              {ev.canCancel ? (
                                <button type="button" className="btn" onClick={() => confirmCancel(ev)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                                  Cancel event
                                </button>
                              ) : (
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Can only cancel 24+ hrs before</span>
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {events.length > 0 && (
                <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                  You can edit athlete name or cancel an upcoming event. Cancellation is only allowed at least 24 hours before the event start.
                </p>
              )}
            </>
          )}

          {cancellingId && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-dialog-title"
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={() => setCancellingId(null)}
            >
              <div
                className="card card-elevated"
                style={{ padding: '1.5rem', maxWidth: '22rem', margin: '1rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 id="cancel-dialog-title" style={{ margin: '0 0 0.75rem' }}>Cancel event?</h3>
                <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  This will remove your booking. You can rebook from Camps & clinics if needed.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn" onClick={() => setCancellingId(null)}>Keep booking</button>
                  <button type="button" className="btn btn-primary" onClick={doCancel}>Yes, cancel my booking</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
