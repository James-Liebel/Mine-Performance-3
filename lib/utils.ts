/**
 * Minimal class name helper (MP2 does not use tailwind-merge).
 * Used only if any component imports @/lib/utils.
 */
export function cn(...inputs: (string | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
