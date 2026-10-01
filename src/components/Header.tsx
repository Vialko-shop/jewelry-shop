'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ArrowLeftRight, ShoppingBag, Search, Menu, Phone, ChevronDown, LayoutGrid } from 'lucide-react';
import type { LiteProduct } from '@/lib/catalog';
import { useCartStore } from '@/store/cartStore';
import { useWishlist, useCompare } from '@/store/listsStore';
import { useUi } from '@/store/uiStore';
import { useHydrated } from '@/lib/useHydrated';
import { SITE } from '@/lib/site';
import Logo from './Logo';
import dynamic from 'next/dynamic';
import { SearchInline } from './SearchBox';
import { MegaPanel, NAV, type NavKey } from './MegaMenu';

const SearchOverlay = dynamic(() => import('./SearchBox').then((m) => m.SearchOverlay), { ssr: false });
const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

function Counter({ n, gold = false }: { n: number; gold?: boolean }) {
  if (!n) return null;
  return <span className={`count-badge${gold ? ' gold' : ''}`}>{n > 99 ? '99+' : n}</span>;
}

export default function Header({ items }: { items: LiteProduct[] }) {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishCount = useWishlist((s) => s.ids.length);
  const cmpCount = useCompare((s) => s.ids.length);
  const panel = useUi((s) => s.panel);
  const open = useUi((s) => s.open);
  const close = useUi((s) => s.close);

  const [active, setActive] = useState<NavKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close everything on navigation
  useEffect(() => {
    setActive(null);
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const hoverOpen = useCallback((k: NavKey) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(k), 90);
  }, []);
  const hoverClose = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(null), 160);
  }, []);
  const keep = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const navShown = NAV.filter((n) => n.kind !== 'badge' || items.some(n.match));

  return (
    <>
      <header
        className={`sticky top-0 z-[60] border-b bg-white/95 backdrop-blur-md transition-shadow ${
          scrolled ? 'border-line shadow-[0_6px_24px_-18px_rgba(28,26,23,.45)]' : 'border-transparent'
        }`}
      >
        <div className="wrap flex h-[62px] items-center gap-2 lg:h-[78px] lg:gap-6">
          <button type="button" className="icon-btn -ml-2 lg:hidden" aria-label="Меню" onClick={() => open('menu')}>
            <Menu size={22} />
          </button>

          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <Logo />
          </div>

          <button
            type="button"
            className={`btn btn-sm hidden gap-2 lg:inline-flex ${active === 'all' ? 'btn-ink' : 'btn-line'}`}
            aria-expanded={active === 'all'}
            aria-haspopup="true"
            onClick={() => setActive((a) => (a === 'all' ? null : 'all'))}
            onMouseEnter={() => hoverOpen('all')}
            onMouseLeave={hoverClose}
          >
            <LayoutGrid size={16} /> Каталог
          </button>

          <div className="hidden min-w-0 flex-1 lg:block">
            <SearchInline items={items} />
          </div>

          <a href={SITE.phoneHref} className="hidden flex-col leading-tight xl:flex">
            <span className="flex items-center gap-1.5 text-[15px] font-extrabold tracking-tight">
              <Phone size={15} className="text-gold-deep" /> {SITE.phone}
            </span>
            <span className="text-[11px] text-ink-3">{SITE.hours}</span>
          </a>

          <div className="flex items-center">
            <button type="button" className="icon-btn lg:hidden" aria-label="Пошук" onClick={() => open('search')}>
              <Search size={21} />
            </button>
            <Link href="/compare" className="icon-btn hidden lg:inline-grid" aria-label={`Порівняння (${hydrated ? cmpCount : 0})`}>
              <ArrowLeftRight size={20} strokeWidth={1.7} />
              <Counter n={hydrated ? cmpCount : 0} />
            </Link>
            <Link href="/wishlist" className="icon-btn hidden lg:inline-grid" aria-label={`Обране (${hydrated ? wishCount : 0})`}>
              <Heart size={21} strokeWidth={1.7} />
              <Counter n={hydrated ? wishCount : 0} />
            </Link>
            <button type="button" className="icon-btn -mr-2 lg:mr-0" aria-label={`Кошик (${hydrated ? cartCount : 0})`} onClick={toggleCart}>
              <ShoppingBag size={21} strokeWidth={1.7} />
              <Counter n={hydrated ? cartCount : 0} gold />
            </button>
          </div>
        </div>

        <nav aria-label="Категорії" className="relative hidden border-t border-line lg:block" onMouseLeave={hoverClose}>
          <ul className="wrap flex h-[46px] items-center gap-1">
            {navShown.map((n, i) => (
              <li key={n.slug} className={i === 6 || i === 8 ? 'ml-3 border-l border-line pl-3' : ''}>
                <Link
                  href={`/catalog/${n.slug}`}
                  onMouseEnter={() => hoverOpen(n.slug)}
                  onFocus={() => setActive(n.slug)}
                  aria-expanded={active === n.slug}
                  className={`relative flex h-[46px] items-center gap-1 px-3 text-[13.5px] font-semibold transition-colors ${
                    active === n.slug ? 'text-ink' : n.kind === 'badge' && n.slug === 'aktsii' ? 'text-wine' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {n.label}
                  {n.kind !== 'badge' && <ChevronDown size={14} className={`opacity-50 transition-transform ${active === n.slug ? 'rotate-180' : ''}`} />}
                  <span className={`absolute inset-x-3 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300 ${active === n.slug ? 'scale-x-100' : 'scale-x-0'}`} />
                </Link>
              </li>
            ))}
          </ul>

          {active && active !== 'all' && (
            <div className="absolute inset-x-0 top-full z-[65]" onMouseEnter={keep} onMouseLeave={hoverClose}>
              <div className="wrap">
                <div className="fade-up overflow-hidden rounded-b-2xl border border-t-0 border-line bg-white shadow-[var(--shadow-pop)]" style={{ animationDuration: '.25s' }}>
                  <MegaPanel active={active} items={items} onPick={() => setActive(null)} />
                </div>
              </div>
            </div>
          )}
        </nav>
        {active === 'all' && (
          <div className="absolute inset-x-0 top-[78px] z-[65] hidden lg:block" onMouseEnter={keep} onMouseLeave={hoverClose}>
            <div className="wrap">
              <div className="fade-up overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-pop)]" style={{ animationDuration: '.25s' }}>
                <MegaPanel active="all" items={items} onPick={() => setActive(null)} />
              </div>
            </div>
          </div>
        )}
      </header>

      {active && <div className="fixed inset-0 z-[55] hidden bg-night/20 lg:block" aria-hidden onClick={() => setActive(null)} />}
      {panel === 'search' && <SearchOverlay items={items} onClose={close} />}
      {panel === 'menu' && <MobileMenu open onClose={close} items={items} />}
    </>
  );
}
