import { Suspense } from 'react';
import Link from 'next/link';
import type { ExtendedProduct } from '@/data/products';
import { CATEGORIES, MATERIALS, type Collection } from '@/lib/taxonomy';
import { itemsWord } from '@/lib/format';
import Breadcrumbs from './Breadcrumbs';
import Catalog from './Catalog';
import ProductCard from './ProductCard';
import { CatIcon } from './Icons';

/** Server-rendered grid: SEO-версія каталогу, поки клієнт не підхопив фільтри */
function StaticGrid({ items }: { items: ExtendedProduct[] }) {
  const sorted = [...items].sort((a, b) => (a.status === 'sold' ? 1 : 0) - (b.status === 'sold' ? 1 : 0) || (a.image ? 0 : 1) - (b.image ? 0 : 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return (
    <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
      <div className="hidden lg:block" />
      <div>
        <p className="mb-5 h-10 text-sm leading-10 text-ink-3">{itemsWord(items.length)}</p>
        <h2 className="sr-only">Товари</h2>
        <div className="pgrid cols-4">
          {sorted.slice(0, 24).map((p, i) => (
            <ProductCard key={p.id} p={p} eager={i < 4} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage({
  title,
  intro,
  items,
  collection,
  seo,
}: {
  title: string;
  intro?: string;
  items: ExtendedProduct[];
  collection?: Collection;
  seo?: string;
}) {
  const hide = collection?.kind === 'category' ? (['cat'] as const) : collection?.kind === 'material' ? (['metal'] as const) : collection?.kind === 'badge' ? (['badge'] as const) : ([] as const);

  const quick =
    collection?.kind === 'material' || collection?.kind === 'badge' || !collection
      ? CATEGORIES.map((c) => ({ key: c.key, label: c.name, icon: c.icon, n: items.filter((p) => p.category === c.key).length, href: `?cat=${c.key}` })).filter((x) => x.n)
      : MATERIALS.map((m) => ({ key: m.key, label: m.name, icon: m.icon, n: items.filter((p) => p.material === m.key).length, href: `?metal=${m.key}` })).filter((x) => x.n);

  return (
    <div className="wrap pb-10">
      <Breadcrumbs items={collection ? [{ href: '/catalog', label: 'Каталог' }, { label: collection.title }] : [{ label: 'Каталог' }]} />
      <div className="mb-6 flex flex-col gap-2 md:mb-8">
        <h1 className="display text-[38px] md:text-[52px]">{title}</h1>
        {intro ? <p className="max-w-2xl text-[15px] text-ink-2">{intro}</p> : null}
      </div>

      {quick.length > 1 && (
        <ul className="-mx-4 mb-8 flex gap-3 overflow-x-auto px-4 no-scrollbar md:mx-0 md:flex-wrap md:px-0" aria-label="Швидкий вибір">
          {quick.map((q) => (
            <li key={q.key} className="flex-none">
              <Link href={q.href} className="flex items-center gap-2.5 rounded-2xl border border-line bg-white py-2 pl-2 pr-4 transition hover:border-ink-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-ivory text-gold-deep">
                  <CatIcon name={q.icon} size={24} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold leading-tight">{q.label}</span>
                  <span className="block text-[11.5px] text-ink-3">{q.n}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Suspense fallback={<StaticGrid items={items} />}>
        <Catalog items={items} hide={[...hide]} />
      </Suspense>

      {seo ? (
        <section className="mt-16 max-w-3xl border-t border-line pt-8">
          <h2 className="font-display text-2xl font-semibold">{title} у VIALKO</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{seo}</p>
        </section>
      ) : null}
    </div>
  );
}
