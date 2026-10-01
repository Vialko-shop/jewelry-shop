'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import { searchProducts } from '@/lib/search';
import { itemsWord } from '@/lib/format';
import { CATEGORIES } from '@/lib/taxonomy';
import ProductCard from '@/components/ProductCard';

export default function SearchResults({ items }: { items: ExtendedProduct[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get('q') ?? '';
  const [val, setVal] = useState(q);
  useEffect(() => setVal(q), [q]);
  const found = useMemo(() => searchProducts(items, q, 200), [items, q]);

  return (
    <div>
      <h1 className="display text-[36px] md:text-[48px]">{q ? <>Пошук: «{q}»</> : 'Пошук прикрас'}</h1>
      <form
        role="search"
        className="relative mt-5 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search?q=${encodeURIComponent(val.trim())}`);
        }}
      >
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
        <input className="input h-12 rounded-full pl-11 pr-28" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Назва, метал або артикул" aria-label="Пошуковий запит" />
        <button type="submit" className="btn btn-ink btn-sm absolute right-1.5 top-1.5 rounded-full">
          Знайти
        </button>
      </form>
      {q.trim().length >= 2 && (
        <p className="mt-4 text-sm text-ink-3" aria-live="polite">
          Знайдено: {itemsWord(found.length)}
        </p>
      )}
      {q.trim().length >= 2 && found.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-ivory px-6 py-12 text-center">
          <p className="font-display text-2xl font-semibold">Нічого не знайшли</p>
          <p className="mt-2 text-sm text-ink-2">Спробуйте інше слово або оберіть категорію:</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.key} href={`/catalog/${c.slug}`} className="chip">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h2 className="sr-only">Товари</h2>
          <div className="pgrid cols-4 mt-8">
            {found.map((p, i) => (
              <ProductCard key={p.id} p={p} eager={i < 4} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
