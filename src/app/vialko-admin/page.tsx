'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getProducts, updateProductPrice, uploadProductPhoto, updateProductImage,
  signIn, signOut, getCurrentUser,
} from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { ExtendedProduct } from '@/data/products';
import PhotoSlot from '@/components/PhotoSlot';

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<ExtendedProduct[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const data = await getProducts();
    setItems(data);
    const p: Record<string, string> = {};
    data.forEach((d) => (p[d.id] = String(d.price)));
    setPrices(p);
  }, []);

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured) { setChecking(false); return; }
      try {
        const u = await getCurrentUser();
        if (u) { setAuthed(true); await load(); }
      } catch { /* not logged in */ }
      setChecking(false);
    })();
  }, [load]);

  const onLogin = async () => {
    setErr(''); setBusy(true);
    try { await signIn(email.trim(), password); setAuthed(true); await load(); }
    catch { setErr('Невірний email або пароль. Спробуйте ще раз.'); }
    finally { setBusy(false); }
  };

  const onLogout = async () => { await signOut(); setAuthed(false); setItems([]); };

  const savePrice = async (id: string) => {
    const val = Number(prices[id]);
    if (!Number.isFinite(val) || val < 0) return;
    setSaved((s) => ({ ...s, [id]: '…' }));
    try {
      await updateProductPrice(id, val);
      setSaved((s) => ({ ...s, [id]: 'Збережено ✓' }));
      setTimeout(() => setSaved((s) => ({ ...s, [id]: '' })), 2500);
    } catch { setSaved((s) => ({ ...s, [id]: 'Помилка' })); }
  };

  const uploadPhoto = async (id: string, file: File | null) => {
    if (!file) return;
    setSaved((s) => ({ ...s, [id]: 'Завантаження…' }));
    try {
      const url = await uploadProductPhoto(file, id);
      await updateProductImage(id, url);
      setItems((list) => list.map((it) => (it.id === id ? { ...it, image: url } : it)));
      setSaved((s) => ({ ...s, [id]: 'Фото оновлено ✓' }));
      setTimeout(() => setSaved((s) => ({ ...s, [id]: '' })), 2500);
    } catch { setSaved((s) => ({ ...s, [id]: 'Помилка фото' })); }
  };

  if (checking) return <div className="adm"><p className="hint">Завантаження…</p></div>;

  if (!isSupabaseConfigured) return (
    <div className="adm"><div className="adm-card">
      <div className="adm-logo">VIALKO</div>
      <div className="adm-logo-sub">Адмін-панель</div>
      <p className="hint" style={{ marginTop: 20 }}>База даних ще не підключена.</p>
    </div></div>
  );

  if (!authed) return (
    <div className="adm"><div className="adm-card">
      <div className="adm-logo">VIALKO</div>
      <div className="adm-logo-sub">Адмін-панель</div>
      <h1>Вхід</h1>
      <p className="hint">Введіть логін та пароль, щоб редагувати ціни та фото.</p>
      <div className="field"><label>Email</label>
        <input type="email" value={email} autoComplete="username"
          onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onLogin()} /></div>
      <div className="field"><label>Пароль</label>
        <input type="password" value={password} autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onLogin()} /></div>
      {err && <div className="err">{err}</div>}
      <button className="btn btn-gold" style={{ width: '100%' }} type="button" onClick={onLogin} disabled={busy}>
        {busy ? 'Вхід…' : 'Увійти'}
      </button>
    </div></div>
  );

  return (
    <div className="adm">
      <div className="adm-top">
        <div>
          <div className="adm-logo" style={{ fontSize: 24 }}>VIALKO</div>
          <div className="who">Редагування цін та фото · {items.length} товарів</div>
        </div>
        <button className="btn btn-ghost btn-sm" type="button" onClick={onLogout}>Вийти</button>
      </div>
      <div className="adm-list">
        {items.map((it) => (
          <div className="adm-row" key={it.id}>
            <div className="adm-thumb"><PhotoSlot src={it.image || null} alt={it.nameUa} label=" " /></div>
            <div>
              <div className="nm">{it.nameUa}</div>
              <div className="meta">{it.material === 'gold' ? 'Золото' : it.material === 'silver' ? 'Срібло' : 'Біжутерія'}</div>
              <div className="adm-saved">{saved[it.id] || ''}</div>
            </div>
            <div className="adm-controls">
              <div className="adm-field"><label>Ціна, ₴</label>
                <input type="number" min={0} value={prices[it.id] ?? ''}
                  onChange={(e) => setPrices((p) => ({ ...p, [it.id]: e.target.value }))} /></div>
              <button className="btn btn-gold btn-sm" type="button" onClick={() => savePrice(it.id)}>Зберегти ціну</button>
              <label className="btn btn-ghost btn-sm adm-photo-btn">Завантажити фото
                <input type="file" accept="image/*" onChange={(e) => uploadPhoto(it.id, e.target.files?.[0] || null)} /></label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
