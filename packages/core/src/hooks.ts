/**
 * Data and filter hooks for programs, coaches, events, leaderboard.
 * Use with server-passed props or client-side data loading.
 */

import { useState, useMemo } from 'react';
import type { Coach, EventItem, LeaderboardData } from './types';
import { PROGRAMS } from './constants';
import { filterLeaderboardRows } from './transforms';

/**
 * Returns programs list (static data).
 */
export function usePrograms() {
  return PROGRAMS;
}

/**
 * Manages coach list with specialty filter.
 */
export function useCoaches(coaches: Coach[]) {
  const [specialty, setSpecialty] = useState('');

  const filtered = useMemo(() => {
    if (!specialty) return coaches;
    return coaches.filter((c) => c.specialty === specialty);
  }, [coaches, specialty]);

  const specialtyOptions = useMemo(
    () =>
      [
        { value: '', label: 'All specialties' },
        ...Array.from(new Set(coaches.map((c) => c.specialty))).map((s) => ({
          value: s,
          label: s,
        })),
      ],
    [coaches]
  );

  return {
    coaches: filtered,
    specialty,
    setSpecialty,
    specialtyOptions,
    allCoaches: coaches,
  };
}

/**
 * Manages events with type filter and featured extraction.
 */
export function useEvents(events: EventItem[]) {
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    if (!typeFilter) return events;
    return events.filter((e) => e.type === typeFilter);
  }, [events, typeFilter]);

  const featured = useMemo(
    () => events.filter((e) => e.featured),
    [events]
  );

  const allPrograms = useMemo(
    () =>
      Array.from(
        new Set(events.map((e) => e.program).filter(Boolean))
      ) as string[],
    [events]
  );

  return {
    events: filtered,
    featured,
    typeFilter,
    setTypeFilter,
    allPrograms,
    allEvents: events,
  };
}

/**
 * Manages leaderboard data with age band and position filters.
 */
export function useLeaderboard(data: LeaderboardData) {
  const [ageBand, setAgeBand] = useState(data.ageBand ?? '');
  const [position, setPosition] = useState('');

  const filteredRows = useMemo(
    () => filterLeaderboardRows(data.rows, ageBand, position),
    [data.rows, ageBand, position]
  );

  return {
    data,
    ageBand,
    setAgeBand,
    position,
    setPosition,
    filteredRows,
    rows: data.rows,
  };
}
