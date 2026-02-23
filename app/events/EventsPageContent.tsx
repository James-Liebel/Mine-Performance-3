'use client';

import { EventsClient, type EventItem } from './EventsClient';
import { PrimaryCTA } from '@/components/PrimaryCTA';
import { EditableContent } from '@/components/EditableContent';

export function EventsPageContent({ events }: { events: EventItem[] }) {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1>
        <EditableContent contentKey="events_heading" fallback="Scheduling" as="span" />
      </h1>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
        <EditableContent contentKey="events_intro" fallback="Training slots — camps, clinics, sessions. Use the calendar to view and book by day. Toggle to show only slots you're signed up for or all slots. Green outline = open; red = full." as="span" />
      </p>
      <EventsClient events={events} />
      <PrimaryCTA />
    </div>
  );
}
