'use client';

import { useState, useEffect } from 'react';
import { CoachesClient, type Coach } from '@/app/coaches/CoachesClient';
import { PrimaryCTA } from '@/components/PrimaryCTA';
import { EditableContent } from '@/components/EditableContent';

const basePath = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '') : '';

function fetchCoaches(): Promise<Coach[]> {
  return fetch(`${basePath}/api/coaches`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Not found'))))
    .then((data) => (Array.isArray(data) ? data : []))
    .catch(() =>
      fetch(`${basePath}/coaches-fallback.json`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => (Array.isArray(data) ? data : []))
        .catch(() => [])
    );
}

export function AboutPageContent() {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    fetchCoaches().then(setCoaches);
  }, []);

  const refetchCoaches = () => {
    fetchCoaches().then(setCoaches);
  };

  return (
    <div className="page page-about-editorial">
      <section className="page-home-section alt-bg">
        <div className="container">
          <h1 data-testid="about-heading">
            <EditableContent contentKey="about_page_heading" fallback="About Mine Performance Academy" as="span" />
          </h1>
        </div>
      </section>

      <div className="about-editorial-split">
        <div className="container about-editorial-split-inner">
          <aside className="about-editorial-left">
            <div className="about-editorial-block">
              <p className="section-sub" style={{ maxWidth: '100%' }}>
                <EditableContent contentKey="about_page_intro" fallback="Mine Performance Academy is a purpose-built baseball training facility in Florence, KY. We combine data-driven coaching, a fully equipped training space, and clear development plans for athletes from youth through college." as="span" />
              </p>
            </div>
            <div className="about-editorial-block">
              <h2>
                <EditableContent contentKey="about_facility_heading" fallback="Facility" as="span" />
              </h2>
              <p className="section-sub" style={{ maxWidth: '100%' }}>
                <EditableContent contentKey="about_facility_sub" fallback="Our space includes batting cages, a pitching lab, strength and conditioning area, and assessment zones designed for capturing velocity, spin rate, exit velocity, and more." as="span" />
              </p>
            </div>
            <div className="about-editorial-block">
              <h2>
                <EditableContent contentKey="about_see_facility_heading" fallback="See the facility" as="span" />
              </h2>
              <p className="section-sub" style={{ maxWidth: '100%', marginBottom: '1rem' }}>
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
          </aside>
          <main id="coaching-staff" className="about-editorial-right" data-testid="coaching-staff">
            <h2>
              <EditableContent contentKey="about_coaching_heading" fallback="Coaching staff" as="span" />
            </h2>
            <p className="section-sub" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
              <EditableContent contentKey="about_coaching_sub" fallback="Our coaches bring D1 playing experience, certifications, and hundreds of athletes trained. They're focused on measurable progress, smart programming, and long-term development." as="span" />
            </p>
            {coaches.length === 0 && basePath && (
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Coach listings are available on the full site.
              </p>
            )}
            <CoachesClient coaches={coaches} onCoachChange={refetchCoaches} />
            <div style={{ marginTop: '2rem' }}>
              <PrimaryCTA />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
