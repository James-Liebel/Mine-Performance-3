import { redirect } from 'next/navigation';

/** Stats section removed from profile; redirect to profile. */
export default function ProfileStatsPage() {
  redirect('/profile');
}
