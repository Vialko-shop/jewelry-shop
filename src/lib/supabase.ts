import { createClient } from '@supabase/supabase-js';

// Public keys are safe to expose in the browser.
// Data access is protected by RLS policies on the Supabase side.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export const isSupabaseConfigured = Boolean(url && anonKey);

export const PHOTO_BUCKET = 'product-photos';
