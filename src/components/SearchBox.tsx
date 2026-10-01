'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import type { LiteProduct } from '@/lib/catalog';
import { searchProducts } from '@/lib/search';
import { money } from '@/lib/format';
import { categoryByKey, CATEGORIES } from '@/lib/taxonomy';
import PhotoSlot from './PhotoSlot';

const POPULAR = ['каблучка', 'сережки', 'срібло', 'перли', 'золото'];

function Results({
  q,
  results,
  active,
  onPick,
  listId,
}: {
  q: string;
  results: LiteProduct[];
  active: number;
  onPick: () => void;
  listId: string;
}) {
  if (q.trim().length < 2) {
    return (
      <div className="p-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-ink-3">Часто шукають</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR.map((w) => (
            <Link key={w} href={`/search?q=${encodeURIComponent(w)}`} className="chip" onClick={onPick}>
              {w}
            </Link>
          ))}
        </div>
        <p className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-[.18em] text-ink-3">Категорії</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={`/catalog/${c.slug}`} className="chip" onClick={onPick}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (!results.length) {
    return (
      <div className="p-5 text-sm text-ink-2">
        За запитом «<b className="text-ink">{q}</b>» нічого не знайдено. Спробуйте інше слово або{' '}
        <Link href="/catalog" className="font-semibold text-gold-deep underline underline-offset-4" onClick={onPick}>
          перегляньте каталог
        </Link>
        .
      </div>
    );
  }
  const top = results.slice(0, 6);
  return (
    <div>
      <ul id={listId} role="listbox" aria-label="Результати пошуку" className="max-h-[60vh] overflow-auto py-1">
        {top.map((p, i) => (
          <li key={p.id} role="option" aria-selected={i === active}>
            <Link
              href={`/product/${encodeURIComponent(p.id)}`}
              onClick={onPick}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${i === active ? 'bg-mist' : 'hover:bg-mist'}`}
            >
              <span className="relative h-14 w-14 flex-none overflow-hidden rounded-lg bg-[#f6f3ee]">
                <PhotoSlot src={p.image || null} alt="" sizes="56px" icon={categoryByKey(p.category)?.icon} label="" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{p.nameUa}</span>
                <span className="block text-xs text-ink-3">{categoryByKey(p.category)?.one}</span>
              </span>
              <span className="whitespace-nowrap text-sm font-bold">{money(p.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/search?q=${encodeURIComponent(q.trim())}`}
        onClick={onPick}
        className="flex items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold hover:bg-mist"
      >
        Усі результати ({results.length}) <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export function useProductSearch(items: LiteProduct[], q: string) {
  return useMemo(() => searchProducts(items, q), [items, q]);
}

/** Desktop search in the header */
export function SearchInline({ items }: { items: LiteProduct[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const results = useProductSearch(items, q);
  const listId = useId();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const submit = () => {
    const top = results.slice(0, 6);
    if (active >= 0 && top[active]) router.push(`/product/${encodeURIComponent(top[active].id)}`);
    else if (q.trim().length >= 2) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <div ref={box} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative"
      >
        <label htmlFor="hdr-search" className="sr-only">
          Пошук прикрас
        </label>
        <input
          id="hdr-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            const n = Math.min(results.length, 6);
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => (n ? (a + 1) % n : -1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => (n ? (a - 1 + n) % n : -1));
            } else if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Пошук: каблучка, сережки, артикул…"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          className="h-11 w-full rounded-full border border-line-2 bg-ivory pl-11 pr-24 text-[14px] outline-none transition focus:border-ink focus:bg-white"
        />
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
        {q && (
          <button type="button" aria-label="Очистити" onClick={() => setQ('')} className="absolute right-[76px] top-1/2 -translate-y-1/2 p-1 text-ink-3 hover:text-ink">
            <X size={16} />
          </button>
        )}
        <button type="submit" className="absolute right-1 top-1 h-9 rounded-full bg-ink px-4 text-[13px] font-bold text-white hover:bg-[#33302b]">
          Знайти
        </button>
      </form>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-pop)]">
          <Results q={q} results={results} active={active} onPick={() => setOpen(false)} listId={listId} />
        </div>
      )}
    </div>
  );
}

/** Full-screen search for phones */
export function SearchOverlay({ items, onClose }: { items: LiteProduct[]; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const results = useProductSearch(items, q);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-white" role="dialog" aria-modal="true" aria-label="Пошук">
      <form
        role="search"
        className="flex items-center gap-2 border-b border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim().length >= 2) {
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            onClose();
          }
        }}
      >
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Що шукаєте?"
            aria-label="Пошук прикрас"
            aria-controls={listId}
            className="h-12 w-full rounded-full border border-line-2 bg-ivory pl-10 pr-4 text-base outline-none focus:border-ink focus:bg-white"
            enterKeyHint="search"
          />
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Закрити пошук">
          <X size={22} />
        </button>
      </form>
      <div className="flex-1 overflow-auto">
        <Results q={q} results={results} active={-1} onPick={onClose} listId={listId} />
      </div>
    </div>
  );
}
