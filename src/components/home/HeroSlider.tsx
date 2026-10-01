'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { DiamondMark } from '../Icons';

export interface HeroSlide {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  href: string;
  cta: string;
  image?: string;
  tone: 'ivory' | 'blush' | 'night' | 'sage';
}

const TONES: Record<HeroSlide['tone'], { bg: string; dark: boolean }> = {
  ivory: { bg: 'radial-gradient(120% 120% at 78% 40%, #fffdf8 0%, #f4ede2 45%, #e9dfcf 100%)', dark: false },
  blush: { bg: 'radial-gradient(120% 120% at 78% 40%, #fff8f5 0%, #f6e8e2 45%, #ecd6cc 100%)', dark: false },
  sage: { bg: 'radial-gradient(120% 120% at 78% 40%, #fbfcf8 0%, #e9eee6 45%, #d9e2d6 100%)', dark: false },
  night: { bg: 'radial-gradient(120% 120% at 78% 40%, #3a332b 0%, #211d18 50%, #15130f 100%)', dark: true },
};

function Art({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className={`relative grid aspect-square w-[62%] place-items-center rounded-full ${dark ? 'bg-white/5' : 'bg-white/60'} shadow-[inset_0_0_80px_rgba(196,160,104,.25)]`}>
        <DiamondMark size={120} className="text-gold" strokeWidth={0.8} />
      </div>
    </div>
  );
}

const RM = '(prefers-reduced-motion: reduce)';
const subscribeRM = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  // Автопрокрутка: вимкнена для «зменшити рух» і кнопкою паузи (WCAG 2.2.2)
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? reduced;
  const [ref, api] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true, active: !paused })]);
  const [sel, setSel] = useState(0);
  const onSel = useCallback(() => api && setSel(api.selectedScrollSnap()), [api]);
  useEffect(() => {
    if (!api) return;
    onSel();
    api.on('select', onSel);
    return () => {
      api.off('select', onSel);
    };
  }, [api, onSel]);

  return (
    <section aria-roledescription="carousel" aria-label="Головні пропозиції" className="wrap pt-4 md:pt-6">
      <div className="relative overflow-hidden rounded-[22px] md:rounded-[28px]">
        <div ref={ref} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {slides.map((s, i) => {
              const t = TONES[s.tone];
              return (
                <div key={i} className="min-w-0 flex-[0_0_100%]" role="group" aria-roledescription="slide" aria-label={`${i + 1} з ${slides.length}`}>
                  <div className="relative grid min-h-[520px] md:min-h-[480px] md:grid-cols-[1.05fr_1fr] lg:min-h-[520px]" style={{ background: t.bg }}>
                    <div className={`relative z-[1] order-2 flex flex-col justify-center gap-4 px-6 pb-12 pt-4 md:order-1 md:px-12 md:py-14 lg:px-16 ${t.dark ? 'text-white' : ''}`}>
                      <span className={`eyebrow ${t.dark ? '!text-gold' : ''}`}>{s.eyebrow}</span>
                      <h2 className="display text-[40px] sm:text-[52px] lg:text-[66px]">
                        {s.title} <em className={`italic-display ${t.dark ? 'text-gold' : 'text-gold-deep'}`}>{s.accent}</em>
                      </h2>
                      <p className={`max-w-md text-[15px] leading-relaxed md:text-base ${t.dark ? 'text-[#d8cfc2]' : 'text-ink-2'}`}>{s.text}</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <Link href={s.href} className={`btn btn-lg ${t.dark ? 'btn-gold' : 'btn-ink'}`} tabIndex={i === sel ? 0 : -1}>
                          {s.cta} <ArrowRight size={17} />
                        </Link>
                        <Link href="/catalog" className={`btn btn-lg ${t.dark ? 'border-white/30 text-white hover:border-white' : 'btn-line'} hidden sm:inline-flex`} tabIndex={i === sel ? 0 : -1}>
                          Увесь каталог
                        </Link>
                      </div>
                    </div>
                    <div className="relative order-1 aspect-[4/3] md:order-2 md:aspect-auto">
                      {s.image ? (
                        <Image
                          src={s.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain object-center p-4 md:p-8"
                          loading={i === 0 ? 'eager' : 'lazy'}
                          fetchPriority={i === 0 ? 'high' : undefined}
                        />
                      ) : (
                        <Art dark={t.dark} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-1 md:bottom-5 md:left-12 md:justify-start lg:left-16">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className="group/dot pointer-events-auto grid h-6 min-w-6 place-items-center"
              aria-label={`Слайд ${i + 1}`}
              aria-current={i === sel}
              onClick={() => api?.scrollTo(i)}
            >
              <span className={`block h-2 rounded-full transition-all ${i === sel ? 'w-8 bg-ink' : 'w-2 bg-ink/25 group-hover/dot:bg-ink/50'}`} />
            </button>
          ))}
          <button
            type="button"
            className="pointer-events-auto ml-1 grid h-6 w-6 place-items-center rounded-full text-ink/55 transition hover:text-ink"
            aria-label={paused ? 'Увімкнути автопрокрутку' : 'Зупинити автопрокрутку'}
            onClick={() => setUserPaused(!paused)}
          >
            {paused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
          </button>
        </div>
        <div className="absolute bottom-5 right-5 hidden gap-2 md:flex">
          <button type="button" onClick={() => api?.scrollPrev()} className="grid h-11 w-11 place-items-center rounded-full bg-white/85 shadow-[var(--shadow-soft)] hover:bg-white" aria-label="Попередній слайд">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => api?.scrollNext()} className="grid h-11 w-11 place-items-center rounded-full bg-white/85 shadow-[var(--shadow-soft)] hover:bg-white" aria-label="Наступний слайд">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
