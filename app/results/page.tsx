import { resultsPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

const STATSTAK_LEADERBOARD = 'https://mine-performance.statstak.io/leaderboard';

export const metadata: Metadata = {
  title: 'Results',
  description: resultsPage.description,
};

export default function ResultsPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {resultsPage.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{resultsPage.lead}</p>
        <p className="mt-4 text-neutral-600">{resultsPage.description}</p>

        <section className="mt-12" aria-labelledby="leaderboard-heading">
          <h2 id="leaderboard-heading" className="font-display text-xl font-bold text-neutral-900">
            Leaderboard
          </h2>
          <p className="mt-2 text-neutral-600">
            See current leaderboard and event results on StatStak.
          </p>
          <Button
            href={STATSTAK_LEADERBOARD}
            variant="primary"
            className="mt-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {resultsPage.leaderboardCta}
          </Button>
        </section>

        <section className="mt-12 p-6 rounded-xl bg-neutral-50 border border-neutral-200" aria-labelledby="definitions-heading">
          <h2 id="definitions-heading" className="font-display text-lg font-bold text-neutral-900">
            What we measure
          </h2>
          <p className="mt-2 text-sm text-neutral-600">{resultsPage.definitionsNote}</p>
          <p className="mt-4 text-sm text-neutral-600">
            Before/after stories and metric definitions can be added here with client-approved copy.
          </p>
          <h3 className="mt-6 font-semibold text-neutral-900">What good looks like</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Placeholder — needs client content. Add age-band benchmarks or “typical ranges” for key metrics so athletes and parents understand context (e.g. velocity bands by age, strength standards).
          </p>
        </section>
      </div>
    </div>
  );
}
