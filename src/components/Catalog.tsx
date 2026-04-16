'use client';
import { useState, useEffect, useRef } from 'react';
import { products, categories, materials } from '@/data/products';
import ProductCard from './ProductCard';

function useSectionVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function Catalog() {
  const [cat, setCat] = useState('all');
  const [mat, setMat] = useState('all');
  const [sort, setSort] = useState('default');
  const { ref, visible } = useSectionVisible();

  const filtered = products
    .filter(p => cat === 'all' || p.category === cat)
    .filter(p => mat === 'all' || p.material === mat)
    .sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : 0);

  return (
    <section id="catalog" style={{ padding: 'clamp(64px, 8vw, 100px) 0', background: 'var(--ivory)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: 'center',
          marginBottom: 'clamp(40px, 5vw, 64px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease',
        }}>
          <p className="section-label" style={{ marginBottom: 16 }}>✦ Наша колекція ✦</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', letterSpacing: '0.06em', marginBottom: 20, fontWeight: 400 }}>
            Каталог прикрас
          </h2>
          <div className="line-gold" />
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {categories.map(c => (
            <button key={c.id} className={`filter-btn${cat === c.id ? ' active' : ''}`} onClick={() => setCat(c.id)}>
              {c.name}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 40, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          {materials.map(m => (
            <button key={m.id} className={`filter-btn${mat === m.id ? ' active' : ''}`} onClick={() => setMat(m.id)}
              style={{ padding: '6px 14px' }}>
              {m.name}
            </button>
          ))}
          <div style={{ width: '0.5px', height: 20, background: 'var(--mist)', margin: '0 4px' }} />
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '7px 14px', border: '0.5px solid var(--mist)', background: 'transparent', color: 'var(--stone)', outline: 'none', cursor: 'pointer' }}>
            <option value="default">Сортування</option>
            <option value="price-asc">Ціна ↑</option>
            <option value="price-desc">Ціна ↓</option>
          </select>
        </div>

        {/* Count */}
        <p style={{ textAlign: 'center', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 32, fontFamily: 'var(--font-sans)' }}>
          {filtered.length} {filtered.length === 1 ? 'виріб' : 'вироби'}
        </p>

        {/* Grid — 2 on mobile, 3 on tablet, 4 on desktop */}
        <div className="catalog-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(12px, 2vw, 28px)',
        }}>
          <style>{`
            @media (min-width: 768px)  { .catalog-grid { grid-template-columns: repeat(3, 1fr) !important; } }
            @media (min-width: 1200px) { .catalog-grid { grid-template-columns: repeat(4, 1fr) !important; } }
          `}</style>
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--stone)' }}>Нічого не знайдено</p>
          </div>
        )}
      </div>
    </section>
  );
}
