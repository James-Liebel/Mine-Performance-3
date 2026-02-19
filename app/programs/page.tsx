import { programsPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programs',
  description: programsPage.description,
};

export default function ProgramsPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {programsPage.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{programsPage.lead}</p>
        <p className="mt-4 text-neutral-600">{programsPage.description}</p>
        <div className="mt-12 p-6 rounded-xl bg-neutral-50 border border-neutral-200">
          <p className="text-sm text-neutral-500">
            Program pathways (e.g. in-season, off-season, return-to-sport) can be listed here with links to booking or StatStak.
          </p>
        </div>
        <div className="mt-8">
          <Button href="/contact" variant="primary">
            {programsPage.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
