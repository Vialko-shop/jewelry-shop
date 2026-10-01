import type { LiteProduct } from './catalog';
import { categoryByKey, materialByKey, STATUS } from './taxonomy';
import { sku } from './format';

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ʼ’'`]/g, '')
    .replace(/ё/g, 'е')
    .replace(/[ыі]/g, 'и')
    .replace(/[ї]/g, 'и')
    .replace(/є/g, 'е')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Ukrainian/Russian stems: «каблучки» → «каблучк», «сережок» → «сереж»
const stem = (w: string) => (w.length > 5 ? w.slice(0, Math.max(4, w.length - 2)) : w);

export function searchProducts<T extends LiteProduct>(items: T[], query: string, limit = 60): T[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const tokens = q.split(' ').filter(Boolean).map(stem);
  const scored: { p: T; s: number }[] = [];
  for (const p of items) {
    const name = norm(p.nameUa);
    const hay = norm(
      [
        p.nameUa,
        categoryByKey(p.category)?.name,
        materialByKey(p.material)?.name,
        p.description ?? '',
        sku(p.id),
        p.id,
      ].join(' '),
    );
    let s = 0;
    let all = true;
    for (const t of tokens) {
      if (name.startsWith(t)) s += 6;
      else if (name.includes(` ${t}`)) s += 4;
      else if (name.includes(t)) s += 3;
      else if (hay.includes(t)) s += 1;
      else all = false;
    }
    if (all && s > 0) {
      if (p.status === 'sold') s -= 0.5;
      scored.push({ p, s });
    }
  }
  return scored
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

export const statusLabel = (s: LiteProduct['status']) => STATUS[s]?.label ?? '';
