'use client';

import Link from 'next/link';
import { EditableContent } from '@/components/EditableContent';

const defaultSubtitle = 'Mine Performance Academy combines expert coaching, measurable progress tracking, and structured programs — memberships, scheduling for events and camps, and lab and cage rentals so athletes and parents always know where they stand and what comes next.';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container">
        <p className="hero-tag" aria-hidden>
          <EditableContent contentKey="hero_tag" fallback="Florence, KY — Now accepting athletes" as="span" />
        </p>
        <h1 id="hero-heading">
          <EditableContent contentKey="hero_title" fallback="Train smarter. Get stronger. See the data." as="span" />
        </h1>
        <p className="hero-sub">
          <EditableContent contentKey="hero_subtitle" fallback={defaultSubtitle} as="span" />
        </p>
        <div className="hero-ctas">
          <Link href="/member-registration" className="btn btn-primary" data-testid="hero-cta">
            View memberships
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
