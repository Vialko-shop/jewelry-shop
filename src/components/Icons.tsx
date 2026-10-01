import type { SVGProps } from 'react';
import type { IconName } from '@/lib/taxonomy';

/* Оригінальні лінійні іконки VIALKO (категорії, метали, мітки). */

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export function CatIcon({ name, size = 28, ...props }: P & { name: IconName }) {
  const s = base(size, props);
  switch (name) {
    case 'ring':
      return (
        <svg {...s}>
          <ellipse cx="24" cy="29" rx="12.5" ry="12" />
          <ellipse cx="24" cy="29" rx="9" ry="8.6" />
          <path d="M19 14.5 24 9l5 5.5-5 4.2z" />
          <path d="M19 14.5h10M24 9v9.7" opacity=".55" />
        </svg>
      );
    case 'earrings':
      return (
        <svg {...s}>
          <path d="M15 8c-2.6 0-3.6 3.4-1 5l1 .6" />
          <path d="M33 8c-2.6 0-3.6 3.4-1 5l1 .6" />
          <path d="M15 14v5M33 14v5" />
          <path d="M15 19c-3 3.4-4.6 6.9-4.6 9.9a4.6 4.6 0 0 0 9.2 0c0-3-1.6-6.5-4.6-9.9z" />
          <path d="M33 19c-3 3.4-4.6 6.9-4.6 9.9a4.6 4.6 0 0 0 9.2 0c0-3-1.6-6.5-4.6-9.9z" />
        </svg>
      );
    case 'bracelet':
      return (
        <svg {...s}>
          <ellipse cx="24" cy="25" rx="17" ry="10.5" />
          <ellipse cx="24" cy="25" rx="13" ry="7" strokeDasharray="2.2 3.2" />
          <circle cx="24" cy="35.5" r="2.4" />
        </svg>
      );
    case 'necklace':
      return (
        <svg {...s}>
          <path d="M9 8c1.2 10.5 7.3 17 15 17s13.8-6.5 15-17" strokeDasharray="2.4 2.8" />
          <path d="M24 25v3" />
          <path d="M24 28c-3.7 3.2-5.6 6-5.6 8.6a5.6 5.6 0 0 0 11.2 0c0-2.6-1.9-5.4-5.6-8.6z" />
        </svg>
      );
    case 'set':
      return (
        <svg {...s}>
          <ellipse cx="18" cy="31" rx="9.5" ry="9" />
          <ellipse cx="18" cy="31" rx="6.6" ry="6.2" />
          <path d="m14.5 19.5 3.5-4 3.5 4-3.5 3z" />
          <path d="M35 8c-2.2 0-3 2.8-.8 4.2l.8.5v4" />
          <path d="M35 16.7c-2.6 2.9-3.9 5.8-3.9 8.3a3.9 3.9 0 0 0 7.8 0c0-2.5-1.3-5.4-3.9-8.3z" />
        </svg>
      );
    case 'biju':
      return (
        <svg {...s}>
          <path d="M8 12c3 13 9 19.5 16 19.5S37 25 40 12" opacity=".35" />
          {[
            [9.2, 17], [11.6, 22.3], [14.8, 26.6], [18.8, 29.6], [24, 31], [29.2, 29.6], [33.2, 26.6], [36.4, 22.3], [38.8, 17],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.3" />
          ))}
          <circle cx="24" cy="37.5" r="3.4" />
        </svg>
      );
    case 'gold':
    case 'silver':
      return (
        <svg {...s}>
          <path d="M10 33h28l-5-13H15z" />
          <path d="M15 20l3.5-5h11L33 20" opacity=".55" />
          <text x="24" y="30" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="currentColor" stroke="none" fontFamily="inherit">
            {name === 'gold' ? 'Au' : 'Ag'}
          </text>
        </svg>
      );
    case 'new':
      return (
        <svg {...s}>
          <path d="M24 8c1.4 7.6 4.4 10.6 12 12-7.6 1.4-10.6 4.4-12 12-1.4-7.6-4.4-10.6-12-12 7.6-1.4 10.6-4.4 12-12z" />
          <path d="M37 31c.6 3 1.8 4.2 4.8 4.8-3 .6-4.2 1.8-4.8 4.8-.6-3-1.8-4.2-4.8-4.8 3-.6 4.2-1.8 4.8-4.8z" />
        </svg>
      );
    case 'hit':
      return (
        <svg {...s}>
          <path d="m24 8 4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L24 31.6l-9.3 4.9 1.8-10.3L9 18.9l10.4-1.5z" />
        </svg>
      );
    case 'sale':
      return (
        <svg {...s}>
          <path d="M8 24 24 8h14v14L22 38z" />
          <circle cx="32" cy="15" r="2.2" />
          <path d="m19 28 8-8" />
          <circle cx="19.5" cy="21.5" r="1.4" />
          <circle cx="26.5" cy="27.5" r="1.4" />
        </svg>
      );
    default:
      return (
        <svg {...s}>
          <path d="m15 9 5 5-5 5-5-5zM33 9l5 5-5 5-5-5zM15 29l5 5-5 5-5-5zM33 29l5 5-5 5-5-5z" />
        </svg>
      );
  }
}

/** Знак бренду — діамант */
export function DiamondMark({ size = 18, ...props }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" aria-hidden {...props}>
      <path d="M3 9.5 7 4h10l4 5.5L12 20z" />
      <path d="M3 9.5h18M9 4l3 5.5L15 4M12 9.5 12 20" opacity=".6" />
    </svg>
  );
}

/** Нейтральні «бейджі» платіжних систем і перевізника — текстом, без чужих логотипів */
export function PayBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-md border border-line bg-white px-2.5 text-[11px] font-extrabold tracking-wide text-ink-2">
      {children}
    </span>
  );
}
