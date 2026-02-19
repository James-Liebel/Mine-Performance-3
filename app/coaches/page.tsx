import { coachesPage } from '@/content/site-copy';
import { CoachesList } from './CoachesList';
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
        <CoachesList />
      </div>
    </div>
  );
}
