import Link from 'next/link';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { SITE, INFO_LINKS } from '@/lib/site';
import Breadcrumbs from './Breadcrumbs';

export default function InfoPage({ title, lead, children, path }: { title: string; lead?: string; children: React.ReactNode; path: string }) {
  return (
    <div className="wrap pb-10">
      <Breadcrumbs items={[{ label: title }]} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <article>
          <h1 className="display text-[38px] md:text-[54px]">{title}</h1>
          {lead ? <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">{lead}</p> : null}
          <div className="prose-vk mt-8 max-w-3xl">{children}</div>
        </article>
        <aside className="space-y-4 lg:pt-4">
          <div className="rounded-2xl bg-ivory p-6">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-gold-deep">Маєте питання?</p>
            <a href={SITE.phoneHref} className="mt-3 flex items-center gap-2 text-xl font-extrabold">
              <Phone size={18} className="text-gold-deep" /> {SITE.phone}
            </a>
            <p className="mt-1 text-xs text-ink-3">{SITE.hours}</p>
            <a href={`mailto:${SITE.email}`} className="mt-3 flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
              <Mail size={15} /> {SITE.email}
            </a>
          </div>
          <nav aria-label="Покупцям" className="rounded-2xl border border-line p-3">
            {INFO_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={l.href === path ? 'page' : undefined}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] ${l.href === path ? 'bg-ink font-semibold text-white' : 'text-ink-2 hover:bg-mist hover:text-ink'}`}
              >
                {l.label} <ArrowRight size={14} className="opacity-60" />
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
