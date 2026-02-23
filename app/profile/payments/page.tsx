'use client';

const DEMO_PAST_PAYMENTS = [
  { created: '2/16/26', event: '—', cost: '$266.55', refund: '—', description: 'Every 4 Weeks member registration payment for Pitching - 1 days for James Liebel' },
  { created: '2/15/26', event: '2/18/26', cost: '—', refund: '—', description: 'Pitching for James Liebel, on Feb 18, 2026' },
  { created: '1/19/26', event: '—', cost: '$266.55', refund: '—', description: 'Every 4 Weeks member registration payment for Pitching - 1 days' },
  { created: '1/18/26', event: '1/21/26', cost: '—', refund: '—', description: 'Pitching for James Liebel, on Jan 21, 2026' },
];

export default function ProfilePaymentsPage() {
  return (
    <div className="container profile-payments-page" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="profile-payments-layout">
        <section className="profile-payment-info card card-elevated">
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Payment info</h2>
          <div className="profile-balance-row">
            <span>Facility $</span>
            <strong>$0.00</strong>
          </div>
          <div className="profile-balance-row">
            <span>Credits</span>
            <strong>0</strong>
          </div>

          <div className="profile-card-section" style={{ marginTop: '1.5rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Update facility credit card
            </p>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span aria-hidden>💳</span> VISA 5795
            </p>
          </div>

          <div className="profile-registration-section" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Member registration</h3>
            <div className="profile-registration-card card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
              <span className="profile-badge profile-badge--active">Active</span>
              <p style={{ margin: '0.5rem 0 0', fontWeight: 600 }}>Pitching - 1 days</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Auto-payment of $266.55 in 25 days
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Credits will be added in 24.8 days
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Pause member registration
                </button>
                <button type="button" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Cancel member registration
                </button>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Canceled Pitching - 1 days (past)
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Canceled Pitching - 1 days (past)
            </p>
          </div>

          <div className="profile-prepaid-section" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Pre-paid events (4)</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Expires 3/16/26 Membership Credit
            </p>
          </div>
        </section>

        <section className="profile-past-payments card card-elevated">
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Past payments</h2>
          <div className="profile-payments-table-wrap">
            <table className="profile-payments-table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Event</th>
                  <th>Cost</th>
                  <th>Refund</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_PAST_PAYMENTS.map((row, i) => (
                  <tr key={i}>
                    <td>{row.created}</td>
                    <td>{row.event}</td>
                    <td>{row.cost}</td>
                    <td>{row.refund}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            Page 1 of 7
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            = Unpaid
          </p>
        </section>
      </div>
    </div>
  );
}
