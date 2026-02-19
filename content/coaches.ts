/**
 * Coach/trainer bios. Replace placeholders with real copy from client.
 * Source: run scripts/extract-trainers.ts if StatStak exposes data; otherwise client-supplied.
 */

export interface CoachBio {
  id: string;
  name: string;
  role: string;
  /** Specialty for filter pills (e.g. Pitching, Hitting, S&C, Rehab). */
  specialties: string[];
  credentials: string[];
  bio: string;
  image?: string;
}

export const coaches: CoachBio[] = [
  {
    id: '1',
    name: 'Coach Name',
    role: 'Lead Performance',
    specialties: ['Strength & Conditioning', 'Performance'],
    credentials: ['CSCS', 'CPT', 'Rehab & Return-to-Sport'],
    bio: 'Short bio: background in sport science and athlete development. Focus on assessment-driven programming and long-term durability. Replace with client-provided copy.',
    image: undefined,
  },
  {
    id: '2',
    name: 'Coach Name Two',
    role: 'Rehab & Return-to-Throw',
    specialties: ['Rehab', 'Return-to-Throw'],
    credentials: ['PT', 'Strength & Conditioning'],
    bio: 'Short bio: experience in return-to-throw progressions and working with throwing athletes. Replace with client-provided copy.',
    image: undefined,
  },
];

/** All unique specialties for filter UI. */
export const allSpecialties = Array.from(new Set(coaches.flatMap((c) => c.specialties))).sort();
