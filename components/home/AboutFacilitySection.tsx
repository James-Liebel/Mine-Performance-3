'use client';

import Link from 'next/link';
import { SITE_NAME, SITE_ADDRESS } from '@/lib/config';
import { EditableContent } from '@/components/EditableContent';

const defaultAboutText = `${SITE_NAME} is a purpose-built baseball training facility at ${SITE_ADDRESS}. Batting cages, pitching lab, weight room, and assessment area. We serve athletes from 10U through high school and beyond — memberships, scheduling for camps and clinics, and lab and cage rentals available year-round.`;

export function AboutFacilitySection() {
  return (
    <section className="page-home-section alt-bg">
      <div className="container">
        <h2>
          <EditableContent contentKey="about_heading" fallback="About the facility" as="span" />
        </h2>
        <p className="section-sub" style={{ maxWidth: '560px' }}>
          <EditableContent contentKey="about_text" fallback={defaultAboutText} as="span" />
        </p>
        <p className="section-sub" style={{ maxWidth: '560px', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <strong>Credentials & safety:</strong> Placeholder — add facility certifications, tech stack (HitTrax, radar), and rehab/safety confidence line.
        </p>
        <div className="cta-row">
          <Link href="/member-registration" className="btn btn-primary">View memberships</Link>
          <Link href="/contact" className="btn btn-secondary">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
