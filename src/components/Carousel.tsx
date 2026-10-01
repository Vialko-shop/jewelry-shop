'use client';

import { Children, useCallback, useEffect, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({
  children,
  className = '',
  slideClass = '[--slide:50%] md:[--slide:33.333%] xl:[--slide:25%]',
  loop = false,
  autoplay = 0,
  dots = false,
  label = 'Каруселька',
}: {
  children: ReactNode;
  className?: string;
  slideClass?: string;
  loop?: boolean;
  autoplay?: number;
  dots?: boolean;
  label?: string;
}) {
  const plugins = autoplay ? [Autoplay({ delay: autoplay, stopOnInteraction: true, stopOnMouseEnter: true })] : [];
  const [ref, api] = useEmblaCarousel({ align: 'start', loop, slidesToScroll: 'auto', containScroll: 'trimSnaps' }, plugins);
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(false);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [sel, setSel] = useState(0);

  const sync = useCallback(() => {
    if (!api) return;
    setPrev(api.canScrollPrev());
    setNext(api.canScrollNext());
    setSnaps(api.scrollSnapList());
    setSel(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    sync();
    api.on('select', sync).on('reInit', sync);
    return () => {
      api.off('select', sync).off('reInit', sync);
    };
  }, [api, sync]);

  const items = Children.toArray(children);

  return (
    <div className={`embla ${slideClass} ${className}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="embla-viewport" ref={ref}>
        <div className="embla-track">
          {items.map((child, i) => (
            <div className="embla-slide" key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} з ${items.length}`}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="embla-nav prev" onClick={() => api?.scrollPrev()} disabled={!prev} aria-label="Назад">
        <ChevronLeft size={20} />
      </button>
      <button type="button" className="embla-nav next" onClick={() => api?.scrollNext()} disabled={!next} aria-label="Далі">
        <ChevronRight size={20} />
      </button>
      {dots && snaps.length > 1 ? (
        <div className="embla-dots">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`embla-dot${i === sel ? ' on' : ''}`}
              aria-label={`Слайд ${i + 1}`}
              aria-current={i === sel}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
