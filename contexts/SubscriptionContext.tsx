'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { SubscriptionTier } from '@/lib/subscription';

const STORAGE_KEY = 'mine-perf-subscription-tier';

type SubscriptionContextValue = {
  tier: SubscriptionTier;
  setTier: (t: SubscriptionTier) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function getStoredTier(): SubscriptionTier {
  if (typeof window === 'undefined') return 'basic';
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === 'basic' || s === 'premium' || s === 'all') return s;
  } catch {}
  return 'basic';
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<SubscriptionTier>('basic');

  useEffect(() => {
    setTierState(getStoredTier());
  }, []);

  const setTier = useCallback((t: SubscriptionTier) => {
    setTierState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }, []);

  return (
    <SubscriptionContext.Provider value={{ tier, setTier }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
