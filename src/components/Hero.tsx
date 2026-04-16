'use client';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--dark)' }}>

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80"
          alt="Luxury jewelry"
          className="w-full h-full object-cover"
          style={{ opacity: 0.35, transform: 'scale(1.02)' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(26,22,20,0.5) 0%, rgba(26,22,20,0.2) 50%, rgba(26,22,20,0.6) 100%)'
        }} />
      </div>

      {/* Side ornament lines */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
        <div className="w-px h-24" style={{ background: 'linear-gradient(to bottom, transparent, var(--gold))' }} />
        <div className="text-xs text-center" style={{ color: 'var(--gold)', fontFamily: 'Jost', letterSpacing: '0.3em', writingMode: 'vertical-rl' }}>
          VIALKO
        </div>
        <div className="w-px h-24" style={{ background: 'linear-gradient(to top, transparent, var(--gold))' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease',
        }}>

        <p className="text-xs tracking-[0.6em] uppercase mb-8"
          style={{ color: 'var(--gold)', fontFamily: 'Jost', fontWeight: 300 }}>
          ✦ &nbsp; Авторські прикраси &nbsp; ✦
        </p>

        <h1 className="text-white mb-4 leading-none"
          style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(3.5rem, 9vw, 8rem)', fontWeight: 300, letterSpacing: '0.05em' }}>
          Краса у
        </h1>
        <h1 className="mb-8 leading-none"
          style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(3.5rem, 9vw, 8rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--gold-light)', letterSpacing: '0.02em' }}>
          кожній деталі
        </h1>

        {/* Ornament divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-px" style={{ background: 'var(--gold)' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>◆</span>
          <div className="w-16 h-px" style={{ background: 'var(--gold)' }} />
        </div>

        <p className="text-base mb-12 max-w-xl mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Jost', fontWeight: 300, letterSpacing: '0.05em' }}>
          Золото, срібло та вишукана біжутерія.<br />Доставляємо по всій Україні Новою Поштою.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a href="#catalog" className="btn-gold px-12 py-4 inline-block">
            Переглянути колекцію
          </a>
          <a href="tel:+380957775000" className="btn-outline px-12 py-4 inline-block">
            Зателефонувати
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-16">
          {[
            { num: '500+', label: 'Задоволених клієнток' },
            { num: '5+', label: 'Років досвіду' },
            { num: '100%', label: 'Оригінальні вироби' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold)' }}>{s.num}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Jost', letterSpacing: '0.08em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#catalog" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold-light)', fontFamily: 'Jost' }}>Дивитись</span>
        <ChevronDown size={16} style={{ color: 'var(--gold-light)' }} className="animate-bounce" />
      </a>
    </section>
  );
}
