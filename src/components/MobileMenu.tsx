'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { X, Phone, Mail, ChevronRight, Heart, ArrowLeftRight } from 'lucide-react';
import type { LiteProduct } from '@/lib/catalog';
import { CATEGORIES, MATERIALS, BADGES, badgeKeys, type IconName } from '@/lib/taxonomy';
import { SITE, INFO_LINKS } from '@/lib/site';
import { CatIcon } from './Icons';
import Logo from './Logo';

export default function MobileMenu({ open, onClose, items }: { open: boolean; onClose: () => void; items: LiteProduct[] }) {
  const rows: { href: string; label: string; icon: IconName; n: number }[] = [
    ...CATEGORIES.map((c) => ({ href: `/catalog/${c.slug}`, label: c.name, icon: c.icon, n: items.filter((p) => p.category === c.key).length })),
    { href: '/catalog/biju', label: 'Біжутерія', icon: 'biju', n: items.filter((p) => p.material === 'bijouterie').length },
  ];
  const extra: { href: string; label: string; icon: IconName; n: number }[] = [
    ...MATERIALS.filter((m) => m.key !== 'bijouterie').map((m) => ({ href: `/catalog/${m.slug}`, label: m.name, icon: m.icon, n: items.filter((p) => p.material === m.key).length })),
    ...BADGES.map((b) => ({ href: `/catalog/${b.slug}`, label: b.title, icon: b.key as IconName, n: items.filter((p) => badgeKeys(p.badges).includes(b.key)).length })),
  ].filter((x) => x.n > 0);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="drawer left" aria-describedby={undefined}>
          <div className="drawer-head">
            <Dialog.Title className="sr-only">Меню</Dialog.Title>
            <Logo compact />
            <Dialog.Close className="icon-btn" aria-label="Закрити меню">
              <X size={22} />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-4 pb-2 pt-4">
              <Link href="/catalog" onClick={onClose} className="btn btn-ink btn-block">
                Увесь каталог
              </Link>
            </div>
            <ul className="px-2">
              {rows.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-ivory">
                    <CatIcon name={r.icon} size={26} className="text-gold-deep" />
                    <span className="flex-1 text-[15px] font-semibold">{r.label}</span>
                    <span className="text-xs text-ink-3">{r.n}</span>
                    <ChevronRight size={16} className="text-ink-3" />
                  </Link>
                </li>
              ))}
            </ul>
            {extra.length > 0 && (
              <div className="mx-4 mt-2 flex flex-wrap gap-2 border-t border-line pt-4">
                {extra.map((x) => (
                  <Link key={x.href} href={x.href} onClick={onClose} className="chip">
                    <CatIcon name={x.icon} size={16} /> {x.label}
                  </Link>
                ))}
              </div>
            )}
            <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
              <Link href="/wishlist" onClick={onClose} className="btn btn-line btn-sm">
                <Heart size={15} /> Обране
              </Link>
              <Link href="/compare" onClick={onClose} className="btn btn-line btn-sm">
                <ArrowLeftRight size={15} /> Порівняння
              </Link>
            </div>
            <ul className="mx-4 mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-[14px] text-ink-2">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={onClose} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 border-t border-line bg-ivory px-5 py-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <a href={SITE.phoneHref} className="flex items-center gap-2 text-[17px] font-extrabold">
              <Phone size={17} className="text-gold-deep" /> {SITE.phoneDisplay}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-sm text-ink-2">
              <Mail size={15} /> {SITE.email}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
