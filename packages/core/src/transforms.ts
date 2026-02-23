/**
 * Percentile and grouping utilities for leaderboard data.
 */

import type { LeaderboardRow } from './types';

/**
 * Compute percentile rank (0-100) for a value in a sorted array of values.
 * Formula: (count below + 0.5 * count equal) / total * 100
 */
export function computePercentile(value: number, sortedValues: number[]): number {
  if (sortedValues.length === 0) return 0;
  const below = sortedValues.filter((v) => v < value).length;
  const equal = sortedValues.filter((v) => v === value).length;
  return Math.round(((below + 0.5 * equal) / sortedValues.length) * 100);
}

/**
 * Assign percentile to each row based on value (higher = better for typical metrics).
 */
export function assignPercentiles(rows: LeaderboardRow[]): LeaderboardRow[] {
  const values = rows.map((r) => r.value).sort((a, b) => a - b);
  return rows.map((r) => ({
    ...r,
    percentile: computePercentile(r.value, values),
  }));
}

/**
 * Group rows by a key (e.g. ageBand). Returns a map of key -> rows.
 */
export function groupByAgeBand<K extends string>(
  rows: { [k in K]?: string }[],
  key: K
): Map<string, typeof rows> {
  const map = new Map<string, typeof rows>();
  for (const row of rows) {
    const val = row[key] ?? 'Unknown';
    if (!map.has(val)) map.set(val, []);
    map.get(val)!.push(row);
  }
  return map;
}

/**
 * Alias for groupByAgeBand when key is generic.
 */
export function groupBy<K extends string>(
  rows: { [k in K]?: string }[],
  key: K
): Map<string, typeof rows> {
  return groupByAgeBand(rows, key);
}

/**
 * Filter leaderboard rows by age band and position.
 */
export function filterLeaderboardRows(
  rows: LeaderboardRow[],
  ageBand: string,
  position: string
): LeaderboardRow[] {
  let filtered = rows;
  if (ageBand) {
    filtered = filtered.filter((r) => (r.ageBand ?? '') === ageBand);
  }
  if (position) {
    filtered = filtered.filter((r) => (r.position ?? '') === position);
  }
  return filtered;
}
