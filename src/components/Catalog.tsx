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
    <section id="catalog" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>✦ Наша колекція ✦</p>
          <h2 className="text-5xl" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--dark)' }}>
            Каталог прикрас
          </h2>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: 'var(--gold)' }} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-5 py-2 text-xs tracking-widest uppercase transition-all"
              style={{
                fontFamily: 'Jost',
                border: '1px solid var(--gold-light)',
                background: activeCategory === cat.id ? 'var(--gold)' : 'transparent',
                color: activeCategory === cat.id ? 'white' : 'var(--stone)',
              }}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {materials.map(mat => (
            <button key={mat.id}
              onClick={() => setActiveMaterial(mat.id)}
              className="px-5 py-2 text-xs tracking-widest uppercase transition-all"
              style={{
                fontFamily: 'Jost',
                border: '1px solid var(--gold-light)',
                background: activeMaterial === mat.id ? 'var(--charcoal)' : 'transparent',
                color: activeMaterial === mat.id ? 'white' : 'var(--stone)',
              }}>
              {mat.name}
            </button>
          ))}

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-5 py-2 text-xs tracking-widest uppercase"
            style={{
              fontFamily: 'Jost',
              border: '1px solid var(--gold-light)',
              color: 'var(--stone)',
              background: 'transparent',
              outline: 'none',
            }}>
            <option value="default">Сортування</option>
            <option value="price-asc">Ціна: дешевші</option>
            <option value="price-desc">Ціна: дорожчі</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-center text-xs mb-8" style={{ color: 'var(--stone)', fontFamily: 'Jost', letterSpacing: '0.1em' }}>
          Знайдено {filtered.length} {filtered.length === 1 ? 'прикраса' : 'прикраси'}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--stone)' }}>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem' }}>
              Нічого не знайдено
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
