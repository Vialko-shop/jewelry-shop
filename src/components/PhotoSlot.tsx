import Image from 'next/image';
import { CatIcon } from './Icons';
import type { IconName } from '@/lib/taxonomy';

// Хост нашого Supabase (той самий, що дозволений у next.config.ts → images.remotePatterns)
const SUPABASE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname;
  } catch {
    return '';
  }
})();

/** Can next/image optimize this source? (local files + our Supabase storage) */
export function isOptimizable(src: string) {
  if (src.startsWith('/')) return !src.startsWith('//');
  try {
    const u = new URL(src);
    return Boolean(SUPABASE_HOST) && u.protocol === 'https:' && u.hostname === SUPABASE_HOST && u.pathname.startsWith('/storage/v1/object/public/');
  } catch {
    return false;
  }
}

/**
 * Фото товару з гарним плейсхолдером «Фото скоро», якщо фото ще немає.
 * Батьківський елемент має бути `position: relative` з фіксованим aspect-ratio (CLS ≈ 0).
 */
export default function PhotoSlot({
  src,
  alt = '',
  sizes = '(max-width: 768px) 50vw, 25vw',
  className = '',
  icon = 'ring',
  label = 'Фото скоро',
  eager = false,
  fit = 'contain',
}: {
  src?: string | null;
  alt?: string;
  sizes?: string;
  className?: string;
  icon?: IconName;
  label?: string;
  /** above the fold (LCP) → eager + high priority */
  eager?: boolean;
  fit?: 'contain' | 'cover';
}) {
  if (!src) {
    return (
      <span className={`ph ${className}`} role="img" aria-label={alt ? `${alt} — фото незабаром` : 'Фото незабаром'}>
        <span className="ph-inner">
          <CatIcon name={icon} size={64} strokeWidth={1.2} />
          {label ? <span className="ph-label">{label}</span> : null}
        </span>
      </span>
    );
  }
  const fitCls = fit === 'contain' ? 'object-contain' : 'object-cover';
  if (isOptimizable(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`${fitCls} ${className}`}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} className={`absolute inset-0 h-full w-full ${fitCls} ${className}`} />
  );
}
