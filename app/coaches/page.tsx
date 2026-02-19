import { coachesPage } from '@/content/site-copy';
import { coaches } from '@/content/coaches';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meet the Coaches',
  description: coachesPage.description,
};

export default function CoachesPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {coachesPage.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{coachesPage.lead}</p>
        <p className="mt-4 text-neutral-600">{coachesPage.description}</p>
        <ul className="mt-16 space-y-16" aria-label="Coach bios">
          {coaches.map((coach) => (
            <li key={coach.id} className="flex flex-col md:flex-row gap-8 border-t border-neutral-200 pt-12 first:pt-12 first:border-t first:border-neutral-200">
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
      </div>
    </div>
  );
}
