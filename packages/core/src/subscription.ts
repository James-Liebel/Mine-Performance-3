/**
 * Subscription tiers for event access.
 */

import type { SubscriptionTier } from './types';

export { type SubscriptionTier } from './types';

export const SUBSCRIPTION_ORDER: SubscriptionTier[] = ['basic', 'premium', 'all'];

export function canBookEvent(
  userTier: SubscriptionTier,
  eventTier: string
): boolean {
  if (userTier === 'all') return true;
  if (eventTier === 'All' || eventTier === 'all') return true;
  if (
    userTier === 'premium' &&
    (eventTier === 'basic' || eventTier === 'premium')
  )
    return true;
  if (userTier === 'basic' && eventTier === 'basic') return true;
  return false;
}

export function tierLabel(tier: SubscriptionTier): string {
  return tier === 'all'
    ? 'All programs'
    : tier === 'premium'
      ? 'Premium'
      : 'Basic';
}
