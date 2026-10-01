import Link from 'next/link';
import { SITE } from '@/lib/site';
import { ldJson } from '@/lib/jsonld';

export interface Crumb {
  href?: string;
  label: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ href: '/', label: 'Головна' }, ...items];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE.url}${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Навігаційний ланцюжок" className="crumbs py-4">
      {all.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="sep" aria-hidden>/</span>}
          {c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page" className="text-ink-2">{c.label}</span>}
        </span>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
    </nav>
  );
}
