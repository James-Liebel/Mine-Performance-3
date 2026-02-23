'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { canBookEvent, tierLabel, type SubscriptionTier } from '@/lib/subscription';
import { getSlotDisplayName, formatTime12h } from '@/lib/slot-display';

export interface EventForBooking {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: string;
  program?: string;
  location: string;
  capacity: number;
  bookedCount: number;
  subscriptionTier: string;
}

type EventBookingModalProps = {
  event: EventForBooking | null;
  userTier: SubscriptionTier;
  allPrograms: string[];
  onClose: () => void;
  onBook: (eventId: string) => void;
};

export function EventBookingModal({
  event,
  userTier,
  allPrograms,
  onClose,
  onBook,
}: EventBookingModalProps) {
  const canBook = event ? canBookEvent(userTier, event.subscriptionTier) : false;
  const spotsLeft = event ? event.capacity - event.bookedCount : 0;
  const isFull = event ? event.bookedCount >= event.capacity : false;
  const otherPrograms = event && event.program
    ? allPrograms.filter((p) => p !== event.program && p !== 'All')
    : [];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!event) return null;

  const timeRange = [event.startTime, event.endTime].filter(Boolean).length
    ? `${formatTime12h(event.startTime)} – ${formatTime12h(event.endTime)}`
    : 'Time TBD';

  return (
    <div
      className="event-booking-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-booking-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
    >
      <div
        className="event-booking-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          maxWidth: '420px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {getSlotDisplayName(event.program, event.date)}
            </span>
            <h2 id="event-booking-title" style={{ margin: '0.15rem 0 0', fontSize: '1.25rem' }}>{event.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', margin: '0 0 1rem', fontSize: '0.95rem' }}>
          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          {timeRange && ` · ${timeRange}`}
        </p>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{event.location}</p>
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {event.program && `${event.program} · `}{event.type}
        </p>

        <div className="event-occupancy" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--surface-elevated)', borderRadius: 'var(--radius)' }}>
          <strong style={{ fontSize: '0.9rem' }}>Spots</strong>
          <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>
            <span style={{ color: isFull ? 'var(--accent)' : 'var(--text)' }}>
              {event.bookedCount} of {event.capacity} filled
            </span>
            {!isFull && (
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                ({spotsLeft} left)
              </span>
            )}
          </p>
        </div>

        {canBook && !isFull && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
            onClick={() => onBook(event.id)}
          >
            Book this slot
          </button>
        )}
        {!canBook && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(234, 88, 12, 0.1)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              This slot requires <strong>{event.subscriptionTier}</strong> access. Your plan: <strong>{tierLabel(userTier)}</strong>.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
              Upgrade to book
            </Link>
          </div>
        )}
        {isFull && canBook && (
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>This slot is full. <Link href="/contact">Contact us</Link> to join the waitlist.</p>
        )}

        {otherPrograms.length > 0 && (
          <div className="event-other-programs" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Explore other programs
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
              {otherPrograms.slice(0, 4).map((p) => (
                <li key={p}>
                  <Link href="/member-registration">{p}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
