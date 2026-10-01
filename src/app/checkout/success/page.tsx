'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Truck } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order');
  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-16 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-soft text-gold-deep">
          <CheckCircle size={40} />
        </span>
        <p className="eyebrow mt-6 justify-center">Дякуємо за замовлення</p>
        <h1 className="display mt-2 text-5xl">Дякуємо!</h1>
        {orderId && (
          <p className="mt-3 text-sm text-ink-2">
            Замовлення <strong className="text-ink">#{orderId}</strong>
          </p>
        )}
        <p className="mt-4 leading-relaxed text-ink-2">
          Ми отримали ваше замовлення та зв&apos;яжемося з вами для підтвердження. Після оплати прикраси в наявності відправляємо Новою поштою протягом 1–2 робочих днів.
        </p>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line p-4 text-left text-sm text-ink-2">
          <Truck size={22} className="flex-none text-gold-deep" />
          <span>
            Відстежити посилку можна на сайті <strong className="text-ink">novaposhta.ua</strong> за номером ТТН, який ми надішлемо вам.
          </span>
        </div>
        <Link href="/catalog" className="btn btn-ink mt-8">
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="wrap py-20 text-center text-ink-3">Завантаження...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
