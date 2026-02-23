/**
 * Store for waiver templates (admin-managed) and member signatures.
 * Persisted to data/persisted/waivers.json when the filesystem is writable.
 */

import { loadJSON, saveJSON } from './persist';

export interface Waiver {
  id: string;
  title: string;
  body: string;
  createdAt: string; // ISO
}

const WAIVERS_SEED: Waiver[] = [
  {
    id: '1',
    title: 'Waiver of Liability and Hold Harmless Agreement',
    body: 'By e-signing, you confirm you have read, understood, and agreed to all policies, terms and conditions. Full policies and digital proof of signature can be downloaded.',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Code of Conduct',
    body: 'You agree to follow facility rules and treat staff and other athletes with respect. Violations may result in suspension.',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];

type Persisted = { waivers: Waiver[]; signatures: Record<string, Record<string, string>> };
const loaded = loadJSON<Persisted>('waivers.json');
let waivers: Waiver[] = loaded?.waivers ?? WAIVERS_SEED;
let signatures: Record<string, Record<string, string>> = loaded?.signatures ?? {};

function persist(): void {
  saveJSON('waivers.json', { waivers, signatures });
}

export function getWaivers(): Waiver[] {
  return [...waivers];
}

export function getWaiverById(id: string): Waiver | undefined {
  return waivers.find((w) => w.id === id);
}

export function addWaiver(waiver: Omit<Waiver, 'id' | 'createdAt'>): Waiver {
  const id = `w-${Date.now()}`;
  const created: Waiver = {
    id,
    title: waiver.title,
    body: waiver.body,
    createdAt: new Date().toISOString(),
  };
  waivers.push(created);
  persist();
  return created;
}

export function updateWaiver(id: string, updates: Partial<Pick<Waiver, 'title' | 'body'>>): Waiver | null {
  const i = waivers.findIndex((w) => w.id === id);
  if (i === -1) return null;
  waivers[i] = { ...waivers[i], ...updates };
  persist();
  return waivers[i];
}

export function deleteWaiver(id: string): boolean {
  const i = waivers.findIndex((w) => w.id === id);
  if (i === -1) return false;
  waivers.splice(i, 1);
  persist();
  return true;
}

export function getSignaturesForMember(memberId: string): Record<string, string> {
  return { ...(signatures[memberId] ?? {}) };
}

export function setSignature(memberId: string, waiverId: string, signedAt: string): void {
  if (!signatures[memberId]) signatures[memberId] = {};
  signatures[memberId][waiverId] = signedAt;
  persist();
}

export function isSigned(memberId: string, waiverId: string): boolean {
  return Boolean(signatures[memberId]?.[waiverId]);
}

export function getSignedAt(memberId: string, waiverId: string): string | null {
  return signatures[memberId]?.[waiverId] ?? null;
}
