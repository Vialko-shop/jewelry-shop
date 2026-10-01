'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import { CATEGORIES, MATERIALS, BADGES, PRICE_BANDS, badgeKeys, type BadgeKey } from '@/lib/taxonomy';
import { money, itemsWord } from '@/lib/format';
import ProductCard from './ProductCard';

type SortKey = 'pop' | 'cheap' | 'exp' | 'new' | 'name';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'pop', label: 'Популярні' },
  { key: 'cheap', label: 'Спочатку дешевші' },
  { key: 'exp', label: 'Спочатку дорожчі' },
  { key: 'new', label: 'Новинки' },
  { key: 'name', label: 'За назвою' },
];

interface Filters {
  metal: string[];
  cat: string[];
  badge: BadgeKey[];
  avail: boolean;
  min: number | null;
  max: number | null;
  band: string | null;
  sort: SortKey;
}

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);
const num = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Number(v) : null);

function readFilters(sp: URLSearchParams): Filters {
  const sort = (sp.get('sort') as SortKey) || 'pop';
  return {
    metal: list(sp.get('metal')),
    cat: list(sp.get('cat')),
    badge: list(sp.get('badge')) as BadgeKey[],
    avail: sp.get('avail') === '1',
    min: num(sp.get('min')),
    max: num(sp.get('max')),
    band: sp.get('price'),
    sort: SORTS.some((s) => s.key === sort) ? sort : 'pop',
  };
}

function writeFilters(f: Filters) {
  const sp = new URLSearchParams();
  if (f.metal.length) sp.set('metal', f.metal.join(','));
  if (f.cat.length) sp.set('cat', f.cat.join(','));
  if (f.badge.length) sp.set('badge', f.badge.join(','));
  if (f.avail) sp.set('avail', '1');
  if (f.band) sp.set('price', f.band);
  if (f.min != null) sp.set('min', String(f.min));
  if (f.max != null) sp.set('max', String(f.max));
  if (f.sort !== 'pop') sp.set('sort', f.sort);
  return sp.toString();
}

type Facet = 'metal' | 'cat' | 'badge' | 'avail' | 'price';

function apply(items: ExtendedProduct[], f: Filters, skip?: Facet) {
  const band = PRICE_BANDS.find((b) => b.id === f.band);
  return items.filter((p) => {
    if (skip !== 'metal' && f.metal.length && !f.metal.includes(p.material)) return false;
    if (skip !== 'cat' && f.cat.length && !f.cat.includes(p.category)) return false;
    if (skip !== 'badge' && f.badge.length) {
      const k = badgeKeys(p.badges);
      if (!f.badge.some((b) => k.includes(b))) return false;
    }
    if (skip !== 'avail' && f.avail && p.status !== 'in_stock') return false;
    if (skip !== 'price') {
      if (band && (p.price < band.min || p.price > band.max)) return false;
      if (f.min != null && p.price < f.min) return false;
      if (f.max != null && p.price > f.max) return false;
    }
    return true;
  });
}

function sortItems(items: ExtendedProduct[], s: SortKey) {
  const arr = [...items];
  const soldLast = (a: ExtendedProduct, b: ExtendedProduct) => (a.status === 'sold' ? 1 : 0) - (b.status === 'sold' ? 1 : 0);
  switch (s) {
    case 'cheap':
      return arr.sort((a, b) => soldLast(a, b) || a.price - b.price);
    case 'exp':
      return arr.sort((a, b) => soldLast(a, b) || b.price - a.price);
    case 'name':
      return arr.sort((a, b) => a.nameUa.localeCompare(b.nameUa, 'uk'));
    case 'new':
      return arr.sort((a, b) => soldLast(a, b) || Number(badgeKeys(b.badges).includes('new')) - Number(badgeKeys(a.badges).includes('new')) || (b.sortOrder ?? 0) - (a.sortOrder ?? 0));
    default:
      return arr.sort(
        (a, b) =>
          soldLast(a, b) ||
          Number(badgeKeys(b.badges).includes('hit')) - Number(badgeKeys(a.badges).includes('hit')) ||
          (a.image ? 0 : 1) - (b.image ? 0 : 1) ||
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      );
  }
}

function Group({ title, children, open = true }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-extrabold uppercase tracking-[.12em] [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={16} className="text-ink-3 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 space-y-0.5">{children}</div>
    </details>
  );
}

function PriceRange({ lo, hi, f, set }: { lo: number; hi: number; f: Filters; set: (p: Partial<Filters>) => void }) {
  const [a, setA] = useState<string>(f.min != null ? String(f.min) : '');
  const [b, setB] = useState<string>(f.max != null ? String(f.max) : '');
  useEffect(() => {
    setA(f.min != null ? String(f.min) : '');
    setB(f.max != null ? String(f.max) : '');
  }, [f.min, f.max]);
  const commit = () => set({ min: a ? Math.max(0, Number(a)) : null, max: b ? Math.max(0, Number(b)) : null, band: null });
  return (
    <form
      className="mt-2 flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        commit();
      }}
    >
      <input className="input h-10 px-3 text-sm" inputMode="numeric" placeholder={String(lo)} aria-label="Ціна від" value={a} onChange={(e) => setA(e.target.value.replace(/\D/g, ''))} />
      <span className="text-ink-3">—</span>
      <input className="input h-10 px-3 text-sm" inputMode="numeric" placeholder={String(hi)} aria-label="Ціна до" value={b} onChange={(e) => setB(e.target.value.replace(/\D/g, ''))} />
      <button type="submit" className="btn btn-ink btn-sm h-10 px-3">
        OK
      </button>
    </form>
  );
}

export default function Catalog({
  items,
  hide = [],
  emptyHint,
}: {
  items: ExtendedProduct[];
  hide?: Facet[];
  emptyHint?: string;
}) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const spStr = sp.toString();
  // локальний стан — миттєвий відгук; URL оновлюємо без запиту до сервера
  const [f, setF] = useState<Filters>(() => readFilters(new URLSearchParams(spStr)));
  useEffect(() => {
    setF(readFilters(new URLSearchParams(spStr)));
  }, [spStr]);
  const [limit, setLimit] = useState(24);
  const [drawer, setDrawer] = useState(false);

  const set = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...f, ...patch };
      setF(next);
      const qs = writeFilters(next);
      window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname);
      setLimit(24);
    },
    [f, pathname],
  );

  const toggle = <K extends 'metal' | 'cat' | 'badge'>(key: K, v: string) => {
    const cur = f[key] as string[];
    set({ [key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] } as Partial<Filters>);
  };

  const result = useMemo(() => sortItems(apply(items, f), f.sort), [items, f]);
  const prices = items.map((p) => p.price);
  const lo = prices.length ? Math.min(...prices) : 0;
  const hi = prices.length ? Math.max(...prices) : 0;

  const facetCount = (facet: Facet, pred: (p: ExtendedProduct) => boolean) => apply(items, f, facet).filter(pred).length;

  const active: { label: string; clear: () => void }[] = [
    ...f.metal.map((m) => ({ label: MATERIALS.find((x) => x.key === m)?.name ?? m, clear: () => toggle('metal', m) })),
    ...f.cat.map((c) => ({ label: CATEGORIES.find((x) => x.key === c)?.name ?? c, clear: () => toggle('cat', c) })),
    ...f.badge.map((b) => ({ label: BADGES.find((x) => x.key === b)?.title ?? b, clear: () => toggle('badge', b) })),
    ...(f.avail ? [{ label: 'В наявності', clear: () => set({ avail: false }) }] : []),
    ...(f.band ? [{ label: PRICE_BANDS.find((b) => b.id === f.band)?.label ?? '', clear: () => set({ band: null }) }] : []),
    ...(f.min != null || f.max != null ? [{ label: `${f.min != null ? money(f.min) : lo} – ${f.max != null ? money(f.max) : money(hi)}`, clear: () => set({ min: null, max: null }) }] : []),
  ];

  const panel = (
    <div>
      {!hide.includes('avail') && (
        <div className="border-b border-line pb-4">
          <label className="check font-semibold text-ink">
            <input type="checkbox" checked={f.avail} onChange={(e) => set({ avail: e.target.checked })} />
            Лише в наявності
            <span className="n">{facetCount('avail', (p) => p.status === 'in_stock')}</span>
          </label>
        </div>
      )}
      {!hide.includes('cat') && (
        <Group title="Категорія">
          {CATEGORIES.map((c) => {
            const n = facetCount('cat', (p) => p.category === c.key);
            if (!n && !f.cat.includes(c.key)) return null;
            return (
              <label key={c.key} className="check">
                <input type="checkbox" checked={f.cat.includes(c.key)} onChange={() => toggle('cat', c.key)} />
                {c.name}
                <span className="n">{n}</span>
              </label>
            );
          })}
        </Group>
      )}
      {!hide.includes('metal') && (
        <Group title="Метал">
          {MATERIALS.map((m) => {
            const n = facetCount('metal', (p) => p.material === m.key);
            if (!n && !f.metal.includes(m.key)) return null;
            return (
              <label key={m.key} className="check">
                <input type="checkbox" checked={f.metal.includes(m.key)} onChange={() => toggle('metal', m.key)} />
                {m.name}
                <span className="n">{n}</span>
              </label>
            );
          })}
        </Group>
      )}
      {!hide.includes('price') && (
        <Group title="Ціна, ₴">
          {PRICE_BANDS.map((b) => {
            const n = facetCount('price', (p) => p.price >= b.min && p.price <= b.max);
            if (!n && f.band !== b.id) return null;
            return (
              <label key={b.id} className="check">
                <input type="radio" name="price-band" checked={f.band === b.id} onChange={() => set({ band: b.id, min: null, max: null })} />
                {b.label}
                <span className="n">{n}</span>
              </label>
            );
          })}
          <PriceRange lo={lo} hi={hi} f={f} set={set} />
        </Group>
      )}
      {!hide.includes('badge') && (
        <Group title="Добірки">
          {BADGES.map((b) => {
            const n = facetCount('badge', (p) => badgeKeys(p.badges).includes(b.key));
            if (!n && !f.badge.includes(b.key)) return null;
            return (
              <label key={b.key} className="check">
                <input type="checkbox" checked={f.badge.includes(b.key)} onChange={() => toggle('badge', b.key)} />
                {b.title}
                <span className="n">{n}</span>
              </label>
            );
          })}
        </Group>
      )}
      {active.length > 0 && (
        <button type="button" className="btn btn-line btn-sm mt-5 w-full" onClick={() => set({ metal: [], cat: [], badge: [], avail: false, band: null, min: null, max: null })}>
          Скинути фільтри
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="hidden lg:block" aria-label="Фільтри">
        <div className="sticky top-[140px] max-h-[calc(100dvh-160px)] overflow-y-auto pr-1 no-scrollbar">{panel}</div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-line btn-sm lg:hidden" onClick={() => setDrawer(true)}>
            <SlidersHorizontal size={16} /> Фільтри{active.length ? ` · ${active.length}` : ''}
          </button>
          <p className="text-sm text-ink-3" aria-live="polite">
            {itemsWord(result.length)}
          </p>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="hidden text-ink-3 sm:inline">Сортування:</span>
            <select className="select h-10 w-auto min-w-[190px] text-sm" value={f.sort} onChange={(e) => set({ sort: e.target.value as SortKey })} aria-label="Сортування">
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {active.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {active.map((a) => (
              <button key={a.label} type="button" className="chip is-on" onClick={a.clear} aria-label={`Прибрати фільтр ${a.label}`}>
                {a.label} <X size={13} />
              </button>
            ))}
          </div>
        )}

        {result.length === 0 ? (
          <div className="rounded-2xl bg-ivory px-6 py-14 text-center">
            <p className="font-display text-2xl font-semibold">Нічого не знайдено</p>
            <p className="mt-2 text-sm text-ink-2">{emptyHint ?? 'Спробуйте змінити або скинути фільтри.'}</p>
            {active.length > 0 && (
              <button type="button" className="btn btn-ink btn-sm mt-5" onClick={() => set({ metal: [], cat: [], badge: [], avail: false, band: null, min: null, max: null })}>
                Скинути фільтри
              </button>
            )}
          </div>
        ) : (
          <>
            <h2 className="sr-only">Товари</h2>
            <div className="pgrid cols-4">
              {result.slice(0, limit).map((p, i) => (
                <ProductCard key={p.id} p={p} eager={i < 4} />
              ))}
            </div>
            {result.length > limit && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-sm text-ink-3">
                  Показано {Math.min(limit, result.length)} з {result.length}
                </p>
                <button type="button" className="btn btn-line" onClick={() => setLimit((l) => l + 24)}>
                  Показати ще
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog.Root open={drawer} onOpenChange={setDrawer}>
        <Dialog.Portal>
          <Dialog.Overlay className="overlay" />
          <Dialog.Content className="drawer left" aria-describedby={undefined}>
            <div className="drawer-head">
              <Dialog.Title className="drawer-title">Фільтри</Dialog.Title>
              <Dialog.Close className="icon-btn" aria-label="Закрити">
                <X size={22} />
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">{panel}</div>
            <div className="border-t border-line p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
              <button type="button" className="btn btn-ink btn-block" onClick={() => setDrawer(false)}>
                Показати {itemsWord(result.length)}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
