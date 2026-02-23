/**
 * Supabase browser client. Safe to import from client components.
 * Returns null if Supabase is not configured (env vars missing).
 */

import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}

/** Get Supabase client for use in client components. Call inside component/hook. */
export function getSupabaseBrowser() {
  return createSupabaseBrowserClient();
}
