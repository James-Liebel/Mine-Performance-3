'use client';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AdminCalendar, type AdminCalendarEvent } from '@/components/AdminCalendar';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

type RepeatKind = 'none' | 'daily' | 'weekly';

interface ManagedEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  program: string;
  location: string;
  capacity: number;
  subscriptionTier: string;
  featured: boolean;
  bookedCount: number;
}

const DAYS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

function formatEventDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<AdminCalendarEvent[]>([]);
  const [managedEvents, setManagedEvents] = useState<ManagedEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<ManagedEvent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [title, setTitle] = useState('');
  const [program, setProgram] = useState('General');
  const [type, setType] = useState('clinic');
  const [location, setLocation] = useState('Main facility');
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'premium' | 'all'>('basic');
  const [capacity, setCapacity] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [repeat, setRepeat] = useState<RepeatKind>('none');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);

  const refetch = useCallback(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => setCalendarEvents(Array.isArray(data) ? data : []))
      .catch(() => setCalendarEvents([]));
    fetch('/api/admin/events')
      .then((r) => r.json())
      .then((data) => setManagedEvents(Array.isArray(data) ? data : []))
      .catch(() => setManagedEvents([]));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  function handleCalendarSelectDate(dateKey: string) {
    setStartDate(dateKey);
    if (repeat === 'none') setEndDate(dateKey);
    setMessage(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  if (status === 'unauthenticated') {
    return null; // Middleware redirects to /admin/login
  }
  if (status === 'loading') {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <p>Loading…</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const end = repeat === 'none' ? startDate : endDate;
      const body =
        repeat === 'none'
          ? {
              title,
              program,
              type,
              location,
              subscriptionTier,
              capacity,
              date: startDate,
              startTime,
              endTime,
              featured: false,
            }
          : {
              title,
              program,
              type,
              location,
              subscriptionTier,
              capacity,
              startTime,
              endTime,
              repeat,
              startDate,
              endDate,
              daysOfWeek: repeat === 'weekly' ? daysOfWeek : undefined,
            };
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: 'err', text: data.error || res.statusText || 'Failed to create events' });
        return;
      }
      const count = data.created ?? 0;
      setMessage({ type: 'ok', text: `Created ${count} event(s). They will appear on the Events page.` });
      if (repeat === 'none') {
        setTitle('');
        setStartDate('');
        setEndDate('');
      }
      refetch();
    } finally {
      setSaving(false);
    }
  }

  function requestDelete(id: string) {
    setDeleteConfirmId(id);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteConfirmId(null);
    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: 'err', text: data.error || 'Could not delete event' });
        return;
      }
      setMessage({ type: 'ok', text: 'Event removed.' });
      refetch();
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(event: ManagedEvent) {
    setEditingEvent({ ...event });
    setMessage(null);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEvent) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          title: editingEvent.title,
          date: editingEvent.date,
          startTime: editingEvent.startTime,
          endTime: editingEvent.endTime,
          type: editingEvent.type,
          program: editingEvent.program,
          location: editingEvent.location,
          capacity: editingEvent.capacity,
          subscriptionTier: editingEvent.subscriptionTier,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: 'err', text: data.error || 'Could not update event' });
        return;
      }
      setMessage({ type: 'ok', text: 'Event updated.' });
      setEditingEvent(null);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  function toggleDay(d: number) {
    setDaysOfWeek((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)
    );
  }

  return (
    <div className="container admin-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Admin — Add events</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {session?.user ? (
            <>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>{session.user.email}</span>
              <button type="button" className="btn btn-secondary" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign out
              </button>
            </>
          ) : (
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Demo — no login required</span>
          )}
          <Link href="/events" className="btn btn-secondary">
            View events
          </Link>
        </div>
      </div>

      <p className="text-muted admin-page-desc" style={{ marginBottom: '1.5rem' }}>
        <strong>Click any event row below to edit</strong> its date, time, title, or capacity. Add new events with the form at the bottom. Delete from the row.
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <AdminCalendar
          events={calendarEvents}
          onSelectDate={handleCalendarSelectDate}
        />
      </section>

      {managedEvents.length > 0 && (
        <section className="admin-events-managed" style={{ marginBottom: '2rem' }}>
          <h2 className="admin-form-title">Your events — click a row to edit</h2>
          <p className="text-muted admin-editable-hint" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            Click anywhere on a row to change date, time, title, or capacity. Use Delete to remove an event.
          </p>
          <div className="admin-events-table-wrap">
            <table className="admin-pricing-table admin-events-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...managedEvents]
                  .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                  .map((ev) => (
                    <tr
                      key={ev.id}
                      className="admin-clickable-row"
                      onClick={() => startEdit(ev)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && startEdit(ev)}
                      aria-label={`Edit event ${ev.title}`}
                    >
                      <td>{formatEventDate(ev.date)}</td>
                      <td><strong>{ev.title}</strong></td>
                      <td>{ev.startTime} – {ev.endTime}</td>
                      <td>{ev.type}</td>
                      <td>{ev.bookedCount}/{ev.capacity}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="admin-events-actions">
                          <button
                            type="button"
                            className="btn btn-secondary admin-events-btn"
                            onClick={() => startEdit(ev)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary admin-events-btn admin-events-btn-danger"
                            onClick={() => requestDelete(ev.id)}
                            disabled={deletingId === ev.id}
                          >
                            {deletingId === ev.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdminConfirmModal
        open={deleteConfirmId !== null}
        title="Remove this event?"
        message="This event will be removed from the calendar. Members will no longer see it. You can add it again later if needed."
        confirmLabel="Yes, remove"
        cancelLabel="Keep"
        danger
        loading={deletingId !== null}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <form ref={formRef} onSubmit={handleSubmit} className="card card-elevated admin-form">
        <h2 className="admin-form-title">New event</h2>

        <div className="form-group">
          <label className="form-label" htmlFor="event-title">Title</label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Open Cage Session"
            className="form-input"
          />
        </div>

        <div className="form-row form-row--2">
          <div className="form-group">
            <label className="form-label" htmlFor="event-program">Program</label>
            <input
              id="event-program"
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="event-type">Type</label>
            <select
              id="event-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-input"
            >
              <option value="assessment">Assessment</option>
              <option value="clinic">Clinic</option>
              <option value="camp">Camp</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="event-location">Location</label>
          <input
            id="event-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-row form-row--2">
          <div className="form-group">
            <label className="form-label" htmlFor="event-start-date">Start date</label>
            <input
              id="event-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="event-end-date">
              End date {repeat !== 'none' && '(for repeat)'}
            </label>
            <input
              id="event-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required={repeat !== 'none'}
              disabled={repeat === 'none'}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row form-row--2">
          <div className="form-group">
            <label className="form-label" htmlFor="event-start-time">Start time</label>
            <input
              id="event-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="event-end-time">End time</label>
            <input
              id="event-end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row form-row--2">
          <div className="form-group">
            <label className="form-label" htmlFor="event-capacity">Capacity</label>
            <input
              id="event-capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value) || 10)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="event-tier">Tier required</label>
            <select
              id="event-tier"
              value={subscriptionTier}
              onChange={(e) => setSubscriptionTier(e.target.value as 'basic' | 'premium' | 'all')}
              className="form-input"
            >
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <span className="form-label">Repeat</span>
          <div className="form-radio-group">
            <label className="form-radio-label">
              <input
                type="radio"
                name="repeat"
                checked={repeat === 'none'}
                onChange={() => setRepeat('none')}
              />
              One-time
            </label>
            <label className="form-radio-label">
              <input type="radio" name="repeat" checked={repeat === 'daily'} onChange={() => setRepeat('daily')} />
              Daily
            </label>
            <label className="form-radio-label">
              <input type="radio" name="repeat" checked={repeat === 'weekly'} onChange={() => setRepeat('weekly')} />
              Weekly (select days)
            </label>
          </div>
          {repeat === 'weekly' && (
            <div className="form-checkbox-group">
              {DAYS.map((d) => (
                <label key={d.value} className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={daysOfWeek.includes(d.value)}
                    onChange={() => toggleDay(d.value)}
                  />
                  {d.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {message && (
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.9rem',
              color: message.type === 'ok' ? 'var(--accent)' : 'var(--error, #ef4444)',
            }}
          >
            {message.text}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Creating…' : repeat === 'none' ? 'Add event' : 'Create recurring events'}
        </button>
      </form>

      <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        <Link href="/">Back to site</Link>
      </p>

      {editingEvent && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-event-title"
          onClick={(e) => e.target === e.currentTarget && setEditingEvent(null)}
        >
          <div className="modal card admin-form" style={{ maxWidth: '520px' }}>
            <header className="modal-header">
              <h2 id="edit-event-title">Edit event</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Close"
                onClick={() => setEditingEvent(null)}
              >
                ✕
              </button>
            </header>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent((p) => p ? { ...p, title: e.target.value } : null)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-program">Program</label>
                  <input
                    id="edit-program"
                    type="text"
                    value={editingEvent.program}
                    onChange={(e) => setEditingEvent((p) => p ? { ...p, program: e.target.value } : null)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-type">Type</label>
                  <select
                    id="edit-type"
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent((p) => p ? { ...p, type: e.target.value } : null)}
                    className="form-input"
                  >
                    <option value="assessment">Assessment</option>
                    <option value="clinic">Clinic</option>
                    <option value="camp">Camp</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-location">Location</label>
                <input
                  id="edit-location"
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent((p) => p ? { ...p, location: e.target.value } : null)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-date">Date</label>
                <input
                  id="edit-date"
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent((p) => p ? { ...p, date: e.target.value } : null)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-start-time">Start time</label>
                  <input
                    id="edit-start-time"
                    type="time"
                    value={editingEvent.startTime}
                    onChange={(e) => setEditingEvent((p) => p ? { ...p, startTime: e.target.value } : null)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-end-time">End time</label>
                  <input
                    id="edit-end-time"
                    type="time"
                    value={editingEvent.endTime}
                    onChange={(e) => setEditingEvent((p) => p ? { ...p, endTime: e.target.value } : null)}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-capacity">Capacity</label>
                  <input
                    id="edit-capacity"
                    type="number"
                    min={1}
                    value={editingEvent.capacity}
                    onChange={(e) => setEditingEvent((p) => p ? { ...p, capacity: Number(e.target.value) || 1 } : null)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-tier">Tier required</label>
                  <select
                    id="edit-tier"
                    value={editingEvent.subscriptionTier}
                    onChange={(e) => setEditingEvent((p) => p ? { ...p, subscriptionTier: e.target.value } : null)}
                    className="form-input"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>
              <footer className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingEvent(null)}>
                  Cancel
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
