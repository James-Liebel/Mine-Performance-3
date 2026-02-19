'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-6 py-20 md:px-12 lg:px-24 min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h1 className="font-display text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-4 text-ink-muted">We’ve logged the error. You can try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
