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
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        We’ve logged the error. You can try again or go home.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
        <a href="/" className="btn btn-secondary">
          Go home
        </a>
      </div>
    </div>
  );
}
