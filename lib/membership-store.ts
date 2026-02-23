/**
 * Store for admin-edited memberships (pricing). Persisted to data/persisted/memberships.json.
 */
import { MEMBERSHIPS, type Membership } from '@/lib/memberships';
import { loadJSON, saveJSON } from './persist';

const FILE = 'memberships.json';

let store: Membership[] | null = loadJSON<Membership[]>(FILE);

export function getStoredMemberships(): Membership[] {
  return store !== null ? store : [...MEMBERSHIPS];
}

export function setStoredMemberships(list: Membership[]): void {
  store = [...list];
  saveJSON(FILE, list);
}

export function hasStoredOverrides(): boolean {
  return store !== null;
}
