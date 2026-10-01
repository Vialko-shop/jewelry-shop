'use client';

import './globals.css';
import { SITE } from '@/lib/site';

// Показується, лише якщо впав сам каркас сайту (root layout)
export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="uk">
      <body>
        <title>VIALKO — технічна пауза</title>
        <main className="grid min-h-dvh place-items-center bg-ivory px-4 text-center">
          <div>
            <p className="text-sm font-semibold tracking-[.32em]">VIALKO</p>
            <h1 className="mt-5 text-3xl font-semibold">Сайт тимчасово недоступний</h1>
            <p className="mx-auto mt-3 max-w-sm text-[15px] text-ink-2">
              Оновіть сторінку за хвилину або зателефонуйте нам:{' '}
              <a href={SITE.phoneHref} className="font-bold underline">
                {SITE.phoneDisplay}
              </a>
            </p>
            <button type="button" className="btn btn-ink mt-6" onClick={() => unstable_retry()}>
              Спробувати ще раз
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
