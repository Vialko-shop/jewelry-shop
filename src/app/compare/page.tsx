import type { Metadata } from 'next';
import { getCatalog } from '@/lib/catalog';
import Breadcrumbs from '@/components/Breadcrumbs';
import CompareTable from './CompareTable';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Порівняння прикрас',
  robots: { index: false, follow: true },
};

export default async function Page() {
  const items = await getCatalog();
  return (
    <div className="wrap pb-10">
      <Breadcrumbs items={[{ label: 'Порівняння' }]} />
      <CompareTable items={items} />
    </div>
  );
}
