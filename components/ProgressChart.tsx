'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface ProgressDataPoint {
  date: string;
  pitchingVelo?: number;
  exitVelo?: number;
  [key: string]: string | number | undefined;
}

export interface ProgressChartProps {
  data: ProgressDataPoint[];
  series: { dataKey: string; name: string; color?: string }[];
  height?: number;
}

const DEFAULT_COLORS = ['#ea580c', '#22c55e', '#3b82f6'];

export function ProgressChart({ data, series, height = 260 }: ProgressChartProps) {
  return (
    <div className="progress-chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            stroke="var(--border)"
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            stroke="var(--border)"
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
            }}
            labelStyle={{ color: 'var(--text-muted)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '0.85rem' }}
            formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
          />
          {series.map((s, i) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              strokeWidth={2}
              dot={{ fill: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length], r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
