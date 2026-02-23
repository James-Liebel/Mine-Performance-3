/**
 * StatStak integration — deep links to leaderboard, trainers, scheduling.
 * Base URL from STATSTAK_BASE_URL (e.g. https://mine-performance.statstak.io).
 */

import type { DeepLinkAdapter } from './types';

const DEFAULT_BASE = 'https://mine-performance.statstak.io';
const SUPPORTED_TARGETS = ['leaderboard', 'trainers', 'scheduling', 'events', 'home'] as const;

function getBaseUrl(): string {
  const base = process.env.STATSTAK_BASE_URL?.trim();
  return base || DEFAULT_BASE;
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export const statstakAdapter: DeepLinkAdapter = {
  id: 'statstak',
  supportedTargets: [...SUPPORTED_TARGETS],

  async healthy(): Promise<boolean> {
    const base = getBaseUrl();
    return isValidUrl(base);
  },

  buildUrl(target: string, params?: Record<string, string>): string | null {
    const base = getBaseUrl().replace(/\/$/, '');
    const pathMap: Record<string, string> = {
      leaderboard: '/leaderboard',
      trainers: '/trainers',
      scheduling: '/scheduling',
      events: '/events',
      home: '/',
    };
    const path = pathMap[target] ?? null;
    if (!path) return null;

    let url = `${base}${path}`;
    if (params && Object.keys(params).length > 0) {
      const search = new URLSearchParams(params).toString();
      url += (path.includes('?') ? '&' : '?') + search;
    }
    return url;
  },
};
