'use client';

import { useMemo, useState } from 'react';
import { getSlotDisplayName, formatTime12h } from '@/lib/slot-display';

export interface CalendarEvent {
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

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthYearLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const totalCells = startPad + daysInMonth;
  const rows = Math.ceil(totalCells / 7);
  const cells: { date: Date | null; dateKey: string }[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ date: null, dateKey: '' });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({
      date,
      dateKey: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }
  const fill = rows * 7 - cells.length;
  for (let i = 0; i < fill; i++) cells.push({ date: null, dateKey: '' });
  return cells;
}

type EventCalendarProps = {
  events: CalendarEvent[];
  onSelectEvent: (e: CalendarEvent) => void;
  /** Called when user clicks a day (date key YYYY-MM-DD) to view or book events that day */
  onSelectDay?: (dateKey: string) => void;
  /** Event IDs the user is signed up for — pills for these get a highlight class */
  bookedEventIds?: string[];
};

export function EventCalendar({ events, onSelectEvent, onSelectDay, bookedEventIds = [] }: EventCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = useMemo(
    () => getDaysInMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    Object.keys(map).forEach((k) => map[k].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')));
    return map;
  }, [events]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  return (
    <div className="event-calendar">
      <div className="event-calendar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{getMonthYearLabel(viewYear, viewMonth)}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={prevMonth} aria-label="Previous month">
            ‹
          </button>
          <button type="button" className="btn btn-secondary" onClick={nextMonth} aria-label="Next month">
            ›
          </button>
        </div>
      </div>
      <div className="event-calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ padding: '0.5rem', background: 'var(--surface-elevated)', fontSize: '0.75rem', fontWeight: 600 }}>
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          const dayEvents = cell.dateKey ? eventsByDate[cell.dateKey] || [] : [];
          const isToday =
            cell.date &&
            cell.date.getDate() === today.getDate() &&
            cell.date.getMonth() === today.getMonth() &&
            cell.date.getFullYear() === today.getFullYear();
          return (
            <div
              key={i}
              className="event-calendar-cell"
              style={{
                minHeight: '90px',
                padding: '0.35rem',
                background: 'var(--surface)',
                fontSize: '0.8rem',
                overflow: 'auto',
              }}
            >
              {cell.date && (
                <>
                  {onSelectDay ? (
                    <button
                      type="button"
                      className="event-calendar-day-num"
                      onClick={() => onSelectDay(cell.dateKey)}
                      style={{
                        display: 'inline-block',
                        background: 'none',
                        border: 'none',
                        padding: '0.15rem 0.25rem',
                        margin: '-0.15rem -0.25rem',
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius)',
                        fontSize: 'inherit',
                      }}
                      title="View training slots on this day"
                      aria-label={`View training slots on ${cell.dateKey}`}
                    >
                      {cell.date.getDate()}
                    </button>
                  ) : (
                    <span
                      style={{
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                      }}
                    >
                      {cell.date.getDate()}
                    </span>
                  )}
                  {dayEvents.map((ev) => {
                    const isBooked = bookedEventIds.includes(ev.id);
                    const slotOpen = ev.bookedCount < ev.capacity;
                    const slotBorder =
                      slotOpen
                        ? '2px solid var(--slot-outline-open, #5a9f6a)'
                        : '2px solid var(--slot-outline-full, #b86b6b)';
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        className={`event-calendar-event-pill${isBooked ? ' event-calendar-event-pill--booked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          marginTop: '0.25rem',
                          padding: '0.25rem 0.35rem',
                          textAlign: 'left',
                          background: isBooked ? 'var(--accent-muted)' : 'var(--surface-elevated)',
                          border: slotBorder,
                          borderRadius: '4px',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                        }}
                        title={isBooked ? 'You\'re signed up' : slotOpen ? 'Open slot' : 'Slot full'}
                      >
                        <span style={{ fontWeight: 600, display: 'block' }}>
                          {getSlotDisplayName(ev.program, ev.date)}
                        </span>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85em' }}>
                          {formatTime12h(ev.startTime)} · {ev.bookedCount}/{ev.capacity} full
                          {isBooked ? ' · You' : ''}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
