/**
 * Simple placeholder plans used only for the contact BookingBanner demo.
 * The main membership flows live in the dedicated member-registration page.
 */

export type PlanId = 'basic' | 'premium' | 'unlimited';

export interface Plan {
  id: PlanId;
  name: string;
  credits: number;
  priceCents: number;
  priceLabel: string;
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    credits: 4,
    priceCents: 4900,
    priceLabel: '$49 (4 credits)',
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 12,
    priceCents: 12900,
    priceLabel: '$129 (12 credits)',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    credits: 999,
    priceCents: 24900,
    priceLabel: '$249 (unlimited)',
  },
];

export const SINGLE_SESSION = {
  credits: 1,
  priceCents: 1999,
  priceLabel: '$19.99',
  label: 'Single session',
  description: 'Book one session without a plan.',
};

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

