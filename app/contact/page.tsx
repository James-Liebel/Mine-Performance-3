import { contactPage } from '@/content/site-copy';
import { Button } from '@/components/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: contactPage.description,
};

export default function ContactPage() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {contactPage.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{contactPage.lead}</p>
        <p className="mt-4 text-neutral-600">{contactPage.description}</p>
        <div className="mt-12 flex flex-col gap-4">
          <Button href="#book" variant="primary" size="lg">
            {contactPage.cta}
          </Button>
          <p className="text-sm text-neutral-500">
            Placeholder — needs client content. Add contact form, booking link, phone, or email here.
          </p>
        </div>
      </div>
    </div>
  );
}
