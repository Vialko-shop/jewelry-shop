import type { Metadata } from 'next';
import InfoPage from '@/components/InfoPage';
import { SITE } from '@/lib/site';
import { money } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Доставка і оплата',
  description: `Доставка прикрас VIALKO Новою поштою по всій Україні, безкоштовно від ${money(SITE.freeShippingFrom)}. Оплата онлайн через LiqPay.`,
  alternates: { canonical: '/dostavka-i-oplata' },
};

export default function Page() {
  return (
    <InfoPage path="/dostavka-i-oplata" title="Доставка і оплата" lead="Надсилаємо прикраси по всій Україні Новою поштою та дбайливо пакуємо кожне замовлення.">
      <h2>Доставка</h2>
      <ul>
        <li>Перевізник — <strong>Нова пошта</strong>: у відділення або поштомат.</li>
        <li>
          Для замовлень від <strong>{money(SITE.freeShippingFrom)}</strong> доставка безкоштовна. Для менших сум — за тарифами Нової пошти.
        </li>
        <li>Прикраси в наявності відправляємо зазвичай протягом 1–2 робочих днів після підтвердження замовлення. Дорога по Україні — 1–3 дні.</li>
        <li>Після відправлення надсилаємо номер ТТН, за яким можна відстежити посилку на сайті або в застосунку Нової пошти.</li>
      </ul>
      <h2>Оплата</h2>
      <ul>
        <li>
          Онлайн карткою <strong>Visa</strong> або <strong>Mastercard</strong> через захищений сервіс LiqPay (ПриватБанк).
        </li>
        <li>Дані картки вводяться на сторінці LiqPay — ми їх не бачимо й не зберігаємо.</li>
        <li>Після оплати ви повернетеся на сайт, а ми зв’яжемося для підтвердження деталей.</li>
      </ul>
      <h2>Упаковка</h2>
      <p>Кожну прикрасу пакуємо у фірмове паковання — замовлення можна одразу дарувати.</p>
    </InfoPage>
  );
}
