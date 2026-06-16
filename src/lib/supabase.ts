import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(url && anon);
export const PHOTO_BUCKET = 'product-photos';

// Guard: if env vars are missing, fall back to a harmless placeholder so module
// import never throws. Every data/auth call is gated behind `isSupabaseConfigured`,
// so this placeholder client is never actually used — the site just shows the
// static fallback catalog instead of crashing.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anon || 'placeholder-anon-key'
);
