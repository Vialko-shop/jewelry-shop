'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import { useWishlist } from '@/store/listsStore';
import { useHydrated } from '@/lib/useHydrated';
import { itemsWord } from '@/lib/format';
import ProductCard from '@/components/ProductCard';

export default function SavedList({ items }: { items: ExtendedProduct[] }) {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const list = hydrated ? ids.map((id) => items.find((p) => p.id === id)).filter((p): p is ExtendedProduct => Boolean(p)) : [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[38px] md:text-[52px]">Обране</h1>
          <p className="mt-1 text-sm text-ink-3">{hydrated ? itemsWord(list.length) : '…'}</p>
        </div>
        {list.length > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
            Очистити список
          </button>
        )}
      </div>
      {hydrated && list.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-ivory px-6 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-wine">
            <Heart size={28} />
          </span>
          <p className="mt-4 font-display text-2xl font-semibold">Тут поки порожньо</p>
          <p className="mt-2 text-sm text-ink-2">Натискайте ♡ на картці прикраси, щоб зберегти її тут.</p>
          <Link href="/catalog" className="btn btn-ink mt-6">
            До каталогу <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <h2 className="sr-only">Товари</h2>
          <div className="pgrid cols-4 mt-8">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
