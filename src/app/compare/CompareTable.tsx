'use client';

import Link from 'next/link';
import { X, ArrowLeftRight, ArrowRight, ShoppingBag } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import { useCompare } from '@/store/listsStore';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/lib/useHydrated';
import { money, sku, probeOf } from '@/lib/format';
import { categoryByKey, materialByKey, STATUS } from '@/lib/taxonomy';
import PhotoSlot from '@/components/PhotoSlot';
import { toCartProduct } from '@/components/ProductCard';

export default function CompareTable({ items }: { items: ExtendedProduct[] }) {
  const hydrated = useHydrated();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);
  const list = hydrated ? ids.map((id) => items.find((p) => p.id === id)).filter((p): p is ExtendedProduct => Boolean(p)) : [];

  const rows: [string, (p: ExtendedProduct) => string][] = [
    ['Ціна', (p) => money(p.price)],
    ['Категорія', (p) => categoryByKey(p.category)?.one ?? '—'],
    ['Метал', (p) => materialByKey(p.material)?.name ?? '—'],
    ['Проба', (p) => (p.material === 'bijouterie' ? '—' : probeOf(p) ?? '—')],
    ['Вага', (p) => p.weight ?? '—'],
    ['Розмір', (p) => p.size ?? '—'],
    ['Наявність', (p) => STATUS[p.status]?.label ?? '—'],
    ['Артикул', (p) => sku(p.id)],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[38px] md:text-[52px]">Порівняння</h1>
        {list.length > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
            Очистити
          </button>
        )}
      </div>
      {hydrated && list.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-ivory px-6 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-ink">
            <ArrowLeftRight size={26} />
          </span>
          <p className="mt-4 font-display text-2xl font-semibold">Додайте прикраси для порівняння</p>
          <p className="mt-2 text-sm text-ink-2">Натисніть ⇄ на картці товару — до 4 прикрас одночасно.</p>
          <Link href="/catalog" className="btn btn-ink mt-6">
            До каталогу <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto pb-4">
          <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="w-[130px]" />
                {list.map((p) => (
                  <th key={p.id} className="px-3 pb-4 text-left align-top font-normal">
                    <div className="relative">
                      <Link href={`/product/${encodeURIComponent(p.id)}`} className="relative block aspect-square overflow-hidden rounded-xl bg-[#f6f3ee]">
                        <PhotoSlot src={p.image || null} alt={p.nameUa} sizes="220px" icon={categoryByKey(p.category)?.icon} label="" />
                      </Link>
                      <button type="button" onClick={() => remove(p.id)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white shadow" aria-label={`Прибрати «${p.nameUa}»`}>
                        <X size={15} />
                      </button>
                    </div>
                    <Link href={`/product/${encodeURIComponent(p.id)}`} className="mt-3 line-clamp-2 block font-semibold hover:text-gold-deep">
                      {p.nameUa}
                    </Link>
                    <button type="button" className="btn btn-ink btn-sm mt-3 w-full" disabled={p.status === 'sold'} onClick={() => addItem(toCartProduct(p))}>
                      <ShoppingBag size={14} /> У кошик
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, get]) => (
                <tr key={label}>
                  <th scope="row" className="border-t border-line py-3 pr-3 text-left font-semibold text-ink-3">
                    {label}
                  </th>
                  {list.map((p) => (
                    <td key={p.id} className="border-t border-line px-3 py-3 font-semibold">
                      {get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
