import { describe, it, expect } from 'vitest';
import { buildStatStakLink, buildContactLink } from './links';

describe('buildStatStakLink', () => {
  it('builds booking link with coach ID', () => {
    const url = buildStatStakLink({
      baseUrl: 'https://example.statstak.io',
      kind: 'booking',
      coachId: 'coach-123',
    });
    expect(url).toBe('https://example.statstak.io/trainers/coach-123');
  });

  it('builds booking link without coach ID', () => {
    const url = buildStatStakLink({
      baseUrl: 'https://example.statstak.io',
      kind: 'booking',
    });
    expect(url).toBe('https://example.statstak.io/trainers');
  });

  it('builds registration link with event ID', () => {
    const url = buildStatStakLink({
      baseUrl: 'https://example.statstak.io',
      kind: 'registration',
      eventId: 'evt-456',
    });
    expect(url).toBe('https://example.statstak.io/events/evt-456');
  });

  it('builds leaderboard link with metric', () => {
    const url = buildStatStakLink({
      baseUrl: 'https://example.statstak.io',
      kind: 'leaderboard',
      metric: 'Pitching Velo',
    });
    expect(url).toContain('/leaderboard');
    expect(url).toContain('metric=');
    expect(url).toContain('Pitching');
  });
});

describe('buildContactLink', () => {
  it('builds contact link without event', () => {
    expect(buildContactLink()).toBe('/contact');
  });

  it('builds contact link with book param', () => {
    expect(buildContactLink('evt-1')).toBe('/contact?book=evt-1');
  });
});
