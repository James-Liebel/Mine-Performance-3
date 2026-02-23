/**
 * V3 Story Module: The Problem — the challenge athletes and parents face.
 * Editable on homepage when admin uses Edit site.
 */
import Link from 'next/link';
import { EditableContent } from '@/components/EditableContent';
import { SITE_HOURS } from '@/lib/config';

export function StoryProblem() {
  return (
    <section className="hero story-module" aria-labelledby="problem-heading">
      <div className="container">
        <p className="hero-tag" aria-hidden>
          <EditableContent contentKey="hero_tag" fallback="Florence, KY — Baseball training" as="span" />
        </p>
        <h1 id="problem-heading">
          <EditableContent contentKey="hero_heading" fallback="Your baseball training, quantified." as="span" />
        </h1>
        <div className="hero-what-we-have">
          <p className="hero-space-offerings">
            <EditableContent contentKey="hero_space_offerings" fallback="Batting cages, pitching lab, weight room, assessment area." as="span" />
          </p>
          <p className="hero-hours">
            {SITE_HOURS.map((line, i) => (
              <span key={i}>{line}{i < SITE_HOURS.length - 1 ? ' · ' : ''}</span>
            ))}
          </p>
        </div>
        <p className="hero-train-rent">
          <EditableContent contentKey="hero_train_rent_line" fallback="Book a rental by the hour, or get a membership and do training with our programs — choose what fits." as="span" />
        </p>
        <div className="hero-ctas">
          <Link href="/member-registration" className="btn btn-primary" data-testid="hero-cta">
            Get a membership
          </Link>
          <Link href="/rentals" className="btn btn-secondary">
            Book a rental
          </Link>
          <Link href="/start" className="btn btn-secondary">
            Book an evaluation
          </Link>
        </div>
      </div>
    </section>
  );
}
