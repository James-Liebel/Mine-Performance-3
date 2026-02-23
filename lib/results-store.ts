/**
 * Store for college commits and player endorsements.
 * Persisted to data/persisted/results.json when the filesystem is writable.
 */

import { loadJSON, saveJSON } from './persist';

export type CommitDivision = 'd1' | 'd2' | 'd3' | 'juco_naia';

export interface CollegeCommit {
  id: string;
  athleteName: string;
  college: string;
  /** D1, D2, D3, or JUCO/NAIA */
  division?: CommitDivision;
  year?: string;
  position?: string;
  /** Optional URL to college logo, mascot, or similar image */
  imageUrl?: string;
}

export interface Endorsement {
  id: string;
  quote: string;
  athleteName: string;
  college?: string;
}

const COLLEGE_COMMITS_SEED: CollegeCommit[] = [
  { id: 'commit-1', athleteName: 'Sample Athlete', college: 'University of Kentucky', division: 'd1', year: '2024', position: 'RHP' },
  { id: 'commit-2', athleteName: 'Jake Mitchell', college: 'Louisville', division: 'd1', year: '2025', position: 'RHP' },
  { id: 'commit-3', athleteName: 'Tyler Barnes', college: 'Vanderbilt', division: 'd1', year: '2024', position: 'OF' },
  { id: 'commit-4', athleteName: 'Carson Webb', college: 'Tennessee', division: 'd1', year: '2025', position: 'SS' },
  { id: 'commit-5', athleteName: 'Blake Cooper', college: 'Ohio State', division: 'd1', year: '2024', position: 'LHP' },
  { id: 'commit-6', athleteName: 'Drew Harris', college: 'Indiana', division: 'd1', year: '2025', position: 'C' },
  { id: 'commit-7', athleteName: 'Ryan Foster', college: 'Northern Kentucky', division: 'd2', year: '2024', position: 'RHP' },
  { id: 'commit-8', athleteName: 'Mason Reed', college: 'Bellarmine', division: 'd2', year: '2025', position: '3B' },
  { id: 'commit-9', athleteName: 'Cole Phillips', college: 'Southern Indiana', division: 'd2', year: '2024', position: 'OF' },
  { id: 'commit-10', athleteName: 'Luke Daniels', college: 'Drury', division: 'd2', year: '2025', position: 'RHP' },
  { id: 'commit-11', athleteName: 'Ethan Walsh', college: 'Kentucky Wesleyan', division: 'd2', year: '2024', position: '1B' },
  { id: 'commit-12', athleteName: 'Nate Brooks', college: 'Trevecca Nazarene', division: 'd2', year: '2025', position: '2B' },
  { id: 'commit-13', athleteName: 'Owen Clark', college: 'Transylvania', division: 'd3', year: '2024', position: 'RHP' },
  { id: 'commit-14', athleteName: 'Grant Hill', college: 'Centre College', division: 'd3', year: '2025', position: 'SS' },
  { id: 'commit-15', athleteName: 'Ben Stewart', college: 'DePauw', division: 'd3', year: '2024', position: 'C' },
  { id: 'commit-16', athleteName: 'Jack Murphy', college: 'Wabash', division: 'd3', year: '2025', position: 'OF' },
  { id: 'commit-17', athleteName: 'Sam Davis', college: 'Hanover', division: 'd3', year: '2024', position: 'LHP' },
  { id: 'commit-18', athleteName: 'Will Turner', college: 'Johns Hopkins', division: 'd3', year: '2025', position: '3B' },
  { id: 'commit-19', athleteName: 'Bryce Adams', college: 'Wabash Valley College', division: 'juco_naia', year: '2024', position: 'RHP' },
  { id: 'commit-20', athleteName: 'Chase Miller', college: 'John A. Logan College', division: 'juco_naia', year: '2025', position: 'OF' },
  { id: 'commit-21', athleteName: 'Parker Jones', college: 'Vincennes University', division: 'juco_naia', year: '2024', position: 'C' },
  { id: 'commit-22', athleteName: 'Dylan Scott', college: 'Lindsey Wilson (NAIA)', division: 'juco_naia', year: '2025', position: 'SS' },
  { id: 'commit-23', athleteName: 'Kyle Bennett', college: 'Georgetown College (NAIA)', division: 'juco_naia', year: '2024', position: 'RHP' },
  { id: 'commit-24', athleteName: 'Austin Reed', college: 'Cumberland (NAIA)', division: 'juco_naia', year: '2025', position: '1B' },
];

const ENDORSEMENTS_SEED: Endorsement[] = [
  { id: 'endorsement-1', quote: 'The training and coaching here helped me get to the next level.', athleteName: 'Sample Athlete', college: 'University of Kentucky' },
];

type Persisted = {
  collegeCommits: CollegeCommit[];
  endorsements: Endorsement[];
  commitIdCounter: number;
  endorsementIdCounter: number;
};

const loaded = loadJSON<Persisted>('results.json');
let commitIdCounter = loaded?.commitIdCounter ?? 1;
let endorsementIdCounter = loaded?.endorsementIdCounter ?? 1;

function nextCommitId(): string {
  return `commit-${++commitIdCounter}`;
}
function nextEndorsementId(): string {
  return `endorsement-${++endorsementIdCounter}`;
}

let collegeCommits: CollegeCommit[] = loaded?.collegeCommits ?? [...COLLEGE_COMMITS_SEED];
let endorsements: Endorsement[] = loaded?.endorsements ?? [...ENDORSEMENTS_SEED];

function persist(): void {
  saveJSON('results.json', {
    collegeCommits,
    endorsements,
    commitIdCounter,
    endorsementIdCounter,
  });
}

export function getCollegeCommits(): CollegeCommit[] {
  return collegeCommits.map((c) => ({
    ...c,
    division: c.division && VALID_DIVISIONS.includes(c.division) ? c.division : 'd1',
  }));
}

const VALID_DIVISIONS: CollegeCommit['division'][] = ['d1', 'd2', 'd3', 'juco_naia'];

export function addCollegeCommit(input: Omit<CollegeCommit, 'id'>): CollegeCommit {
  const division = input.division && VALID_DIVISIONS.includes(input.division) ? input.division : 'd1';
  const c: CollegeCommit = {
    id: nextCommitId(),
    athleteName: (input.athleteName || '').trim() || 'Athlete',
    college: (input.college || '').trim() || '',
    division,
    year: input.year?.trim(),
    position: input.position?.trim(),
    imageUrl: typeof input.imageUrl === 'string' && input.imageUrl.trim() ? input.imageUrl.trim() : undefined,
  };
  collegeCommits.push(c);
  persist();
  return c;
}

export function updateCollegeCommit(id: string, patch: Partial<Omit<CollegeCommit, 'id'>>): CollegeCommit | null {
  const i = collegeCommits.findIndex((c) => c.id === id);
  if (i === -1) return null;
  if (patch.athleteName !== undefined) collegeCommits[i].athleteName = (patch.athleteName || '').trim() || collegeCommits[i].athleteName;
  if (patch.college !== undefined) collegeCommits[i].college = (patch.college || '').trim();
  if (patch.division !== undefined) collegeCommits[i].division = VALID_DIVISIONS.includes(patch.division) ? patch.division : collegeCommits[i].division;
  if (patch.year !== undefined) collegeCommits[i].year = patch.year?.trim();
  if (patch.position !== undefined) collegeCommits[i].position = patch.position?.trim();
  if (patch.imageUrl !== undefined) collegeCommits[i].imageUrl = typeof patch.imageUrl === 'string' && patch.imageUrl.trim() ? patch.imageUrl.trim() : undefined;
  persist();
  return collegeCommits[i];
}

export function removeCollegeCommit(id: string): boolean {
  const i = collegeCommits.findIndex((c) => c.id === id);
  if (i === -1) return false;
  collegeCommits.splice(i, 1);
  persist();
  return true;
}

export function getEndorsements(): Endorsement[] {
  return [...endorsements];
}

export function addEndorsement(input: Omit<Endorsement, 'id'>): Endorsement {
  const e: Endorsement = {
    id: nextEndorsementId(),
    quote: (input.quote || '').trim() || '',
    athleteName: (input.athleteName || '').trim() || '',
    college: input.college?.trim(),
  };
  endorsements.push(e);
  persist();
  return e;
}

export function updateEndorsement(id: string, patch: Partial<Omit<Endorsement, 'id'>>): Endorsement | null {
  const i = endorsements.findIndex((e) => e.id === id);
  if (i === -1) return null;
  if (patch.quote !== undefined) endorsements[i].quote = (patch.quote || '').trim();
  if (patch.athleteName !== undefined) endorsements[i].athleteName = (patch.athleteName || '').trim();
  if (patch.college !== undefined) endorsements[i].college = patch.college?.trim();
  persist();
  return endorsements[i];
}

export function removeEndorsement(id: string): boolean {
  const i = endorsements.findIndex((e) => e.id === id);
  if (i === -1) return false;
  endorsements.splice(i, 1);
  persist();
  return true;
}
