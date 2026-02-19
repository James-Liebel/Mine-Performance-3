'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ctaBar } from '@/content/site-copy';
import { cn } from '@/lib/utils';

export function CTABar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400 && window.innerWidth < 768);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-surface border-t border-brand-100 px-4 py-3 shadow-lg transition-transform duration-300 md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
      role="complementary"
      aria-label="Quick actions"
    >
      <Link
        href="/contact"
        className="flex-1 text-center py-2.5 px-4 rounded-card bg-brand-500 text-white font-medium text-sm hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {ctaBar.mobile.primary}
      </Link>
      <Link
        href="/programs"
        className="flex-1 text-center py-2.5 px-4 rounded-card border-2 border-ink text-ink font-medium text-sm hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {ctaBar.mobile.secondary}
      </Link>
    </div>
  );
}
