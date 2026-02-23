'use client';

/**
 * Explains how credits work and optionally shows balance.
 * Use on profile (with balance) and member-registration (how they work).
 */
export interface CreditsExplainerProps {
  /** Show "Your balance: N credits" when provided. Omit for public/registration page. */
  balance?: number | null;
  /** Compact layout (e.g. inline callout). */
  compact?: boolean;
  className?: string;
}

const HOW_CREDITS_WORK = [
  'Credits are used to book events and sessions (camps, clinics, training slots).',
  'Your membership may include a set number of credits per billing period.',
  'When you book an event that uses credits, the cost is deducted from your balance.',
  'You can see your balance in your profile and when booking.',
];

export function CreditsExplainer({ balance, compact = false, className = '' }: CreditsExplainerProps) {
  return (
    <section
      className={`credits-explainer ${compact ? 'credits-explainer--compact' : ''} ${className}`.trim()}
      aria-labelledby="credits-heading"
    >
      <h2 id="credits-heading" className="credits-explainer-heading">
        {balance !== undefined && balance !== null ? 'Your credits' : 'How credits work'}
      </h2>
      {balance !== undefined && balance !== null && (
        <div className="credits-balance">
          <span className="credits-balance-value">{balance}</span>
          <span className="credits-balance-label">credits available</span>
        </div>
      )}
      <ul className="credits-explainer-list">
        {HOW_CREDITS_WORK.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
