import { redirect } from 'next/navigation';

/** Coaching staff is now on the About us page. Redirect old /coaches links. */
export default function CoachesPage() {
  redirect('/about#coaching-staff');
}
