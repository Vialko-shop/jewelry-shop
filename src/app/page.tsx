import type { Metadata } from 'next';
import Storefront from '@/components/Storefront';
import { getCatalog } from '@/lib/catalog';

// ISR: сторінка статична, оновлюється кожні 60 с і одразу після змін в адмінці
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  const products = await getCatalog();
  return <Storefront products={products} />;
}
