'use client';

import { useMemo, useState } from 'react';

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

export interface AdminCalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type?: string;
}

type AdminCalendarProps = {
  events?: AdminCalendarEvent[];
  onSelectDate: (dateKey: string) => void;
  onSelectSlot?: (dateKey: string, startTime: string) => void;
};

export function AdminCalendar({ events = [], onSelectDate, onSelectSlot }: AdminCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = useMemo(
    () => getDaysInMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, AdminCalendarEvent[]> = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    Object.keys(map).forEach((k) =>
      map[k].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
    );
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
    <div className="admin-calendar">
      <div
        className="admin-calendar-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
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
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Click a day to create an event on that date. Existing events are shown below the date.
      </p>
      <div
        className="admin-calendar-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              padding: '0.5rem',
              background: 'var(--surface-elevated)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
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
              className="admin-calendar-cell"
              style={{
                minHeight: '100px',
                padding: '0.35rem',
                background: 'var(--surface)',
                fontSize: '0.8rem',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {cell.date && (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectDate(cell.dateKey)}
                    aria-label={`Create event on ${cell.dateKey}`}
                    style={{
                      alignSelf: 'flex-start',
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? 'var(--accent)' : 'var(--text)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.15rem 0.25rem',
                      margin: '-0.15rem -0.25rem',
                      borderRadius: 'var(--radius)',
                      fontSize: 'inherit',
                    }}
                    className="admin-calendar-day-num"
                  >
                    {cell.date.getDate()}
                  </button>
                  <span style={{ marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>+ Add</span>
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      style={{
                        marginTop: '0.25rem',
                        padding: '0.2rem 0.35rem',
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{ev.title}</span>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                        {ev.startTime || ''}–{ev.endTime || ''}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
