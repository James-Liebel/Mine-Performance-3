import { facilityPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Facility',
  description: facilityPage.description,
};

export default function FacilityPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
          {facilityPage.title}
        </h1>
        <p className="mt-4 text-lg text-brand-600 font-medium">{facilityPage.lead}</p>
        <p className="mt-4 text-ink-muted">{facilityPage.description}</p>
        <div className="mt-12 aspect-video rounded-card bg-brand-100 flex items-center justify-center text-brand-600/70">
          [ Facility imagery / tech stack ]
        </div>
        <div className="mt-8">
          <Button href="/contact" variant="primary" size="lg">
            {facilityPage.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
