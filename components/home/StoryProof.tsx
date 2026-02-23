/**
 * V3 Story Module: The Proof — stats, credentials, results. All text editable (buttons stay as-is).
 */
import Link from 'next/link';
import { STATS, FEATURES } from '@/data/home-content';
import { EditableContent } from '@/components/EditableContent';

const STAT_KEYS = [
  { value: 'stat_0_value', label: 'stat_0_label' },
  { value: 'stat_1_value', label: 'stat_1_label' },
  { value: 'stat_2_value', label: 'stat_2_label' },
  { value: 'stat_3_value', label: 'stat_3_label' },
] as const;
const FEATURE_KEYS = [
  { title: 'feature_0_title', desc: 'feature_0_description' },
  { title: 'feature_1_title', desc: 'feature_1_description' },
  { title: 'feature_2_title', desc: 'feature_2_description' },
  { title: 'feature_3_title', desc: 'feature_3_description' },
] as const;

export function StoryProof() {
  return (
    <section className="story-module" aria-labelledby="proof-heading">
      <div className="container">
        <span className="story-module-label">
          <EditableContent contentKey="story_proof_label" fallback="The Proof" as="span" />
        </span>
        <h2 id="proof-heading">
          <EditableContent contentKey="story_proof_heading" fallback="Results that speak for themselves" as="span" />
        </h2>
        <p className="story-body" style={{ marginBottom: '2rem' }}>
          <EditableContent contentKey="story_proof_body" fallback="D1 playing experience. Hundreds of athletes trained. Real numbers — not hype." as="span" />
        </p>
        <div className="stats-strip stats-strip-inline" style={{ marginBottom: '2.5rem' }}>
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">
                  <EditableContent contentKey={STAT_KEYS[i].value} fallback={s.value} as="span" />
                </span>
                <span className="stat-label">
                  <EditableContent contentKey={STAT_KEYS[i].label} fallback={s.label} as="span" />
                </span>
              </div>
            ))}
          </div>
        </div>
        <ul className="feature-grid" role="list">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="feature-card card card-elevated">
              <span className="feature-icon" aria-hidden>{f.icon}</span>
              <h3 style={{ marginBottom: '0.35rem', fontSize: '1.1rem' }}>
                <EditableContent contentKey={FEATURE_KEYS[i].title} fallback={f.title} as="span" />
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <EditableContent contentKey={FEATURE_KEYS[i].desc} fallback={f.description} as="span" />
              </p>
            </li>
          ))}
        </ul>
        <p className="features-links" style={{ marginTop: '1.5rem' }}>
          <Link href="/portal"><EditableContent contentKey="story_proof_link_portal" fallback="Portal" as="span" /></Link>
          <span className="dot" aria-hidden> · </span>
          <Link href="/coaches"><EditableContent contentKey="story_proof_link_coaches" fallback="Meet the coaches" as="span" /></Link>
          <span className="dot" aria-hidden> · </span>
          <Link href="/events"><EditableContent contentKey="story_proof_link_events" fallback="Upcoming events" as="span" /></Link>
        </p>
      </div>
    </section>
  );
}
