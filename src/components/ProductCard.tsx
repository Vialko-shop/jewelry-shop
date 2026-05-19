'use client';
import { ExtendedProduct, statusLabels } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Eye, X, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const MAT_COLOR: Record<string, string> = { gold: '#d4af37', silver: '#9ea3ae', bijouterie: '#c4a882' };
const MAT_LABEL: Record<string, string> = { gold: 'Золото', silver: 'Срібло', bijouterie: 'Біжутерія' };

export default function ProductCard({ product, index = 0 }: { product: ExtendedProduct; index?: number }) {
  const { addItem } = useCartStore();
  const [quickView, setQuickView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const status = statusLabels[product.status];
  return (
    <>
      <div className="product-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="img-wrap" style={{ paddingBottom: '120%', position: 'relative' }}>
          <img src={product.image} alt={product.nameUa} className="primary" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          {product.image2 && <img src={product.image2} alt="" className="secondary" />}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className="badge" style={{ background: 'rgba(26,26,26,0.75)', color: MAT_COLOR[product.material] }}>{MAT_LABEL[product.material]}</span>
          </div>
          {product.status === 'sold' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Продано</span>
            </div>
          )}
          {product.status !== 'sold' && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', opacity: hovered ? 1 : 0, transition: 'all 0.28s ease' }}>
              <button onClick={() => addItem(product)} className="btn-gold" style={{ flex: 1, justifyContent: 'center', borderRadius: 0, padding: '11px 8px' }}>
                <ShoppingBag size={13} /> До кошика
              </button>
              <button onClick={() => setQuickView(true)} style={{ width: 44, background: 'var(--black)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={15} />
              </button>
            </div>
          )}
        </div>
        <div style={{ padding: '14px 14px 18px' }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 7 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={9} fill="var(--gold)" color="var(--gold)" />)}
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, marginBottom: 5 }}>{product.nameUa}</h3>
          <p style={{ fontSize: '0.68rem', color: 'var(--stone)', marginBottom: 10 }}>{product.description}</p>
          <hr style={{ border: 'none', borderTop: '0.5px solid var(--mist)', marginBottom: 10 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>{product.price.toLocaleString('uk-UA')} ₴</span>
            <span className="badge" style={{ background: status.color + '18', color: status.color }}>{status.label}</span>
          </div>
        </div>
      </div>
    </>
  );
}
