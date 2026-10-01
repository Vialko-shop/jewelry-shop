import Link from 'next/link';
import { Phone, Mail, Truck, ShieldCheck, Gift, CreditCard } from 'lucide-react';
import { SITE, INFO_LINKS } from '@/lib/site';
import { CATEGORIES, MATERIALS, BADGES } from '@/lib/taxonomy';
import { money } from '@/lib/format';
import Logo from './Logo';
import { PayBadge } from './Icons';

export const BENEFITS = [
  { icon: Truck, title: 'Безкоштовна доставка', text: `Новою поштою від ${money(SITE.freeShippingFrom)}` },
  { icon: ShieldCheck, title: 'Гарантія якості', text: 'Перевіряємо кожну прикрасу перед відправкою' },
  { icon: Gift, title: 'Фірмова упаковка', text: 'Прикраса готова до подарунка' },
  { icon: CreditCard, title: 'Безпечна оплата', text: 'Visa / Mastercard через LiqPay' },
] as const;

export default function Footer() {
  const socials = Object.entries(SITE.socials).filter(([, v]) => v);
  return (
    <footer className="mt-10 bg-night text-[#cfc6b8]">
      <div className="border-b border-white/10">
        <ul className="wrap grid grid-cols-2 gap-x-4 gap-y-6 py-8 md:grid-cols-4">
          {BENEFITS.map(({ icon: I, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <I size={24} strokeWidth={1.5} className="mt-0.5 flex-none text-gold" />
              <span>
                <b className="block text-[14px] text-white">{title}</b>
                <span className="text-[12.5px] leading-snug text-[#b8b0a4]">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Logo invert />
          <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-[#b8b0a4]">
            Прикраси із золота, срібла та вишукана біжутерія. Дбайливо обираємо, перевіряємо й пакуємо кожен виріб.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold capitalize text-white hover:border-gold">
                  {k}
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Каталог">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[.2em] text-gold">Каталог</p>
          <ul className="space-y-2 text-[14px]">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link href={`/catalog/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            {MATERIALS.map((m) => (
              <li key={m.key}>
                <Link href={`/catalog/${m.slug}`} className="hover:text-white">
                  {m.name}
                </Link>
              </li>
            ))}
            {BADGES.map((b) => (
              <li key={b.key}>
                <Link href={`/catalog/${b.slug}`} className="hover:text-white">
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Покупцям">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[.2em] text-gold">Покупцям</p>
          <ul className="space-y-2 text-[14px]">
            {INFO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/wishlist" className="hover:text-white">
                Обране
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-white">
                Порівняння
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[.2em] text-gold">Контакти</p>
          <a href={SITE.phoneHref} className="flex items-center gap-2 text-xl font-extrabold text-white hover:text-gold">
            <Phone size={18} className="text-gold" /> {SITE.phoneDisplay}
          </a>
          <p className="mt-1 text-[12.5px] text-[#b8b0a4]">{SITE.hours}</p>
          <a href={`mailto:${SITE.email}`} className="mt-4 flex items-center gap-2 text-[14px] hover:text-white">
            <Mail size={16} className="text-gold" /> {SITE.email}
          </a>
          <p className="mt-4 text-[13px] leading-relaxed text-[#b8b0a4]">Доставка Новою поштою по всій Україні — у відділення або поштомат.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-6 text-[12.5px] text-[#9a9186] md:flex-row">
          <p>© {new Date().getFullYear()} VIALKO · Віалко. Усі права захищені.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 opacity-90">
            <PayBadge>VISA</PayBadge>
            <PayBadge>Mastercard</PayBadge>
            <PayBadge>LiqPay</PayBadge>
            <PayBadge>Нова пошта</PayBadge>
          </div>
        </div>
      </div>
    </footer>
  );
}
