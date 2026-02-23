/**
 * V3 Story Module: The Place — facility, location, CTA. All text editable (buttons stay as-is).
 */
import Link from 'next/link';
import { EditableContent } from '@/components/EditableContent';

export function StoryPlace() {
  return (
    <section className="story-module alt-bg cta-block centered" aria-labelledby="place-heading">
      <div className="container">
        <span className="story-module-label">
          <EditableContent contentKey="story_place_label" fallback="The Place" as="span" />
        </span>
        <h2 id="place-heading">
          <EditableContent contentKey="story_place_heading" fallback="Florence, KY — purpose-built for athletes" as="span" />
        </h2>
        <p className="story-body centered-sub" style={{ marginBottom: '1.5rem' }}>
          <EditableContent contentKey="story_place_body" fallback="Batting cages, pitching lab, weight room, and assessment area. We serve athletes from 10U through high school and beyond — lessons, memberships, camps, and open sessions year-round." as="span" />
        </p>
        <div className="cta-row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn btn-secondary">
            Visit us
          </Link>
          <Link href="/member-registration" className="btn btn-secondary">
            View plans &amp; pricing
          </Link>
        </div>
        <h2 style={{ marginTop: '2.5rem', marginBottom: '0.5rem', fontSize: 'var(--type-h2)' }}>
          <EditableContent contentKey="story_place_cta_heading" fallback="Ready to get started?" as="span" />
        </h2>
        <p className="section-sub centered-sub" style={{ marginBottom: '1.5rem' }}>
          <EditableContent contentKey="story_place_cta_sub" fallback="Book an evaluation and we'll match you with the right program and coach." as="span" />
        </p>
        <Link href="/start" className="btn btn-primary btn-lg" data-testid="home-bottom-cta">
          Book an Evaluation
        </Link>
        <p className="cta-footer">
          <EditableContent contentKey="story_place_footer_before" fallback="Questions? " as="span" />
          <Link href="/contact"><EditableContent contentKey="story_place_footer_contact" fallback="Contact us" as="span" /></Link>
          <EditableContent contentKey="story_place_footer_after" fallback=" or call (513) 384-3840." as="span" />
        </p>
      </div>
    </section>
  );
}
