import Storefront from '@/components/Storefront';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getProducts } from '@/lib/products';
import { products as fallbackProducts } from '@/data/products';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let items = fallbackProducts;
  if (isSupabaseConfigured) {
    try {
      const data = await getProducts();
      if (data && data.length) items = data;
    } catch {
      /* on any error, show the static catalog */
    }
  }
  return <Storefront initialProducts={items} />;
}
