'use client';

import { useState } from 'react';
import Link from 'next/link';
import { nav } from '@/content/site-copy';
import { site } from '@/content/site-copy';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const mainLinks = [
  { href: '/method', label: nav.method },
  { href: '/programs', label: nav.programs },
  { href: '/coaches', label: nav.coaches },
  { href: '/facility', label: nav.facility },
  { href: '/results', label: nav.results },
  { href: '/events', label: nav.events },
  { href: '/rehab', label: nav.rehab },
  { href: '/contact', label: nav.contact },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12 lg:px-24">
        <Link
          href="/"
          className="font-display text-lg font-bold text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded"
          aria-label={`${site.name} home`}
        >
          {site.name}
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {mainLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              data-testid={`nav-${href.replace(/^\//, '') || 'home'}`}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded"
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="md:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden border-t border-neutral-200 bg-white',
          open ? 'block' : 'hidden'
        )}
        aria-hidden={!open}
      >
        <nav className="px-6 py-4 flex flex-col gap-2" aria-label="Main navigation mobile">
          {mainLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-2 text-neutral-700 hover:text-neutral-900 font-medium"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
