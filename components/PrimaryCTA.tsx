import Link from 'next/link';

export function PrimaryCTA() {
  return (
    <section className="cta-inline card card-elevated" style={{ marginTop: '2rem', padding: '1.75rem' }}>
      <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '0.5rem' }}>Ready to train?</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
        View memberships or contact us and we&apos;ll help you find the right fit.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link href="/member-registration" className="btn btn-primary" data-testid="page-primary-cta">
          View memberships
        </Link>
        <Link href="/contact" className="btn btn-secondary">Contact us</Link>
      </div>
    </section>
  );
}
