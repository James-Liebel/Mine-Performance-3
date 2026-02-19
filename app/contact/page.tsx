import { contactPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

const STATSTAK_BASE = 'https://mine-performance.statstak.io';

export const metadata: Metadata = {
  title: 'Contact',
  description: contactPage.description,
};

export default function ContactPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {contactPage.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{contactPage.lead}</p>
        <p className="mt-4 text-neutral-600">{contactPage.description}</p>
        <div className="mt-12 flex flex-col gap-4">
          <Button href={STATSTAK_BASE} variant="primary" size="lg" target="_blank" rel="noopener noreferrer">
            {contactPage.cta}
          </Button>
          <a
            href={STATSTAK_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          >
            Go to Mine Performance on StatStak →
          </a>
        </div>
      </div>
    </div>
  );
}
