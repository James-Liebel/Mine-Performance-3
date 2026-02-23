import { describe, it, expect } from 'vitest';
import { computePercentile, assignPercentiles, groupBy } from './percentiles';

describe('computePercentile', () => {
  it('returns 0 for empty array', () => {
    expect(computePercentile(50, [])).toBe(0);
  });

  it('returns 100 for value above all', () => {
    expect(computePercentile(100, [10, 20, 30])).toBe(100);
  });

  it('returns 0 for value below all', () => {
    expect(computePercentile(5, [10, 20, 30])).toBe(0);
  });

  it('returns ~50 for middle value', () => {
    const p = computePercentile(20, [10, 20, 30]);
    expect(p).toBeGreaterThanOrEqual(40);
    expect(p).toBeLessThanOrEqual(60);
  });

  it('handles ties', () => {
    const p = computePercentile(20, [10, 20, 20, 30]);
    expect(p).toBeGreaterThanOrEqual(25);
    expect(p).toBeLessThanOrEqual(75);
  });
});

describe('assignPercentiles', () => {
  it('assigns percentiles to rows by value', () => {
    const rows = [
      { name: 'A', value: 80 },
      { name: 'B', value: 90 },
      { name: 'C', value: 70 },
    ];
    const result = assignPercentiles(rows);
    // Formula: (below + 0.5*equal)/total*100. C=70: 0+0.5/3≈17; A=80: 1+0.5/3=50; B=90: 2+0.5/3≈83
    expect(result.find((r) => r.name === 'C')?.percentile).toBe(17);
    expect(result.find((r) => r.name === 'A')?.percentile).toBe(50);
    expect(result.find((r) => r.name === 'B')?.percentile).toBe(83);
  });

  it('preserves existing fields', () => {
    const rows = [{ name: 'X', value: 50, rank: 1 }];
    const result = assignPercentiles(rows);
    expect(result[0].rank).toBe(1);
    expect(result[0].name).toBe('X');
  });
});

describe('groupBy', () => {
  it('groups rows by key', () => {
    const rows = [
      { ageBand: '14U', name: 'A' },
      { ageBand: '16U', name: 'B' },
      { ageBand: '14U', name: 'C' },
    ];
    const map = groupBy(rows, 'ageBand');
    expect(map.get('14U')).toHaveLength(2);
    expect(map.get('16U')).toHaveLength(1);
  });

  it('uses Unknown for missing key', () => {
    const rows = [{ name: 'A' } as { ageBand?: string; name: string }];
    const map = groupBy(rows, 'ageBand');
    expect(map.get('Unknown')).toHaveLength(1);
  });
});
