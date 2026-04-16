'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order');
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
      <div className="text-center max-w-md py-20">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
          <CheckCircle size={40} color="white" />
        </div>
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
          ✦ Оплата успішна ✦
        </p>
        <h1 className="text-4xl mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>Дякуємо!</h1>
        {orderId && (
          <p className="text-sm mb-2" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
            Замовлення <strong style={{ color: 'var(--gold-dark)' }}>#{orderId}</strong>
          </p>
        )}
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--stone)', fontFamily: 'Jost', fontWeight: 300 }}>
          Ваше замовлення прийнято і буде відправлено Новою Поштою протягом 1-2 робочих днів.
          Ми зв'яжемося з вами для підтвердження.
        </p>
        <div className="p-4 mb-8 text-sm" style={{ background: 'white', border: '1px solid var(--gold-light)', fontFamily: 'Jost', color: 'var(--stone)' }}>
          🚚 Відстежити замовлення можна на сайті <strong>novaposhta.ua</strong><br/>
          по номеру ТТН, який ми надішлемо вам SMS.
        </div>
        <Link href="/" className="btn-gold px-10 py-4 inline-block">
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Завантаження...</div>}>
        <SuccessContent />
      </Suspense>
    </>
  );
}
