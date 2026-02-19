'use client';

import { useState } from 'react';
import { coaches, allSpecialties, type CoachBio } from '@/content/coaches';

export function CoachesList() {
  const [specialty, setSpecialty] = useState<string | null>(null);
  const filtered =
    specialty === null
      ? coaches
      : coaches.filter((c) => c.specialties.includes(specialty));

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by specialty">
        <button
          type="button"
          onClick={() => setSpecialty(null)}
          data-testid="filter-specialty-all"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
            specialty === null
              ? 'bg-brand-500 text-white'
              : 'bg-surface-muted text-ink-muted hover:bg-brand-100'
          }`}
        >
          All
        </button>
        {allSpecialties.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpecialty(s)}
            data-testid={`filter-specialty-${s.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
              specialty === s ? 'bg-brand-500 text-white' : 'bg-surface-muted text-ink-muted hover:bg-brand-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <ul className="mt-16 space-y-16" aria-label="Coach bios">
        {filtered.map((coach) => (
          <li
            key={coach.id}
            className="flex flex-col md:flex-row gap-8 border-t border-brand-100 pt-12 first:pt-12 first:border-t first:border-brand-100"
          >
            <div className="md:w-48 flex-shrink-0">
              <div
                className="aspect-square rounded-card bg-brand-100 flex items-center justify-center text-brand-600/70 text-sm"
                aria-hidden
              >
                {coach.image ? 'Photo' : 'Headshot'}
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">{coach.name}</h2>
              <p className="mt-1 text-brand-600 font-medium">{coach.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {coach.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium px-2 py-1 rounded bg-brand-100 text-brand-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Credentials">
                {coach.credentials.map((c) => (
                  <li
                    key={c}
                    className="text-xs font-medium px-2 py-1 rounded bg-surface-muted text-ink-muted"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-ink-muted">{coach.bio}</p>
            </div>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="mt-8 text-ink-muted">No coaches match this filter. Try another specialty.</p>
      )}
    </>
  );
}
