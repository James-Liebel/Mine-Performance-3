/**
 * User data service: single entry point for auth and admin.
 * Currently uses file-based user-store. When Supabase is connected, switch
 * implementation here to Supabase (USE_SUPABASE_FOR_USERS) so auth and admin
 * both use the same source without changing call sites.
 */

import { USE_SUPABASE_FOR_USERS } from './integrations';
import * as userStore from './user-store';

export type { StoredUser, UsersPage } from './user-store';

export function getUsers() {
  if (USE_SUPABASE_FOR_USERS) {
    // TODO: when Supabase is connected, call Supabase here and return same shape
    return userStore.getUsers();
  }
  return userStore.getUsers();
}

export function getUsersPaginated(options: {
  page?: number;
  limit?: number;
  q?: string;
}) {
  if (USE_SUPABASE_FOR_USERS) {
    // TODO: when Supabase is connected, implement pagination + search via Supabase
    return userStore.getUsersPaginated(options);
  }
  return userStore.getUsersPaginated(options);
}

export function getUserByEmail(email: string) {
  if (USE_SUPABASE_FOR_USERS) {
    // TODO: when Supabase is connected, fetch from Supabase
    return userStore.getUserByEmail(email);
  }
  return userStore.getUserByEmail(email);
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
) {
  if (USE_SUPABASE_FOR_USERS) {
    // TODO: when Supabase is connected, update in Supabase and return
    return userStore.updateUser(email, patch);
  }
  return userStore.updateUser(email, patch);
}
