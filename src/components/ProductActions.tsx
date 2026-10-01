'use client';

import { Heart, ArrowLeftRight, ShoppingBag } from 'lucide-react';
import { useCartStore, type Product } from '@/store/cartStore';
import { useWishlist, useCompare } from '@/store/listsStore';
import { useUi } from '@/store/uiStore';
import { useHydrated } from '@/lib/useHydrated';

/** Обране / порівняння: стан з localStorage лише після гідрації (без розбіжностей SSR) */
export function useListToggle(kind: 'wish' | 'compare', id: string) {
  const hydrated = useHydrated();
  const wishOn = useWishlist((s) => s.ids.includes(id));
  const cmpOn = useCompare((s) => s.ids.includes(id));
  const on = kind === 'wish' ? wishOn : cmpOn;
  const notify = useUi((s) => s.notify);
  const act = () => {
    const added = (kind === 'wish' ? useWishlist : useCompare).getState().toggle(id);
    if (kind === 'wish') notify(added ? 'Додано в обране' : 'Прибрано з обраного', added ? '/wishlist' : undefined, 'Переглянути');
    else notify(added ? 'Додано до порівняння' : 'Прибрано з порівняння', added ? '/compare' : undefined, 'Порівняти');
  };
  return { on: hydrated && on, act };
}

/** Кнопки ♡ та ⇄ на картці */
export function CardTools({ id }: { id: string }) {
  const wish = useListToggle('wish', id);
  const cmp = useListToggle('compare', id);
  return (
    <div className="pcard-tools">
      <button
        type="button"
        className={`pcard-tool${wish.on ? ' on' : ''}`}
        aria-pressed={wish.on}
        aria-label={wish.on ? 'Прибрати з обраного' : 'Додати в обране'}
        onClick={wish.act}
      >
        <Heart size={17} strokeWidth={1.8} fill={wish.on ? 'currentColor' : 'none'} />
      </button>
      <button
        type="button"
        className={`pcard-tool reveal${cmp.on ? ' on-compare' : ''}`}
        aria-pressed={cmp.on}
        aria-label={cmp.on ? 'Прибрати з порівняння' : 'Додати до порівняння'}
        onClick={cmp.act}
      >
        <ArrowLeftRight size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}

/** «У кошик» на картці (десктоп — кнопка при наведенні, телефон — кругла кнопка біля ціни) */
export function AddToCart({ product, sold, variant }: { product: Product; sold: boolean; variant: 'bar' | 'round' }) {
  const addItem = useCartStore((s) => s.addItem);
  if (variant === 'round')
    return (
      <button
        type="button"
        className="pcard-quick relative z-[2] ml-auto h-9 w-9 items-center justify-center rounded-full bg-ink text-white disabled:opacity-40"
        aria-label={`Додати «${product.nameUa}» у кошик`}
        disabled={sold}
        onClick={() => addItem(product)}
      >
        <ShoppingBag size={16} />
      </button>
    );
  return (
    <div className="pcard-cta">
      <button type="button" className="btn btn-ink btn-sm btn-block" disabled={sold} onClick={() => addItem(product)}>
        <ShoppingBag size={15} /> {sold ? 'Продано' : 'У кошик'}
      </button>
    </div>
  );
}
