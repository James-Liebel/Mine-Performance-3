import Link from 'next/link';
import { footer, site } from '@/content/site-copy';

const links = [
  { href: '/method', label: footer.links.method },
  { href: '/programs', label: footer.links.programs },
  { href: '/coaches', label: footer.links.coaches },
  { href: '/facility', label: footer.links.facility },
  { href: '/results', label: footer.links.results },
  { href: '/events', label: footer.links.events },
  { href: '/rehab', label: footer.links.rehab },
  { href: '/contact', label: footer.links.contact },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-24">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-start">
          <div>
            <p className="font-display font-bold text-neutral-900">{site.name}</p>
            <p className="mt-1 text-sm text-neutral-600">{footer.tagline}</p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm text-neutral-500">
          <span>{footer.legal}</span>
          <a
            href="https://statstak.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          >
            {footer.statstak}
          </a>
        </div>
      </div>
    </footer>
  );
}
