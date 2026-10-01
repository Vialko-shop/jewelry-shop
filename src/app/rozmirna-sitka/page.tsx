import type { Metadata } from 'next';
import InfoPage from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'Розмірна сітка каблучок і браслетів',
  description: 'Як визначити розмір каблучки та довжину браслета: таблиця розмірів VIALKO.',
  alternates: { canonical: '/rozmirna-sitka' },
};

const RINGS = [15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 21];
const BRACELETS = [
  ['до 14 см', '16 см'],
  ['14–15 см', '17 см'],
  ['15–16 см', '18 см'],
  ['16–17 см', '19 см'],
  ['17–18 см', '20 см'],
];

export default function Page() {
  return (
    <InfoPage path="/rozmirna-sitka" title="Розмірна сітка" lead="Розмір каблучки в Україні дорівнює її внутрішньому діаметру в міліметрах. Нижче — таблиці, які допоможуть обрати правильно.">
      <h2>Каблучки</h2>
      <p>Виміряйте внутрішній діаметр каблучки, яка вам підходить, або обхват пальця (ниткою чи смужкою паперу) і знайдіть найближче значення.</p>
      <table>
        <thead>
          <tr>
            <th>Розмір</th>
            <th>Діаметр, мм</th>
            <th>Обхват пальця, мм</th>
          </tr>
        </thead>
        <tbody>
          {RINGS.map((r) => (
            <tr key={r}>
              <td>
                <strong>{String(r).replace('.', ',')}</strong>
              </td>
              <td>{r.toFixed(1).replace('.', ',')}</td>
              <td>{(r * Math.PI).toFixed(1).replace('.', ',')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Поради</h3>
      <ul>
        <li>Вимірюйте ввечері, у теплому приміщенні — вранці та на холоді пальці тонші.</li>
        <li>Для широких каблучок (від 5 мм) обирайте на пів розміру більше.</li>
        <li>Якщо розмір між двома значеннями — беріть більший.</li>
      </ul>
      <h2>Браслети</h2>
      <p>Виміряйте обхват зап’ястя сантиметровою стрічкою та додайте 1–2 см для вільної посадки.</p>
      <table>
        <thead>
          <tr>
            <th>Обхват зап’ястя</th>
            <th>Рекомендована довжина</th>
          </tr>
        </thead>
        <tbody>
          {BRACELETS.map(([a, b]) => (
            <tr key={a}>
              <td>{a}</td>
              <td>
                <strong>{b}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </InfoPage>
  );
}
