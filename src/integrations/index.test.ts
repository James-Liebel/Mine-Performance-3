import { describe, it, expect } from 'vitest';
import { getAdapter, getAllAdapters, checkAllHealthy, noopAdapter } from './index';

describe('integration registry', () => {
  it('getAdapter returns adapter by id', () => {
    expect(getAdapter('statstak').id).toBe('statstak');
    expect(getAdapter('noop').id).toBe('noop');
  });

  it('getAdapter returns noop for unknown id', () => {
    const adapter = getAdapter('does-not-exist');
    expect(adapter).toBe(noopAdapter);
    expect(adapter.id).toBe('noop');
  });

  it('getAllAdapters returns all registered adapters', () => {
    const adapters = getAllAdapters();
    expect(adapters.length).toBeGreaterThanOrEqual(2);
    expect(adapters.map((a) => a.id)).toContain('statstak');
    expect(adapters.map((a) => a.id)).toContain('noop');
  });

  it('checkAllHealthy returns status for each integration', async () => {
    const { ok, integrations } = await checkAllHealthy();
    expect(typeof ok).toBe('boolean');
    expect(integrations).toHaveProperty('statstak');
    expect(integrations).toHaveProperty('noop');
    expect(integrations.noop).toBe(true);
  });
});
