import { redirect } from 'next/navigation';

/** Programs and memberships are combined on the training options page. */
export default function ProgramsPage() {
  redirect('/member-registration');
}
