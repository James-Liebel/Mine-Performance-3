'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/events', label: 'Schedules & events' },
  { href: '/admin/pricing', label: 'Pricing' },
  { href: '/admin/coaches', label: 'Coaches' },
  { href: '/admin/results', label: 'College commits' },
  { href: '/admin/waivers', label: 'Waivers' },
  { href: '/admin/users', label: 'Users' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Admin sections">
      <ul className="admin-nav-list">
        {ADMIN_LINKS.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/admin' && pathname?.startsWith(link.href));
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`admin-nav-link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            className="admin-nav-link"
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </li>
      </ul>
    </nav>
  );
}
