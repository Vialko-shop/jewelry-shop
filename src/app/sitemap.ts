import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';
import { COLLECTIONS } from '@/lib/taxonomy';
import { ARTICLES } from '@/data/content';
import { SITE, INFO_LINKS } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog();
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/catalog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    ...COLLECTIONS.map((c) => ({ url: `${SITE.url}/catalog/${c.slug}`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: `${SITE.url}/product/${encodeURIComponent(p.id)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      ...(p.image ? { images: [p.image.startsWith('/') ? `${SITE.url}${p.image}` : p.image] } : {}),
    })),
    ...INFO_LINKS.map((l) => ({ url: `${SITE.url}${l.href}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 })),
    ...ARTICLES.map((a) => ({ url: `${SITE.url}/blog/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
