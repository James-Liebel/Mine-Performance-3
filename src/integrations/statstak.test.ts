import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { statstakAdapter } from './statstak';
import { buildDeepLink, getAdapter, isDeepLinkAdapter } from './index';

describe('statstak adapter', () => {
  const origEnv = process.env;

  beforeEach(() => {
    process.env = { ...origEnv };
  });

  afterEach(() => {
    process.env = origEnv;
  });

  it('implements DeepLinkAdapter', () => {
    expect(isDeepLinkAdapter(statstakAdapter)).toBe(true);
    expect(statstakAdapter.id).toBe('statstak');
    expect(statstakAdapter.supportedTargets).toContain('leaderboard');
  });

  it('buildUrl returns correct paths for known targets', () => {
    process.env.STATSTAK_BASE_URL = 'https://acme.statstak.io';
    const base = 'https://acme.statstak.io';
    expect(statstakAdapter.buildUrl('leaderboard')).toBe(`${base}/leaderboard`);
    expect(statstakAdapter.buildUrl('trainers')).toBe(`${base}/trainers`);
    expect(statstakAdapter.buildUrl('scheduling')).toBe(`${base}/scheduling`);
    expect(statstakAdapter.buildUrl('events')).toBe(`${base}/events`);
    expect(statstakAdapter.buildUrl('home')).toBe(`${base}/`);
  });

  it('buildUrl returns null for unknown target', () => {
    expect(statstakAdapter.buildUrl('unknown')).toBeNull();
  });

  it('buildUrl appends query params when provided', () => {
    process.env.STATSTAK_BASE_URL = 'https://test.statstak.io';
    const url = statstakAdapter.buildUrl('leaderboard', { age: '14U', pos: 'RHP' });
    expect(url).toContain('/leaderboard');
    expect(url).toContain('age=14U');
    expect(url).toContain('pos=RHP');
  });

  it('uses default base URL when STATSTAK_BASE_URL is unset', () => {
    delete process.env.STATSTAK_BASE_URL;
    const url = statstakAdapter.buildUrl('leaderboard');
    expect(url).toMatch(/^https:\/\/.*\/leaderboard/);
    expect(url).toContain('statstak');
  });

  it('healthy returns true when base URL is valid', async () => {
    process.env.STATSTAK_BASE_URL = 'https://valid.example.com';
    expect(await statstakAdapter.healthy()).toBe(true);
  });

  it('healthy returns true with default URL', async () => {
    delete process.env.STATSTAK_BASE_URL;
    expect(await statstakAdapter.healthy()).toBe(true);
  });
});

describe('buildDeepLink', () => {
  beforeEach(() => {
    process.env.STATSTAK_BASE_URL = 'https://test.statstak.io';
  });

  it('returns URL for statstak + valid target', () => {
    const url = buildDeepLink('statstak', 'leaderboard');
    expect(url).toBe('https://test.statstak.io/leaderboard');
  });

  it('returns null for unknown adapter', () => {
    expect(buildDeepLink('unknown-adapter', 'leaderboard')).toBeNull();
  });

  it('returns null for noop adapter (not a DeepLinkAdapter)', () => {
    expect(buildDeepLink('noop', 'leaderboard')).toBeNull();
  });
});
