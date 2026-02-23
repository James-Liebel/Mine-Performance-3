/**
 * Credit counting and tracking: records every credit add/deduct with reason and reference.
 * Mimics payment logic so when Stripe (or admin) records a payment, we add credits here
 * and optionally deduct when user spends (e.g. booking). Balance is kept in user-store;
 * this store is the audit log.
 */

import { loadJSON, saveJSON } from './persist';
import { getUserByEmail, updateUser } from './user-store';

export type CreditReason =
  | 'stripe_purchase'   // Payment received via Stripe (checkout.session.completed)
  | 'stripe_refund'     // Refund from Stripe
  | 'booking_spend'     // Credits used to book an event/session
  | 'admin_adjustment'  // Admin added or removed credits
  | 'membership_grant'  // Credits granted with membership
  | 'other';

export interface CreditTransaction {
  id: string;
  email: string;
  amount: number;       // positive = add, negative = deduct
  reason: CreditReason;
  reference?: string;  // e.g. Stripe session id, booking id
  createdAt: string;   // ISO
}

const FILE = 'credit-transactions.json';
const MAX_TRANSACTIONS = 5000;
const DEFAULT_HISTORY_LIMIT = 50;

let transactions: CreditTransaction[] = loadJSON<CreditTransaction[]>(FILE) ?? [];

function persist(): void {
  const toSave = transactions.slice(-MAX_TRANSACTIONS);
  saveJSON(FILE, toSave);
}

function nextId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Record a credit change: updates the user's balance and appends a transaction.
 * Use this for all credit adds/deducts (Stripe webhook, booking, admin).
 * User must exist (by email); if not, transaction is still recorded but balance is not updated.
 */
export function recordCreditChange(
  email: string,
  amount: number,
  reason: CreditReason,
  reference?: string
): { ok: boolean; newBalance: number | null; transaction: CreditTransaction } {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return {
      ok: false,
      newBalance: null,
      transaction: { id: '', email, amount, reason, reference, createdAt: new Date().toISOString() },
    };
  }

  const tx: CreditTransaction = {
    id: nextId(),
    email: normalizedEmail,
    amount,
    reason,
    reference,
    createdAt: new Date().toISOString(),
  };
  transactions.push(tx);
  persist();

  const user = getUserByEmail(normalizedEmail);
  if (user) {
    const updated = updateUser(normalizedEmail, { creditsDelta: amount });
    return {
      ok: true,
      newBalance: updated?.credits ?? user.credits + amount,
      transaction: tx,
    };
  }

  return { ok: true, newBalance: null, transaction: tx };
}

/**
 * Get recent credit transactions for a user (newest first).
 */
export function getTransactionsByEmail(
  email: string,
  limit: number = DEFAULT_HISTORY_LIMIT
): CreditTransaction[] {
  const normalized = email.trim().toLowerCase();
  return transactions
    .filter((t) => t.email.toLowerCase() === normalized)
    .slice(-limit)
    .reverse();
}
