import type { ExtendedProduct } from '@/data/products';
import { materialByKey, categoryByKey } from './taxonomy';

const nf = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });

export const money = (n: number) => `${nf.format(Math.round(n))} ₴`;

/** Стабільний артикул з id товару: VK-12345 */
export function sku(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `VK-${String((h >>> 0) % 90000 + 10000)}`;
}

/** Проба з опису («…585 проби…», «срібло 925») — лише якщо вказана явно */
export function probeOf(p: Pick<ExtendedProduct, 'description' | 'material'>): string | null {
  const m = p.description?.match(/\b(375|500|585|750|875|916|925|958|999)\b/);
  return m ? m[1] : null;
}

export function metalLabel(p: Pick<ExtendedProduct, 'material' | 'description'>): string {
  const base = materialByKey(p.material)?.name ?? '';
  const probe = probeOf(p);
  return probe && p.material !== 'bijouterie' ? `${base} ${probe}` : base;
}

export const categoryLabel = (key: string) => categoryByKey(key)?.one ?? '';

export function discountPct(p: Pick<ExtendedProduct, 'price' | 'oldPrice'>): number | null {
  if (!p.oldPrice || p.oldPrice <= p.price) return null;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

/** «16-19» → ['16','16.5',…,'19'];  «16, 17, 18» → ['16','17','18'] */
export function sizeOptions(size?: string): string[] {
  if (!size) return [];
  const s = size.replace(',', '.').trim();
  const range = s.match(/^(\d{1,2}(?:\.\d)?)\s*[-–—]\s*(\d{1,2}(?:\.\d)?)$/);
  if (range) {
    const a = parseFloat(range[1]);
    const b = parseFloat(range[2]);
    if (b > a && b - a <= 12) {
      const out: string[] = [];
      for (let v = a; v <= b + 1e-9; v += 0.5) out.push(Number.isInteger(v) ? String(v) : v.toFixed(1));
      return out;
    }
  }
  const list = size.split(/[;,/]\s*|\s+/).map((x) => x.trim()).filter(Boolean);
  return list.length > 1 ? list : [];
}

export function plural(n: number, one: string, few: string, many: string) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}

export const itemsWord = (n: number) => `${n} ${plural(n, 'прикраса', 'прикраси', 'прикрас')}`;
