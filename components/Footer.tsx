import Link from 'next/link';
import { footer, site } from '@/content/site-copy';

const links = [
  { href: '/start', label: footer.links.start },
  { href: '/programs', label: footer.links.programs },
  { href: '/coaches', label: footer.links.coaches },
  { href: '/events', label: footer.links.events },
  { href: '/results', label: footer.links.results },
  { href: '/method', label: footer.links.method },
  { href: '/facility', label: footer.links.facility },
  { href: '/rehab', label: footer.links.rehab },
  { href: '/contact', label: footer.links.contact },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-24">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-start">
          <div>
            <p className="font-display font-bold text-ink">{site.name}</p>
            <p className="mt-1 text-sm text-ink-muted">{footer.tagline}</p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-brand-100 text-sm text-ink-muted">
          <span>{footer.legal}</span>
        </div>
      </div>
    </footer>
  );
}
