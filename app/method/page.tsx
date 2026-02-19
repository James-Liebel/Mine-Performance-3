import { methodPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Method',
  description: methodPage.description,
};

export default function MethodPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {methodPage.title}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">{methodPage.description}</p>
        <ul className="mt-12 space-y-10" aria-label="Method steps">
          {methodPage.steps.map((step, i) => (
            <li key={step.title}>
              <span className="font-display text-sm font-bold text-orange-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-display text-xl font-bold text-neutral-900 mt-1">{step.title}</h2>
              <p className="mt-2 text-neutral-600">{step.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <Button href="/contact" variant="primary" size="lg">
            {methodPage.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
