import { resultsPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Results',
  description: resultsPage.description,
};

export default function ResultsPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
          {resultsPage.title}
        </h1>
        <p className="mt-4 text-lg text-brand-600 font-medium">{resultsPage.lead}</p>
        <p className="mt-4 text-ink-muted">{resultsPage.description}</p>

        <section className="mt-12" aria-labelledby="leaderboard-heading">
          <h2 id="leaderboard-heading" className="font-display text-xl font-bold text-ink">
            Leaderboard
          </h2>
          <p className="mt-2 text-ink-muted">
            Leaderboard and event results. Placeholder — add your own results feed or link when ready.
          </p>
          <Button
            href="/contact"
            variant="primary"
            className="mt-4"
          >
            {resultsPage.leaderboardCta}
          </Button>
        </section>

        <section className="mt-12 p-6 rounded-card bg-surface-muted border border-brand-100" aria-labelledby="definitions-heading">
          <h2 id="definitions-heading" className="font-display text-lg font-bold text-ink">
            What we measure
          </h2>
          <p className="mt-2 text-sm text-ink-muted">{resultsPage.definitionsNote}</p>
          <p className="mt-4 text-sm text-ink-muted">
            Before/after stories and metric definitions can be added here with client-approved copy.
          </p>
          <h3 className="mt-6 font-semibold text-ink">What good looks like</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Placeholder — needs client content. Add age-band benchmarks or “typical ranges” for key metrics so athletes and parents understand context (e.g. velocity bands by age, strength standards).
          </p>
        </section>
      </div>
    </div>
  );
}
