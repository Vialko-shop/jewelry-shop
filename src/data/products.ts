import { Product } from '@/store/cartStore';

export type ProductStatus = 'in_stock' | 'on_order' | 'sold';

export interface ExtendedProduct extends Product {
  status: ProductStatus;
  image2?: string;
  image3?: string;
  badges?: string[];
}

// ─── РЕАЛЬНІ ТОВАРИ МАМИ (фото Gemini AI) ────────────────────────────────────
// Всі ціни 1000 грн — змінювати через /vialko-admin
// Фото генеруються через Gemini з оригіналів Google Drive

export const products: ExtendedProduct[] = [

  // ── Товар 1: Кільце з бурштином ──────────────────────────────
  {
    id: 'ring-amber-001',
    name: 'Amber Ring',
    nameUa: 'Кільце з бурштином',
    price: 1000,
    material: 'silver',
    category: 'ring',
    image: 'https://drive.google.com/thumbnail?id=111mdirvAAr75VdueURjBA411wwaUg_Km&sz=w800',
    image2: 'https://drive.google.com/thumbnail?id=1lG8b3pYO6XM3pZsf5xE6flkghn5EwayJ&sz=w800',
    description: 'Срібне кільце з натуральним бурштином. Ручна робота, срібло 925 проби.',
    inStock: true,
    weight: '4.2г',
    size: '16-19',
    status: 'in_stock',
    badges: ['Нова'],
  },

  // ── Товар 2: Сережки квіточки (срібні) ───────────────────────
  {
    id: 'earrings-flower-001',
    name: 'Flower Earrings',
    nameUa: 'Сережки-квіточки срібні',
    price: 1000,
    material: 'silver',
    category: 'earrings',
    image: 'https://drive.google.com/thumbnail?id=1lG8b3pYO6XM3pZsf5xE6flkghn5EwayJ&sz=w800',
    image2: 'https://drive.google.com/thumbnail?id=11tykbqz_fcJsEeoCojkJpe-3OHxbTi4U&sz=w800',
    description: 'Витончені срібні сережки у формі квіточки. Срібло 925, покриття родієм.',
    inStock: true,
    status: 'in_stock',
    badges: ['Нова'],
  },

  // ── Товар 3: Сережки-хрестики (золоті) ───────────────────────
  {
    id: 'earrings-cross-001',
    name: 'Cross Earrings',
    nameUa: 'Сережки-хрестики золоті',
    price: 1000,
    material: 'gold',
    category: 'earrings',
    image: 'https://drive.google.com/thumbnail?id=1mZ9QVGMISgs5GbOUa2GqLodhTS7YbwQ6&sz=w800',
    image2: 'https://drive.google.com/thumbnail?id=18ND9-c0JFnRKIRMAEdbDUwSJKP3jL3Ok&sz=w800',
    description: 'Елегантні золоті сережки-хрестики. Золото 585 проби з фіанітами.',
    inStock: true,
    status: 'in_stock',
    badges: ['Нова'],
  },

  // ── Товар 4: Кільця срібні з чорними каменями ────────────────
  {
    id: 'ring-black-001',
    name: 'Black Stone Ring',
    nameUa: 'Кільця срібні з чорними каменями',
    price: 1000,
    material: 'silver',
    category: 'ring',
    image: 'https://drive.google.com/thumbnail?id=1kNxTHD35691WGU311LQ8j6WDD0fiBHO4&sz=w800',
    image2: 'https://drive.google.com/thumbnail?id=1zExuCULTAgkb1o72_XutaCAsfwa5knm-&sz=w800',
    description: 'Срібні кільця з чорними онікс-каменями. Комплект 2 шт, срібло 925.',
    inStock: true,
    status: 'in_stock',
    badges: ['Нова'],
  },

  // ── Товар 5: Браслет-ланцюжок срібний ────────────────────────
  {
    id: 'bracelet-chain-001',
    name: 'Silver Chain Bracelet',
    nameUa: 'Браслет-ланцюжок срібний',
    price: 1000,
    material: 'silver',
    category: 'bracelet',
    image: 'https://drive.google.com/thumbnail?id=1UB_8y2bq-pSs8_08YHaqy1iCCc-ydIek&sz=w800',
    image2: 'https://drive.google.com/thumbnail?id=1kNxTHD35691WGU311LQ8j6WDD0fiBHO4&sz=w800',
    description: 'Тонкий срібний браслет-ланцюжок. Срібло 925, довжина 18 см + 3 см подовжувач.',
    inStock: true,
    status: 'in_stock',
    badges: ['Нова'],
  },

  // ── Товар 6-12: Placeholder (будуть замінені після Gemini генерації) ──────
  {
    id: 'jewelry-006',
    name: 'Jewelry 6',
    nameUa: 'Прикраса 6',
    price: 1000,
    material: 'silver',
    category: 'ring',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    description: 'Авторська прикраса ручної роботи від майстра VIALKO.',
    inStock: true,
    status: 'in_stock',
  },
  {
    id: 'jewelry-007',
    name: 'Jewelry 7',
    nameUa: 'Прикраса 7',
    price: 1000,
    material: 'gold',
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    description: 'Авторська прикраса ручної роботи від майстра VIALKO.',
    inStock: true,
    status: 'in_stock',
  },
  {
    id: 'jewelry-008',
    name: 'Jewelry 8',
    nameUa: 'Прикраса 8',
    price: 1000,
    material: 'bijouterie',
    category: 'bracelet',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    description: 'Авторська прикраса ручної роботи від майстра VIALKO.',
    inStock: true,
    status: 'in_stock',
  },
  {
    id: 'jewelry-009',
    name: 'Jewelry 9',
    nameUa: 'Прикраса 9',
    price: 1000,
    material: 'silver',
    category: 'necklace',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    description: 'Авторська прикраса ручної роботи від майстра VIALKO.',
    inStock: true,
    status: 'in_stock',
  },
  {
    id: 'jewelry-010',
    name: 'Jewelry 10',
    nameUa: 'Прикраса 10',
    price: 1000,
    material: 'gold',
    category: 'ring',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    description: 'Авторська прикраса ручної роботи від майстра VIALKO.',
    inStock: true,
    status: 'in_stock',
  },
  {
    id: 'jewelry-011',
    name: 'Jewelry 11',
    nameUa: 'Прикраса 11',
    price: 1000,
    material: 'bijouterie',
    category: 'set',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94815b2?w=600&q=80',
    description: 'Авторська прикраса ручної роботи від майстра VIALKO.',
    inStock: true,
    status: 'in_stock',
  },
  {
    id: 'jewelry-012',
    name: 'Jewelry 12',
    nameUa: 'Прикраса 12',
    price: 1000,
    material: 'silver',
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80',
    description: 'Авторська прикраса ручної роботи від майстра VIALKO.',
    inStock: true,
    status: 'in_stock',
  },
];

export const categories = [
  { id: 'all', name: 'Всі прикраси' },
  { id: 'ring', name: 'Каблучки' },
  { id: 'earrings', name: 'Сережки' },
  { id: 'bracelet', name: 'Браслети' },
  { id: 'necklace', name: 'Підвіски' },
  { id: 'set', name: 'Комплекти' },
];

export const materials = [
  { id: 'all', name: 'Всі' },
  { id: 'gold', name: 'Золото' },
  { id: 'silver', name: 'Срібло' },
  { id: 'bijouterie', name: 'Біжутерія' },
];

export const statusLabels: Record<ProductStatus, { label: string; color: string }> = {
  in_stock: { label: 'В наявності', color: '#22c55e' },
  on_order: { label: 'Під замовлення', color: '#f59e0b' },
  sold: { label: 'Продано', color: '#ef4444' },
};
