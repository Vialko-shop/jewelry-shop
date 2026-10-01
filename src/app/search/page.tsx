import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCatalog } from '@/lib/catalog';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchResults from './SearchResults';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Пошук прикрас',
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
};

export default async function Page() {
  const items = await getCatalog();
  return (
    <div className="wrap pb-10">
      <Breadcrumbs items={[{ label: 'Пошук' }]} />
      <Suspense fallback={<p className="py-10 text-ink-3">Завантаження…</p>}>
        <SearchResults items={items} />
      </Suspense>
    </div>
  );
}
