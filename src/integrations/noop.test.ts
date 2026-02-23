import { describe, it, expect } from 'vitest';
import { noopAdapter } from './noop';

describe('noop adapter', () => {
  it('has id noop', () => {
    expect(noopAdapter.id).toBe('noop');
  });

  it('healthy always returns true', async () => {
    expect(await noopAdapter.healthy()).toBe(true);
  });
});
