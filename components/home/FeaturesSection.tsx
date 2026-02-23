'use client';

import Link from 'next/link';
import { FEATURES } from '@/data/home-content';
import { EditableContent } from '@/components/EditableContent';

const keys = [
  { title: 'feature_0_title', desc: 'feature_0_description' },
  { title: 'feature_1_title', desc: 'feature_1_description' },
  { title: 'feature_2_title', desc: 'feature_2_description' },
  { title: 'feature_3_title', desc: 'feature_3_description' },
] as const;

export function FeaturesSection() {
  return (
    <section className="features">
      <div className="container">
        <h2>
          <EditableContent contentKey="features_heading" fallback="Why athletes choose Mine Performance" as="span" />
        </h2>
        <p className="section-sub centered-sub">
          <EditableContent contentKey="features_sub" fallback="A training facility built around measurable results — not just reps." as="span" />
        </p>
        <ul className="feature-grid" role="list">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="feature-card card card-elevated">
              <span className="feature-icon" aria-hidden>
                {f.icon}
              </span>
              <h3 style={{ marginBottom: '0.35rem', fontSize: '1.1rem' }}>
                <EditableContent contentKey={keys[i].title} fallback={f.title} as="span" />
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                }}
              >
                <EditableContent contentKey={keys[i].desc} fallback={f.description} as="span" />
              </p>
            </li>
          ))}
        </ul>
        <p className="features-links">
          <Link href="/about#coaching-staff">Meet the coaches</Link>
          <span className="dot" aria-hidden> · </span>
          <Link href="/contact">Contact us</Link>
        </p>
      </div>
    </section>
  );
}
