'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RENTAL_RESOURCES, type RentalResource } from '@/lib/rentals';
import { EditableContent } from '@/components/EditableContent';
import { useSiteContent } from '@/contexts/SiteContentContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateForParam(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatHour(hour: number): string {
  if (hour === 0) return '12:00 am';
  if (hour === 12) return '12:00 pm';
  if (hour < 12) return `${hour}:00 am`;
  return `${hour - 12}:00 pm`;
}

interface SelectedSlot {
  resource: RentalResource;
  date: Date;
  hour: number;
}

function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

export default function RentalsPage() {
  const router = useRouter();
  const { content } = useSiteContent();
  const today = new Date();
  const [calendarView, setCalendarView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const year = calendarView.getFullYear();
  const month = calendarView.getMonth();
  const monthName = MONTHS[month];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCalendarView(new Date(year, month - 1));
  const nextMonth = () => setCalendarView(new Date(year, month + 1));

  const isDaySelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
  };
  const isDayToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  const isDayPast = (day: number) => {
    const d = new Date(year, month, day);
    return isPastDate(d);
  };

  const handleDayClick = (day: number) => {
    const d = new Date(year, month, day);
    if (isPastDate(d)) return;
    setSelectedDate(d);
    setSelectedSlot(null);
  };

  const handleRequestClick = () => {
    if (!selectedSlot || !selectedDate) return;
    const date = formatDateForParam(selectedSlot.date);
    const time = `${String(selectedSlot.hour).padStart(2, '0')}:00`;
    router.push(
      `/contact?resource=${encodeURIComponent(selectedSlot.resource.id)}&date=${date}&time=${time}`
    );
  };

  const clearSelection = () => {
    setSelectedSlot(null);
  };

  return (
    <div className="page page-rentals">
      <section className="hero hero-dark hero-compact">
        <div className="container">
          <h1>
            <EditableContent contentKey="rentals_heading" fallback="Rentals" as="span" />
          </h1>
          <p className="hero-subtitle">
            <EditableContent contentKey="rentals_subtitle" fallback="Reserve our labs, cages, and turf space for your own training or team sessions." as="span" />
          </p>
        </div>
      </section>

      <div className="container rentals-container">
        <section className="rentals-section">
          <h2 className="rentals-section-title">
            <EditableContent contentKey="rentals_choose_date_heading" fallback="Choose a date" as="span" />
          </h2>
          <p className="rentals-section-desc text-muted">
            <EditableContent contentKey="rentals_choose_date_desc" fallback="Select a day on the calendar, then pick a resource and time slot below." as="span" />
          </p>

          <div className="rentals-calendar-card card card-elevated">
            <div className="rentals-calendar-header">
              <h3 className="rentals-calendar-month">{monthName} {year}</h3>
              <div className="rentals-calendar-nav">
                <button
                  type="button"
                  className="rentals-calendar-nav-btn"
                  onClick={prevMonth}
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="rentals-calendar-nav-btn"
                  onClick={() => {
                    setCalendarView(new Date(today.getFullYear(), today.getMonth(), 1));
                    setSelectedDate(new Date());
                    setSelectedSlot(null);
                  }}
                  aria-label="Go to current month"
                >
                  Today
                </button>
                <button
                  type="button"
                  className="rentals-calendar-nav-btn"
                  onClick={nextMonth}
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="rentals-calendar-grid">
              {DAYS.map((d) => (
                <div key={d} className="rentals-calendar-dow" aria-hidden>
                  {d}
                </div>
              ))}
              {blanks.map((_, i) => (
                <div key={`b-${i}`} className="rentals-calendar-day rentals-calendar-day--blank" />
              ))}
              {days.map((day) => {
                const past = isDayPast(day);
                const selected = isDaySelected(day);
                const todayCell = isDayToday(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`rentals-calendar-day rentals-calendar-day--clickable ${
                      selected ? 'rentals-calendar-day--selected' : ''
                    } ${todayCell ? 'rentals-calendar-day--today' : ''} ${past ? 'rentals-calendar-day--past' : ''}`}
                    onClick={() => handleDayClick(day)}
                    disabled={past}
                    aria-label={past ? `Past date` : `Select ${monthName} ${day}`}
                    aria-pressed={selected}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {selectedDate && (
              <p className="rentals-calendar-selected text-muted" aria-live="polite">
                Selected: <strong>{formatDateForDisplay(selectedDate)}</strong>
              </p>
            )}
          </div>
        </section>

        <section className="rentals-section">
          <h2 className="rentals-section-title">
            <EditableContent contentKey="rentals_pick_resource_heading" fallback="Pick a resource and time" as="span" />
          </h2>
          <p className="rentals-section-desc text-muted">
            {selectedDate ? (
              <EditableContent
                contentKey="rentals_pick_resource_desc_with_date"
                fallback="Available times for {date}. We'll confirm after you submit."
                displayValue={(content.rentals_pick_resource_desc_with_date ?? 'Available times for {date}. We\'ll confirm after you submit.').replace('{date}', formatDateForDisplay(selectedDate))}
                as="span"
              />
            ) : (
              <EditableContent contentKey="rentals_pick_resource_desc_no_date" fallback="Select a date above first." as="span" />
            )}
          </p>

          <div className="rentals-layout">
            <div className="rentals-grid">
              {RENTAL_RESOURCES.map((resource) => {
                const hours: number[] = [];
                for (let h = resource.openHour; h < resource.closeHour; h++) {
                  hours.push(h);
                }
                return (
                  <article
                    key={resource.id}
                    className={`rental-card card card-elevated ${selectedSlot?.resource.id === resource.id ? 'rental-card--selected' : ''}`}
                  >
                    <div className="rental-card-header">
                      <h3 className="rental-card-title">{resource.name}</h3>
                      <p className="rental-card-desc text-muted">{resource.description}</p>
                      <div className="rental-card-rates">
                        {resource.rates.map((rate) => (
                          <span key={rate.label} className="rental-rate-badge">
                            {rate.price} / {rate.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rental-card-slots">
                      <p className="rental-slots-label text-muted">Time slots</p>
                      <div className="rental-slots-grid">
                        {hours.map((hour) => {
                          const isSelected =
                            selectedSlot &&
                            selectedSlot.resource.id === resource.id &&
                            selectedSlot.hour === hour &&
                            selectedDate &&
                            selectedSlot.date.toDateString() === selectedDate.toDateString();
                          return (
                            <button
                              key={hour}
                              type="button"
                              className={`rental-slot-btn ${isSelected ? 'rental-slot-btn--selected' : ''}`}
                              onClick={() =>
                                selectedDate &&
                                setSelectedSlot({
                                  resource,
                                  date: new Date(selectedDate),
                                  hour,
                                })
                              }
                              disabled={!selectedDate}
                              aria-pressed={!!isSelected}
                              title={selectedDate ? `${formatDateForDisplay(selectedDate)} at ${formatHour(hour)}` : 'Select a date first'}
                            >
                              {formatHour(hour)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="rentals-sidebar card card-elevated">
              <h3 className="rentals-sidebar-title">Your selection</h3>
              {selectedSlot && selectedDate ? (
                <>
                  <div className="rentals-sidebar-summary">
                    <div className="rentals-sidebar-row">
                      <span className="text-muted">Resource</span>
                      <strong>{selectedSlot.resource.name}</strong>
                    </div>
                    <div className="rentals-sidebar-row">
                      <span className="text-muted">Date</span>
                      <span>{formatDateForDisplay(selectedSlot.date)}</span>
                    </div>
                    <div className="rentals-sidebar-row">
                      <span className="text-muted">Time</span>
                      <span>{formatHour(selectedSlot.hour)}</span>
                    </div>
                    <div className="rentals-sidebar-row">
                      <span className="text-muted">Rates</span>
                      <span className="rentals-sidebar-rates">
                        {selectedSlot.resource.rates.map((r) => `${r.price}/${r.label}`).join(' · ')}
                      </span>
                    </div>
                  </div>
                  <div className="rentals-sidebar-actions">
                    <button type="button" className="btn btn-primary rentals-cta" onClick={handleRequestClick}>
                      Request this rental
                    </button>
                    <button type="button" className="btn btn-ghost rentals-clear" onClick={clearSelection}>
                      Change selection
                    </button>
                  </div>
                </>
              ) : (
                <div className="rentals-sidebar-empty">
                  <p className="text-muted">
                    {!selectedDate
                      ? 'Select a date on the calendar above.'
                      : 'Choose a time slot for your selected date.'}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
