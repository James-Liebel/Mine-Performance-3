import mockEvents from '@/data/mock-events.json';
import { getAllEvents } from './event-store';
import type { EventItem } from './events-types';

export type { EventItem };

/** Merge static mock events with admin-created (and recurring) events. */
export function getMergedEvents(): EventItem[] {
  const staticEvents = mockEvents as EventItem[];
  const dynamic = getAllEvents();
  return [...staticEvents, ...dynamic];
}

export function getMergedEventById(id: string): EventItem | null {
  const events = getMergedEvents();
  return events.find((e) => e.id === id) ?? null;
}
