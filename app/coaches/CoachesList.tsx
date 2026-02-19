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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
            specialty === null
              ? 'bg-orange-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
              specialty === s ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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
            className="flex flex-col md:flex-row gap-8 border-t border-neutral-200 pt-12 first:pt-12 first:border-t first:border-neutral-200"
          >
            <div className="md:w-48 flex-shrink-0">
              <div
                className="aspect-square rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-400 text-sm"
                aria-hidden
              >
                {coach.image ? 'Photo' : 'Headshot'}
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">{coach.name}</h2>
              <p className="mt-1 text-orange-600 font-medium">{coach.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {coach.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Credentials">
                {coach.credentials.map((c) => (
                  <li
                    key={c}
                    className="text-xs font-medium px-2 py-1 rounded bg-neutral-100 text-neutral-700"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-neutral-600">{coach.bio}</p>
            </div>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="mt-8 text-neutral-600">No coaches match this filter. Try another specialty.</p>
      )}
    </>
  );
}
