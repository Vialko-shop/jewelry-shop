import type { Metadata } from 'next';
import CatalogPage from '@/components/CatalogPage';
import { getCatalog } from '@/lib/catalog';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Каталог прикрас — золото, срібло, біжутерія',
  description: 'Каталог VIALKO: каблучки, сережки, браслети, підвіски та комплекти із золота й срібла, біжутерія. Фільтри за металом і ціною, доставка Новою поштою.',
  alternates: { canonical: '/catalog' },
};

export default async function Page() {
  const items = await getCatalog();
  return (
    <CatalogPage
      title="Каталог прикрас"
      intro="Усі прикраси VIALKO в одному місці: оберіть категорію, метал і ціну — ми підкажемо з розміром і дбайливо запакуємо замовлення."
      items={items}
      seo="У каталозі VIALKO — прикраси із золота 585 проби, срібла 925 проби та вишукана біжутерія. Оформлюйте замовлення онлайн: оплата через LiqPay, доставка Новою поштою по всій Україні, безкоштовно від 1 500 ₴."
    />
  );
}
