import { describe, it, expect } from 'vitest';
import { matchFAQ, hasHighConfidence } from './faq-matcher';
import type { FAQEntry } from '@/content/faq';

const FAQ_ENTRIES: FAQEntry[] = [
  {
    id: 'get-started',
    question: 'How do I get started?',
    answer: "Book an evaluation and we'll match you with the right program.",
    tags: ['getting started', 'evaluation', 'booking'],
  },
  {
    id: 'location',
    question: 'Where are you located?',
    answer: "We're at 4999 Houston Rd Suite 500-2, Florence, KY 41042.",
    tags: ['location', 'address', 'where'],
  },
  {
    id: 'ages',
    question: 'What ages do you work with?',
    answer: 'We serve athletes from 10U through high school.',
    tags: ['ages', 'age', 'youth'],
  },
];

describe('matchFAQ', () => {
  it('returns top matches for exact question phrase', () => {
    const results = matchFAQ('How do I get started?', FAQ_ENTRIES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.id).toBe('get-started');
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('returns matches for keyword overlap', () => {
    const results = matchFAQ('where location address', FAQ_ENTRIES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.id).toBe('location');
  });

  it('returns matches for partial phrase', () => {
    const results = matchFAQ('get started', FAQ_ENTRIES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.id).toBe('get-started');
  });

  it('returns empty for unrelated query', () => {
    const results = matchFAQ('xyzzy nothing', FAQ_ENTRIES);
    expect(results.length).toBe(0);
  });

  it('returns empty for empty query', () => {
    expect(matchFAQ('', FAQ_ENTRIES)).toEqual([]);
    expect(matchFAQ('   ', FAQ_ENTRIES)).toEqual([]);
  });

  it('normalizes input (lowercase, punctuation)', () => {
    const results = matchFAQ('HOW DO I GET STARTED!!!', FAQ_ENTRIES);
    expect(results[0].entry.id).toBe('get-started');
  });

  it('respects topK limit', () => {
    const results = matchFAQ('age location start', FAQ_ENTRIES, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });
});

describe('hasHighConfidence', () => {
  it('returns true when top score >= 0.3', () => {
    expect(
      hasHighConfidence([{ entry: FAQ_ENTRIES[0], score: 0.5 }])
    ).toBe(true);
  });

  it('returns false when top score < 0.3', () => {
    expect(
      hasHighConfidence([{ entry: FAQ_ENTRIES[0], score: 0.2 }])
    ).toBe(false);
  });

  it('returns false for empty results', () => {
    expect(hasHighConfidence([])).toBe(false);
  });
});
