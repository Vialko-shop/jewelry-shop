import type { ExtendedProduct, ProductStatus } from '@/data/products';

export type CategoryKey = ExtendedProduct['category'];
export type MaterialKey = ExtendedProduct['material'];
export type IconName =
  | 'ring' | 'earrings' | 'bracelet' | 'necklace' | 'set' | 'biju'
  | 'gold' | 'silver' | 'new' | 'hit' | 'sale' | 'all';

export interface CategoryDef {
  key: CategoryKey;
  slug: string;
  name: string;
  one: string;
  icon: IconName;
  blurb: string;
}

// Слаг дизайну ↔ enum у Supabase (не змінювати ключі — на них завязана база)
export const CATEGORIES: CategoryDef[] = [
  { key: 'ring', slug: 'kabluchky', name: 'Каблучки', one: 'Каблучка', icon: 'ring', blurb: 'Класичні, з камінням, заручальні' },
  { key: 'earrings', slug: 'serezhky', name: 'Сережки', one: 'Сережки', icon: 'earrings', blurb: 'Пусети, кільця, підвіски' },
  { key: 'bracelet', slug: 'braslety', name: 'Браслети', one: 'Браслет', icon: 'bracelet', blurb: 'Ланцюжки, жорсткі, з камінням' },
  { key: 'necklace', slug: 'pidviski', name: 'Підвіски', one: 'Підвіска', icon: 'necklace', blurb: 'Кулони, кольє, хрестики' },
  { key: 'set', slug: 'komplekty', name: 'Комплекти', one: 'Комплект', icon: 'set', blurb: 'Сережки й каблучка в парі' },
];

export interface MaterialDef {
  key: MaterialKey;
  slug: string;
  name: string;
  icon: IconName;
  hint: string;
}

export const MATERIALS: MaterialDef[] = [
  { key: 'gold', slug: 'zoloto', name: 'Золото', icon: 'gold', hint: 'Прикраси із золота' },
  { key: 'silver', slug: 'sriblo', name: 'Срібло', icon: 'silver', hint: 'Прикраси зі срібла 925' },
  { key: 'bijouterie', slug: 'biju', name: 'Біжутерія', icon: 'biju', hint: 'Вишукана біжутерія' },
];

export type BadgeKey = 'new' | 'hit' | 'sale';

export const BADGES: { key: BadgeKey; label: string; slug: string; title: string }[] = [
  { key: 'hit', label: 'Хіт', slug: 'khity', title: 'Хіти продажу' },
  { key: 'new', label: 'Новинка', slug: 'novynky', title: 'Новинки' },
  { key: 'sale', label: 'Акція', slug: 'aktsii', title: 'Акції' },
];

/** Нормалізація довільних міток з бази ('Нова', 'Хіт', 'Sale'…) */
export function badgeKeys(badges?: string[] | null): BadgeKey[] {
  if (!badges?.length) return [];
  const out = new Set<BadgeKey>();
  for (const raw of badges) {
    const b = raw.trim().toLowerCase();
    if (/^(нов|new)/.test(b)) out.add('new');
    else if (/^(хіт|хит|hit|bestseller|топ)/.test(b)) out.add('hit');
    else if (/^(акц|знижк|sale|розпрод|-\d)/.test(b)) out.add('sale');
  }
  return [...out];
}

export const STATUS: Record<ProductStatus, { label: string; tone: 'ok' | 'warn' | 'off' }> = {
  in_stock: { label: 'В наявності', tone: 'ok' },
  on_order: { label: 'Під замовлення', tone: 'warn' },
  sold: { label: 'Продано', tone: 'off' },
};

export type CollectionKind = 'category' | 'material' | 'badge';

export interface Collection {
  slug: string;
  kind: CollectionKind;
  title: string;
  h1: string;
  icon: IconName;
  match: (p: ExtendedProduct) => boolean;
  seo: string;
}

const matLabelLower: Record<MaterialKey, string> = { gold: 'золота', silver: 'срібла', bijouterie: 'біжутерії' };

export const COLLECTIONS: Collection[] = [
  ...CATEGORIES.map<Collection>((c) => ({
    slug: c.slug,
    kind: 'category',
    title: c.name,
    h1: c.name,
    icon: c.icon,
    match: (p) => p.category === c.key,
    seo: `${c.name} VIALKO — ${c.blurb.toLowerCase()}. Прикраси із золота, срібла та біжутерія з доставкою Новою поштою по всій Україні.`,
  })),
  ...MATERIALS.map<Collection>((m) => ({
    slug: m.slug,
    kind: 'material',
    title: m.name,
    h1: m.key === 'bijouterie' ? 'Біжутерія' : `Прикраси з ${matLabelLower[m.key]}`,
    icon: m.icon,
    match: (p) => p.material === m.key,
    seo: `${m.hint} від VIALKO: каблучки, сережки, браслети та підвіски. Доставка по Україні, безкоштовно від 1 500 ₴.`,
  })),
  ...BADGES.map<Collection>((b) => ({
    slug: b.slug,
    kind: 'badge',
    title: b.title,
    h1: b.title,
    icon: b.key,
    match: (p) => badgeKeys(p.badges).includes(b.key),
    seo: `${b.title} VIALKO — добірка прикрас, яку оновлюємо регулярно.`,
  })),
];

export const collectionBySlug = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
export const categoryByKey = (key: string) => CATEGORIES.find((c) => c.key === key);
export const materialByKey = (key: string) => MATERIALS.find((m) => m.key === key);

export const PRICE_BANDS = [
  { id: 'lt1000', label: 'До 1 000 ₴', min: 0, max: 999 },
  { id: '1000-3000', label: '1 000 – 3 000 ₴', min: 1000, max: 3000 },
  { id: '3000-10000', label: '3 000 – 10 000 ₴', min: 3000, max: 10000 },
  { id: 'gt10000', label: 'Від 10 000 ₴', min: 10000, max: Infinity },
];
