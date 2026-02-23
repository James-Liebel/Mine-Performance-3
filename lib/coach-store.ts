/**
 * Store for coaches (name, title, specialty, bio, image).
 * Persisted to data/persisted/coaches.json when the filesystem is writable.
 */

import { loadJSON, saveJSON } from './persist';

export interface StoredCoach {
  id: string;
  name: string;
  specialty: string;
  title: string;
  bio: string;
  image: string | null;
}

/** Coach photos (public/images/framer). Mapped from user-provided order 1–6. See docs/FRAMER-IMAGES.md */
const COACH_IMAGES = {
  ryanConover: '/images/framer/ryan-conover.png',   // 1: B&W smiling portrait, LEGENS patch, MP/859
  nickGooden: '/images/framer/C3E3RGERq5NtgSHWQs8junnJdY.jpg',      // 2: blue batting action
  bradenPickett: '/images/framer/XtGHwN6UHu8ylsn1vKRdEiow7bk.jpg',   // 3: two men, right in hoodie gesturing
  travisClark: '/images/framer/03VcVuj0McxrYx2zQKknN5frQtY.jpg',     // 4: arms crossed, MP cap, peach logo
  marcCarney: '/images/framer/marc-carney.png',     // 5: nighttime, red cap, Bearcats C, hand raised
  gavinSunderman: '/images/framer/5F37VUJm0pC8Ukd9wgesLMQcTR4.jpg',  // 6: tan cap, Nike
};

const SEED: StoredCoach[] = [
  { id: '1', name: 'Ryan Conover', specialty: 'Leadership', title: 'Founder & CEO', bio: 'Founder and CEO of Mine Performance Academy — leading the vision, culture, and development of the facility. He focuses on creating a high-level training environment built on modern performance methods, technology, and long term athlete development.', image: COACH_IMAGES.ryanConover },
  { id: '2', name: 'Nick Gooden', specialty: 'Hitting Power', title: 'Hitting Coach', bio: 'Former Division 1 player at Morehead State with six years of collegiate experience. Gold Glove Award winner in 2024. Specializes in developing the physical and mental aspects of hitting and defense. Focused on helping athletes maximize their abilities and compete at a high level.', image: COACH_IMAGES.nickGooden },
  { id: '3', name: 'Braden Pickett', specialty: 'Rehab', title: 'Rehab & Arm Care Coach', bio: 'Former collegiate athlete at Iowa Western and San Jacinto. Overcame injuries and rehab challenges, building resilience and a strong commitment to excellence. Focuses on helping athletes reach their full physical, mental, and emotional potential through structured development.', image: COACH_IMAGES.bradenPickett },
  { id: '4', name: 'Travis Clark', specialty: 'Pitching Velo', title: 'Pitching Coach', bio: 'Pitching coach with 8 years of experience. Has trained more than 500 pitchers and specializes in velocity development, rehab, and pitch design. Rehabilitated over 70 UCL and labrum injuries and helped 35 athletes commit to college programs in the past 24 months. Focuses on efficient movement patterns and advanced pitch sequencing.', image: COACH_IMAGES.travisClark },
  { id: '5', name: 'Marc Carney', specialty: 'Strength', title: 'Strength Coach', bio: 'Former collegiate player with experience at Central Michigan University and the University of Cincinnati. Brings a strong background in baseball, overcoming challenges such as injuries and mental barriers. Dedicated to helping athletes excel physically, mentally, and strategically on the field.', image: COACH_IMAGES.marcCarney },
  { id: '6', name: 'Gavin Sunderman', specialty: 'Pitching Velo', title: 'Pitching Coach', bio: 'Former pitcher at Wabash Valley College whose career was cut short due to arm injuries. Brings 5 years of coaching experience and firsthand understanding of throwing development, injury prevention, and long term arm health. Focuses on building strong physical and mental foundations for throwers.', image: COACH_IMAGES.gavinSunderman },
];

const loaded = loadJSON<{ coaches: StoredCoach[]; nextId: number }>('coaches.json');
let store: StoredCoach[] = loaded?.coaches ? loaded.coaches : SEED.map((c) => ({ ...c }));
let idCounter = loaded?.nextId ?? 100;

function nextId(): string {
  return String(++idCounter);
}

function persist(): void {
  saveJSON('coaches.json', { coaches: store, nextId: idCounter });
}

export function getCoaches(): StoredCoach[] {
  return [...store];
}

export function getCoachById(id: string): StoredCoach | undefined {
  return store.find((c) => c.id === id);
}

export function addCoach(input: Omit<StoredCoach, 'id'>): StoredCoach {
  const coach: StoredCoach = {
    id: nextId(),
    name: input.name.trim() || 'New Coach',
    specialty: input.specialty.trim() || '',
    title: input.title.trim() || '',
    bio: input.bio.trim() || '',
    image: typeof input.image === 'string' && input.image.trim() ? input.image.trim() : null,
  };
  store.push(coach);
  persist();
  return coach;
}

export function updateCoach(id: string, patch: Partial<Omit<StoredCoach, 'id'>>): StoredCoach | null {
  const i = store.findIndex((c) => c.id === id);
  if (i === -1) return null;
  if (typeof patch.name === 'string' && patch.name.trim()) store[i].name = patch.name.trim();
  if (typeof patch.specialty === 'string') store[i].specialty = patch.specialty.trim();
  if (typeof patch.title === 'string') store[i].title = patch.title.trim();
  if (typeof patch.bio === 'string') store[i].bio = patch.bio.trim();
  if (patch.image !== undefined) store[i].image = typeof patch.image === 'string' && patch.image.trim() ? patch.image.trim() : null;
  persist();
  return store[i];
}

export function removeCoach(id: string): boolean {
  const i = store.findIndex((c) => c.id === id);
  if (i === -1) return false;
  store.splice(i, 1);
  persist();
  return true;
}
