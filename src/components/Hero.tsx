'use client';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', fn); };
  }, []);

  return (
    <section ref={ref} style={{ position: 'relative', minHeight: '94vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--black)' }}>

      {/* Parallax BG */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${scrollY * 0.3}px)`, willChange: 'transform' }}>
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=75"
          alt="" style={{ width: '100%', height: '110%', objectFit: 'cover', opacity: 0.32, objectPosition: 'center 30%' }} />
      </div>
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.15) 40%, rgba(26,26,26,0.55) 100%)' }} />

      {/* Thin side lines */}
      <div className="hidden xl:block" style={{ position: 'absolute', left: 40, top: '20%', bottom: '20%', width: '0.5px', background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)' }} />
      <div className="hidden xl:block" style={{ position: 'absolute', right: 40, top: '20%', bottom: '20%', width: '0.5px', background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)' }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: 820,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 1.1s cubic-bezier(0.4,0,0.2,1), transform 1.1s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <p style={{ fontSize: '0.58rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-sans)', fontWeight: 400, marginBottom: 28, opacity: 0.9 }}>
          ✦ &nbsp; Авторські прикраси &nbsp; ✦
        </p>

        <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)', color: 'white', letterSpacing: '0.04em', lineHeight: 1.08, marginBottom: 8 }}>
          Краса у
        </h1>
        <h1 className="gold-text hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)', letterSpacing: '0.02em', lineHeight: 1.08, marginBottom: 36 }}>
          кожній деталі
        </h1>

        {/* Gold line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 48, height: '0.5px', background: 'var(--gold)' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.5rem' }}>◆</span>
          <div style={{ width: 48, height: '0.5px', background: 'var(--gold)' }} />
        </div>

        <p style={{ fontSize: '0.85rem', letterSpacing: '0.06em', lineHeight: 1.8, color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: 44, maxWidth: 460, margin: '0 auto 44px' }}>
          Золото, срібло та вишукана біжутерія.<br />Доставка по всій Україні.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 60 }}>
          <a href="#catalog" className="btn-primary"><span>Переглянути колекцію</span></a>
          <a href="tel:+380957775000" className="btn-ghost">Зателефонувати</a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 64px)' }}>
          {[['500+', 'Задоволених'], ['5+', 'Років досвіду'], ['100%', 'Оригінал']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--gold)', letterSpacing: '0.05em' }}>{num}</div>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#catalog" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.45, transition: 'opacity 0.2s', textDecoration: 'none' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}>
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}>Дивитись</span>
        <ChevronDown size={14} color="var(--gold)" style={{ animation: 'bounce 2s infinite' }} />
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }`}</style>
      </a>
    </section>
  );
}
