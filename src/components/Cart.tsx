'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/lib/useHydrated';
import { money, metalLabel, itemsWord } from '@/lib/format';
import { categoryByKey } from '@/lib/taxonomy';
import { SITE } from '@/lib/site';
import PhotoSlot from './PhotoSlot';

export function FreeShipBar({ total }: { total: number }) {
  const left = Math.max(0, SITE.freeShippingFrom - total);
  const pct = Math.min(100, (total / SITE.freeShippingFrom) * 100);
  return (
    <div className="rounded-xl bg-ivory p-3">
      <p className="flex items-center gap-2 text-[13px] text-ink-2">
        <Truck size={16} className="text-gold-deep" />
        {left > 0 ? (
          <span>
            До безкоштовної доставки: <b className="text-ink">{money(left)}</b>
          </span>
        ) : (
          <span className="font-semibold text-ok">Безкоштовна доставка вже ваша</span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand" aria-hidden>
        <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Cart() {
  const hydrated = useHydrated();
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();
  const list = hydrated ? items : [];
  const total = list.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = list.reduce((s, i) => s + i.quantity, 0);

  return (
    <Dialog.Root open={hydrated && isOpen} onOpenChange={(o) => o !== isOpen && toggleCart()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="drawer right" aria-describedby={undefined}>
          <div className="drawer-head">
            <Dialog.Title className="drawer-title">
              Кошик <span className="align-middle font-sans text-sm font-semibold text-ink-3">{count ? itemsWord(count) : ''}</span>
            </Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label="Закрити кошик">
              <X size={22} />
            </Dialog.Close>
          </div>

          {list.length === 0 ? (
            <div className="grid flex-1 place-items-center p-8 text-center">
              <div>
                <span className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-ivory text-gold-deep">
                  <ShoppingBag size={34} strokeWidth={1.4} />
                </span>
                <p className="font-display text-2xl font-semibold">Кошик порожній</p>
                <p className="mt-2 text-sm text-ink-2">Оберіть прикрасу до душі — ми дбайливо запакуємо її.</p>
                <Link href="/catalog" onClick={toggleCart} className="btn btn-ink mt-6">
                  До каталогу <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5">
                {list.map((it) => (
                  <li key={it.id} className="flex gap-3 py-4">
                    <Link href={`/product/${encodeURIComponent(it.id)}`} onClick={toggleCart} className="relative h-[84px] w-[84px] flex-none overflow-hidden rounded-xl bg-[#f6f3ee]">
                      <PhotoSlot src={it.image || null} alt={it.nameUa} sizes="84px" icon={categoryByKey(it.category)?.icon} label="" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${encodeURIComponent(it.id)}`} onClick={toggleCart} className="line-clamp-2 text-[14px] font-semibold leading-snug hover:text-gold-deep">
                        {it.nameUa}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-3">
                        {metalLabel(it)}
                        {it.selectedSize ? ` · розмір ${it.selectedSize}` : ''}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-line">
                          <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-mist" aria-label="Менше" onClick={() => updateQuantity(it.id, it.quantity - 1)}>
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-bold" aria-live="polite">
                            {it.quantity}
                          </span>
                          <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-mist" aria-label="Більше" onClick={() => updateQuantity(it.id, it.quantity + 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-[15px] font-extrabold">{money(it.price * it.quantity)}</span>
                      </div>
                    </div>
                    <button type="button" className="self-start p-1 text-ink-3 hover:text-wine" aria-label={`Видалити «${it.nameUa}»`} onClick={() => removeItem(it.id)}>
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="space-y-4 border-t border-line px-5 py-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
                <FreeShipBar total={total} />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-ink-2">Разом</span>
                  <span className="text-2xl font-extrabold tracking-tight">{money(total)}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="btn btn-gold btn-lg btn-block">
                  Оформити замовлення <ArrowRight size={17} />
                </Link>
                <button type="button" className="btn btn-ghost btn-sm btn-block" onClick={toggleCart}>
                  Продовжити покупки
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
