'use client';

import { EventsClient, type EventItem } from './EventsClient';
import { PrimaryCTA } from '@/components/PrimaryCTA';
import { EditableContent } from '@/components/EditableContent';

export function EventsPageContent({ events }: { events: EventItem[] }) {
  return (
    <div className="page page-events-editorial">
      <section className="events-editorial-hero page-home-section alt-bg">
        <div className="container">
          <h1>
            <EditableContent contentKey="events_heading" fallback="Scheduling" as="span" />
          </h1>
          <p className="section-sub events-editorial-intro" style={{ maxWidth: '560px' }}>
            <EditableContent contentKey="events_intro" fallback="Training slots — camps, clinics, sessions. Use the calendar to view and book by day. Toggle to show only slots you're signed up for or all slots. Green outline = open; red = full." as="span" />
          </p>
        </div>
      </section>
      <div className="events-editorial-layout">
        <div className="container events-editorial-layout-inner">
          <aside className="events-editorial-sidebar">
            <div className="card card-elevated events-legend-card">
              <h3 className="events-legend-title">Legend</h3>
              <dl className="events-legend-list">
                <dt style={{ borderLeftColor: 'var(--slot-outline-open)' }}>Open</dt>
                <dd>Slots available to book</dd>
                <dt style={{ borderLeftColor: 'var(--slot-outline-full)' }}>Full</dt>
                <dd>No spots left</dd>
              </dl>
              <p className="events-legend-tip text-muted">
                Use the view toggle to filter by your bookings or see all slots.
              </p>
            </div>
          </aside>
          <div className="events-editorial-main">
            <EventsClient events={events} />
            <PrimaryCTA />
          </div>
        </div>
      </div>
    </div>
  );
}
