/**
 * Program offerings (training pathways). Used on the combined programs & memberships page.
 */
export const PROGRAMS = [
  {
    id: 'pitching-velo',
    name: 'Pitching Velo',
    desc: 'Velocity development, efficient mechanics, and arm care. Structured assessments and measurable progress — tracked by radar and coach evaluation.',
    coach: 'Travis Clark & Gavin Sunderman',
  },
  {
    id: 'pitch-design',
    name: 'Pitch Design',
    desc: 'Breaking ball development, spin axis optimization, and pitch sequencing. Data-backed movement design to build a complete arsenal.',
    coach: 'Travis Clark',
  },
  {
    id: 'rehab',
    name: 'Rehab & Arm Care',
    desc: 'Return-to-throw programs and injury prevention. Safe, progressive protocols to get back to full intensity with confidence.',
    coach: 'Braden Pickett',
  },
  {
    id: 'hitting-power',
    name: 'Hitting Power',
    desc: 'Exit velocity, barrel accuracy, and approach refinement. Cage work and live reps with measurable gains over time.',
    coach: 'Nick Gooden',
  },
  {
    id: 'strength',
    name: 'Strength & Conditioning',
    desc: 'Athletic development built for baseball — speed, power, durability, and injury prevention in the weight room.',
    coach: 'Marc Carney',
  },
] as const;
