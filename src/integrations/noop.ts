/**
 * No-op adapter — safe default when an integration is not configured.
 * Use when env vars are unset or in dev without real backends.
 */

import type { IntegrationAdapter } from './types';

export const noopAdapter: IntegrationAdapter = {
  id: 'noop',
  async healthy(): Promise<boolean> {
    return true;
  },
};
