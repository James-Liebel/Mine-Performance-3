import { redirect } from 'next/navigation';

/** Start flow removed; redirect to login. */
export default function StartPage() {
  redirect('/login');
}
