import { rehabPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rehab & Return-to-Throw',
  description: rehabPage.body.slice(0, 160),
};

export default function RehabPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {rehabPage.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{rehabPage.lead}</p>

        <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200" role="note" aria-label="Disclaimer">
          <p className="text-sm text-amber-900">{rehabPage.disclaimer}</p>
        </div>

        <p className="mt-8 text-neutral-600 leading-relaxed">{rehabPage.body}</p>

        <ul className="mt-8 space-y-3" aria-label="Key points">
          {rehabPage.points.map((point) => (
            <li key={point} className="flex gap-3 text-neutral-600">
              <span className="text-orange-500 flex-shrink-0" aria-hidden>✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Button href="/contact" variant="primary" size="lg">
            {rehabPage.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
