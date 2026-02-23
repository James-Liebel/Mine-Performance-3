export interface RentalRate {
  label: string;
  price: string;
}

export interface RentalResource {
  id: string;
  name: string;
  description: string;
  rates: RentalRate[];
  openHour: number;
  closeHour: number;
}

export const RENTAL_RESOURCES: RentalResource[] = [
  {
    id: 'hitting-lab-1',
    name: 'Hitting Lab 1',
    description: 'Dedicated hitting lab with HitTrax / data capture.',
    rates: [
      { label: '30 minutes', price: '$45' },
      { label: '60 minutes', price: '$65' },
    ],
    openHour: 6,
    closeHour: 23,
  },
  {
    id: 'hitting-lab-2',
    name: 'Hitting Lab 2',
    description: 'Secondary hitting lab with machines and tech support.',
    rates: [
      { label: '30 minutes', price: '$45' },
      { label: '60 minutes', price: '$65' },
    ],
    openHour: 6,
    closeHour: 23,
  },
  {
    id: 'turf',
    name: 'Turf',
    description: 'Open turf space for fielding work, throwing, and movement.',
    rates: [
      { label: '30 minutes', price: '$75' },
      { label: '60 minutes', price: '$125' },
    ],
    openHour: 6,
    closeHour: 23,
  },
  {
    id: 'cage-standard',
    name: 'Cage (no HitTrax or TrackMan)',
    description: 'Standard batting cage without HitTrax or TrackMan.',
    rates: [
      { label: '30 minutes', price: '$25' },
      { label: '60 minutes', price: '$45' },
    ],
    openHour: 6,
    closeHour: 23,
  },
  {
    id: 'pitching-lab',
    name: 'Pitching Lab',
    description: 'Dedicated pitching lab with mounds and tracking tech.',
    rates: [
      { label: '30 minutes', price: '$50' },
      { label: '60 minutes', price: '$75' },
    ],
    openHour: 6,
    closeHour: 23,
  },
];

export function getRentalResourceById(
  id: string
): RentalResource | undefined {
  return RENTAL_RESOURCES.find((r) => r.id === id);
}

