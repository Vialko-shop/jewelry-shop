'use client';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, X, Menu, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV = [
  { href: '#catalog', label: 'Каталог' },
  { href: '#about',   label: 'Про нас' },
  { href: 'tel:+380957775000', label: '+38 (095) 777-50-00', icon: true },
];

export default function Header() {
  const { getTotalItems, toggleCart } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = getTotalItems();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="ann-bar">
        <span>✦ &nbsp; Безкоштовна доставка від <strong>1500 ₴</strong> &nbsp;|&nbsp; Оплата частинами ПриватБанк &nbsp; ✦</span>
      </div>

      {/* Main header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: scrolled ? 'rgba(253,252,240,0.88)' : 'var(--ivory)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `0.5px solid ${scrolled ? 'var(--mist)' : 'transparent'}`,
        transition: 'all 0.4s ease',
        boxShadow: scrolled ? '0 2px 24px rgba(26,26,26,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Desktop nav left */}
          <nav style={{ display: 'flex', gap: 32, flex: 1 }} className="hidden md:flex">
            <a href="#catalog" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone)', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--black)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}>
              Каталог
            </a>
            <a href="#about" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone)', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--black)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}>
              Про нас
            </a>
          </nav>

          {/* Logo center */}
          <Link href="/" style={{ textDecoration: 'none', textAlign: 'center', flex: '0 0 auto' }}>
            <div style={{ fontSize: '0.5rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: 'var(--stone)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
              ✦ Luxury Jewelry ✦
            </div>
            <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.18em', lineHeight: 1.1, fontWeight: 400 }}
              className="gold-text">
              VIALKO
            </div>
          </Link>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, justifyContent: 'flex-end' }}>
            {/* Phone desktop */}
            <a href="tel:+380957775000" className="hidden md:flex" style={{ alignItems: 'center', gap: 6, fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--stone)', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--black)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}>
              <Phone size={12} />
              095 777-50-00
            </a>

            {/* Cart */}
            <button onClick={toggleCart} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--black)' }}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 17, height: 17,
                  background: 'var(--gold)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 600, color: 'var(--black)',
                }}>
                  {count}
                </span>
              )}
            </button>

            {/* Burger */}
            <button className="md:hidden" onClick={() => setMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--black)' }}>
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}
            style={{ animation: 'fadeIn 0.3s ease' }} />
          <div className="mobile-menu" style={{ animation: 'slideIn 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
            `}</style>

            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '0.15em', color: 'var(--gold)' }}>VIALKO</span>
              <button onClick={() => setMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            <nav style={{ flex: 1 }}>
              {[
                { href: '#catalog', label: 'Каталог' },
                { href: '#about', label: 'Про нас' },
              ].map((item, i) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: 300,
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.85)',
                    padding: '12px 0',
                    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    animationDelay: `${i * 0.06}s`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}>
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Bottom */}
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
              <a href="tel:+380957775000"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gold)', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                <Phone size={14} /> +38 (095) 777-50-00
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
