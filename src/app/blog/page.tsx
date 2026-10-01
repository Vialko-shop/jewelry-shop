import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/data/content';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CatIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Блог: поради про прикраси',
  description: 'Як визначити розмір каблучки, доглядати за сріблом і розуміти проби золота — корисні статті VIALKO.',
  alternates: { canonical: '/blog' },
};

export default function Page() {
  return (
    <div className="wrap pb-10">
      <Breadcrumbs items={[{ label: 'Блог' }]} />
      <h1 className="display text-[38px] md:text-[54px]">Блог VIALKO</h1>
      <p className="mt-3 max-w-2xl text-[16px] text-ink-2">Поради про вибір, розміри та догляд за прикрасами.</p>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link href={`/blog/${a.slug}`} className="group block h-full rounded-2xl border border-line bg-white p-7 transition hover:border-line-2 hover:shadow-[var(--shadow-soft)]">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-soft text-gold-deep">
                <CatIcon name={a.icon} size={32} />
              </span>
              <p className="mt-6 text-xs text-ink-3">
                {new Date(a.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })} · {a.minutes} хв читання
              </p>
              <h2 className="mt-2 font-display text-[26px] font-semibold leading-tight group-hover:text-gold-deep">{a.title}</h2>
              <p className="mt-3 text-[14.5px] text-ink-2">{a.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
