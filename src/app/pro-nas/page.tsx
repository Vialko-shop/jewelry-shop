import type { Metadata } from 'next';
import Link from 'next/link';
import InfoPage from '@/components/InfoPage';
import Partners from '@/components/Partners';

export const metadata: Metadata = {
  title: 'Про нас',
  description: 'VIALKO (Віалко) — ювелірний інтернет-магазин прикрас із золота, срібла та біжутерії.',
  alternates: { canonical: '/pro-nas' },
};

export default function Page() {
  return (
    <>
      <InfoPage path="/pro-nas" title="Про VIALKO" lead="VIALKO — це прикраси, які хочеться носити щодня і дарувати близьким.">
        <p>
          Ми збираємо колекцію каблучок, сережок, браслетів, підвісок і комплектів із золота та срібла, а також вишукану біжутерію. Кожен виріб ми особисто перевіряємо, фотографуємо й
          описуємо — щоб ви точно знали, що отримаєте.
        </p>
        <h2>Чому обирають нас</h2>
        <ul>
          <li>Уважність до деталей: перевіряємо кожну прикрасу перед відправкою.</li>
          <li>Фірмова упаковка — замовлення готове до подарунка.</li>
          <li>Зручна доставка Новою поштою по всій Україні, безкоштовно від 1 500 ₴.</li>
          <li>Жива консультація: допоможемо з розміром і вибором подарунка.</li>
        </ul>
        <p>
          Перегляньте <Link href="/catalog">каталог</Link> або зателефонуйте нам — з радістю допоможемо.
        </p>
      </InfoPage>
      <Partners />
    </>
  );
}
