import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown, ArrowRight, ShieldCheck, Gift, RotateCcw } from 'lucide-react';
import { getCatalog, getProduct, related } from '@/lib/catalog';
import { categoryByKey, materialByKey, STATUS } from '@/lib/taxonomy';
import { SITE } from '@/lib/site';
import { money, sku, metalLabel, probeOf } from '@/lib/format';
import Breadcrumbs from '@/components/Breadcrumbs';
import Gallery from '@/components/product/Gallery';
import BuyBox from '@/components/product/BuyBox';
import DeliveryCalc from '@/components/product/DeliveryCalc';
import Carousel from '@/components/Carousel';
import ProductCard, { Stickers } from '@/components/ProductCard';
import { ldJson } from '@/lib/jsonld';

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await getCatalog();
  return all.map((p) => ({ id: p.id }));
}

const absolute = (src: string) => (src.startsWith('/') ? `${SITE.url}${src}` : src);

export async function generateMetadata({ params }: PageProps<'/product/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(decodeURIComponent(id));
  if (!p) return { title: 'Товар не знайдено' };
  const desc = `${p.nameUa} — ${metalLabel(p).toLowerCase()}, ціна ${money(p.price)}. ${p.description}`.slice(0, 300);
  const images = [p.image, p.image2].filter(Boolean).map((s) => absolute(s as string));
  return {
    title: `${p.nameUa} — ${money(p.price)}`,
    description: desc,
    alternates: { canonical: `/product/${encodeURIComponent(p.id)}` },
    openGraph: { title: p.nameUa, description: desc, url: `/product/${encodeURIComponent(p.id)}`, images },
  };
}

const PROBES = [
  { metal: 'Золото', probe: '585', share: '58,5 %', note: 'Міцне та зносостійке — найпопулярніше для прикрас' },
  { metal: 'Золото', probe: '750', share: '75 %', note: 'Насичений колір, преміальні вироби' },
  { metal: 'Срібло', probe: '925', share: '92,5 %', note: 'Стандарт ювелірного срібла' },
];

export default async function ProductPage({ params }: PageProps<'/product/[id]'>) {
  const { id } = await params;
  const all = await getCatalog();
  const p = all.find((x) => x.id === decodeURIComponent(id));
  if (!p) notFound();

  const cat = categoryByKey(p.category);
  const mat = materialByKey(p.material);
  const images = [p.image, p.image2, p.image3].filter((s): s is string => Boolean(s));
  const probe = probeOf(p);
  const rel = related(all, p, 12);

  const specs: [string, string][] = [
    ['Артикул', sku(p.id)],
    ['Категорія', cat?.one ?? '—'],
    ['Метал', mat?.name ?? '—'],
    ...(probe && p.material !== 'bijouterie' ? ([['Проба', probe]] as [string, string][]) : []),
    ...(p.weight ? ([['Вага', p.weight]] as [string, string][]) : []),
    ...(p.size ? ([[p.category === 'ring' ? 'Розміри' : 'Розмір / довжина', p.size]] as [string, string][]) : []),
    ['Наявність', STATUS[p.status]?.label ?? ''],
  ];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nameUa,
    sku: sku(p.id),
    description: p.description,
    category: cat?.name,
    material: mat?.name,
    brand: { '@type': 'Brand', name: 'VIALKO' },
    ...(images.length ? { image: images.map(absolute) } : {}),
    offers: {
      '@type': 'Offer',
      url: `${SITE.url}/product/${encodeURIComponent(p.id)}`,
      priceCurrency: 'UAH',
      price: p.price,
      availability:
        p.status === 'in_stock' ? 'https://schema.org/InStock' : p.status === 'on_order' ? 'https://schema.org/PreOrder' : 'https://schema.org/SoldOut',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="wrap pb-6">
      <Breadcrumbs
        items={[
          { href: '/catalog', label: 'Каталог' },
          ...(cat ? [{ href: `/catalog/${cat.slug}`, label: cat.name }] : []),
          { label: p.nameUa },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-[140px] lg:self-start">
          <Gallery images={images} alt={p.nameUa} icon={cat?.icon ?? 'ring'}>
            <Stickers p={p} className="pointer-events-none absolute left-4 top-4 z-[2] flex flex-col items-start gap-1.5" />
          </Gallery>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-deep">{metalLabel(p) || cat?.one}</p>
          <h1 className="mt-2 font-display text-[34px] font-semibold leading-[1.05] md:text-[44px]">{p.nameUa}</h1>
          <p className="mt-2 text-sm text-ink-3">Артикул: {sku(p.id)}</p>

          <div className="mt-6">
            <BuyBox p={p} />
          </div>

          <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-[12px] text-ink-2">
            <li className="rounded-xl bg-ivory px-2 py-3">
              <ShieldCheck size={18} className="mx-auto mb-1 text-gold-deep" /> Гарантія якості
            </li>
            <li className="rounded-xl bg-ivory px-2 py-3">
              <Gift size={18} className="mx-auto mb-1 text-gold-deep" /> Фірмова упаковка
            </li>
            <li className="rounded-xl bg-ivory px-2 py-3">
              <RotateCcw size={18} className="mx-auto mb-1 text-gold-deep" /> Обмін за правилами
            </li>
          </ul>

          <div className="mt-6">
            <DeliveryCalc price={p.price} />
          </div>

          <div className="acc mt-8">
            <details open>
              <summary>
                Опис
                <ChevronDown size={18} className="chev" />
              </summary>
              <div className="acc-body">
                <p>{p.description || 'Опис готується. Зателефонуйте нам — розповімо про прикрасу детальніше.'}</p>
              </div>
            </details>
            <details open>
              <summary>
                Характеристики
                <ChevronDown size={18} className="chev" />
              </summary>
              <div className="acc-body">
                <dl>
                  {specs.map(([k, v]) => (
                    <div key={k} className="spec-row">
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </details>
            <details>
              <summary>
                Доставка і оплата
                <ChevronDown size={18} className="chev" />
              </summary>
              <div className="acc-body space-y-2">
                <p>Відправляємо Новою поштою по всій Україні у відділення або поштомат. Для замовлень від {money(SITE.freeShippingFrom)} доставка безкоштовна.</p>
                <p>Оплата онлайн карткою Visa / Mastercard через LiqPay — захищений платіжний сервіс ПриватБанку.</p>
                <Link href="/dostavka-i-oplata" className="inline-flex items-center gap-1 font-semibold text-gold-deep">
                  Детальніше <ArrowRight size={14} />
                </Link>
              </div>
            </details>
            <details>
              <summary>
                Гарантія та обмін
                <ChevronDown size={18} className="chev" />
              </summary>
              <div className="acc-body space-y-2">
                <p>Перевіряємо кожну прикрасу перед відправкою. Якщо виявите виробничий недолік — замінимо виріб або повернемо кошти.</p>
                <Link href="/obmin-i-povernennia" className="inline-flex items-center gap-1 font-semibold text-gold-deep">
                  Умови обміну і повернення <ArrowRight size={14} />
                </Link>
              </div>
            </details>
            <details>
              <summary>
                Таблиця проб: метал і вміст
                <ChevronDown size={18} className="chev" />
              </summary>
              <div className="acc-body">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13.5px]">
                    <thead>
                      <tr className="border-b border-line text-ink">
                        <th className="py-2 pr-3 font-bold">Метал</th>
                        <th className="py-2 pr-3 font-bold">Проба</th>
                        <th className="py-2 pr-3 font-bold">Чистого металу</th>
                        <th className="py-2 font-bold">Особливості</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROBES.map((r) => (
                        <tr key={r.probe} className={`border-b border-line ${probe === r.probe ? 'bg-gold-soft/60 font-semibold text-ink' : ''}`}>
                          <td className="py-2 pr-3">{r.metal}</td>
                          <td className="py-2 pr-3">{r.probe}</td>
                          <td className="py-2 pr-3">{r.share}</td>
                          <td className="py-2">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {rel.length > 0 && (
        <section className="pt-16" aria-labelledby="rel-title">
          <div className="section-head">
            <h2 id="rel-title" className="section-title">
              Вам може сподобатися
            </h2>
            {cat && (
              <Link href={`/catalog/${cat.slug}`} className="link-more">
                Усі {cat.name.toLowerCase()} <ArrowRight size={15} />
              </Link>
            )}
          </div>
          <Carousel label="Схожі прикраси" slideClass="[--slide:50%] md:[--slide:33.333%] lg:[--slide:25%] xl:[--slide:20%]">
            {rel.map((r) => (
              <ProductCard key={r.id} p={r} sizes="(max-width: 767px) 50vw, 260px" />
            ))}
          </Carousel>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
    </div>
  );
}
