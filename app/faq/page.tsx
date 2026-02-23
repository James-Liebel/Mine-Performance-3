import { redirect } from 'next/navigation';

/**
 * FAQ is now delivered as a site-wide chat widget (bottom-right).
 * Redirect to home so users see the widget.
 */
export default function FAQPage() {
  redirect('/');
}
