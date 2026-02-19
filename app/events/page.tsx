import { eventsPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: eventsPage.description,
};

export default function EventsPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {eventsPage.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{eventsPage.lead}</p>
        <p className="mt-4 text-neutral-600">{eventsPage.description}</p>
        <div className="mt-12 p-6 rounded-xl bg-neutral-50 border border-neutral-200">
          <p className="text-neutral-600">
            Featured events can be listed here. Full schedule and registration live on StatStak.
          </p>
          <Button
            href="/contact"
            variant="primary"
            className="mt-6"
          >
            {eventsPage.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
