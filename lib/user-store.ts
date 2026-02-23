/**
 * Store for admin-editable user display name, role, credits, and membership.
 * Persisted to data/persisted/users.json. Seeded from env if no file exists.
 */

import { loadJSON, saveJSON } from './persist';

export interface StoredUser {
  email: string;
  name: string;
  role: 'admin' | 'user';
  credits: number;
  membershipId: string;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@mineperformance.com';
const MEMBER_EMAIL = process.env.MEMBER_EMAIL ?? 'member@mineperformance.com';

const SEED: StoredUser[] = [
  { email: ADMIN_EMAIL, name: 'Admin', role: 'admin', credits: 0, membershipId: '' },
  { email: MEMBER_EMAIL, name: 'Member', role: 'user', credits: 0, membershipId: '' },
];

const loaded = loadJSON<StoredUser[]>('users.json');
let store: StoredUser[] = loaded ?? SEED;

function persist(): void {
  saveJSON('users.json', store);
}

export function getUsers(): StoredUser[] {
  return [...store];
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface UsersPage {
  users: StoredUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Paginated and optionally filtered list for admin (scales to hundreds of users). */
export function getUsersPaginated(options: {
  page?: number;
  limit?: number;
  q?: string;
}): UsersPage {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, options.limit ?? DEFAULT_PAGE_SIZE));
  const q = typeof options.q === 'string' ? options.q.trim().toLowerCase() : '';

  let filtered = store;
  if (q) {
    filtered = store.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name && u.name.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const users = filtered.slice(start, start + limit);

  return { users, total, page, limit, totalPages };
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return store.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function updateUser(
  email: string,
  patch: {
    name?: string;
    role?: 'admin' | 'user';
    credits?: number;
    membershipId?: string;
    creditsDelta?: number;
  }
): StoredUser | null {
  const i = store.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (i === -1) return null;
  if (typeof patch.name === 'string' && patch.name.trim()) store[i].name = patch.name.trim();
  if (patch.role === 'admin' || patch.role === 'user') store[i].role = patch.role;
  if (typeof patch.credits === 'number' && patch.credits >= 0) store[i].credits = patch.credits;
  if (typeof patch.creditsDelta === 'number') store[i].credits = Math.max(0, store[i].credits + patch.creditsDelta);
  if (typeof patch.membershipId === 'string') store[i].membershipId = patch.membershipId;
  persist();
  return store[i];
}
