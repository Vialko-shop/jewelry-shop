import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/taxonomy';
import { DiamondMark } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <DiamondMark size={56} className="mx-auto text-gold" />
        <p className="display mt-6 text-[64px] text-gold-deep">404</p>
        <h1 className="font-display text-3xl font-semibold">Сторінку не знайдено</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-2">Можливо, прикрасу вже продано або посилання змінилося. Подивіться схожі прикраси в каталозі.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={`/catalog/${c.slug}`} className="chip">
              {c.name}
            </Link>
          ))}
        </div>
        <Link href="/" className="btn btn-ink mt-8">
          На головну <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
