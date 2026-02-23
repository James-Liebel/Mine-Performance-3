/**
 * Trust module: testimonial placeholders. All text editable (buttons stay as-is).
 */
import Link from 'next/link';
import { EditableContent } from '@/components/EditableContent';

const TESTIMONIAL_KEYS = [
  { quote: 'testimonial_0_quote', author: 'testimonial_0_author', role: 'testimonial_0_role' },
  { quote: 'testimonial_1_quote', author: 'testimonial_1_author', role: 'testimonial_1_role' },
  { quote: 'testimonial_2_quote', author: 'testimonial_2_author', role: 'testimonial_2_role' },
] as const;

const FALLBACKS = [
  { quote: 'Placeholder — Client testimonial 1. Real athlete quote and outcome.', author: 'Parent / Athlete name', role: 'Placeholder' },
  { quote: 'Placeholder — Client testimonial 2. Real athlete quote and outcome.', author: 'Parent / Athlete name', role: 'Placeholder' },
  { quote: 'Placeholder — Client testimonial 3. Real athlete quote and outcome.', author: 'Parent / Athlete name', role: 'Placeholder' },
];

export function TestimonialsSection() {
  return (
    <section className="page-home-section testimonials">
      <div className="container">
        <h2>
          <EditableContent contentKey="testimonials_heading" fallback="What athletes say" as="span" />
        </h2>
        <p className="section-sub centered-sub">
          <EditableContent contentKey="testimonials_sub" fallback="Placeholder — needs client testimonials. Replace with real quotes and attribution." as="span" />
        </p>
        <div className="testimonial-grid">
          {TESTIMONIAL_KEYS.map((keys, i) => (
            <blockquote key={i} className="testimonial-card card card-elevated">
              <p className="testimonial-quote">
                &ldquo;<EditableContent contentKey={keys.quote} fallback={FALLBACKS[i].quote} as="span" />&rdquo;
              </p>
              <footer>
                <cite className="testimonial-author">
                  <EditableContent contentKey={keys.author} fallback={FALLBACKS[i].author} as="span" />
                </cite>
                <span className="testimonial-role">
                  <EditableContent contentKey={keys.role} fallback={FALLBACKS[i].role} as="span" />
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/contact" className="btn btn-secondary">
            Get in touch
          </Link>
        </p>
      </div>
    </section>
  );
}
