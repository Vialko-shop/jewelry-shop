'use client';
import { ExtendedProduct, statusLabels } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Eye, X, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const MAT_COLOR: Record<string, string> = { gold: '#d4af37', silver: '#9ea3ae', bijouterie: '#c4a882' };
const MAT_LABEL: Record<string, string> = { gold: 'Золото', silver: 'Срібло', bijouterie: 'Біжутерія' };

function QuickView({ product, onClose }: { product: ExtendedProduct; onClose: () => void }) {
  const { addItem } = useCartStore();
  const status = statusLabels[product.status];

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{
          background: 'white', maxWidth: 800, width: '100%', display: 'flex',
          flexDirection: 'row', maxHeight: '90vh', overflow: 'hidden',
          animation: 'modalIn 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>

        {/* Image */}
        <div style={{ flex: '0 0 45%', position: 'relative', minHeight: 420 }} className="hidden sm:block">
          <img src={product.image} alt={product.nameUa} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {product.status === 'sold' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', padding: '8px 20px', border: '0.5px solid rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)' }}>Продано</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '40px 36px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', fontWeight: 500, color: MAT_COLOR[product.material] }}>
              {MAT_LABEL[product.material]}
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)', padding: 4 }}>
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 400, letterSpacing: '0.04em', marginBottom: 12, lineHeight: 1.2 }}>
            {product.nameUa}
          </h2>

          <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="var(--gold)" color="var(--gold)" />)}
          </div>

          <p style={{ fontSize: '0.82rem', lineHeight: 1.75, color: 'var(--stone)', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: 28 }}>
            {product.description}
          </p>

          {/* Details */}
          <div style={{ borderTop: '0.5px solid var(--mist)', paddingTop: 20, marginBottom: 28 }}>
            {[
              product.weight && ['Вага', product.weight],
              product.size && ['Розмір', product.size],
              ['Статус', <span key="s" style={{ color: status.color }}>{status.label}</span>],
            ].filter(Boolean).map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--mist)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--stone)' }}>
                <span>{(row as [string, React.ReactNode])[0]}</span>
                <span style={{ color: 'var(--black)', fontWeight: 400 }}>{(row as [string, React.ReactNode])[1]}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', letterSpacing: '0.02em', marginBottom: 20, color: 'var(--black)' }}>
              {product.price.toLocaleString('uk-UA')} <span style={{ fontSize: '1.2rem', color: 'var(--stone)' }}>₴</span>
            </div>
            {product.status !== 'sold' && (
              <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { addItem(product); onClose(); }}>
                <ShoppingBag size={14} /> Додати до кошика
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Intersection Observer hook ── */
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function ProductCard({ product, index = 0 }: { product: ExtendedProduct; index?: number }) {
  const { addItem } = useCartStore();
  const [quickView, setQuickView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { ref, visible } = useInView();
  const status = statusLabels[product.status];

  return (
    <>
      <div ref={ref}
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 0.55s ease ${index * 0.07}s, transform 0.55s ease ${index * 0.07}s, box-shadow 0.4s ease`,
        }}>

        {/* Image */}
        <div className="img-wrap" style={{ paddingBottom: '120%', position: 'relative' }}>
          <img src={product.image} alt={product.nameUa}
            className="primary"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          {product.image2 && (
            <img src={product.image2} alt="" className="secondary" />
          )}

          {/* Material tag */}
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="badge" style={{ background: 'rgba(26,26,26,0.72)', color: MAT_COLOR[product.material], backdropFilter: 'blur(4px)' }}>
              {MAT_LABEL[product.material]}
            </span>
          </div>

          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {product.badges.slice(0, 1).map(b => (
                <span key={b} className="badge" style={{ background: 'var(--gold)', color: 'var(--black)', fontWeight: 600 }}>{b}</span>
              ))}
            </div>
          )}

          {/* Sold overlay */}
          {product.status === 'sold' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', padding: '6px 16px', border: '0.5px solid rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans)' }}>Продано</span>
            </div>
          )}

          {/* Hover actions */}
          {product.status !== 'sold' && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              display: 'flex',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.3s ease',
            }}>
              <button onClick={() => addItem(product)} className="btn-gold"
                style={{ flex: 1, justifyContent: 'center', borderRadius: 0, padding: '12px 8px', fontSize: '0.58rem' }}>
                <ShoppingBag size={13} /> До кошика
              </button>
              <button onClick={() => setQuickView(true)}
                style={{ width: 44, background: 'var(--black)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--black)')}>
                <Eye size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px 16px 20px' }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={9} fill="var(--gold)" color="var(--gold)" />)}
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.02rem', fontWeight: 400, letterSpacing: '0.03em', marginBottom: 6, lineHeight: 1.25, color: 'var(--black)' }}>
            {product.nameUa}
          </h3>

          <p style={{ fontSize: '0.7rem', color: 'var(--stone)', fontFamily: 'var(--font-sans)', fontWeight: 300, lineHeight: 1.5, marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as any }}>
            {product.description}
          </p>

          <hr style={{ border: 'none', borderTop: '0.5px solid var(--mist)', marginBottom: 12 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', letterSpacing: '0.02em', color: 'var(--black)' }}>
              {product.price.toLocaleString('uk-UA')} ₴
            </span>
            <span className="badge" style={{ background: status.color + '18', color: status.color }}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {quickView && <QuickView product={product} onClose={() => setQuickView(false)} />}
    </>
  );
}
