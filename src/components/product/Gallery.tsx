'use client';

import { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { IconName } from '@/lib/taxonomy';
import PhotoSlot from '../PhotoSlot';

function Zoomable({ src, alt, eager, onOpen }: { src: string; alt: string; eager: boolean; onOpen: () => void }) {
  const [origin, setOrigin] = useState('50% 50%');
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className="group relative block h-full w-full cursor-zoom-in overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onClick={onOpen}
      aria-label="Відкрити фото на весь екран"
    >
      <span className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: on ? 'scale(1.9)' : 'none', transformOrigin: origin }}>
        <PhotoSlot src={src} alt={alt} sizes="(max-width: 1024px) 100vw, 640px" eager={eager} />
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm group-hover:hidden md:flex">
        <ZoomIn size={14} /> Наведіть, щоб збільшити
      </span>
    </button>
  );
}

export default function Gallery({ images, alt, icon, children }: { images: string[]; alt: string; icon: IconName; children?: React.ReactNode }) {
  const [ref, api] = useEmblaCarousel({ loop: images.length > 1 });
  const [sel, setSel] = useState(0);
  const [open, setOpen] = useState(false);
  const onSel = useCallback(() => api && setSel(api.selectedScrollSnap()), [api]);
  useEffect(() => {
    if (!api) return;
    api.on('select', onSel);
    return () => {
      api.off('select', onSel);
    };
  }, [api, onSel]);

  if (!images.length) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#f6f3ee]">
        <PhotoSlot src={null} alt={alt} icon={icon} label="Фото незабаром" />
        {children}
      </div>
    );
  }

  const go = (i: number) => api?.scrollTo(i);

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2 md:w-[76px] md:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Фото ${i + 1}`}
              aria-current={i === sel}
              className={`relative aspect-square w-[68px] overflow-hidden rounded-xl border-2 bg-[#f6f3ee] transition md:w-full ${i === sel ? 'border-ink' : 'border-transparent opacity-75 hover:opacity-100'}`}
            >
              <PhotoSlot src={src} alt="" sizes="76px" />
            </button>
          ))}
        </div>
      )}
      <div className="relative min-w-0 flex-1">
        <div className="overflow-hidden rounded-[20px] bg-[#f6f3ee]" ref={ref}>
          <div className="flex touch-pan-y">
            {images.map((src, i) => (
              <div key={src} className="relative aspect-square min-w-0 flex-[0_0_100%]">
                <Zoomable src={src} alt={i === 0 ? alt : `${alt} — фото ${i + 1}`} eager={i === 0} onOpen={() => setOpen(true)} />
              </div>
            ))}
          </div>
        </div>
        {children}
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => api?.scrollPrev()} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow md:hidden" aria-label="Попереднє фото">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => api?.scrollNext()} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow md:hidden" aria-label="Наступне фото">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="overlay !bg-night/85" />
          <Dialog.Content className="fixed inset-0 z-[90] grid place-items-center p-4 outline-none" aria-describedby={undefined}>
            <Dialog.Title className="sr-only">{alt}</Dialog.Title>
            <div className="relative aspect-square w-[min(92vw,86dvh)] overflow-hidden rounded-2xl bg-[#f6f3ee]">
              <PhotoSlot src={images[sel]} alt={alt} sizes="92vw" />
            </div>
            <Dialog.Close className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink" aria-label="Закрити">
              <X size={22} />
            </Dialog.Close>
            {images.length > 1 && (
              <>
                <button type="button" className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white" aria-label="Попереднє" onClick={() => go((sel - 1 + images.length) % images.length)}>
                  <ChevronLeft size={22} />
                </button>
                <button type="button" className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white" aria-label="Наступне" onClick={() => go((sel + 1) % images.length)}>
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
