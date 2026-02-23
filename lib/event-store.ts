/**
 * Event store for admin-created events (including recurring).
 * Persisted to data/persisted/events.json when the filesystem is writable.
 */

import { loadJSON, saveJSON } from './persist';

export type SubscriptionTier = 'basic' | 'premium' | 'all';

export interface StoredEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;
  type: string;
  program: string;
  location: string;
  featured: boolean;
  capacity: number;
  bookedCount: number;
  subscriptionTier: SubscriptionTier;
}

export type RepeatKind = 'none' | 'daily' | 'weekly';

export interface RecurringSpec {
  title: string;
  program: string;
  type: string;
  location: string;
  subscriptionTier: SubscriptionTier;
  capacity: number;
  startTime: string;
  endTime: string;
  repeat: RepeatKind;
  startDate: string;   // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  daysOfWeek?: number[]; // 0–6 (Sun–Sat) for weekly
}

const loaded = loadJSON<{ events: StoredEvent[]; nextId: number }>('events.json');
let store: StoredEvent[] = loaded?.events ?? [];
let idCounter = loaded?.nextId ?? 1000;

function persist(): void {
  saveJSON('events.json', { events: store, nextId: idCounter });
}

function nextId(): string {
  return String(idCounter++);
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getAllEvents(): StoredEvent[] {
  return [...store];
}

export function addEvent(event: Omit<StoredEvent, 'id' | 'bookedCount'>): StoredEvent {
  const e: StoredEvent = {
    ...event,
    id: nextId(),
    bookedCount: 0,
  };
  store.push(e);
  persist();
  return e;
}

export function addRecurring(spec: RecurringSpec): StoredEvent[] {
  const start = parseDate(spec.startDate);
  const end = parseDate(spec.endDate);
  const created: StoredEvent[] = [];

  if (spec.repeat === 'none') {
    const one = addEvent({
      title: spec.title,
      date: spec.startDate,
      startTime: spec.startTime,
      endTime: spec.endTime,
      type: spec.type,
      program: spec.program,
      location: spec.location,
      subscriptionTier: spec.subscriptionTier,
      capacity: spec.capacity,
      featured: false,
    });
    return [one];
  }

  const daysOfWeek = spec.daysOfWeek ?? [1, 2, 3, 4, 5]; // weekdays if weekly
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    if (spec.repeat === 'weekly' && !daysOfWeek.includes(dayOfWeek)) continue;
    const dateStr = formatDate(d);
    created.push(
      addEvent({
        title: spec.title,
        date: dateStr,
        startTime: spec.startTime,
        endTime: spec.endTime,
        type: spec.type,
        program: spec.program,
        location: spec.location,
        subscriptionTier: spec.subscriptionTier,
        capacity: spec.capacity,
        featured: false,
      })
    );
  }
  return created;
}

export function deleteEvent(id: string): boolean {
  const i = store.findIndex((e) => e.id === id);
  if (i === -1) return false;
  store.splice(i, 1);
  persist();
  return true;
}

export function updateEvent(
  id: string,
  patch: Partial<Omit<StoredEvent, 'id'>>
): StoredEvent | null {
  const i = store.findIndex((e) => e.id === id);
  if (i === -1) return null;
  store[i] = { ...store[i], ...patch };
  persist();
  return store[i];
}

export function getEventById(id: string): StoredEvent | null {
  const e = store.find((x) => x.id === id);
  return e ?? null;
}
