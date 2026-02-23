/**
 * Main navigation structure. Used by Nav component.
 * V1: Flat conversion-first nav — Programs | About us | Scheduling | Rentals | Commits | Contact
 */
export type NavChild = { href: string; label: string };
export type NavGroup = { id: string; label: string; children: NavChild[] };

/** Primary marketing nav — same order on every page for conversion */
export const PRIMARY_NAV_LINKS: NavChild[] = [
  { href: '/programs', label: 'Programs' },
  { href: '/about', label: 'About us' },
  { href: '/events', label: 'Scheduling' },
  { href: '/rentals', label: 'Rentals' },
  { href: '/results', label: 'Commits' },
  { href: '/contact', label: 'Contact' },
];

/** Legacy dropdown groups — kept for backward compat if needed */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'train',
    label: 'Train',
    children: [
      { href: '/member-registration', label: 'Memberships' },
      { href: '/rentals', label: 'Rentals' },
      { href: '/events', label: 'Scheduling' },
    ],
  },
];

export const STANDALONE_LINKS: NavChild[] = [
  { href: '/about', label: 'About us' },
  { href: '/results', label: 'College commits' },
  { href: '/contact', label: 'Contact' },
];

export function groupIsActive(
  group: NavGroup,
  pathname: string | null
): boolean {
  if (!pathname) return false;
  return group.children.some(
    (child) =>
      pathname === child.href || pathname.startsWith(child.href + '/')
  );
}

export function linkIsActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(href + '/');
}
