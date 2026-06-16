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
}

// DB row → shape the storefront/admin expect
export function rowToProduct(r: ProductRow): ExtendedProduct {
  return {
    id: r.id,
    name: r.name,
    nameUa: r.name_ua,
    price: r.price,
    material: r.material,
    category: r.category,
    description: r.description,
    image: r.image ?? '', // empty → card shows the "Фото скоро" placeholder
    image2: r.image2 ?? undefined,
    image3: r.image3 ?? undefined,
    inStock: r.status !== 'sold',
    weight: r.weight ?? undefined,
    size: r.size ?? undefined,
    status: r.status,
    badges: r.badges?.length ? r.badges : undefined,
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

// ── Admin: mom's edits ───────────────────────────────────────────────
export async function updateProductPrice(id: string, price: number) {
  const { error } = await supabase.from('products').update({ price }).eq('id', id);
  if (error) throw error;
}

export async function updateProductImage(id: string, url: string) {
  const { error } = await supabase.from('products').update({ image: url }).eq('id', id);
  if (error) throw error;
}

// Upload a photo to storage → returns a public URL
export async function uploadProductPhoto(file: File, productId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${productId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' });
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
