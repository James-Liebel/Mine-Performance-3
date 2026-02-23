'use client';

import Link from 'next/link';
import { SITE_PHONE } from '@/lib/config';
import { EditableContent } from '@/components/EditableContent';

export function CTASection() {
  const tel = SITE_PHONE.replace(/\D/g, '');
  return (
    <section className="page-home-section cta-block centered">
      <div className="container">
        <h2 style={{ marginBottom: '0.5rem' }}>
          <EditableContent contentKey="cta_heading" fallback="Ready to train?" as="span" />
        </h2>
        <p className="section-sub centered-sub" style={{ marginBottom: '1.5rem' }}>
          <EditableContent contentKey="cta_sub" fallback="View memberships, book events on the calendar, or reserve a lab or cage. We'll help you find the right fit." as="span" />
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Link href="/member-registration" className="btn btn-primary btn-lg" data-testid="home-bottom-cta">
            View memberships
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">Contact us</Link>
        </div>
        <p className="cta-footer">
          Questions? <Link href="/contact">Contact us</Link> or call <a href={`tel:${tel}`}>{SITE_PHONE}</a>.
        </p>
      </div>
    </section>
  );
}
