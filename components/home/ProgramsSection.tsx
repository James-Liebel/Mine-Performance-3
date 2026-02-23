'use client';

import Link from 'next/link';
import { EditableContent } from '@/components/EditableContent';

export function ProgramsSection() {
  return (
    <section className="page-home-section alt-bg">
      <div className="container">
        <h2>
          <EditableContent contentKey="programs_heading" fallback="Programs" as="span" />
        </h2>
        <p className="section-sub">
          <EditableContent contentKey="programs_sub" fallback="Whether you're building velocity, refining your swing, or coming back from injury — we have a path designed for you." as="span" />
        </p>
        <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="/member-registration" className="btn btn-primary">View memberships</Link>
          <Link href="/contact" className="btn btn-secondary">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
