export type MembershipCategory = 'adult' | 'youth' | 'remote';

export interface MembershipOption {
  id: string;
  label: string;
  daysPerWeek: number;
  priceCents: number;
  /** Stripe Payment Link URL for this option (e.g. https://buy.stripe.com/...). When set, "Choose plan" goes here instead of contact. */
  stripePaymentLink?: string;
}

export interface Membership {
  id: string;
  name: string;
  category: MembershipCategory;
  basePrice2Day: number;
  billingLabel: 'billed every 4 weeks';
  options: MembershipOption[];
  /** Stripe Payment Link URL for this plan (used when no option-specific link is set). */
  stripePaymentLink?: string;
  /** Short description of what the membership includes */
  description?: string;
  /** Days of the week this option is available (e.g. Mon, Wed, Fri) */
  daysAvailable?: string[];
  /** Time range when sessions are available (e.g. "5:00 pm – 7:00 pm") */
  timesAvailable?: string;
}

function dollarsToCents(value: number): number {
  return Math.round(value * 100);
}

function buildOptions(
  basePrice2Day: number,
  daysConfig: 1 | 2 | 3
): MembershipOption[] {
  const base = basePrice2Day;
  const oneDay = base - 100;
  const twoDay = base;
  const threeDay = base + 100;

  const opts: MembershipOption[] = [];

  if (daysConfig === 2 || daysConfig === 3) {
    opts.push({
      id: '1-day',
      label: '1 day per week',
      daysPerWeek: 1,
      priceCents: dollarsToCents(oneDay),
    });
    opts.push({
      id: '2-day',
      label: '2 days per week',
      daysPerWeek: 2,
      priceCents: dollarsToCents(twoDay),
    });
    if (daysConfig === 3) {
      opts.push({
        id: '3-day',
        label: '3 days per week',
        daysPerWeek: 3,
        priceCents: dollarsToCents(threeDay),
      });
    }
  } else {
    opts.push({
      id: '2-day',
      label: '2 days per week',
      daysPerWeek: 2,
      priceCents: dollarsToCents(twoDay),
    });
  }

  return opts;
}

export const MEMBERSHIPS: Membership[] = [
  {
    id: 'spt-pitching',
    name: 'Strength + Pitching',
    category: 'adult',
    basePrice2Day: 399,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(399, 3),
    description: 'Combined strength training and pitching development.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '5:00 pm – 7:00 pm',
  },
  {
    id: 'spt-hitting',
    name: 'Strength + Hitting',
    category: 'adult',
    basePrice2Day: 399,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(399, 3),
    description: 'Strength work and hitting instruction in one plan.',
    daysAvailable: ['Tue', 'Thu', 'Sat'],
    timesAvailable: '6:00 pm – 8:00 pm',
  },
  {
    id: 'spt',
    name: 'Strength',
    category: 'adult',
    basePrice2Day: 299,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(299, 3),
    description: 'Weight room and athletic development only.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '5:00 pm – 7:00 pm',
  },
  {
    id: 'hitting',
    name: 'Hitting',
    category: 'adult',
    basePrice2Day: 349,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(349, 3),
    description: 'Cage work, exit velocity, and approach refinement.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '5:00 pm – 7:00 pm',
  },
  {
    id: 'pitching',
    name: 'Pitching',
    category: 'adult',
    basePrice2Day: 349,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(349, 3),
    description: 'Velocity development, mechanics, and arm care.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '5:00 pm – 7:00 pm',
  },
  {
    id: 'catching',
    name: 'Catching',
    category: 'adult',
    basePrice2Day: 349,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(349, 2),
    description: 'Receiving, blocking, and game-calling development.',
    daysAvailable: ['Tue', 'Thu'],
    timesAvailable: '6:00 pm – 8:00 pm',
  },
  {
    id: 'arm-care-development',
    name: 'Arm Care & Development',
    category: 'adult',
    basePrice2Day: 299,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(299, 2),
    description: 'Return-to-throw and injury prevention protocols.',
    daysAvailable: ['Mon', 'Wed'],
    timesAvailable: '5:00 pm – 6:30 pm',
  },
  {
    id: 'hitting-arm-care-spt',
    name: 'Hitting / Arm Care / Strength',
    category: 'adult',
    basePrice2Day: 449,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(449, 3),
    description: 'Full mix of hitting, arm care, and strength.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '5:00 pm – 7:30 pm',
  },
  {
    id: 'hitting-pitching',
    name: 'Hitting + Pitching',
    category: 'adult',
    basePrice2Day: 399,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(399, 3),
    description: 'Dual focus on hitting and pitching development.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '5:00 pm – 7:00 pm',
  },
  {
    id: 'hitting-pitching-spt',
    name: 'Hitting / Pitching / Strength',
    category: 'adult',
    basePrice2Day: 449,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(449, 3),
    description: 'Complete training: hitting, pitching, and strength.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '5:00 pm – 7:30 pm',
  },
  {
    id: 'fielding-spt',
    name: 'Fielding and Strength',
    category: 'adult',
    basePrice2Day: 349,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(349, 2),
    description: 'Infield/outfield work plus weight room.',
    daysAvailable: ['Tue', 'Thu'],
    timesAvailable: '6:00 pm – 8:00 pm',
  },
  {
    id: 'youth-hitting-membership',
    name: 'Youth Hitting Membership',
    category: 'youth',
    basePrice2Day: 240,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(240, 2),
    description: 'Age-appropriate hitting and cage work.',
    daysAvailable: ['Tue', 'Thu'],
    timesAvailable: '4:00 pm – 6:00 pm',
  },
  {
    id: 'youth-hitting-pitching',
    name: 'Youth Hitting + Pitching',
    category: 'youth',
    basePrice2Day: 320,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(320, 2),
    description: 'Youth hitting and pitching combined.',
    daysAvailable: ['Mon', 'Wed', 'Fri'],
    timesAvailable: '4:00 pm – 6:00 pm',
  },
  {
    id: 'youth-hitting-spt',
    name: 'Youth Hitting + SPT Membership',
    category: 'youth',
    basePrice2Day: 320,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(320, 2),
    description: 'Hitting and strength for youth athletes.',
    daysAvailable: ['Tue', 'Thu'],
    timesAvailable: '4:00 pm – 6:00 pm',
  },
  {
    id: 'youth-pitching',
    name: 'Youth Pitching',
    category: 'youth',
    basePrice2Day: 320,
    billingLabel: 'billed every 4 weeks',
    options: buildOptions(320, 2),
    description: 'Pitching development for youth.',
    daysAvailable: ['Mon', 'Wed'],
    timesAvailable: '4:00 pm – 5:30 pm',
  },
  {
    id: 'remote-pitching-training',
    name: 'Remote Pitching Training',
    category: 'remote',
    basePrice2Day: 250,
    billingLabel: 'billed every 4 weeks',
    options: [
      {
        id: 'remote-2-day',
        label: 'Remote program (2 days per week suggested)',
        daysPerWeek: 2,
        priceCents: dollarsToCents(250),
      },
    ],
    description: 'Video-based pitching program with coach check-ins.',
    daysAvailable: ['Flexible'],
    timesAvailable: 'By appointment',
  },
];

export function getMembershipById(id: string): Membership | undefined {
  return MEMBERSHIPS.find((m) => m.id === id);
}

export function getMembershipOptions(id: string): MembershipOption[] {
  const membership = getMembershipById(id);
  return membership?.options ?? [];
}

