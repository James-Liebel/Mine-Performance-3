import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mineperformance.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/member-registration',
    '/events',
    '/login',
    '/profile',
    '/contact',
    '/rentals',
    '/about',
    '/admin',
  ];
  return routes.map((path) => {
    const url = path === '' ? BASE : `${BASE}${path}`;
    const changeFrequency: 'weekly' | 'monthly' = path === '' || path === '/events' ? 'weekly' : 'monthly';
    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority: path === '' ? 1 : 0.8,
    };
  });
}
