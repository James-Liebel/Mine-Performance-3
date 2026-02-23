/**
 * Integration flags and config for Supabase and Stripe.
 * Set env vars to enable; app works without them until you connect.
 */

export const SUPABASE_ENABLED =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;

export const STRIPE_ENABLED =
  typeof process.env.STRIPE_SECRET_KEY === 'string' &&
  process.env.STRIPE_SECRET_KEY.length > 0;

/** Use Supabase for user/auth data when enabled; otherwise file store. */
export const USE_SUPABASE_FOR_USERS = SUPABASE_ENABLED && process.env.USE_SUPABASE_FOR_USERS === 'true';
