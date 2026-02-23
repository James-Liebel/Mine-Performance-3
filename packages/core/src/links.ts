/**
 * Deep-link builders for StatStak (booking, registration, athlete profile).
 * Configurable via STATSTAK_BASE_URL for different environments.
 */

export type StatStakLinkKind = 'booking' | 'registration' | 'profile' | 'leaderboard';

export interface BuildStatStakLinkOptions {
  baseUrl?: string;
  kind: StatStakLinkKind;
  /** Coach/trainer ID for booking */
  coachId?: string;
  /** Event ID for registration */
  eventId?: string;
  /** Athlete ID for profile */
  athleteId?: string;
  /** Metric for leaderboard deep link */
  metric?: string;
}

const DEFAULT_BASE = 'https://mine-performance.statstak.io';

/**
 * Build a StatStak deep link for booking, registration, or athlete profile.
 * Falls back to internal /contact when baseUrl is not set or for internal flows.
 */
export function buildStatStakLink(options: BuildStatStakLinkOptions): string {
  const envBase =
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STATSTAK_BASE_URL;
  const base =
    options.baseUrl ??
    (typeof envBase === 'string' ? envBase : DEFAULT_BASE);

  const url = new URL(base);

  switch (options.kind) {
    case 'booking':
      if (options.coachId) {
        url.pathname = `/trainers/${options.coachId}`;
      } else {
        url.pathname = '/trainers';
      }
      break;
    case 'registration':
      if (options.eventId) {
        url.pathname = `/events/${options.eventId}`;
      } else {
        url.pathname = '/events';
      }
      break;
    case 'profile':
      if (options.athleteId) {
        url.pathname = `/athletes/${options.athleteId}`;
      } else {
        url.pathname = '/athletes';
      }
      break;
    case 'leaderboard':
      url.pathname = '/leaderboard';
      if (options.metric) {
        url.searchParams.set('metric', options.metric);
      }
      break;
    default:
      url.pathname = '/';
  }

  return url.toString();
}

/**
 * Build an internal contact link with optional booking context.
 * Used when StatStak is not the primary booking flow.
 */
export function buildContactLink(bookEventId?: string): string {
  if (bookEventId) {
    return `/contact?book=${encodeURIComponent(bookEventId)}`;
  }
  return '/contact';
}
