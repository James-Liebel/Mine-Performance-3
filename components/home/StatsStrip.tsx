'use client';

import { STATS } from '@/data/home-content';
import { EditableContent } from '@/components/EditableContent';

const keys = [
  { value: 'stat_0_value', label: 'stat_0_label' },
  { value: 'stat_1_value', label: 'stat_1_label' },
  { value: 'stat_2_value', label: 'stat_2_label' },
  { value: 'stat_3_value', label: 'stat_3_label' },
] as const;

export function StatsStrip() {
  return (
    <section className="stats-strip">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">
                <EditableContent contentKey={keys[i].value} fallback={s.value} as="span" />
              </span>
              <span className="stat-label">
                <EditableContent contentKey={keys[i].label} fallback={s.label} as="span" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
