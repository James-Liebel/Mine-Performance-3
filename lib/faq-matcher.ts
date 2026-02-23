/**
 * Lightweight FAQ matcher: keyword overlap + phrase contains + tag boosts.
 * No embeddings or external AI.
 */

import type { FAQEntry } from '@/content/faq';

export interface MatchResult {
  entry: FAQEntry;
  score: number;
}

const MIN_SCORE_THRESHOLD = 0.15;
const TOP_K = 3;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  const norm = normalize(text);
  return norm ? norm.split(' ').filter((t) => t.length > 1) : [];
}

function phraseContains(phrase: string, target: string): boolean {
  const p = normalize(phrase);
  const t = normalize(target);
  return t.includes(p) || p.includes(t);
}

/**
 * Score a single FAQ entry against the user query.
 */
function scoreEntry(
  entry: FAQEntry,
  queryTokens: string[],
  queryNormalized: string
): number {
  let score = 0;
  const questionTokens = tokenize(entry.question);
  const answerTokens = tokenize(entry.answer);
  const tagTokens = (entry.tags ?? []).flatMap((t) => tokenize(t));
  const allEntryTokens = Array.from(
    new Set([...questionTokens, ...answerTokens, ...tagTokens])
  );

  // Keyword overlap (question + answer)
  for (const qt of queryTokens) {
    for (const et of allEntryTokens) {
      if (qt === et) score += 0.3;
      else if (et.startsWith(qt) || qt.startsWith(et)) score += 0.15;
    }
  }

  // Phrase contains: query in question or question in query
  if (phraseContains(entry.question, queryNormalized)) score += 0.5;

  // Tag boost
  for (const qt of queryTokens) {
    for (const tag of entry.tags ?? []) {
      const tagNorm = normalize(tag);
      if (tagNorm.includes(qt) || qt.includes(tagNorm)) score += 0.2;
    }
  }

  return score;
}

/**
 * Match user query to best FAQ entries. Returns top 1–3 matches with scores.
 */
export function matchFAQ(
  query: string,
  entries: FAQEntry[],
  topK: number = TOP_K
): MatchResult[] {
  const qn = normalize(query);
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = entries
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, tokens, qn),
    }))
    .filter((r) => r.score >= MIN_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

/**
 * Check if the top match has sufficient confidence.
 */
export function hasHighConfidence(results: MatchResult[]): boolean {
  if (results.length === 0) return false;
  const top = results[0];
  // Require at least one strong signal
  return top.score >= 0.3;
}
