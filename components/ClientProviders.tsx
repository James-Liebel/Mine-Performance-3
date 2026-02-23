'use client';

import { SessionProvider } from 'next-auth/react';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { SiteContentProvider } from '@/contexts/SiteContentContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SiteContentProvider>
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </SiteContentProvider>
    </SessionProvider>
  );
}
