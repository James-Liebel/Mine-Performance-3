'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Redirect /coaches to About page coaching section. Works with static export and basePath. */
export function CoachesRedirect() {
  const router = useRouter();
  const basePath = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '') : '';

  useEffect(() => {
    router.replace(`${basePath}/about#coaching-staff`);
  }, [router, basePath]);

  return (
    <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
      <p className="text-muted">Redirecting to coaching staff…</p>
    </div>
  );
}
