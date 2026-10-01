import Link from 'next/link';
import { ShoppingBag, Ruler } from 'lucide-react';
import type { ExtendedProduct } from '@/data/products';
import type { Product } from '@/store/cartStore';
import { badgeKeys, categoryByKey, STATUS } from '@/lib/taxonomy';
import { money, metalLabel, discountPct, sizeOptions } from '@/lib/format';
import PhotoSlot from './PhotoSlot';
import { CardTools, AddToCart } from './ProductActions';

// Серверна картка (мінімум JS): інтерактивні лише кнопки ♡ ⇄ і «У кошик»

export function toCartProduct(p: ExtendedProduct): Product {
  return {
    id: p.id,
    name: p.name,
    nameUa: p.nameUa,
    price: p.price,
    material: p.material,
    category: p.category,
    image: p.image,
    description: p.description,
    inStock: p.status !== 'sold',
    weight: p.weight,
    size: p.size,
  };
}

export function Stickers({ p, className = '' }: { p: Pick<ExtendedProduct, 'badges' | 'price' | 'oldPrice'>; className?: string }) {
  const keys = badgeKeys(p.badges);
  const pct = discountPct(p);
  if (!keys.length && !pct) return null;
  return (
    <div className={className}>
      {pct ? <span className="sticker sticker-sale">−{pct}%</span> : keys.includes('sale') ? <span className="sticker sticker-sale">Акція</span> : null}
      {keys.includes('hit') && <span className="sticker sticker-hit">Хіт</span>}
      {keys.includes('new') && <span className="sticker sticker-new">Новинка</span>}
    </div>
  );
}

export default function ProductCard({
  p,
  eager = false,
  sizes = '(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw',
}: {
  p: ExtendedProduct;
  eager?: boolean;
  sizes?: string;
}) {
  const cat = categoryByKey(p.category);
  const st = STATUS[p.status] ?? STATUS.in_stock;
  const sold = p.status === 'sold';
  const pct = discountPct(p);
  const href = `/product/${encodeURIComponent(p.id)}`;
  const cartItem = toCartProduct(p);
  // Каблучки з кількома розмірами: спершу обрати розмір на сторінці товару
  const pickSize = !sold && p.category === 'ring' && sizeOptions(p.size).length > 1;
  const sizeHref = `${href}#size-picker`;

  return (
    <article className="pcard group">
      <div className="pcard-media">
        <PhotoSlot
          src={p.image || null}
          alt={p.nameUa}
          sizes={sizes}
          icon={cat?.icon ?? 'ring'}
          eager={eager}
          className={`img-a${p.image2 ? ' has-b' : ''}`}
        />
        {p.image && p.image2 ? <PhotoSlot src={p.image2} alt="" sizes={sizes} className="img-b" /> : null}
        <Stickers p={p} className="pcard-stickers" />
        <CardTools id={p.id} />
        {pickSize ? (
          <div className="pcard-cta">
            <Link href={sizeHref} className="btn btn-ink btn-sm btn-block">
              <Ruler size={15} /> Обрати розмір
            </Link>
          </div>
        ) : (
          <AddToCart product={cartItem} sold={sold} variant="bar" />
        )}
      </div>
      <div className="pcard-body">
        <div className="pcard-meta">
          <span className={`dot dot-${st.tone}`} aria-hidden />
          <span>{st.label}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{metalLabel(p)}</span>
        </div>
        <h3 className="pcard-title">
          <Link href={href}>{p.nameUa}</Link>
        </h3>
        <div className="pcard-price">
          <span className={`price-now${pct ? ' sale' : ''}`}>{money(p.price)}</span>
          {pct ? <span className="price-old">{money(p.oldPrice!)}</span> : null}
          {pickSize ? (
            <Link
              href={sizeHref}
              className="pcard-quick relative z-[2] ml-auto h-9 w-9 items-center justify-center rounded-full bg-ink text-white"
              aria-label={`Обрати розмір: ${p.nameUa}`}
            >
              <ShoppingBag size={16} />
            </Link>
          ) : (
            <AddToCart product={cartItem} sold={sold} variant="round" />
          )}
        </div>
      </div>
    </article>
  );
}
