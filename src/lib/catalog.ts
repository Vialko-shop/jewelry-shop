import { unstable_cache } from 'next/cache';
import { isSupabaseConfigured } from './supabase';
import { getProducts } from './products';
import { products as localProducts, type ExtendedProduct } from '@/data/products';
import { DEMO_PRODUCTS } from '@/data/demoProducts';
import { badgeKeys, type BadgeKey } from './taxonomy';

/** Tag used by /api/revalidate after edits in /vialko-admin */
export const CATALOG_TAG = 'products';

const loadFromSupabase = unstable_cache(
  async () => getProducts(),
  ['vialko-catalog-v2'],
  { tags: [CATALOG_TAG], revalidate: 60 },
);

/** Without Supabase env (local dev / tests): the real 12 items + showcase demo items */
function localCatalog(): ExtendedProduct[] {
  const real = localProducts.map((p) => ({ ...p, image: '', image2: undefined, image3: undefined }));
  return [...real, ...DEMO_PRODUCTS];
}

/**
 * Whole catalog, cached (ISR). Throws on a Supabase error so Next keeps
 * serving the last good page instead of caching an empty/wrong store.
 */
export async function getCatalog(): Promise<ExtendedProduct[]> {
  if (!isSupabaseConfigured) return localCatalog();
  return loadFromSupabase();
}

export async function getProduct(id: string) {
  const all = await getCatalog();
  return all.find((p) => p.id === id) ?? null;
}

export function related(all: ExtendedProduct[], p: ExtendedProduct, n = 10) {
  const score = (x: ExtendedProduct) =>
    (x.category === p.category ? 2 : 0) + (x.material === p.material ? 1 : 0) + (x.status !== 'sold' ? 0.5 : 0) + (x.image ? 0.75 : 0);
  return all
    .filter((x) => x.id !== p.id)
    .map((x) => ({ x, s: score(x) }))
    .sort((a, b) => b.s - a.s || (a.x.sortOrder ?? 0) - (b.x.sortOrder ?? 0))
    .slice(0, n)
    .map((r) => r.x);
}

export const withBadge = (all: ExtendedProduct[], b: BadgeKey) => all.filter((p) => badgeKeys(p.badges).includes(b));

/** Light shape for client islands (header search, wishlist, compare) */
export interface LiteProduct {
  id: string;
  nameUa: string;
  price: number;
  oldPrice?: number;
  image: string;
  image2?: string;
  category: ExtendedProduct['category'];
  material: ExtendedProduct['material'];
  status: ExtendedProduct['status'];
  badges?: string[];
  description?: string;
  weight?: string;
  size?: string;
}

export const toLite = (p: ExtendedProduct, withDetails = false): LiteProduct => ({
  id: p.id,
  nameUa: p.nameUa,
  price: p.price,
  oldPrice: p.oldPrice,
  image: p.image,
  image2: p.image2,
  category: p.category,
  material: p.material,
  status: p.status,
  badges: p.badges,
  ...(withDetails ? { description: p.description, weight: p.weight, size: p.size } : {}),
});
