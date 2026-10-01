import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CatalogPage from '@/components/CatalogPage';
import { getCatalog } from '@/lib/catalog';
import { COLLECTIONS, collectionBySlug } from '@/lib/taxonomy';

export const revalidate = 60;
// Невідомі slug → notFound() у самій сторінці. dynamicParams=false не використовуємо:
// після revalidatePath (збереження в адмінці) такі сторінки віддавали 404.

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<'/catalog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const c = collectionBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.h1} — купити в ювелірному магазині`,
    description: c.seo,
    alternates: { canonical: `/catalog/${c.slug}` },
    openGraph: { title: `${c.h1} | VIALKO`, description: c.seo, url: `/catalog/${c.slug}` },
  };
}

export default async function Page({ params }: PageProps<'/catalog/[slug]'>) {
  const { slug } = await params;
  const c = collectionBySlug(slug);
  if (!c) notFound();
  const all = await getCatalog();
  const items = all.filter(c.match);
  return <CatalogPage title={c.h1} items={items} collection={c} seo={c.seo} />;
}
