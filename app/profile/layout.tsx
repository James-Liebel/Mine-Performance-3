'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

const PROFILE_TABS = [
  { href: '/profile', label: 'Profile' },
  { href: '/profile/calendar', label: 'Calendar' },
  { href: '/profile/payments', label: 'Payments' },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isDev = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    if (!isDev && status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/profile');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (!session?.user && !isDev) {
    return null;
  }

  const user =
    (session?.user as { name?: string | null; role?: string } | undefined) ??
    { name: 'Demo member', role: 'member' };

  return (
    <div className="profile-layout">
      <div className="container">
        <div className="profile-header">
          <div className="profile-tabs" role="tablist">
            {PROFILE_TABS.map((tab) => {
              const isActive =
                pathname === tab.href ||
                (tab.href !== '/profile' && pathname?.startsWith(tab.href));
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  role="tab"
                  aria-selected={isActive}
                  className={`profile-tab${isActive ? ' active' : ''}`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
          <div className="profile-athlete-label">{user.name ?? 'User'}</div>
        </div>
      </div>
      <div className="profile-content">{children}</div>
    </div>
  );
}
