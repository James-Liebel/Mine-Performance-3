'use client';

import { useId } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FiltersProps {
  position?: FilterOption[];
  ageBand?: FilterOption[];
  specialty?: FilterOption[];
  selected?: { position?: string; ageBand?: string; specialty?: string };
  onChange?: (key: string, value: string) => void;
  /** When false, position dropdown is not rendered. Default true. */
  showPosition?: boolean;
  /** When false, age band dropdown is not rendered. Default true. */
  showAgeBand?: boolean;
  /** When false, specialty dropdown is not rendered. Default true. */
  showSpecialty?: boolean;
}

const DEFAULT_POSITIONS = [
  { value: '', label: 'All positions' },
  { value: 'RHP', label: 'RHP' },
  { value: 'LHP', label: 'LHP' },
  { value: 'OF', label: 'OF' },
  { value: 'IF', label: 'IF' },
  { value: 'C', label: 'C' },
];

const DEFAULT_AGE_BANDS = [
  { value: '', label: 'All ages' },
  { value: '12U', label: '12U' },
  { value: '14U', label: '14U' },
  { value: '16U', label: '16U' },
  { value: '18U', label: '18U' },
];

const DEFAULT_SPECIALTIES = [
  { value: '', label: 'All specialties' },
  { value: 'Pitching Velo', label: 'Pitching Velo' },
  { value: 'Pitch Design', label: 'Pitch Design' },
  { value: 'Rehab', label: 'Rehab' },
  { value: 'Hitting Power', label: 'Hitting Power' },
  { value: 'Strength', label: 'Strength' },
];

export function Filters({
  position = DEFAULT_POSITIONS,
  ageBand = DEFAULT_AGE_BANDS,
  specialty = DEFAULT_SPECIALTIES,
  selected = {},
  onChange,
  showPosition = true,
  showAgeBand = true,
  showSpecialty = true,
}: FiltersProps) {
  const posId = useId();
  const ageId = useId();
  const specId = useId();

  const renderSelect = (
    id: string,
    options: FilterOption[],
    key: 'position' | 'ageBand' | 'specialty',
    label: string
  ) => (
    <label htmlFor={id} className="filter-label">
      <span className="filter-label-text">{label}</span>
      <select
        id={id}
        value={selected[key] ?? ''}
        onChange={(e) => onChange?.(key, e.target.value)}
        className="filter-select"
        aria-label={label}
        data-testid={key === 'specialty' ? 'filter-specialty' : undefined}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="filters" role="group" aria-label="Filter results">
      {showPosition && renderSelect(posId, position, 'position', 'Position')}
      {showAgeBand && renderSelect(ageId, ageBand, 'ageBand', 'Age band')}
      {showSpecialty && renderSelect(specId, specialty, 'specialty', 'Specialty')}
      <style jsx>{`
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-end;
          margin-bottom: 1rem;
        }
        .filter-label {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
          min-width: 160px;
        }
        .filter-label-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .filter-select {
          padding: 0.6rem 0.85rem;
          background: var(--surface-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text);
          font-family: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a0b0' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.5rem;
        }
        .filter-select:hover {
          border-color: var(--surface-hover);
          background-color: var(--surface);
        }
        .filter-select:focus-visible {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.2);
        }
        .filter-select option {
          background: var(--surface);
          color: var(--text);
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
}
