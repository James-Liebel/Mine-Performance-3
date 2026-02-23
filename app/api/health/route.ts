/**
 * Health check endpoint — env sanity and integration readiness.
 * GET /api/health
 * Returns 200 when healthy, 503 when critical integrations fail.
 */

import { NextResponse } from 'next/server';
import { checkAllHealthy } from '@/src/integrations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const { ok, integrations } = await checkAllHealthy();

  return NextResponse.json(
    {
      status: ok ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      integrations,
    },
    { status: ok ? 200 : 503 }
  );
}
