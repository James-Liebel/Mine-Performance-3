/**
 * Lightweight in-memory rate limiter for API routes.
 * For multi-instance deployments, use Redis or similar.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MUTATION_LIMIT = 30; // 30 requests per minute for mutations
const READ_LIMIT = 120; // 120 requests per minute for reads (admin)

function getKey(identifier: string, prefix: string): string {
  return `${prefix}:${identifier}`;
}

function check(identifier: string, limit: number, prefix: string): { ok: boolean; remaining: number } {
  const key = getKey(identifier, prefix);
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, entry);
    return { ok: true, remaining: limit - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, limit - entry.count);
  return { ok: entry.count <= limit, remaining };
}

/** Cleanup old entries periodically */
setInterval(() => {
  const now = Date.now();
  Array.from(store.entries()).forEach(([k, v]) => {
    if (now > v.resetAt) store.delete(k);
  });
}, WINDOW_MS * 2);

export function rateLimitMutation(identifier: string): { ok: boolean; remaining: number } {
  return check(identifier, MUTATION_LIMIT, 'mut');
}

export function rateLimitRead(identifier: string): { ok: boolean; remaining: number } {
  return check(identifier, READ_LIMIT, 'read');
}

/** Get client identifier from request (IP or x-forwarded-for) */
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip || 'unknown';
}
