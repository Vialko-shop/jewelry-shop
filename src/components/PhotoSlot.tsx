import type { CSSProperties } from 'react';

export default function PhotoSlot({
  src,
  alt = '',
  label,
  className = '',
  style,
}: {
  src?: string | null;
  alt?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const has = Boolean(src);
  return (
    <span className={`photo-slot${has ? '' : ' is-empty'}${className ? ' ' + className : ''}`} style={style}>
      {has ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src as string} alt={alt} loading="lazy" />
      ) : (
        <span className="ps-label">
          Фото скоро
          {label && label.trim() ? <small>{label}</small> : null}
        </span>
      )}
    </span>
  );
}
