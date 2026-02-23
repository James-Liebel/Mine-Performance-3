import { getMergedEvents } from '@/lib/events-server';
import { EventsPageContent } from './EventsPageContent';

export default function EventsPage() {
  const events = getMergedEvents();
  return <EventsPageContent events={events} />;
}
