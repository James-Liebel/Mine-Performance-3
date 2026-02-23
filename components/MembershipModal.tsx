'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Membership, MembershipOption } from '@/lib/memberships';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export interface MembershipModalProps {
  membership: Membership;
  selectedOption: MembershipOption | null;
  onSelectOption: (option: MembershipOption) => void;
  onClose: () => void;
  isLoggedIn?: boolean;
  loginCallbackUrl?: string;
}

export function MembershipModal({
  membership,
  selectedOption,
  onSelectOption,
  onClose,
  isLoggedIn = false,
  loginCallbackUrl = '/member-registration',
}: MembershipModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const contactHref =
    selectedOption
      ? `/contact?membership=${encodeURIComponent(membership.id)}&days=${selectedOption.daysPerWeek}`
      : '/contact';

  const stripeLink =
    selectedOption?.stripePaymentLink?.trim() ||
    membership.stripePaymentLink?.trim() ||
    '';

  const hasStripeLink = !!stripeLink;
  const canProceedToStripe = hasStripeLink && !!selectedOption;
  const loginHref = `/login?callbackUrl=${encodeURIComponent(loginCallbackUrl)}`;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowConfirm(false);
      onClose();
    }
  };

  const handleContinueToCheckout = () => {
    if (!canProceedToStripe || !isLoggedIn) return;
    setShowConfirm(true);
  };

  const handleConfirmStripe = () => {
    if (stripeLink) {
      window.open(stripeLink, '_blank', 'noopener,noreferrer');
      setShowConfirm(false);
      onClose();
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal card">
        <header className="modal-header">
          <h2>{membership.name}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close"
            onClick={() => { setShowConfirm(false); onClose(); }}
          >
            ✕
          </button>
        </header>
        <div className="modal-body">
          <p className="modal-step-title">1. Select days per week</p>
          <p className="text-muted" style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            Memberships are {membership.billingLabel}. Pick your option below.
          </p>
          <div className="option-list" role="radiogroup" aria-label="Days per week">
            {membership.options.map((option) => (
              <label key={option.id} className="option-row">
                <input
                  type="radio"
                  name="membership-days"
                  value={option.daysPerWeek}
                  checked={selectedOption?.daysPerWeek === option.daysPerWeek}
                  onChange={() => onSelectOption(option)}
                />
                <span className="option-main">
                  <span className="option-label">{option.label}</span>
                  <span className="option-price">
                    {formatPrice(option.priceCents)}{' '}
                    <span className="text-muted">
                      ({membership.billingLabel})
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>

          <p className="modal-step-title">2. Pay</p>
          {selectedOption ? (
            <p className="summary" style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <strong>{selectedOption.label}</strong> — {formatPrice(selectedOption.priceCents)} {membership.billingLabel}.
            </p>
          ) : (
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: 0, marginBottom: '0.5rem' }}>
              Select an option above to see price and pay.
            </p>
          )}
          {!isLoggedIn && (
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              You must be signed in to purchase. <Link href={loginHref} className="link">Sign in</Link> to continue.
            </p>
          )}
        </div>
        <footer className="modal-footer">
          {showConfirm ? (
            <>
              <div className="modal-confirm-summary" style={{ width: '100%', marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--surface-elevated)', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                <strong>Confirm purchase</strong>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>
                  {membership.name} — {selectedOption?.label ?? ''} — {selectedOption ? formatPrice(selectedOption.priceCents) : ''} {membership.billingLabel}. You&apos;ll be taken to Stripe to complete payment.
                </p>
              </div>
              <button type="button" className="btn btn-primary" onClick={handleConfirmStripe}>
                Continue to Stripe
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleCancelConfirm}>
                Back
              </button>
            </>
          ) : (
            <>
              {!isLoggedIn ? (
                <Link href={loginHref} className="btn btn-primary">
                  Sign in to continue
                </Link>
              ) : hasStripeLink ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!selectedOption}
                  onClick={handleContinueToCheckout}
                  title={!selectedOption ? 'Select days per week above first' : undefined}
                >
                  {selectedOption ? 'Continue to checkout' : 'Select days per week first'}
                </button>
              ) : (
                <Link href={contactHref} className="btn btn-primary">
                  Continue to contact
                </Link>
              )}
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Close
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
