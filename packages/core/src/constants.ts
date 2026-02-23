/**
 * Shared constants for filters, age bands, programs, and config.
 */

import type { Program } from './types';

export const MOCK_DATA_LABEL = 'Demo data — sample athletes shown';
export const SITE_NAME = 'Mine Performance Academy';
export const SPT_LABEL = 'SPT';
export const SPT_FULL = 'Sports Performance Training';
export const SPT_DESCRIPTION =
  'Strength, movement, and conditioning — the foundation that supports pitching, hitting, and recovery.';
export const SITE_PHONE = '(513) 384-3840';
export const SITE_EMAIL = 'Ryan@mineperformanceacademy.com';
export const SITE_ADDRESS = '4999 Houston Rd Suite 500-2, Florence, KY 41042';
export const SITE_HOURS = [
  'Monday – Friday: 8 am – 9 pm',
  'Saturday – Sunday: 10 am – 8 pm',
];

export const AGE_BANDS: { value: string; label: string }[] = [
  { value: '', label: 'All ages' },
  { value: '12U', label: '12U' },
  { value: '14U', label: '14U' },
  { value: '16U', label: '16U' },
  { value: '18U', label: '18U' },
];

export const DEFAULT_POSITIONS: { value: string; label: string }[] = [
  { value: '', label: 'All positions' },
  { value: 'RHP', label: 'RHP' },
  { value: 'LHP', label: 'LHP' },
  { value: 'OF', label: 'OF' },
  { value: 'IF', label: 'IF' },
  { value: 'C', label: 'C' },
];

export const DEFAULT_SPECIALTIES: { value: string; label: string }[] = [
  { value: '', label: 'All specialties' },
  { value: 'Pitching Velo', label: 'Pitching Velo' },
  { value: 'Pitch Design', label: 'Pitch Design' },
  { value: 'Rehab', label: 'Rehab' },
  { value: 'Hitting Power', label: 'Hitting Power' },
  { value: 'Strength', label: 'Strength' },
];

export const PROGRAMS: Program[] = [
  {
    id: 'pitching-velo',
    name: 'Pitching Velo',
    desc:
      'Velocity development, efficient mechanics, and arm care. Structured assessments and measurable progress — tracked by radar and coach evaluation.',
    coach: 'Travis Clark & Gavin Sunderman',
  },
  {
    id: 'pitch-design',
    name: 'Pitch Design',
    desc:
      'Breaking ball development, spin axis optimization, and pitch sequencing. Data-backed movement design to build a complete arsenal.',
    coach: 'Travis Clark',
  },
  {
    id: 'rehab',
    name: 'Rehab & Arm Care',
    desc:
      'Return-to-throw programs and injury prevention. Safe, progressive protocols to get back to full intensity with confidence.',
    coach: 'Braden Pickett',
  },
  {
    id: 'hitting-power',
    name: 'Hitting Power',
    desc:
      'Exit velocity, barrel accuracy, and approach refinement. Cage work and live reps with measurable gains over time.',
    coach: 'Nick Gooden',
  },
  {
    id: 'strength',
    name: 'Strength & Conditioning',
    desc:
      'Athletic development built for baseball — speed, power, durability, and injury prevention in the weight room.',
    coach: 'Marc Carney',
  },
];

export const WIZARD_GOALS = [
  { id: 'velocity', label: 'Throw harder / Pitching velo' },
  { id: 'hitting', label: 'Hit for more power' },
  { id: 'rehab', label: 'Return from injury / Arm care' },
  { id: 'strength', label: 'Get stronger / Athletic development' },
  { id: 'general', label: 'Not sure yet — help me choose' },
];

export const WIZARD_AGE_BANDS = [
  { id: '10u', label: '10U and under' },
  { id: '12u', label: '12U' },
  { id: '14u', label: '14U' },
  { id: '16u', label: '16U' },
  { id: '18u', label: '18U / High school+' },
];

export const WIZARD_SCHEDULE = [
  { id: '1-2', label: '1–2 days per week' },
  { id: '3-4', label: '3–4 days per week' },
  { id: '5+', label: '5+ days (serious commitment)' },
];
