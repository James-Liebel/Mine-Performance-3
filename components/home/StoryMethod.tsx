/**
 * V3 Story Module: The Method — how we solve the problem. All text editable (buttons stay as-is).
 */
import Link from 'next/link';
import { PROGRAMS } from '@/data/home-content';
import { EditableContent } from '@/components/EditableContent';

const PROGRAM_KEYS = [
  { name: 'program_0_name', desc: 'program_0_desc' },
  { name: 'program_1_name', desc: 'program_1_desc' },
  { name: 'program_2_name', desc: 'program_2_desc' },
] as const;

export function StoryMethod() {
  return (
    <section className="story-module alt-bg" aria-labelledby="method-heading">
      <div className="container">
        <span className="story-module-label">
          <EditableContent contentKey="story_method_label" fallback="The Method" as="span" />
        </span>
        <h2 id="method-heading">
          <EditableContent contentKey="story_method_heading" fallback="Data-driven development, expert-led training" as="span" />
        </h2>
        <p className="story-body" style={{ marginBottom: '2rem' }}>
          <EditableContent contentKey="story_method_body" fallback="We combine structured programs with measurable progress tracking — velocity, spin rate, exit velo, and more. Athletes and parents see exactly where they stand and what comes next." as="span" />
        </p>
        <div className="program-grid">
          {PROGRAMS.map((p, i) => (
            <Link key={p.name} href={p.href} className="card card-elevated card-link program-card">
              <strong className="program-name">
                <EditableContent contentKey={PROGRAM_KEYS[i].name} fallback={p.name} as="span" />
              </strong>
              <p className="program-desc">
                <EditableContent contentKey={PROGRAM_KEYS[i].desc} fallback={p.desc} as="span" />
              </p>
              <span className="program-arrow" aria-hidden>→</span>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/programs" className="btn btn-secondary">
            All programs
          </Link>
        </p>
      </div>
    </section>
  );
}
