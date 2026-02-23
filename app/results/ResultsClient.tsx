'use client';

import { MetricCard } from '@/components/MetricCard';
import { Filters } from '@/components/Filters';
import {
  useLeaderboard,
} from '@mine-performance/core/hooks';
import {
  MOCK_DATA_LABEL,
  AGE_BANDS,
  type LeaderboardData,
} from '@mine-performance/core';

export function ResultsClient({ data }: { data: LeaderboardData }) {
  const { ageBand, setAgeBand, position, setPosition, rows } =
    useLeaderboard(data);

  return (
    <>
      <p className="mock-badge" style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {MOCK_DATA_LABEL}.
      </p>
      {data.demoAthlete && (
        <section className="my-metrics results-section-v3" style={{ marginBottom: '2rem' }}>
          <h2 className="results-h2-v3">My metrics</h2>
          <p className="results-explainer-v3">
            Your numbers, clearly explained. Tap the &quot;?&quot; on each metric to see what it means and what &quot;good&quot; looks like for your age.
          </p>
          <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {data.demoAthlete.metrics.map((m) => (
              <MetricCard
                key={m.id}
                label={m.label}
                value={m.value}
                unit={m.unit}
                trend={m.trend as 'up' | 'down' | 'neutral'}
                vsLast={m.vsLast}
              />
            ))}
          </div>
        </section>
      )}
      <section className="leaderboard results-section-v3">
        <h2 className="results-h2-v3">Leaderboard — {data.metric}</h2>
        <div className="results-parent-explainer">
          <strong>For parents:</strong> Rank is your athlete&apos;s position in this age group. Percentile means &quot;they beat X% of peers&quot; — higher is better. Use the age filter to compare within the right band.
        </div>
        <Filters
          ageBand={AGE_BANDS}
          selected={{ ageBand, position }}
          onChange={(key, value) => {
            if (key === 'ageBand') setAgeBand(value);
            if (key === 'position') setPosition(value);
          }}
        />
        <div className="table-wrap" style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border)' }}>Rank</th>
                <th scope="col" style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border)' }}>Name</th>
                <th scope="col" style={{ textAlign: 'right', padding: '0.75rem', borderBottom: '2px solid var(--border)' }}>Value ({data.unit})</th>
                <th scope="col" style={{ textAlign: 'right', padding: '0.75rem', borderBottom: '2px solid var(--border)' }}>Percentile</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.rank}
                  style={{
                    background: r.isDemo ? 'rgba(234, 88, 12, 0.12)' : undefined,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>{r.rank}</td>
                  <td style={{ padding: '0.75rem' }}>{r.name}{r.isDemo ? ' (you)' : ''}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>{r.value}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>{r.percentile ?? '—'}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
