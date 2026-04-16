'use client';
import { useState } from 'react';
import { products, categories, materials } from '@/data/products';
import ProductCard from './ProductCard';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMaterial, setActiveMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => activeMaterial === 'all' || p.material === activeMaterial)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <section id="catalog" className="py-24 px-6" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Section title */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: 'var(--gold)', fontFamily: 'Jost', fontWeight: 300 }}>
            ✦ Наша колекція ✦
          </p>
          <h2 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--dark)' }}>
            Каталог прикрас
          </h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <span style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.3em', fontFamily: 'Jost' }}>
              VIALKO
            </span>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-6 py-2 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: 'Jost',
                border: '1px solid var(--gold-light)',
                background: activeCategory === cat.id ? 'var(--dark)' : 'transparent',
                color: activeCategory === cat.id ? 'white' : 'var(--stone)',
              }}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Material + Sort row */}
        <div className="flex flex-wrap gap-2 justify-center items-center mb-12">
          {materials.map(mat => (
            <button key={mat.id}
              onClick={() => setActiveMaterial(mat.id)}
              className="px-5 py-1.5 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: 'Jost',
                border: '1px solid transparent',
                background: activeMaterial === mat.id ? 'var(--gold-light)' : 'transparent',
                color: activeMaterial === mat.id ? 'var(--dark)' : 'var(--stone)',
                borderColor: activeMaterial === mat.id ? 'var(--gold)' : 'transparent',
              }}>
              {mat.name}
            </button>
          ))}

          <div className="w-px h-5 mx-2" style={{ background: 'var(--gold-light)' }} />

          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-4 py-1.5 text-xs tracking-widest uppercase bg-transparent outline-none"
            style={{ fontFamily: 'Jost', border: '1px solid var(--gold-light)', color: 'var(--stone)' }}>
            <option value="default">За замовчуванням</option>
            <option value="price-asc">Ціна ↑</option>
            <option value="price-desc">Ціна ↓</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-center text-xs mb-10" style={{ color: 'var(--stone)', fontFamily: 'Jost', letterSpacing: '0.15em' }}>
          {filtered.length} {filtered.length === 1 ? 'виріб' : 'вироби'}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl mb-2" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--stone)' }}>
              Нічого не знайдено
            </p>
            <p className="text-sm" style={{ fontFamily: 'Jost', color: 'var(--stone)' }}>
              Спробуйте інший фільтр
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
