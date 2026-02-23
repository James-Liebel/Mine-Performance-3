import { describe, it, expect } from 'vitest';
import {
  computePercentile,
  assignPercentiles,
  groupBy,
  groupByAgeBand,
  filterLeaderboardRows,
} from './transforms';

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
});

describe('assignPercentiles', () => {
  it('assigns percentiles to rows by value', () => {
    const rows = [
      { name: 'A', value: 80 },
      { name: 'B', value: 90 },
      { name: 'C', value: 70 },
    ];
    const result = assignPercentiles(rows);
    expect(result.find((r) => r.name === 'C')?.percentile).toBe(17);
    expect(result.find((r) => r.name === 'A')?.percentile).toBe(50);
    expect(result.find((r) => r.name === 'B')?.percentile).toBe(83);
  });
});

describe('groupBy / groupByAgeBand', () => {
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

  it('groupByAgeBand is alias for groupBy', () => {
    const rows = [{ ageBand: '12U', name: 'X' }];
    expect(groupByAgeBand(rows, 'ageBand').get('12U')).toHaveLength(1);
  });
});

describe('filterLeaderboardRows', () => {
  it('returns all rows when filters are empty', () => {
    const rows = [
      { name: 'A', value: 80, ageBand: '14U' },
      { name: 'B', value: 90, ageBand: '16U' },
    ];
    expect(filterLeaderboardRows(rows, '', '')).toHaveLength(2);
  });

  it('filters by ageBand', () => {
    const rows = [
      { name: 'A', value: 80, ageBand: '14U' },
      { name: 'B', value: 90, ageBand: '16U' },
    ];
    expect(filterLeaderboardRows(rows, '14U', '')).toHaveLength(1);
    expect(filterLeaderboardRows(rows, '14U', '')[0].name).toBe('A');
  });

  it('filters by position', () => {
    const rows = [
      { name: 'A', value: 80, position: 'RHP' },
      { name: 'B', value: 90, position: 'LHP' },
    ];
    expect(filterLeaderboardRows(rows, '', 'RHP')).toHaveLength(1);
  });
});
