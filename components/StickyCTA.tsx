'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div className="sticky-cta-bar" role="complementary" aria-label="Quick action">
      <div className="container sticky-cta-inner">
        <span className="sticky-cta-text">Ready to get started?</span>
        <Link href="/start" className="btn btn-primary" data-testid="sticky-cta">
          Book an Evaluation
        </Link>
      </div>
    </div>
  );
}
