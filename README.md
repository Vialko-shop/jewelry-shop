# Каблучка & Co — Jewelry Store

## Запуск локально
```bash
npm install
npm run dev
```

## Environment Variables (.env.local)
```
NOVA_POSHTA_API_KEY=3944c02bdbb3c6d3b4e3ae1adff53b29
LIQPAY_PUBLIC_KEY=your_liqpay_public_key
LIQPAY_PRIVATE_KEY=your_liqpay_private_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com.ua
```

## Deploy на Vercel
1. `npm i -g vercel`
2. `vercel login`
3. `vercel --prod`
4. Додати Environment Variables в Vercel Dashboard

## LiqPay
Отримати ключі: https://www.liqpay.ua → Бізнес → Магазин
