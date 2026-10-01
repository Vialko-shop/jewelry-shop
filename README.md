# VIALKO — ювелірний інтернет-магазин

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase · Zustand · LiqPay · Нова пошта.
Прод: https://www.vialko.com.ua (автодеплой Vercel з гілки `main`).

## Запуск локально

```bash
npm install
npm run dev
```

Без змінних Supabase сайт показує локальний каталог (`src/data/products.ts` + приклади з `src/data/demoProducts.ts`).

## Змінні середовища (Vercel → Settings → Environment Variables)

Дивіться `.env.example`. Значення ключів **не** зберігаються в репозиторії.

| Змінна | Для чого |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | каталог товарів і адмінка |
| `NOVA_POSHTA_API_KEY` | пошук міст і відділень |
| `LIQPAY_PUBLIC_KEY`, `LIQPAY_PRIVATE_KEY` | оплата |
| `NEXT_PUBLIC_SITE_URL` | канонічні посилання, повернення з LiqPay |

## Адмінка — `/vialko-admin`

Вхід через Supabase Auth. Можна: змінювати ціну, назву, опис, категорію, метал, наявність, мітки (Хіт / Новинка / Акція), вагу, розміри, порядок; завантажувати до 3 фото (великі фото автоматично зменшуються); додавати й видаляти товари.
Після збереження вітрина оновлюється одразу (`/api/revalidate`), інакше — максимум за 60 с.

**Товари-приклади**: кнопка «Додати приклади» створює 38 товарів з id `demo-…` і оригінальними 3D-рендерами з `public/demo`. Видалити їх — кнопка «Видалити всі приклади».

## Налаштування

- `src/lib/site.ts` — телефон, email, поріг безкоштовної доставки, соцмережі, партнери, **оплата частинами** (`installments.enabled`).
- `src/lib/taxonomy.ts` — категорії, метали, мітки, слаги URL.
- `src/data/content.ts` — FAQ, статті блогу, SEO-текст головної.

## Знижки (стара ціна)

Щоб з'явилася закреслена ціна, стикер «−%» і поле «Стара ціна» в адмінці, виконайте в Supabase → SQL Editor:

```sql
alter table public.products add column if not exists old_price integer;
```

## Структура

- `src/app` — сторінки: головна, `/catalog`, `/catalog/[slug]`, `/product/[id]`, `/search`, `/wishlist`, `/compare`, `/checkout`, інфо-сторінки, `/blog`, `/vialko-admin`, `sitemap.xml`, `robots.txt`.
- `src/components` — шапка з мега-меню і живим пошуком, картка товару, фільтри, галерея, кошик, футер, мобільна нижня панель.
- `src/lib` — дані (`catalog.ts` з кешем/ISR, `products.ts` — Supabase), форматування, пошук.
- `src/store` — кошик (`cartStore.ts`, без змін), обране/порівняння.
