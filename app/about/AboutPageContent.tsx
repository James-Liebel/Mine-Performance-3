'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CoachesClient, type Coach } from '@/app/coaches/CoachesClient';
import { EditableContent } from '@/components/EditableContent';

export function AboutPageContent() {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    fetch('/api/coaches')
      .then((r) => r.json())
      .then((data) => setCoaches(Array.isArray(data) ? data : []))
      .catch(() => setCoaches([]));
  }, []);

  const refetchCoaches = () => {
    fetch('/api/coaches')
      .then((r) => r.json())
      .then((data) => setCoaches(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  return (
    <div className="page">
      <section className="page-home-section alt-bg">
        <div className="container">
          <h1>
            <EditableContent contentKey="about_page_heading" fallback="About Mine Performance Academy" as="span" />
          </h1>
          <p className="section-sub" style={{ maxWidth: '640px' }}>
            <EditableContent contentKey="about_page_intro" fallback="Mine Performance Academy is a purpose-built baseball training facility in Florence, KY. We combine data-driven coaching, a fully equipped training space, and clear development plans for athletes from youth through college." as="span" />
          </p>
        </div>
      </section>

      <section id="coaching-staff" className="page-home-section alt-bg">
        <div className="container">
          <h2>
            <EditableContent contentKey="about_coaching_heading" fallback="Coaching staff" as="span" />
          </h2>
          <p className="section-sub" style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>
            <EditableContent contentKey="about_coaching_sub" fallback="Our coaches bring D1 playing experience, certifications, and hundreds of athletes trained. They're focused on measurable progress, smart programming, and long-term development." as="span" />
          </p>
          <CoachesClient coaches={coaches} onCoachChange={refetchCoaches} />
          <div className="cta-row" style={{ marginTop: '2rem' }}>
            <Link href="/member-registration" className="btn btn-primary" data-testid="page-primary-cta">
              View memberships
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="page-home-section">
        <div className="container">
          <h2>
            <EditableContent contentKey="about_facility_heading" fallback="Facility" as="span" />
          </h2>
          <p className="section-sub" style={{ maxWidth: '640px' }}>
            <EditableContent contentKey="about_facility_sub" fallback="Our space includes batting cages, a pitching lab, strength and conditioning area, and assessment zones designed for capturing velocity, spin rate, exit velocity, and more." as="span" />
          </p>
        </div>
      </section>

      <section className="page-home-section alt-bg">
        <div className="container">
          <h2>
            <EditableContent contentKey="about_see_facility_heading" fallback="See the facility" as="span" />
          </h2>
          <p className="section-sub" style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>
            <EditableContent contentKey="about_see_facility_sub" fallback="Take a look inside our training space." as="span" />
          </p>
          <div className="facility-video-wrap">
            <div className="facility-video-placeholder" aria-hidden>
              <span className="facility-video-placeholder-text">
                <EditableContent contentKey="about_video_placeholder" fallback="Video coming soon" as="span" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
