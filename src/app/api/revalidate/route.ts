import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CATALOG_TAG } from '@/lib/catalog';

// Викликається з /vialko-admin після збереження: вітрина оновлюється одразу, а не через 60 с.
// Доступ — лише з дійсним токеном входу Supabase (мамин логін).
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 });
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ ok: false }, { status: 401 });

  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, at: Date.now() });
}
