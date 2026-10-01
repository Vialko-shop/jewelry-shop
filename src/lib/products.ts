import { supabase, PHOTO_BUCKET } from './supabase';
import type { ExtendedProduct, ProductStatus } from '@/data/products';

// Row shape of the `products` table in Supabase (snake_case)
export interface ProductRow {
  id: string;
  name: string;
  name_ua: string;
  price: number;
  material: 'gold' | 'silver' | 'bijouterie';
  category: 'ring' | 'earrings' | 'bracelet' | 'necklace' | 'set';
  description: string;
  image: string | null;
  image2: string | null;
  image3: string | null;
  status: ProductStatus;
  weight: string | null;
  size: string | null;
  badges: string[];
  sort_order: number;
  /** optional column — exists only after `alter table products add column old_price integer` */
  old_price?: number | null;
}

// DB row → shape the storefront/admin expect
export function rowToProduct(r: ProductRow): ExtendedProduct {
  return {
    id: r.id,
    name: r.name,
    nameUa: r.name_ua,
    price: Number(r.price) || 0,
    material: r.material,
    category: r.category,
    description: r.description ?? '',
    image: r.image ?? '', // empty → card shows the "Фото скоро" placeholder
    image2: r.image2 ?? undefined,
    image3: r.image3 ?? undefined,
    inStock: r.status !== 'sold',
    weight: r.weight ?? undefined,
    size: r.size ?? undefined,
    status: r.status,
    badges: r.badges?.length ? r.badges : undefined,
    oldPrice: r.old_price ? Number(r.old_price) : undefined,
    sortOrder: r.sort_order,
  };
}

// ── Public catalog read ──────────────────────────────────────────────
export async function getProducts(): Promise<ExtendedProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

/** Admin: raw rows (to know which optional columns exist) */
export async function getProductRows(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as ProductRow[];
}

// ── Admin: mom's edits ───────────────────────────────────────────────
export async function updateProductPrice(id: string, price: number) {
  const { error } = await supabase.from('products').update({ price }).eq('id', id);
  if (error) throw error;
}

export async function updateProductImage(id: string, url: string) {
  const { error } = await supabase.from('products').update({ image: url }).eq('id', id);
  if (error) throw error;
}

export type EditableFields = Partial<Omit<ProductRow, 'id'>>;

export async function updateProduct(id: string, patch: EditableFields) {
  const { data, error } = await supabase.from('products').update(patch).eq('id', id).select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('NO_ROWS_UPDATED');
}

export async function createProducts(rows: ProductRow[]) {
  const clean = rows.map(({ old_price, ...rest }) => (old_price == null ? rest : { ...rest, old_price }));
  const { error } = await supabase.from('products').insert(clean);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const { data, error } = await supabase.from('products').delete().eq('id', id).select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('NO_ROWS_DELETED');
}

/** Видалити кілька товарів за id → кількість реально видалених */
export async function deleteProducts(ids: string[]) {
  if (!ids.length) return 0;
  const { data, error } = await supabase.from('products').delete().in('id', ids).select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

// Upload a photo to storage → returns a public URL
export async function uploadProductPhoto(file: File, productId: string): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${productId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type || undefined });
  if (error) throw error;
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── Admin auth (Supabase Auth) ───────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Ask the storefront to drop its cache so mom's edits appear right away */
export async function requestStorefrontRefresh(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return false;
    const res = await fetch('/api/revalidate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
