'use client';

import { useState, useRef, useEffect } from 'react';
import { getMetricDefinition } from '@/lib/metrics';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  vsLast?: string;
  definition?: string;
}

export function MetricCard({ label, value, unit, trend, vsLast, definition }: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const text = definition ?? getMetricDefinition(label);

  useEffect(() => {
    if (!showTooltip) return;
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTooltip]);

  return (
    <div className="card metric-card">
      <div className="metric-card-header">
        <h3 className="metric-card-label">{label}</h3>
        <div className="metric-card-explain" ref={tooltipRef}>
          <button
            type="button"
            className="explain-trigger"
            aria-label={`Explain ${label}`}
            aria-expanded={showTooltip}
            onClick={() => setShowTooltip((v) => !v)}
            onBlur={() => setShowTooltip(false)}
          >
            ?
          </button>
          {showTooltip && (
            <div className="metric-tooltip" role="tooltip">
              {text}
            </div>
          )}
        </div>
      </div>
      <p className="metric-value">
        {value}
        {unit && <span className="metric-unit">{unit}</span>}
      </p>
      {(trend || vsLast) && (
        <p className="metric-meta">
          {vsLast && <span>vs last: {vsLast}</span>}
          {trend && trend !== 'neutral' && (
            <span className="metric-trend" data-trend={trend} aria-hidden>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </p>
      )}
      <style jsx>{`
        .metric-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .metric-card-explain {
          position: relative;
        }
        .metric-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.25rem;
          padding: 0.75rem;
          max-width: 280px;
          background: var(--surface-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.85rem;
          color: var(--text-muted);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0.5rem 0 0;
        }
        .metric-unit {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-muted);
          margin-left: 0.25rem;
        }
        .metric-meta {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0.25rem 0 0;
        }
        .metric-trend[data-trend='up'] { color: var(--success); }
        .metric-trend[data-trend='down'] { color: var(--accent); }
      `}</style>
    </div>
  );
}
