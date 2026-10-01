import Link from 'next/link';
import { SITE, INFO_LINKS } from '@/lib/site';
import { money } from '@/lib/format';

const MSGS = [
  <>Безкоштовна доставка від <b className="text-gold">{money(SITE.freeShippingFrom)}</b></>,
  <>Гарантія якості на кожну прикрасу</>,
  <>Фірмова упаковка <b className="text-gold">у подарунок</b></>,
];

/** Стрічка переваг + службове меню (прокручуються разом зі сторінкою) */
export default function TopBar() {
  return (
    <div className="relative z-[61]">
      <div className="bg-night text-[12px] font-semibold tracking-wide text-[#e9d8b8]">
        <div className="wrap hidden h-9 items-center justify-center gap-8 md:flex">
          {MSGS.map((m, i) => (
            <span key={i} className="flex items-center gap-8">
              {i > 0 && <span className="text-[9px] text-gold" aria-hidden>◆</span>}
              <span>{m}</span>
            </span>
          ))}
        </div>
        <div className="flex h-8 items-center overflow-hidden md:hidden" aria-label="Переваги магазину">
          <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] gap-10 whitespace-nowrap pl-6">
            {[...MSGS, ...MSGS].map((m, i) => (
              <span key={i} className="flex items-center gap-10" aria-hidden={i >= MSGS.length}>
                <span className="text-[8px] text-gold">◆</span>
                <span>{m}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden border-b border-line bg-white lg:block">
        <div className="wrap flex h-9 items-center justify-between text-[12.5px] text-ink-2">
          <nav aria-label="Інформація" className="flex gap-5">
            {INFO_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <a href={`mailto:${SITE.email}`} className="hover:text-ink">
              {SITE.email}
            </a>
            <a href={SITE.phoneHref} className="font-bold text-ink hover:text-gold-deep">
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
