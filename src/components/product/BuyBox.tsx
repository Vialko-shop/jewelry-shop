'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeftRight, ShoppingBag, Phone, Ruler, Check } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/lib/useHydrated';
import { money, discountPct, sizeOptions } from '@/lib/format';
import { STATUS } from '@/lib/taxonomy';
import { SITE } from '@/lib/site';
import { toCartProduct } from '../ProductCard';
import { useListToggle } from '../ProductActions';
import { useUi } from '@/store/uiStore';

export default function BuyBox({ p }: { p: ExtendedProduct }) {
  const hydrated = useHydrated();
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const cartLine = useCartStore((s) => s.items.find((i) => i.id === p.id));
  const inCart = Boolean(cartLine);
  const notify = useUi((s) => s.notify);
  const wish = useListToggle('wish', p.id);
  const cmp = useListToggle('compare', p.id);
  const sizes = sizeOptions(p.size);
  const needSize = p.category === 'ring' && sizes.length > 0;
  const [size, setSize] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const sameInCart = inCart && (!size || !cartLine?.selectedSize || cartLine.selectedSize === size);
  const st = STATUS[p.status] ?? STATUS.in_stock;
  const sold = p.status === 'sold';
  const pct = discountPct(p);
  const perPayment = Math.ceil(p.price / SITE.installments.payments);

  const add = () => {
    if (needSize && !size) {
      setHint(true);
      document.getElementById('size-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const item = { ...toCartProduct(p), ...(size ? { selectedSize: size } : {}) };
    if (cartLine && size && cartLine.selectedSize !== size) {
      // Кошик тримає один рядок на товар — замінюємо розмір, а не додаємо «ще одну» з іншим розміром
      removeItem(p.id);
      addItem(item);
      notify(`Розмір у кошику: ${size}`);
      return;
    }
    addItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <span className={`text-[34px] font-extrabold leading-none tracking-tight ${pct ? 'text-wine' : ''}`}>{money(p.price)}</span>
        {pct ? (
          <>
            <span className="pb-1 text-lg text-ink-3 line-through">{money(p.oldPrice!)}</span>
            <span className="sticker sticker-sale mb-1.5">−{pct}%</span>
          </>
        ) : null}
      </div>

      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className={`dot dot-${st.tone}`} aria-hidden /> {st.label}
        {p.status === 'on_order' && <span className="font-normal text-ink-3">· виготовлення та доставка — уточнимо по телефону</span>}
      </p>

      {sizes.length > 0 && (
        <div id="size-picker" className="scroll-mt-32">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold">
              {p.category === 'ring' ? 'Розмір' : 'Варіант'}
              {size ? <span className="font-normal text-ink-2">: {size}</span> : null}
            </p>
            {p.category === 'ring' && (
              <Link href="/rozmirna-sitka" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep underline-offset-4 hover:underline">
                <Ruler size={14} /> Як визначити розмір
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Оберіть розмір">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setHint(false);
                }}
                className={`h-10 min-w-[48px] rounded-lg border px-3 text-sm font-semibold transition ${size === s ? 'border-ink bg-ink text-white' : 'border-line-2 hover:border-ink'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {hint && <p className="mt-2 text-sm font-semibold text-wine">Оберіть розмір, будь ласка</p>}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn btn-gold btn-lg sm:flex-1" disabled={sold} onClick={add}>
          {hydrated && sameInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
          {sold ? 'Продано' : hydrated && sameInCart ? 'Додати ще' : 'Купити'}
        </button>
        <a href={SITE.phoneHref} className="btn btn-line btn-lg sm:flex-1">
          <Phone size={17} /> Замовити по телефону
        </a>
      </div>

      <div className="flex gap-2">
        <button type="button" className={`btn btn-ghost btn-sm ${wish.on ? 'text-wine' : ''}`} aria-pressed={wish.on} onClick={wish.act}>
          <Heart size={16} fill={wish.on ? 'currentColor' : 'none'} /> {wish.on ? 'В обраному' : 'В обране'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" aria-pressed={cmp.on} onClick={cmp.act}>
          <ArrowLeftRight size={16} /> {cmp.on ? 'У порівнянні' : 'Порівняти'}
        </button>
      </div>

      {SITE.installments.enabled && !sold && (
        <div className="flex items-center gap-3 rounded-xl border border-line p-4">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gold-soft text-sm font-extrabold text-gold-deep">
            {SITE.installments.payments}×
          </span>
          <p className="text-sm">
            <b>Оплата частинами:</b> {SITE.installments.payments} платежі по {money(perPayment)}
            <span className="block text-xs text-ink-3">{SITE.installments.provider}</span>
          </p>
        </div>
      )}
    </div>
  );
}
