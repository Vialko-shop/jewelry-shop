import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ARTICLES } from '@/data/content';
import { SITE } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ldJson } from '@/lib/jsonld';

// Невідомі slug → notFound() у самій сторінці. dynamicParams=false не використовуємо:
// після revalidatePath (збереження в адмінці) такі сторінки віддавали 404.

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { type: 'article', title: a.title, description: a.excerpt, publishedTime: a.date },
  };
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();
  const others = ARTICLES.filter((x) => x.slug !== a.slug);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    author: { '@type': 'Organization', name: 'VIALKO' },
    publisher: { '@type': 'Organization', name: 'VIALKO', url: SITE.url },
    mainEntityOfPage: `${SITE.url}/blog/${a.slug}`,
  };
  return (
    <div className="wrap pb-10">
      <Breadcrumbs items={[{ href: '/blog', label: 'Блог' }, { label: a.title }]} />
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-ink-3">
          {new Date(a.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })} · {a.minutes} хв читання
        </p>
        <h1 className="display mt-3 text-[38px] md:text-[54px]">{a.title}</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-ink-2">{a.excerpt}</p>
        <div className="prose-vk mt-8">
          {a.sections.map((s, i) => (
            <section key={i}>
              {s.h ? <h2>{s.h}</h2> : null}
              {s.p?.map((t) => (
                <p key={t}>{t}</p>
              ))}
              {s.list ? (
                <ul>
                  {s.list.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
              {s.table ? (
                <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        {s.table.head.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((r) => (
                        <tr key={r.join('|')}>
                          {r.map((c, j) => (
                            <td key={j}>{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
          <Link href="/blog" className="btn btn-line btn-sm">
            <ArrowLeft size={15} /> Усі статті
          </Link>
          <Link href="/catalog" className="btn btn-ink btn-sm">
            До каталогу <ArrowRight size={15} />
          </Link>
        </div>
        {others.length > 0 && (
          <div className="mt-12">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-ink-3">Читайте також</p>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/blog/${o.slug}`} className="font-display text-[22px] font-semibold hover:text-gold-deep">
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
    </div>
  );
}
