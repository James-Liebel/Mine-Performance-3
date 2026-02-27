'use client';

import Link from 'next/link';

const DEMO_STRIPE_MONTHS = [
  { month: 'Jan', revenue: 32000, payments: 180 },
  { month: 'Feb', revenue: 34000, payments: 190 },
  { month: 'Mar', revenue: 36500, payments: 205 },
  { month: 'Apr', revenue: 38000, payments: 210 },
  { month: 'May', revenue: 41000, payments: 225 },
  { month: 'Jun', revenue: 43000, payments: 235 },
  { month: 'Jul', revenue: 45000, payments: 245 },
  { month: 'Aug', revenue: 47000, payments: 255 },
];

function formatMoneyShort(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
}

export default function AdminStripePage() {
  const total = DEMO_STRIPE_MONTHS.reduce((sum, m) => sum + m.revenue, 0);
  const avg = total / DEMO_STRIPE_MONTHS.length;
  const best = DEMO_STRIPE_MONTHS.reduce(
    (max, m) => (m.revenue > max.revenue ? m : max),
    DEMO_STRIPE_MONTHS[0]
  );

  const tickMax = Math.max(...DEMO_STRIPE_MONTHS.map((m) => m.revenue), 1);

  return (
    <div className="container admin-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="admin-page-title" style={{ marginBottom: '0.5rem' }}>Stripe overview (demo)</h1>
      <p className="admin-page-desc text-muted" style={{ marginBottom: '1.5rem' }}>
        This page gives you a Stripe-style snapshot using demo data. For live payments, disputes, and exports,
        open your Stripe Dashboard.
      </p>

      <section className="card card-elevated admin-analytics-section admin-analytics-section--wide" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Revenue (demo)</h2>
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <div className="admin-metric-label">Total (last 8 months):</div>
            <div className="admin-metric-value">${total.toLocaleString()}</div>
          </div>
          <div>
            <div className="admin-metric-label">Avg / month:</div>
            <div className="admin-metric-value">
              ${Math.round(avg).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="admin-metric-label">Best month:</div>
            <div className="admin-metric-value">
              {best.month} · {formatMoneyShort(best.revenue)}
            </div>
          </div>
        </div>

        {/* Simple spark bar chart */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end',
            height: 140,
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border)',
            marginBottom: '0.5rem',
          }}
        >
          {DEMO_STRIPE_MONTHS.map((m) => {
            const ratio = m.revenue / tickMax;
            const h = 20 + ratio * 100;
            const isBest = m.month === best.month;
            return (
              <div
                key={m.month}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: 22,
                    borderRadius: '6px 6px 0 0',
                    background: isBest ? 'var(--accent)' : 'var(--accent-soft, #93c5fd)',
                    height: `${h}px`,
                  }}
                  title={`${m.month}: ${formatMoneyShort(m.revenue)} · ${m.payments} payments`}
                />
                <span style={{ whiteSpace: 'nowrap' }}>
                  {m.month}
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {formatMoneyShort(m.revenue)}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
          Demo data only. Actual payments and payouts appear in your Stripe Dashboard.
        </p>
      </section>

      <section className="card card-elevated admin-analytics-section">
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Stripe & credits</h2>
        <ul className="admin-metrics-list">
          <li>
            <span className="admin-metric-label">What you can see here:</span>{' '}
            <span className="admin-metric-value">
              demo revenue by month and an example payments summary. In the real app, successful Stripe purchases
              would be turned into credits for members (visible under each member&apos;s Payments and Credits tab).
            </span>
          </li>
          <li>
            <span className="admin-metric-label">For live data:</span>{' '}
            <span className="admin-metric-value">
              go to the Stripe Dashboard for real payments, refunds, disputes, and exports.
            </span>
          </li>
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <Link
            href="https://dashboard.stripe.com/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Open Stripe Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

