/**
 * Auth helpers for API routes.
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function requireAdmin(): Promise<{ ok: false; status: 401 } | { ok: true }> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== 'admin') {
    return { ok: false, status: 401 };
  }
  return { ok: true };
}
