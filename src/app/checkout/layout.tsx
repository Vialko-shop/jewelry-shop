import type { Metadata } from 'next';

// Лише метадані: сторінка оформлення — клієнтська, її логіку не змінюємо
export const metadata: Metadata = {
  title: 'Оформлення замовлення',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
