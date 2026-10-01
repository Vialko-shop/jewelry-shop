'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LiteProduct } from '@/lib/catalog';
import { CATEGORIES, MATERIALS, BADGES, PRICE_BANDS, badgeKeys, categoryByKey, type IconName } from '@/lib/taxonomy';
import { money, plural } from '@/lib/format';
import { CatIcon } from './Icons';
import PhotoSlot from './PhotoSlot';

export type NavKey = string; // collection slug or 'all'

export interface NavEntry {
  slug: string;
  label: string;
  icon: IconName;
  kind: 'category' | 'material' | 'badge';
  match: (p: LiteProduct) => boolean;
}

export const NAV: NavEntry[] = [
  ...CATEGORIES.map<NavEntry>((c) => ({ slug: c.slug, label: c.name, icon: c.icon, kind: 'category', match: (p) => p.category === c.key })),
  { slug: 'biju', label: 'Біжутерія', icon: 'biju', kind: 'material', match: (p) => p.material === 'bijouterie' },
  { slug: 'zoloto', label: 'Золото', icon: 'gold', kind: 'material', match: (p) => p.material === 'gold' },
  { slug: 'sriblo', label: 'Срібло', icon: 'silver', kind: 'material', match: (p) => p.material === 'silver' },
  { slug: 'novynky', label: 'Новинки', icon: 'new', kind: 'badge', match: (p) => badgeKeys(p.badges).includes('new') },
  { slug: 'aktsii', label: 'Акції', icon: 'sale', kind: 'badge', match: (p) => badgeKeys(p.badges).includes('sale') },
];

const cnt = (n: number) => `${n} ${plural(n, 'виріб', 'вироби', 'виробів')}`;

function Featured({ list, onPick }: { list: LiteProduct[]; onPick: () => void }) {
  if (!list.length) return null;
  return (
    <div className="grid grid-cols-3 gap-3">
      {list.slice(0, 3).map((p) => (
        <Link key={p.id} href={`/product/${encodeURIComponent(p.id)}`} onClick={onPick} className="group/f block">
          <span className="relative block aspect-square overflow-hidden rounded-xl bg-[#f6f3ee]">
            <PhotoSlot src={p.image || null} alt={p.nameUa} sizes="140px" icon={categoryByKey(p.category)?.icon} label="" className="transition-transform duration-500 group-hover/f:scale-105" />
          </span>
          <span className="mt-2 block truncate text-[12.5px] font-semibold">{p.nameUa}</span>
          <span className="block text-[12.5px] font-bold text-gold-deep">{money(p.price)}</span>
        </Link>
      ))}
    </div>
  );
}

function Col({ title, links, onPick }: { title: string; links: { href: string; label: string; n: number }[]; onPick: () => void }) {
  const shown = links.filter((l) => l.n > 0);
  if (!shown.length) return null;
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-ink-3">{title}</p>
      <ul className="space-y-1.5">
        {shown.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={onPick} className="group/l flex items-baseline gap-2 text-[14px] text-ink-2 hover:text-ink">
              <span className="border-b border-transparent group-hover/l:border-ink">{l.label}</span>
              <span className="text-[11px] text-ink-3">{l.n}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MegaPanel({ active, items, onPick }: { active: NavKey; items: LiteProduct[]; onPick: () => void }) {
  if (active === 'all') return <CatalogMap items={items} onPick={onPick} />;
  const entry = NAV.find((n) => n.slug === active);
  if (!entry) return null;
  const inNav = items.filter(entry.match);
  const base = `/catalog/${entry.slug}`;
  const featured = [...inNav].sort((a, b) => (a.image ? 0 : 1) - (b.image ? 0 : 1)).slice(0, 3);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 p-8">
      <div>
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-soft text-gold-deep">
            <CatIcon name={entry.icon} size={26} />
          </span>
          <div>
            <p className="font-display text-[28px] font-semibold leading-none">{entry.label}</p>
            <p className="mt-1 text-xs text-ink-3">{cnt(inNav.length)}</p>
          </div>
          <Link href={base} onClick={onPick} className="btn btn-line btn-sm ml-auto">
            Усі {entry.label.toLowerCase()} <ArrowRight size={15} />
          </Link>
        </div>
        {entry.kind === 'category' || entry.kind === 'badge' ? (
          <div className="grid grid-cols-3 gap-8">
            <Col
              title="Метал"
              onPick={onPick}
              links={MATERIALS.map((m) => ({ href: `${base}?metal=${m.key}`, label: m.name, n: inNav.filter((p) => p.material === m.key).length }))}
            />
            <Col
              title="Ціна"
              onPick={onPick}
              links={PRICE_BANDS.map((b) => ({ href: `${base}?price=${b.id}`, label: b.label, n: inNav.filter((p) => p.price >= b.min && p.price <= b.max).length }))}
            />
            {entry.kind === 'category' ? (
              <Col
                title="Добірки"
                onPick={onPick}
                links={BADGES.map((b) => ({ href: `${base}?badge=${b.key}`, label: b.title, n: inNav.filter((p) => badgeKeys(p.badges).includes(b.key)).length }))}
              />
            ) : (
              <Col
                title="Категорії"
                onPick={onPick}
                links={CATEGORIES.map((c) => ({ href: `${base}?cat=${c.key}`, label: c.name, n: inNav.filter((p) => p.category === c.key).length }))}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((c) => {
              const n = inNav.filter((p) => p.category === c.key).length;
              if (!n) return null;
              return (
                <Link
                  key={c.key}
                  href={`${base}?cat=${c.key}`}
                  onClick={onPick}
                  className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-ink-3 hover:bg-ivory"
                >
                  <CatIcon name={c.icon} size={30} className="text-gold-deep" />
                  <span>
                    <span className="block text-sm font-semibold">{c.name}</span>
                    <span className="block text-[11.5px] text-ink-3">{cnt(n)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-l border-line pl-10">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-ink-3">Варто подивитися</p>
        <Featured list={featured} onPick={onPick} />
      </div>
    </div>
  );
}

/** «Каталог» — карта всіх розділів */
export function CatalogMap({ items, onPick }: { items: LiteProduct[]; onPick: () => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-10 p-8">
      <div className="grid grid-cols-3 gap-x-8 gap-y-7">
        {CATEGORIES.map((c) => {
          const inCat = items.filter((p) => p.category === c.key);
          return (
            <div key={c.key} className="flex gap-3">
              <CatIcon name={c.icon} size={32} className="mt-0.5 flex-none text-gold-deep" />
              <div>
                <Link href={`/catalog/${c.slug}`} onClick={onPick} className="text-[15px] font-bold hover:text-gold-deep">
                  {c.name} <span className="text-xs font-medium text-ink-3">{inCat.length}</span>
                </Link>
                <ul className="mt-1.5 space-y-1 text-[13.5px] text-ink-2">
                  {MATERIALS.map((m) => {
                    const n = inCat.filter((p) => p.material === m.key).length;
                    return n ? (
                      <li key={m.key}>
                        <Link href={`/catalog/${c.slug}?metal=${m.key}`} onClick={onPick} className="hover:text-ink">
                          {m.name}
                        </Link>
                      </li>
                    ) : null;
                  })}
                  <li>
                    <Link href={`/catalog/${c.slug}?price=lt1000`} onClick={onPick} className="hover:text-ink">
                      До 1 000 ₴
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
        <div className="flex gap-3">
          <CatIcon name="biju" size={32} className="mt-0.5 flex-none text-gold-deep" />
          <div>
            <Link href="/catalog/biju" onClick={onPick} className="text-[15px] font-bold hover:text-gold-deep">
              Біжутерія <span className="text-xs font-medium text-ink-3">{items.filter((p) => p.material === 'bijouterie').length}</span>
            </Link>
            <p className="mt-1.5 text-[13.5px] text-ink-2">Прикраси з ювелірного сплаву, перли, кристали</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 border-l border-line pl-8">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-ink-3">Добірки</p>
        {[...MATERIALS.filter((m) => m.key !== 'bijouterie').map((m) => ({ slug: m.slug, label: m.name, icon: m.icon })), ...BADGES.map((b) => ({ slug: b.slug, label: b.title, icon: b.key as IconName }))].map((x) => (
          <Link key={x.slug} href={`/catalog/${x.slug}`} onClick={onPick} className="flex items-center gap-3 rounded-lg px-2 py-2 text-[14px] font-semibold hover:bg-ivory">
            <CatIcon name={x.icon} size={24} className="text-gold-deep" /> {x.label}
          </Link>
        ))}
        <Link href="/catalog" onClick={onPick} className="btn btn-ink btn-sm mt-3 w-full">
          Увесь каталог <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
