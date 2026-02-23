import type { Metadata } from 'next';
import { SITE_NAME, SITE_PHONE, SITE_EMAIL } from '@/lib/config';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mineperformanceacademy.com';

export const defaultMetadata: Metadata = {
  title: 'Mine Performance Academy | Data-Driven Baseball Training',
  description:
    'Baseball and athletic performance training in Florence, KY. Assessments, pitching & hitting programs, strength training, and progress tracking for athletes of all ages.',
  openGraph: {
    title: 'Mine Performance Academy | Data-Driven Baseball Training',
    description:
      'Baseball and athletic performance training in Florence, KY. Assessments, pitching & hitting programs, strength training, and progress tracking.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: SITE_NAME,
    description:
      'Baseball and athletic performance training. Assessments, programs, and progress tracking.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4999 Houston Rd Suite 500-2',
      addressLocality: 'Florence',
      addressRegion: 'KY',
      postalCode: '41042',
      addressCountry: 'US',
    },
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '20:00',
      },
    ],
    url: SITE_URL,
  };
}
