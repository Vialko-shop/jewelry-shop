import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import { CATEGORIES, MATERIALS, PRICE_BANDS, type IconName } from '@/lib/taxonomy';
import { withBadge } from '@/lib/catalog';
import { money, plural } from '@/lib/format';
import { ABOUT_SEO, ARTICLES, FAQ } from '@/data/content';
import HeroSlider, { type HeroSlide } from './home/HeroSlider';
import ProductTabs from './home/ProductTabs';
import Carousel from './Carousel';
import ProductCard from './ProductCard';
import Partners from './Partners';
import PhotoSlot from './PhotoSlot';
import { BENEFITS } from './Footer';
import { CatIcon } from './Icons';
import { ldJson } from '@/lib/jsonld';

const firstImage = (list: ExtendedProduct[]) => list.find((p) => p.image)?.image ?? '';
const count = (n: number) => `${n} ${plural(n, 'виріб', 'вироби', 'виробів')}`;

export function Benefits() {
  return (
    <section aria-label="Наші переваги" className="wrap pt-6">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {BENEFITS.map(({ icon: I, title, text }) => (
          <li key={title} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gold-soft text-gold-deep">
              <I size={19} strokeWidth={1.7} />
            </span>
            <span className="min-w-0">
              <b className="block text-[13.5px] leading-tight">{title}</b>
              <span className="hidden text-[12px] leading-snug text-ink-3 sm:block">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function QuickCategories({ all }: { all: ExtendedProduct[] }) {
  const tiles: { href: string; label: string; icon: IconName; list: ExtendedProduct[] }[] = [
    ...CATEGORIES.map((c) => ({ href: `/catalog/${c.slug}`, label: c.name, icon: c.icon, list: all.filter((p) => p.category === c.key) })),
    { href: '/catalog/biju', label: 'Біжутерія', icon: 'biju', list: all.filter((p) => p.material === 'bijouterie') },
  ];
  return (
    <section className="wrap pt-12 md:pt-16" aria-labelledby="qc-title">
      <div className="section-head">
        <div>
          <span className="eyebrow">Каталог</span>
          <h2 id="qc-title" className="section-title mt-2">
            Популярні категорії
          </h2>
        </div>
        <Link href="/catalog" className="link-more">
          Увесь каталог <ArrowRight size={15} />
        </Link>
      </div>
      <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-6 md:gap-6 md:overflow-visible md:px-0">
        {tiles.map((t) => {
          const img = firstImage(t.list);
          return (
            <li key={t.href} className="w-[112px] flex-none md:w-auto">
              <Link href={t.href} className="group block text-center">
                <span className="relative mx-auto block aspect-square w-full overflow-hidden rounded-full border border-line bg-[radial-gradient(circle_at_50%_35%,#fff,#f1ebe2)] transition duration-300 group-hover:border-gold group-hover:shadow-[var(--shadow-soft)]">
                  {img ? (
                    <PhotoSlot src={img} alt="" sizes="(max-width: 768px) 112px, 180px" className="p-3 transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-gold-deep">
                      <CatIcon name={t.icon} size={56} strokeWidth={1.2} />
                    </span>
                  )}
                </span>
                <span className="mt-3 block text-[14px] font-bold">{t.label}</span>
                <span className="block text-[12px] text-ink-3">{count(t.list.length)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PromoDuo({ all }: { all: ExtendedProduct[] }) {
  const cards = [
    { slug: 'sriblo', eyebrow: 'Срібло 925', title: 'Легкість на щодень', text: 'Каблучки, сережки й браслети зі срібла', key: 'silver' as const, bg: 'linear-gradient(135deg,#f4f5f7 0%,#e6e8ec 100%)' },
    { slug: 'zoloto', eyebrow: 'Золото 585', title: 'Класика, що залишається', text: 'Прикраси із жовтого та рожевого золота', key: 'gold' as const, bg: 'linear-gradient(135deg,#faf3e6 0%,#efdfc2 100%)' },
  ];
  return (
    <section className="wrap py-4 md:py-6" aria-label="Добірки за металом">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {cards.map((c) => {
          const list = all.filter((p) => p.material === c.key);
          const img = firstImage(list);
          return (
            <Link key={c.slug} href={`/catalog/${c.slug}`} className="group relative grid min-h-[230px] grid-cols-[1.1fr_1fr] overflow-hidden rounded-[22px] md:min-h-[280px]" style={{ background: c.bg }}>
              <div className="relative z-[1] flex flex-col justify-center gap-2 p-6 md:p-9">
                <span className="eyebrow">{c.eyebrow}</span>
                <h3 className="display text-[30px] md:text-[40px]">{c.title}</h3>
                <p className="text-[13.5px] text-ink-2">{c.text}</p>
                <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
                  {count(list.length)} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="relative">
                {img ? (
                  <PhotoSlot src={img} alt="" sizes="(max-width: 768px) 45vw, 25vw" className="p-4 transition-transform duration-700 group-hover:scale-[1.06]" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-gold-deep">
                    <CatIcon name={c.key} size={90} strokeWidth={1} />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CatalogDirectory({ all }: { all: ExtendedProduct[] }) {
  return (
    <section className="wrap py-12 md:py-16" aria-labelledby="dir-title">
      <div className="section-head">
        <div>
          <span className="eyebrow">Навігація</span>
          <h2 id="dir-title" className="section-title mt-2">
            Каталог прикрас VIALKO
          </h2>
        </div>
      </div>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const list = all.filter((p) => p.category === c.key);
          return (
            <div key={c.key} className="flex gap-4">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ivory text-gold-deep">
                <CatIcon name={c.icon} size={28} />
              </span>
              <div>
                <Link href={`/catalog/${c.slug}`} className="text-[16px] font-bold hover:text-gold-deep">
                  {c.name} <span className="text-xs font-medium text-ink-3">{list.length}</span>
                </Link>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-ink-2">
                  {MATERIALS.map((m) =>
                    list.some((p) => p.material === m.key) ? (
                      <li key={m.key}>
                        <Link href={`/catalog/${c.slug}?metal=${m.key}`} className="hover:text-ink">
                          {m.name}
                        </Link>
                      </li>
                    ) : null,
                  )}
                  {PRICE_BANDS.slice(0, 2).map((b) =>
                    list.some((p) => p.price >= b.min && p.price <= b.max) ? (
                      <li key={b.id}>
                        <Link href={`/catalog/${c.slug}?price=${b.id}`} className="hover:text-ink">
                          {b.label}
                        </Link>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            </div>
          );
        })}
        <div className="flex gap-4">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ivory text-gold-deep">
            <CatIcon name="biju" size={28} />
          </span>
          <div>
            <Link href="/catalog/biju" className="text-[16px] font-bold hover:text-gold-deep">
              Біжутерія <span className="text-xs font-medium text-ink-3">{all.filter((p) => p.material === 'bijouterie').length}</span>
            </Link>
            <p className="mt-2 text-[13.5px] text-ink-2">Перли, кристали та позолочені сплави — яскраві акценти за доступною ціною.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSeo() {
  return (
    <section className="bg-ivory py-12 md:py-16" aria-labelledby="about-title">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="eyebrow">Про магазин</span>
          <h2 id="about-title" className="section-title mt-2">
            {ABOUT_SEO.title}
          </h2>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ['585', 'проба золота'],
              ['925', 'проба срібла'],
              ['1–3', 'дні доставки'],
            ].map(([b, s]) => (
              <div key={s} className="rounded-2xl bg-white px-4 py-5 text-center">
                <b className="display block text-[34px] text-gold-deep">{b}</b>
                <span className="text-[12px] text-ink-3">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="prose-vk">
          <p className="!text-ink">{ABOUT_SEO.lead}</p>
          <details className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Читати більше</span>
              <span className="hidden group-open:inline">Згорнути</span>
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4">
              {ABOUT_SEO.more.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

export function FaqBlock({ title = 'Питання та відповіді' }: { title?: string }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <section className="wrap py-12 md:py-16" aria-labelledby="faq-title">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <span className="eyebrow">Допомога</span>
          <h2 id="faq-title" className="section-title mt-2">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-[14.5px] text-ink-2">Не знайшли відповідь? Телефонуйте — ми на зв’язку щодня.</p>
          <Link href="/kontakty" className="btn btn-line mt-5">
            Контакти <ArrowRight size={16} />
          </Link>
        </div>
        <div className="acc">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>
                {f.q}
                <ChevronDown size={18} className="chev" />
              </summary>
              <div className="acc-body">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
    </section>
  );
}

export function BlogTeaser() {
  return (
    <section className="wrap py-12 md:py-16" aria-labelledby="blog-title">
      <div className="section-head">
        <div>
          <span className="eyebrow">Блог</span>
          <h2 id="blog-title" className="section-title mt-2">
            Корисно знати
          </h2>
        </div>
        <Link href="/blog" className="link-more">
          Усі статті <ArrowRight size={15} />
        </Link>
      </div>
      <ul className="grid gap-5 md:grid-cols-3">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link href={`/blog/${a.slug}`} className="group block h-full rounded-2xl border border-line bg-white p-6 transition hover:border-line-2 hover:shadow-[var(--shadow-soft)]">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-soft text-gold-deep">
                <CatIcon name={a.icon} size={28} />
              </span>
              <p className="mt-5 text-xs text-ink-3">
                {new Date(a.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })} · {a.minutes} хв
              </p>
              <h3 className="mt-2 font-display text-[24px] font-semibold leading-tight group-hover:text-gold-deep">{a.title}</h3>
              <p className="mt-2 text-[14px] text-ink-2">{a.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const HERO_IMG = (name: string) => `/hero/${name}.webp`;

export default function Storefront({ products }: { products: ExtendedProduct[] }) {
  // з фото — першими (виглядає краще), далі за порядком з адмінки
  const imgFirst = (a: ExtendedProduct, b: ExtendedProduct) =>
    (a.status === 'sold' ? 1 : 0) - (b.status === 'sold' ? 1 : 0) || (a.image ? 0 : 1) - (b.image ? 0 : 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  const hits = withBadge(products, 'hit').sort(imgFirst);
  const news = withBadge(products, 'new').sort(imgFirst);
  const sale = withBadge(products, 'sale').sort(imgFirst);
  const available = products.filter((p) => p.status !== 'sold');
  const rings = products.filter((p) => p.category === 'ring').sort(imgFirst);
  const gifts = available.filter((p) => p.price <= 2000).sort(imgFirst);

  const slides: HeroSlide[] = [
    {
      eyebrow: news.length ? 'Новинки сезону' : 'Нова колекція',
      title: 'Сяйво, що залишається',
      accent: 'з вами',
      text: 'Каблучки, сережки та підвіски, які хочеться носити щодня. Дбайливо обираємо й пакуємо кожну прикрасу.',
      href: news.length ? '/catalog/novynky' : '/catalog',
      cta: news.length ? 'Дивитися новинки' : 'До каталогу',
      tone: 'ivory',
      image: HERO_IMG('slide-1'),
    },
    {
      eyebrow: 'Срібло 925',
      title: 'Легкість срібла',
      accent: 'на кожен день',
      text: 'Мінімалістичні прикраси зі срібла з родієвим покриттям — не темніють і пасують до всього.',
      href: '/catalog/sriblo',
      cta: 'Обрати срібло',
      tone: 'sage',
      image: HERO_IMG('slide-2'),
    },
    {
      eyebrow: 'Золото 585',
      title: 'Класика,',
      accent: 'що не виходить з моди',
      text: 'Жовте й рожеве золото, фіаніти та перли — для особливих подій і щоденних образів.',
      href: '/catalog/zoloto',
      cta: 'Обрати золото',
      tone: 'night',
      image: HERO_IMG('slide-3'),
    },
    {
      eyebrow: 'Ідеї подарунків',
      title: 'Подарунок,',
      accent: 'який запам’ятають',
      text: 'Готові комплекти у фірмовому пакованні. Безкоштовна доставка від 1 500 ₴.',
      href: '/catalog/komplekty',
      cta: 'Комплекти',
      tone: 'blush',
      image: HERO_IMG('slide-4'),
    },
  ];

  const byOrder = [...available].sort((a, b) => (a.image ? 0 : 1) - (b.image ? 0 : 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <>
      <h1 className="sr-only">VIALKO — ювелірний інтернет-магазин: прикраси із золота, срібла та біжутерія</h1>
      <HeroSlider slides={slides} />
      <Benefits />
      <QuickCategories all={products} />
      <ProductTabs
        title="Хіти та новинки"
        tabs={[
          { key: 'hit', label: 'Хіти продажу', href: '/catalog/khity', items: hits.slice(0, 12), total: hits.length },
          { key: 'new', label: 'Новинки', href: '/catalog/novynky', items: news.slice(0, 12), total: news.length },
          { key: 'sale', label: 'Акції', href: '/catalog/aktsii', items: sale.slice(0, 12), total: sale.length },
          ...(hits.length + news.length + sale.length === 0 ? [{ key: 'all', label: 'Популярне', href: '/catalog', items: byOrder.slice(0, 15) }] : []),
        ]}
      />
      <PromoDuo all={products} />
      {rings.length > 3 && (
        <section className="wrap py-10 md:py-14" aria-labelledby="rings-title">
          <div className="section-head">
            <div>
              <span className="eyebrow">Каблучки</span>
              <h2 id="rings-title" className="section-title mt-2">
                Каблучки на будь-який привід
              </h2>
            </div>
            <Link href="/catalog/kabluchky" className="link-more">
              Усі каблучки <ArrowRight size={15} />
            </Link>
          </div>
          <Carousel label="Каблучки" slideClass="[--slide:50%] md:[--slide:33.333%] lg:[--slide:25%] xl:[--slide:20%]">
            {rings.slice(0, 12).map((p) => (
              <ProductCard key={p.id} p={p} sizes="(max-width: 767px) 50vw, (max-width: 1279px) 25vw, 260px" />
            ))}
          </Carousel>
        </section>
      )}
      {gifts.length > 3 && (
        <section className="wrap py-10 md:py-14" aria-labelledby="gifts-title">
          <div className="section-head">
            <div>
              <span className="eyebrow">Подарунки</span>
              <h2 id="gifts-title" className="section-title mt-2">
                Подарунки до {money(2000)}
              </h2>
            </div>
            <Link href="/catalog?price=1000-3000" className="link-more">
              Більше ідей <ArrowRight size={15} />
            </Link>
          </div>
          <Carousel label="Подарунки" slideClass="[--slide:50%] md:[--slide:33.333%] lg:[--slide:25%] xl:[--slide:20%]">
            {gifts.slice(0, 12).map((p) => (
              <ProductCard key={p.id} p={p} sizes="(max-width: 767px) 50vw, (max-width: 1279px) 25vw, 260px" />
            ))}
          </Carousel>
        </section>
      )}
      <CatalogDirectory all={products} />
      <AboutSeo />
      <BlogTeaser />
      <FaqBlock />
      <Partners />
    </>
  );
}
