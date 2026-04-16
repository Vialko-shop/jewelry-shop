'use client';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--dark)' }}>
      
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80"
          alt="Luxury jewelry"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(26,22,20,0.3) 0%, rgba(26,22,20,0.7) 100%)' }} />
      </div>

      {/* Decorative lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-40" style={{ background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)' }} />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-40" style={{ background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.5em] uppercase mb-6"
          style={{ color: 'var(--gold)', fontFamily: 'Jost', fontWeight: 300 }}>
          ✦ Handcrafted Jewelry ✦
        </p>

        <h1 className="text-white mb-6 leading-none"
          style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 300 }}>
          Краса у<br />
          <em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>кожній деталі</em>
        </h1>

        <p className="text-base mb-10 max-w-lg mx-auto"
          style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Jost', fontWeight: 300, letterSpacing: '0.05em' }}>
          Золото, срібло та вишукана біжутерія. Доставляємо по всій Україні Новою Поштою.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#catalog" className="btn-gold px-10 py-4 inline-block">
            Переглянути колекцію
          </a>
          <a href="#about" className="btn-outline px-10 py-4 inline-block">
            Про нас
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-16">
          {[
            { num: '500+', label: 'Задоволених клієнток' },
            { num: '3', label: 'Роки досвіду' },
            { num: '100%', label: 'Оригінальні вироби' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold)' }}>{s.num}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Jost', letterSpacing: '0.1em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#catalog"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
          Дивитись
        </span>
        <ChevronDown size={16} style={{ color: 'var(--gold)' }} className="animate-bounce" />
      </a>
    </section>
  );
}
