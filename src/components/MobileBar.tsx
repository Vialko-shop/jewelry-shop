'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, LayoutGrid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlist } from '@/store/listsStore';
import { useUi } from '@/store/uiStore';
import { useHydrated } from '@/lib/useHydrated';

/** Нижня панель на телефонах: Головна · Каталог · Пошук · Обране · Кошик */
export default function MobileBar() {
  const path = usePathname();
  const hydrated = useHydrated();
  const cart = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wish = useWishlist((s) => s.ids.length);
  const open = useUi((s) => s.open);
  if (path?.startsWith('/vialko-admin') || path?.startsWith('/checkout')) return null;

  const item = 'relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-semibold';
  const on = (p: string) => (path === p ? 'text-ink' : 'text-ink-3');
  const Badge = ({ n }: { n: number }) =>
    hydrated && n ? (
      <span className="absolute left-1/2 top-1 ml-2 min-w-[17px] rounded-full bg-gold px-1 text-center text-[10px] font-bold leading-[17px] text-ink">{n}</span>
    ) : null;

  return (
    <nav
      aria-label="Швидка навігація"
      className="fixed inset-x-0 bottom-0 z-[58] flex h-[60px] border-t border-line bg-white/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      style={{ height: 'calc(60px + env(safe-area-inset-bottom))' }}
    >
      <Link href="/" className={`${item} ${on('/')}`}>
        <House size={21} strokeWidth={1.7} /> Головна
      </Link>
      <button type="button" className={`${item} text-ink-3`} onClick={() => open('menu')}>
        <LayoutGrid size={21} strokeWidth={1.7} /> Каталог
      </button>
      <button type="button" className={`${item} text-ink-3`} onClick={() => open('search')}>
        <Search size={21} strokeWidth={1.7} /> Пошук
      </button>
      <Link href="/wishlist" className={`${item} ${on('/wishlist')}`}>
        <Heart size={21} strokeWidth={1.7} /> Обране
        <Badge n={wish} />
      </Link>
      <button type="button" className={`${item} text-ink-3`} onClick={toggleCart}>
        <ShoppingBag size={21} strokeWidth={1.7} /> Кошик
        <Badge n={cart} />
      </button>
    </nav>
  );
}
