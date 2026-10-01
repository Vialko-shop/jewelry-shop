'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, LogOut, Plus, Search, ChevronDown, Trash2, Save, ImagePlus, X, Sparkles, Loader2, Check } from 'lucide-react';
import {
  getProductRows,
  updateProduct,
  uploadProductPhoto,
  createProducts,
  deleteProduct,
  deleteProducts,
  signIn,
  signOut,
  getCurrentUser,
  requestStorefrontRefresh,
  type ProductRow,
  type EditableFields,
} from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase';
import { DEMO_PREFIX, DEMO_ROWS } from '@/data/demoProducts';
import { CATEGORIES, MATERIALS, STATUS, badgeKeys } from '@/lib/taxonomy';
import PhotoSlot from '@/components/PhotoSlot';
import { DiamondMark } from '@/components/Icons';

type Msg = { tone: 'ok' | 'err' | 'wait'; text: string } | null;
const BADGE_OPTIONS = [
  { key: 'hit', label: 'Хіт' },
  { key: 'new', label: 'Новинка' },
  { key: 'sale', label: 'Акція' },
] as const;

/**
 * Зменшуємо великі фото з телефону перед завантаженням (швидше і легше).
 * HEIC (iPhone) перетворюємо в JPEG, якщо браузер уміє його прочитати, інакше просимо інший формат.
 */
async function shrink(file: File, max = 1800): Promise<File> {
  const heic = /^image\/hei[cf]$/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
  if (!heic && !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    if (heic) throw new Error('UNSUPPORTED_IMAGE');
    return file;
  }
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  if (!heic && scale === 1 && file.size < 1.5e6) return file;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; // прозорий PNG → білий фон, а не чорний
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.86));
  if (!blob) {
    if (heic) throw new Error('UNSUPPORTED_IMAGE');
    return file;
  }
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}

/** Приклад, якому ще не поставили власне фото (такі можна видаляти пакетно) */
const isUntouchedDemo = (r: ProductRow) => r.id.startsWith(DEMO_PREFIX) && (!r.image || r.image.startsWith('/demo/'));

function errText(e: unknown) {
  const m = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);
  if (m === 'UNSUPPORTED_IMAGE') return 'Цей формат фото не підтримується — оберіть JPG або PNG.';
  if (/NO_ROWS|row-level security|permission|not allowed|violates/i.test(m)) return 'Немає доступу до цієї дії (перевірте вхід або права в базі).';
  if (/Failed to fetch|network/i.test(m)) return 'Немає зв’язку з інтернетом. Спробуйте ще раз.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}

function Note({ msg }: { msg: Msg }) {
  if (!msg) return null;
  const cls = msg.tone === 'ok' ? 'text-ok' : msg.tone === 'err' ? 'text-wine' : 'text-ink-3';
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${cls}`} role="status">
      {msg.tone === 'wait' ? <Loader2 size={14} className="animate-spin" /> : msg.tone === 'ok' ? <Check size={14} /> : null}
      {msg.text}
    </span>
  );
}

function PhotoField({ label, url, busy, onPick, onClear }: { label: string; url: string | null; busy: boolean; onPick: (f: File) => void; onClear: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className="label mb-1.5">{label}</p>
      <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-[#f6f3ee]">
        <PhotoSlot src={url} alt="" sizes="160px" label={busy ? 'Завантаження…' : 'Немає фото'} />
        {url && !busy && (
          <button type="button" onClick={onClear} className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow" aria-label={`Прибрати ${label}`}>
            <X size={15} />
          </button>
        )}
      </div>
      <button type="button" className="btn btn-line btn-sm mt-2 w-full" disabled={busy} onClick={() => input.current?.click()}>
        <ImagePlus size={15} /> {url ? 'Замінити' : 'Завантажити'}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function Editor({ row, hasOld, onSaved, onDeleted }: { row: ProductRow; hasOld: boolean; onSaved: (r: ProductRow) => void; onDeleted: (id: string) => void }) {
  const [d, setD] = useState<ProductRow>(row);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  // Ціну могли змінити у швидкому полі рядка — підтягуємо, не стираючи інші незбережені правки
  useEffect(() => setD((x) => ({ ...x, price: row.price })), [row.price]);

  const set = <K extends keyof ProductRow>(k: K, v: ProductRow[K]) => setD((x) => ({ ...x, [k]: v }));
  const keys = badgeKeys(d.badges);
  const toggleBadge = (key: 'hit' | 'new' | 'sale', label: string) => {
    const others = (d.badges ?? []).filter((b) => !badgeKeys([b]).includes(key));
    set('badges', keys.includes(key) ? others : [...others, label]);
  };

  const save = async () => {
    const price = Number(d.price);
    if (!d.name_ua.trim()) return setMsg({ tone: 'err', text: 'Вкажіть назву' });
    if (!Number.isFinite(price) || price <= 0) return setMsg({ tone: 'err', text: 'Вкажіть ціну більше 0' });
    setMsg({ tone: 'wait', text: 'Зберігаю…' });
    const patch: EditableFields = {
      name_ua: d.name_ua.trim(),
      description: d.description?.trim() ?? '',
      category: d.category,
      material: d.material,
      status: d.status,
      badges: d.badges ?? [],
      price: Math.round(price),
      weight: d.weight?.trim() || null,
      size: d.size?.trim() || null,
      sort_order: Number(d.sort_order) || 0,
      image: d.image || null,
      image2: d.image2 || null,
      image3: d.image3 || null,
      ...(hasOld ? { old_price: d.old_price ? Math.round(Number(d.old_price)) : null } : {}),
    };
    try {
      await updateProduct(row.id, patch);
      onSaved({ ...row, ...patch } as ProductRow);
      setMsg({ tone: 'ok', text: 'Збережено — на сайті за хвилину' });
      requestStorefrontRefresh().then((ok) => ok && setMsg({ tone: 'ok', text: 'Збережено й оновлено на сайті' }));
    } catch (e) {
      setMsg({ tone: 'err', text: errText(e) });
    }
  };

  const upload = async (slot: 'image' | 'image2' | 'image3', f: File) => {
    setBusy(slot);
    setMsg({ tone: 'wait', text: 'Завантажую фото…' });
    try {
      const url = await uploadProductPhoto(await shrink(f), row.id);
      await updateProduct(row.id, { [slot]: url });
      setD((x) => ({ ...x, [slot]: url }));
      onSaved({ ...row, [slot]: url });
      setMsg({ tone: 'ok', text: 'Фото оновлено' });
      requestStorefrontRefresh();
    } catch (e) {
      setMsg({ tone: 'err', text: errText(e) });
    } finally {
      setBusy(null);
    }
  };

  const clearPhoto = async (slot: 'image' | 'image2' | 'image3') => {
    setBusy(slot);
    try {
      await updateProduct(row.id, { [slot]: null });
      setD((x) => ({ ...x, [slot]: null }));
      onSaved({ ...row, [slot]: null });
      setMsg({ tone: 'ok', text: 'Фото прибрано' });
      requestStorefrontRefresh();
    } catch (e) {
      setMsg({ tone: 'err', text: errText(e) });
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    setMsg({ tone: 'wait', text: 'Видаляю…' });
    try {
      await deleteProduct(row.id);
      onDeleted(row.id);
      requestStorefrontRefresh();
    } catch (e) {
      setMsg({ tone: 'err', text: errText(e) });
      setConfirmDel(false);
    }
  };

  return (
    <div className="space-y-5 border-t border-line p-4 md:p-6">
      <div className="grid grid-cols-3 gap-3 md:max-w-lg">
        <PhotoField label="Фото 1 (головне)" url={d.image} busy={busy === 'image'} onPick={(f) => upload('image', f)} onClear={() => clearPhoto('image')} />
        <PhotoField label="Фото 2" url={d.image2} busy={busy === 'image2'} onPick={(f) => upload('image2', f)} onClear={() => clearPhoto('image2')} />
        <PhotoField label="Фото 3" url={d.image3} busy={busy === 'image3'} onPick={(f) => upload('image3', f)} onClear={() => clearPhoto('image3')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="field md:col-span-2">
          <label className="label" htmlFor={`n-${row.id}`}>Назва</label>
          <input id={`n-${row.id}`} className="input" value={d.name_ua} onChange={(e) => set('name_ua', e.target.value)} />
        </div>
        <div className="field md:col-span-2">
          <label className="label" htmlFor={`d-${row.id}`}>Опис</label>
          <textarea id={`d-${row.id}`} className="textarea" rows={3} value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Метал, проба, камені, розміри…" />
        </div>
        <div className="field">
          <label className="label" htmlFor={`p-${row.id}`}>Ціна, ₴</label>
          <input id={`p-${row.id}`} className="input" inputMode="numeric" value={d.price ? String(d.price) : ''} onChange={(e) => set('price', Number(e.target.value.replace(/\D/g, '')) as ProductRow['price'])} />
        </div>
        {hasOld && (
          <div className="field">
            <label className="label" htmlFor={`o-${row.id}`}>Стара ціна, ₴ (для знижки)</label>
            <input id={`o-${row.id}`} className="input" inputMode="numeric" value={d.old_price ? String(d.old_price) : ''} onChange={(e) => set('old_price', e.target.value ? Number(e.target.value.replace(/\D/g, '')) : null)} placeholder="порожньо — без знижки" />
          </div>
        )}
        <div className="field">
          <label className="label" htmlFor={`c-${row.id}`}>Категорія</label>
          <select id={`c-${row.id}`} className="select" value={d.category} onChange={(e) => set('category', e.target.value as ProductRow['category'])}>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor={`m-${row.id}`}>Метал</label>
          <select id={`m-${row.id}`} className="select" value={d.material} onChange={(e) => set('material', e.target.value as ProductRow['material'])}>
            {MATERIALS.map((m) => (
              <option key={m.key} value={m.key}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor={`s-${row.id}`}>Наявність</label>
          <select id={`s-${row.id}`} className="select" value={d.status} onChange={(e) => set('status', e.target.value as ProductRow['status'])}>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <span className="label">Мітки на картці</span>
          <div className="flex flex-wrap gap-2">
            {BADGE_OPTIONS.map((b) => (
              <button key={b.key} type="button" className={`chip ${keys.includes(b.key) ? 'is-on' : ''}`} aria-pressed={keys.includes(b.key)} onClick={() => toggleBadge(b.key, b.label)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor={`w-${row.id}`}>Вага</label>
          <input id={`w-${row.id}`} className="input" value={d.weight ?? ''} onChange={(e) => set('weight', e.target.value)} placeholder="напр. 2,4 г" />
        </div>
        <div className="field">
          <label className="label" htmlFor={`z-${row.id}`}>Розмір(и)</label>
          <input id={`z-${row.id}`} className="input" value={d.size ?? ''} onChange={(e) => set('size', e.target.value)} placeholder="каблучки: 16-19 · браслет: 18 см" />
        </div>
        <div className="field">
          <label className="label" htmlFor={`o2-${row.id}`}>Порядок у каталозі</label>
          <input id={`o2-${row.id}`} className="input" inputMode="numeric" value={String(d.sort_order ?? 0)} onChange={(e) => set('sort_order', Number(e.target.value.replace(/[^\d-]/g, '')) || 0)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-ink" onClick={save}>
          <Save size={16} /> Зберегти зміни
        </button>
        <Link href={`/product/${encodeURIComponent(row.id)}`} target="_blank" className="btn btn-line btn-sm">
          <ExternalLink size={14} /> Переглянути на сайті
        </Link>
        <Note msg={msg} />
        <span className="ml-auto">
          {confirmDel ? (
            <span className="inline-flex items-center gap-2">
              <span className="text-sm font-semibold text-wine">Видалити назавжди?</span>
              <button type="button" className="btn btn-sm bg-wine text-white" onClick={remove}>Так, видалити</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(false)}>Ні</button>
            </span>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm text-wine" onClick={() => setConfirmDel(true)}>
              <Trash2 size={15} /> Видалити товар
            </button>
          )}
        </span>
      </div>
    </div>
  );
}

function Row({ row, hasOld, onSaved, onDeleted }: { row: ProductRow; hasOld: boolean; onSaved: (r: ProductRow) => void; onDeleted: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(String(row.price));
  const [msg, setMsg] = useState<Msg>(null);
  useEffect(() => setPrice(String(row.price)), [row.price]);
  const st = STATUS[row.status] ?? STATUS.in_stock;
  const isDemo = isUntouchedDemo(row);

  const savePrice = async () => {
    const val = Number(price);
    if (!price || !Number.isFinite(val) || val <= 0) return setMsg({ tone: 'err', text: 'Вкажіть ціну більше 0' });
    setMsg({ tone: 'wait', text: '…' });
    try {
      await updateProduct(row.id, { price: Math.round(val) });
      onSaved({ ...row, price: Math.round(val) });
      setMsg({ tone: 'ok', text: 'Збережено' });
      requestStorefrontRefresh();
      setTimeout(() => setMsg(null), 2500);
    } catch (e) {
      setMsg({ tone: 'err', text: errText(e) });
    }
  };

  return (
    <li className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 p-3 md:grid-cols-[72px_minmax(0,1fr)_auto] md:gap-4 md:p-4">
        <span className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f6f3ee] md:h-[72px] md:w-[72px]">
          <PhotoSlot src={row.image} alt="" sizes="72px" label="" icon={CATEGORIES.find((c) => c.key === row.category)?.icon} />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="truncate font-bold">{row.name_ua}</span>
            {isDemo && <span className="sticker sticker-soft">приклад</span>}
          </p>
          <p className="mt-0.5 text-xs text-ink-3">
            {CATEGORIES.find((c) => c.key === row.category)?.one} · {MATERIALS.find((m) => m.key === row.material)?.name} ·{' '}
            <span className={st.tone === 'ok' ? 'text-ok' : st.tone === 'warn' ? 'text-warn' : ''}>{st.label}</span>
            {row.badges?.length ? ` · ${row.badges.join(', ')}` : ''}
          </p>
          <div className="mt-1"><Note msg={msg} /></div>
        </div>
        <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-1">
          <label className="sr-only" htmlFor={`qp-${row.id}`}>Ціна</label>
          <div className="relative">
            <input id={`qp-${row.id}`} className="input h-10 w-[120px] pr-7 text-right font-bold" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => e.key === 'Enter' && savePrice()} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-3">₴</span>
          </div>
          <button type="button" className="btn btn-gold btn-sm" onClick={savePrice} disabled={price === String(row.price)}>
            Зберегти ціну
          </button>
          <button type="button" className="btn btn-line btn-sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            Редагувати <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      {open && <Editor row={row} hasOld={hasOld} onSaved={onSaved} onDeleted={onDeleted} />}
    </li>
  );
}

function NewProduct({ onCreated, nextOrder }: { onCreated: (r: ProductRow) => void; nextOrder: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductRow['category']>('ring');
  const [material, setMaterial] = useState<ProductRow['material']>('silver');
  const [msg, setMsg] = useState<Msg>(null);

  const create = async () => {
    if (!name.trim()) return setMsg({ tone: 'err', text: 'Вкажіть назву' });
    const p = Number(price);
    if (!p || p < 0) return setMsg({ tone: 'err', text: 'Вкажіть ціну' });
    const id = `${category}-${Date.now().toString(36)}`;
    const row: ProductRow = {
      id,
      name: name.trim(),
      name_ua: name.trim(),
      price: Math.round(p),
      material,
      category,
      description: '',
      image: null,
      image2: null,
      image3: null,
      status: 'in_stock',
      weight: null,
      size: null,
      badges: ['Новинка'],
      sort_order: nextOrder,
    };
    setMsg({ tone: 'wait', text: 'Створюю…' });
    try {
      await createProducts([row]);
      onCreated(row);
      setMsg(null);
      setOpen(false);
      setName('');
      setPrice('');
      requestStorefrontRefresh();
    } catch (e) {
      setMsg({ tone: 'err', text: errText(e) });
    }
  };

  if (!open)
    return (
      <button type="button" className="btn btn-ink" onClick={() => setOpen(true)}>
        <Plus size={17} /> Додати товар
      </button>
    );
  return (
    <div className="w-full rounded-2xl border border-line bg-white p-4 md:p-5">
      <p className="mb-4 font-display text-2xl font-semibold">Новий товар</p>
      <div className="grid gap-3 md:grid-cols-4">
        <input className="input md:col-span-2" placeholder="Назва, напр. «Каблучка з перлиною»" value={name} onChange={(e) => setName(e.target.value)} aria-label="Назва" />
        <input className="input" placeholder="Ціна, ₴" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} aria-label="Ціна" />
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value as ProductRow['category'])} aria-label="Категорія">
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.name}</option>
          ))}
        </select>
        <select className="select" value={material} onChange={(e) => setMaterial(e.target.value as ProductRow['material'])} aria-label="Метал">
          {MATERIALS.map((m) => (
            <option key={m.key} value={m.key}>{m.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-ink" onClick={create}>Створити</button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Скасувати</button>
        <Note msg={msg} />
      </div>
      <p className="mt-3 text-xs text-ink-3">Після створення відкрийте «Редагувати», щоб додати фото й опис.</p>
    </div>
  );
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loadErr, setLoadErr] = useState('');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [demoMsg, setDemoMsg] = useState<Msg>(null);
  const [confirmDemo, setConfirmDemo] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await getProductRows());
      setLoadErr('');
    } catch {
      setLoadErr('Не вдалося завантажити товари. Оновіть сторінку.');
    }
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

  const onLogout = async () => { await signOut(); setAuthed(false); setRows([]); };

  const hasOld = rows.some((r) => 'old_price' in r);
  const demoCount = rows.filter(isUntouchedDemo).length;
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => (cat === 'all' || (cat === 'demo' ? isUntouchedDemo(r) : r.category === cat)) && (!s || r.name_ua.toLowerCase().includes(s) || r.id.includes(s)));
  }, [rows, q, cat]);

  const onSaved = (r: ProductRow) => setRows((list) => list.map((x) => (x.id === r.id ? { ...x, ...r } : x)));
  const onDeleted = (id: string) => setRows((list) => list.filter((x) => x.id !== id));

  const addDemo = async () => {
    const existing = new Set(rows.map((r) => r.id));
    const toAdd = DEMO_ROWS.filter((r) => !existing.has(r.id));
    if (!toAdd.length) return setDemoMsg({ tone: 'ok', text: 'Приклади вже додано' });
    setDemoMsg({ tone: 'wait', text: 'Додаю приклади…' });
    try {
      await createProducts(toAdd as ProductRow[]);
      await load();
      setDemoMsg({ tone: 'ok', text: `Додано ${toAdd.length} прикладів` });
      requestStorefrontRefresh();
    } catch (e) {
      setDemoMsg({ tone: 'err', text: errText(e) });
    }
  };
  const removeDemo = async () => {
    setConfirmDemo(false);
    setDemoMsg({ tone: 'wait', text: 'Видаляю приклади…' });
    try {
      const n = await deleteProducts(rows.filter(isUntouchedDemo).map((r) => r.id));
      await load();
      setDemoMsg({ tone: 'ok', text: `Видалено ${n}` });
      requestStorefrontRefresh();
    } catch (e) {
      setDemoMsg({ tone: 'err', text: errText(e) });
    }
  };

  const shell = (children: React.ReactNode) => (
    <div className="min-h-dvh bg-ivory">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">{children}</div>
    </div>
  );

  const brand = (
    <div className="flex items-center gap-2">
      <DiamondMark size={20} className="text-gold" />
      <span className="font-display text-2xl font-semibold tracking-[.24em]">VIALKO</span>
      <span className="ml-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">адмін</span>
    </div>
  );

  if (checking) return shell(<p className="py-20 text-center text-ink-3">Завантаження…</p>);

  if (!isSupabaseConfigured)
    return shell(
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center">
        {brand}
        <p className="mt-6 text-ink-2">База даних ще не підключена.</p>
      </div>,
    );

  if (!authed)
    return shell(
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-line bg-white p-7 md:p-9">
        {brand}
        <h1 className="mt-7 font-display text-3xl font-semibold">Вхід</h1>
        <p className="mt-1 text-sm text-ink-2">Введіть логін та пароль, щоб редагувати товари, ціни та фото.</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div className="field">
            <label className="label" htmlFor="adm-email">Email</label>
            <input id="adm-email" className="input" type="email" value={email} autoComplete="username" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label className="label" htmlFor="adm-pass">Пароль</label>
            <input id="adm-pass" className="input" type="password" value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <p className="text-sm font-semibold text-wine" role="alert">{err}</p>}
          <button className="btn btn-gold btn-lg btn-block" type="submit" disabled={busy}>
            {busy ? 'Вхід…' : 'Увійти'}
          </button>
        </form>
      </div>,
    );

  return shell(
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {brand}
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="btn btn-line btn-sm"><ExternalLink size={14} /> Сайт</Link>
          <button className="btn btn-ghost btn-sm" type="button" onClick={onLogout}><LogOut size={15} /> Вийти</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-3">
        <NewProduct onCreated={(r) => setRows((l) => [...l, r])} nextOrder={Math.max(0, ...rows.filter((r) => !r.id.startsWith(DEMO_PREFIX)).map((r) => r.sort_order || 0)) + 1} />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-line-2 bg-white/60 p-4">
        <p className="flex items-center gap-2 text-sm font-bold"><Sparkles size={16} className="text-gold-deep" /> Товари-приклади для наповнення вітрини</p>
        <p className="mt-1 text-xs text-ink-2">
          Зараз прикладів: <b>{demoCount}</b>. Їх бачать покупці — замініть на свої (завантажте своє фото, змініть назву й ціну) або видаліть одним кліком.
          Приклади, яким ви вже поставили власне фото, вважаються вашими товарами й не видаляються.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-line btn-sm" onClick={addDemo}><Plus size={14} /> Додати приклади ({DEMO_ROWS.length})</button>
          {demoCount > 0 && (confirmDemo ? (
            <>
              <span className="text-sm font-semibold text-wine">Видалити всі {demoCount} прикладів?</span>
              <button type="button" className="btn btn-sm bg-wine text-white" onClick={removeDemo}>Так</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDemo(false)}>Ні</button>
            </>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm text-wine" onClick={() => setConfirmDemo(true)}><Trash2 size={14} /> Видалити всі приклади</button>
          ))}
          <Note msg={demoMsg} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input className="input pl-10" placeholder="Пошук за назвою" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Пошук товарів" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[{ key: 'all', name: 'Усі' }, ...CATEGORIES.map((c) => ({ key: c.key, name: c.name })), ...(demoCount ? [{ key: 'demo', name: 'Приклади' }] : [])].map((c) => (
            <button key={c.key} type="button" className={`chip whitespace-nowrap ${cat === c.key ? 'is-on' : ''}`} onClick={() => setCat(c.key)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loadErr && <p className="mt-4 font-semibold text-wine">{loadErr}</p>}
      <p className="mt-4 text-sm text-ink-3">
        {shown.length} з {rows.length} товарів
      </p>
      <ul className="mt-3 space-y-3">
        {shown.map((r) => (
          <Row key={r.id} row={r} hasOld={hasOld} onSaved={onSaved} onDeleted={onDeleted} />
        ))}
      </ul>
    </>,
  );
}
