import { CoachesRedirect } from './CoachesRedirect';

/** Coaching staff is on the About page. Redirect /coaches so it works with static export and basePath. */
export default function CoachesPage() {
  return <CoachesRedirect />;
}
