'use client';

import type { Membership } from '@/lib/memberships';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function getDirectStripeLink(m: Membership): string | null {
  const planLink = m.stripePaymentLink?.trim();
  if (planLink) return planLink;
  if (m.options.length === 1 && m.options[0].stripePaymentLink?.trim()) {
    return m.options[0].stripePaymentLink?.trim() ?? null;
  }
  return null;
}

export interface TrainingOptionsGridProps {
  memberships: Membership[];
  onSelect: (membership: Membership) => void;
  /** When false, "Buy now" is hidden so users must sign in and choose plan (days) first. */
  isLoggedIn?: boolean;
}

export function TrainingOptionsGrid({ memberships, onSelect, isLoggedIn = false }: TrainingOptionsGridProps) {
  return (
    <div className="training-options-grid">
      {memberships.map((m) => {
        const directStripeLink = getDirectStripeLink(m);
        const showBuyNow = isLoggedIn && directStripeLink;
        return (
          <article key={m.id} id={`membership-${m.id}`} className="training-option-card card card-elevated">
            <div className="training-option-header">
              <h3>{m.name}</h3>
              <span className={`training-option-badge training-option-badge--${m.category}`}>
                {m.category === 'adult' ? 'Adult' : m.category === 'youth' ? 'Youth' : 'Remote'}
              </span>
            </div>
            {(m.description || m.daysAvailable?.length || m.timesAvailable) && (
              <p className="training-option-schedule text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {m.description && <span style={{ display: 'block', marginBottom: '0.25rem' }}>{m.description}</span>}
                {(m.daysAvailable?.length || m.timesAvailable) && (
                  <span>
                    {m.daysAvailable?.length ? m.daysAvailable.join(', ') : ''}
                    {m.daysAvailable?.length && m.timesAvailable ? ' · ' : ''}
                    {m.timesAvailable ?? ''}
                  </span>
                )}
              </p>
            )}
            <div className="training-option-prices">
              {m.options.map((opt) => (
                <div key={opt.id} className="training-option-row">
                  <span className="training-option-days">{opt.label}</span>
                  <span className="training-option-amount">{formatPrice(opt.priceCents)}</span>
                </div>
              ))}
            </div>
            <p className="training-option-billing">{m.billingLabel}</p>
            <div className="training-option-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary training-option-cta"
                onClick={() => onSelect(m)}
              >
                Choose plan
              </button>
              {showBuyNow && (
                <a
                  href={directStripeLink ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Buy now
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
