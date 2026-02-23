/**
 * Integration registry and factory.
 * Use getAdapter(id) to resolve adapters by id.
 */

import { statstakAdapter } from './statstak';
import { noopAdapter } from './noop';
import type { IntegrationAdapter, DeepLinkAdapter, RegisteredAdapter } from './types';

const REGISTRY: Record<string, RegisteredAdapter> = {
  statstak: statstakAdapter,
  noop: noopAdapter,
};

/** Get adapter by id; returns noop if not found */
export function getAdapter(id: string): RegisteredAdapter {
  return REGISTRY[id] ?? noopAdapter;
}

/** Get all registered adapters */
export function getAllAdapters(): RegisteredAdapter[] {
  return Object.values(REGISTRY);
}

/** Check if adapter supports deep links */
export function isDeepLinkAdapter(a: RegisteredAdapter): a is DeepLinkAdapter {
  return 'buildUrl' in a && 'supportedTargets' in a;
}

/** Build a deep link via the given adapter; returns null if not supported or invalid target */
export function buildDeepLink(
  adapterId: string,
  target: string,
  params?: Record<string, string>
): string | null {
  const adapter = getAdapter(adapterId);
  if (!isDeepLinkAdapter(adapter)) return null;
  return adapter.buildUrl(target, params);
}

/** Run health checks for all adapters; returns combined status */
export async function checkAllHealthy(): Promise<{ ok: boolean; integrations: Record<string, boolean> }> {
  const results: Record<string, boolean> = {};
  for (const [id, adapter] of Object.entries(REGISTRY)) {
    try {
      results[id] = await adapter.healthy();
    } catch {
      results[id] = false;
    }
  }
  const ok = Object.values(results).every(Boolean);
  return { ok, integrations: results };
}

export { statstakAdapter, noopAdapter };
export type { IntegrationAdapter, DeepLinkAdapter, FormSubmitAdapter, FormPayload, FormSubmitResult } from './types';
