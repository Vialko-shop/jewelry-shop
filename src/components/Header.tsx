'use client';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const { getTotalItems, toggleCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = getTotalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        ✦ Безкоштовна доставка від 1500 грн &nbsp;|&nbsp; Оплата частинами ПриватБанк &nbsp;|&nbsp; 🚚 Нова Пошта по всій Україні ✦
      </div>

      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(250, 247, 242, 0.97)' : 'var(--cream)',
          borderBottom: '1px solid var(--gold-light)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Phone (desktop) */}
          <div className="hidden lg:flex items-center gap-2" style={{ color: 'var(--stone)' }}>
            <Phone size={13} />
            <a href="tel:+380957775000" className="text-xs tracking-wider hover:text-yellow-700 transition-colors"
              style={{ fontFamily: 'Jost' }}>
              +38 (095) 777-50-00
            </a>
          </div>

          {/* Logo - centered */}
          <Link href="/" className="text-center mx-auto lg:mx-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <div className="text-xs tracking-[0.5em] uppercase" style={{ color: 'var(--stone)', fontFamily: 'Jost', fontWeight: 300 }}>
              ✦ LUXURY JEWELRY ✦
            </div>
            <div className="text-4xl leading-none mt-1" style={{ fontFamily: 'Cormorant Garamond', letterSpacing: '0.1em' }}>
              <span className="gold-gradient font-medium">VIALKO</span>
            </div>
          </Link>

          {/* Right: Nav + Cart */}
          <div className="flex items-center gap-6 ml-auto">
            <nav className="hidden lg:flex gap-8">
              {[
                { href: '#catalog', label: 'Каталог' },
                { href: '#about', label: 'Про нас' },
              ].map(item => (
                <a key={item.href} href={item.href}
                  className="text-xs tracking-[0.2em] uppercase transition-colors hover:text-yellow-700"
                  style={{ color: 'var(--stone)', fontFamily: 'Jost', fontWeight: 400 }}>
                  {item.label}
                </a>
              ))}
            </nav>

            <button onClick={toggleCart} className="relative p-2 transition-transform hover:scale-110">
              <ShoppingBag size={20} style={{ color: 'var(--dark)' }} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ background: 'var(--gold)', fontFamily: 'Jost', fontSize: '0.65rem' }}>
                  {count}
                </span>
              )}
            </button>

            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-6 pt-2" style={{ borderTop: '1px solid var(--gold-light)' }}>
            <a href="tel:+380957775000" className="flex items-center gap-2 py-3 text-xs tracking-wider"
              style={{ color: 'var(--stone)', borderBottom: '1px solid var(--gold-light)', fontFamily: 'Jost' }}>
              <Phone size={13} /> +38 (095) 777-50-00
            </a>
            {['Каталог', 'Про нас'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-xs tracking-[0.2em] uppercase"
                style={{ color: 'var(--stone)', borderBottom: '1px solid var(--gold-light)', fontFamily: 'Jost' }}>
                {item}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
