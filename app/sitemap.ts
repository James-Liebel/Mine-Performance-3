import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mine-performance.example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/method', '/programs', '/coaches', '/facility', '/results', '/events', '/rehab', '/contact'];
  return paths.map((path) => ({
    url: path ? `${BASE}${path}` : `${BASE}/`,
    lastModified: new Date(),
    changeFrequency: path ? ('weekly' as const) : ('monthly' as const),
    priority: path ? 0.8 : 1,
  }));
}
