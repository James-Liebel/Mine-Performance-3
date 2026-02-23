'use client';

import Link from 'next/link';
import { EditableContent } from '@/components/EditableContent';

export function CoachingSection() {
  return (
    <section className="page-home-section">
      <div className="container">
        <h2>
          <EditableContent contentKey="coaching_heading" fallback="Our coaching team" as="span" />
        </h2>
        <p className="section-sub">
          <EditableContent contentKey="coaching_sub" fallback="D1 playing experience. 500+ pitchers trained. 70+ successful rehabs. Our coaches bring real credentials and a commitment to every athlete's growth." as="span" />
        </p>
        <div className="cta-row">
          <Link href="/about#coaching-staff" className="btn btn-primary">
            Meet the coaches
          </Link>
        </div>
      </div>
    </section>
  );
}
