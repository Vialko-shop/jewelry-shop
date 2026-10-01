'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import Carousel from '../Carousel';
import ProductCard from '../ProductCard';

export interface ProductTab {
  key: string;
  label: string;
  href: string;
  items: ExtendedProduct[];
  total?: number;
}

export default function ProductTabs({ title, tabs }: { title: string; tabs: ProductTab[] }) {
  const shown = tabs.filter((t) => t.items.length);
  const [cur, setCur] = useState(shown[0]?.key);
  const base = useId();
  if (!shown.length) return null;
  const tab = shown.find((t) => t.key === cur) ?? shown[0];

  return (
    <section className="wrap py-10 md:py-14" aria-labelledby={`${base}-t`}>
      <div className="section-head flex-col items-start md:flex-row md:items-end">
        <div>
          <span className="eyebrow">Обирають зараз</span>
          <h2 id={`${base}-t`} className="section-title mt-2">
            {title}
          </h2>
        </div>
        <div className="flex w-full items-center gap-2 overflow-x-auto no-scrollbar md:w-auto" role="tablist" aria-label="Добірки">
          {shown.map((t) => (
            <button
              key={t.key}
              id={`${base}-${t.key}`}
              role="tab"
              type="button"
              aria-selected={t.key === tab.key}
              aria-controls={`${base}-panel`}
              className={`chip whitespace-nowrap ${t.key === tab.key ? 'is-on' : ''}`}
              onClick={() => setCur(t.key)}
            >
              {t.label} <span className={`text-[11px] ${t.key === tab.key ? 'text-white/70' : 'text-ink-3'}`}>{t.total ?? t.items.length}</span>
            </button>
          ))}
        </div>
      </div>
      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-${tab.key}`}>
        <Carousel key={tab.key} label={tab.label} slideClass="[--slide:50%] md:[--slide:33.333%] lg:[--slide:25%] xl:[--slide:20%]">
          {tab.items.map((p) => (
            <ProductCard key={p.id} p={p} sizes="(max-width: 767px) 50vw, (max-width: 1279px) 25vw, 260px" />
          ))}
        </Carousel>
      </div>
      <div className="mt-6 flex justify-center">
        <Link href={tab.href} className="btn btn-line">
          Дивитися всі: {tab.label.toLowerCase()} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
