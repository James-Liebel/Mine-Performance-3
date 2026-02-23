'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPlanById } from '@/lib/plans';
import { getMembershipById } from '@/lib/memberships';

export function BookingBanner() {
  const searchParams = useSearchParams();
  const bookEventId = searchParams.get('book');
  const planId = searchParams.get('plan');
  const purchaseSingle = searchParams.get('purchase') === 'single';
  const membershipId = searchParams.get('membership');
  const membershipDays = searchParams.get('days');

  if (membershipId) {
    const membership = getMembershipById(membershipId);
    const days = membershipDays ? parseInt(membershipDays, 10) : undefined;
    const option =
      membership && days
        ? membership.options.find((opt) => opt.daysPerWeek === days)
        : undefined;

    const label =
      option && membership
        ? `${option.label} (${membership.billingLabel}).`
        : 'a membership (billed every 4 weeks).';

    return (
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'var(--surface-elevated)',
          borderColor: 'var(--accent)',
        }}
      >
        <strong>Membership: {membership?.name ?? membershipId}</strong>
        <p
          style={{
            margin: '0.25rem 0 0',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          You selected {label} Send your message below and we&apos;ll get you
          set up.
        </p>
      </div>
    );
  }

  if (planId) {
    const plan = getPlanById(planId as 'basic' | 'premium' | 'unlimited');
    return (
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'var(--surface-elevated)',
          borderColor: 'var(--accent)',
        }}
      >
        <strong>Plan: {plan?.name ?? planId}</strong>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          You chose to purchase {plan?.credits ?? 0} credits. Send your message below and we&apos;ll get you set up.
        </p>
      </div>
    );
  }

  if (purchaseSingle) {
    return (
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'var(--surface-elevated)',
          borderColor: 'var(--accent)',
        }}
      >
        <strong>Purchase 1 session</strong>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          You chose to buy a single session. Send your message below and we&apos;ll confirm.
        </p>
      </div>
    );
  }

  if (!bookEventId) return null;

  return (
    <div
      className="card"
      style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--surface-elevated)',
        borderColor: 'var(--accent)',
      }}
    >
      <strong>Event booking request</strong>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        You selected an event to book (ID: {bookEventId}). Send your message below and we&apos;ll confirm your spot.
      </p>
    </div>
  );
}
