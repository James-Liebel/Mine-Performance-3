/**
 * Home page copy and structure. Used by app/page.tsx and home section components.
 */
export const FEATURES = [
  {
    title: 'Memberships & plans',
    description:
      'Adult and youth programs: hitting, pitching, strength, and combos. Choose your focus and days per week — billed every 4 weeks.',
    icon: '⚾',
  },
  {
    title: 'Scheduling & events',
    description:
      'View all events on the calendar, book camps and clinics by day, and see only the events you’re signed up for.',
    icon: '📅',
  },
  {
    title: 'Rentals',
    description:
      'Reserve hitting labs, pitching lab, turf, and cages by date and time. Perfect for solo work or team sessions.',
    icon: '🏟️',
  },
  {
    title: 'Data-driven development',
    description:
      'Track velocity, spin rate, exit velo, and more. Coaches use radar and tech so you see where you stand and what’s next.',
    icon: '📊',
  },
] as const;

export const PROGRAMS = [
  { name: 'Memberships', desc: 'Adult & youth plans — hitting, pitching, strength', href: '/member-registration' },
  { name: 'Scheduling', desc: 'Events, camps, clinics — view calendar and book', href: '/events' },
  { name: 'Rentals', desc: 'Labs, cages, turf — reserve by date and time', href: '/rentals' },
] as const;

export const STATS = [
  { value: '500+', label: 'Pitchers trained' },
  { value: '70+', label: 'Successful rehabs' },
  { value: '35', label: 'College commits (24 mo.)' },
  { value: '5', label: 'Expert coaches' },
] as const;
