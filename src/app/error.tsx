'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';

export default function Error({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap py-16 text-center md:py-24">
      <p className="eyebrow">Технічна пауза</p>
      <h1 className="display mt-3 text-[36px] md:text-[50px]">Не вдалося завантажити сторінку</h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-2">
        Спробуйте ще раз за мить. Якщо не виходить — зателефонуйте, і ми оформимо замовлення по телефону.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-ink" onClick={() => unstable_retry()}>
          <RotateCcw size={16} /> Спробувати ще раз
        </button>
        <a href={SITE.phoneHref} className="btn btn-line">
          <Phone size={16} /> {SITE.phoneDisplay}
        </a>
        <Link href="/" className="btn btn-ghost">
          На головну
        </Link>
      </div>
    </div>
  );
}
