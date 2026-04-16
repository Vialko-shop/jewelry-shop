'use client';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { getTotalItems, toggleCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = getTotalItems();

  return (
    <header style={{ background: 'var(--cream)', borderBottom: '1px solid var(--gold-light)' }}
      className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-center">
          <div className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
            Ukraine
          </div>
          <div className="text-3xl leading-none" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--dark)' }}>
            <span className="gold-gradient">Каблучка</span>
          </div>
          <div className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
            & Co
          </div>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex gap-8">
          {['Каталог', 'Золото', 'Срібло', 'Біжутерія', 'Про нас'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-xs tracking-[0.2em] uppercase transition-colors hover:text-yellow-600"
              style={{ color: 'var(--stone)', fontFamily: 'Jost', fontWeight: 400 }}>
              {item}
            </a>
          ))}
        </nav>

        {/* Cart */}
        <div className="flex items-center gap-4">
          <button onClick={toggleCart} className="relative p-2 transition-transform hover:scale-110">
            <ShoppingBag size={20} style={{ color: 'var(--dark)' }} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                style={{ background: 'var(--gold)', fontFamily: 'Jost' }}>
                {count}
              </span>
            )}
          </button>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4" style={{ borderTop: '1px solid var(--gold-light)' }}>
          {['Каталог', 'Золото', 'Срібло', 'Біжутерія', 'Про нас'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="block py-3 text-xs tracking-[0.2em] uppercase"
              style={{ color: 'var(--stone)', borderBottom: '1px solid var(--gold-light)' }}>
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
