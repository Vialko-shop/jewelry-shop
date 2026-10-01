import type { Metadata } from 'next';
import { Phone, Mail, Truck, Clock } from 'lucide-react';
import InfoPage from '@/components/InfoPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Контакти',
  description: `Контакти VIALKO: телефон ${SITE.phoneDisplay}, email ${SITE.email}.`,
  alternates: { canonical: '/kontakty' },
};

export default function Page() {
  const cards = [
    { icon: Phone, title: 'Телефон', value: SITE.phoneDisplay, href: SITE.phoneHref },
    { icon: Mail, title: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Clock, title: 'Коли дзвонити', value: SITE.hours },
    { icon: Truck, title: 'Доставка', value: 'Нова пошта, вся Україна' },
  ];
  return (
    <InfoPage path="/kontakty" title="Контакти" lead="Зателефонуйте або напишіть нам — допоможемо з вибором, розміром та оформленням замовлення.">
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {cards.map(({ icon: I, title, value, href }) => {
          const inner = (
            <>
              <I size={22} className="text-gold-deep" />
              <span className="mt-3 block text-xs font-bold uppercase tracking-[.16em] text-ink-3">{title}</span>
              <span className="mt-1 block text-lg font-extrabold text-ink">{value}</span>
            </>
          );
          return href ? (
            <a key={title} href={href} className="block rounded-2xl border border-line p-5 !no-underline transition hover:border-ink-3">
              {inner}
            </a>
          ) : (
            <div key={title} className="rounded-2xl border border-line p-5">
              {inner}
            </div>
          );
        })}
      </div>
    </InfoPage>
  );
}
