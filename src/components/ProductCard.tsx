'use client';
import { ExtendedProduct, statusLabels } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Eye, X, Star } from 'lucide-react';
import { useState } from 'react';

const materialLabel: Record<string, string> = {
  gold: 'Золото', silver: 'Срібло', bijouterie: 'Біжутерія',
};
const materialColor: Record<string, string> = {
  gold: '#C9A84C', silver: '#A8A8B3', bijouterie: '#D4A5A5',
};

function QuickView({ product, onClose }: { product: ExtendedProduct; onClose: () => void }) {
  const { addItem } = useCartStore();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 quick-view-overlay"
      onClick={onClose}>
      <div className="bg-white max-w-3xl w-full flex overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '85vh' }}>

        {/* Image */}
        <div className="w-1/2 relative flex-shrink-0" style={{ paddingBottom: '0' }}>
          <img src={product.image} alt={product.nameUa} className="w-full h-full object-cover" style={{ minHeight: '400px' }} />
          {product.status === 'sold' && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(26,22,20,0.5)' }}>
              <span className="text-white text-lg px-6 py-2 border border-white" style={{ fontFamily: 'Cormorant Garamond', letterSpacing: '0.2em' }}>
                ПРОДАНО
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 text-white text-xs tracking-widest uppercase"
                style={{ background: materialColor[product.material], fontFamily: 'Jost', fontSize: '0.6rem' }}>
                {materialLabel[product.material]}
              </span>
              <button onClick={onClose} className="p-1 hover:opacity-60 transition-opacity">
                <X size={20} style={{ color: 'var(--stone)' }} />
              </button>
            </div>

            <h2 className="text-2xl mb-2 leading-snug" style={{ fontFamily: 'Cormorant Garamond' }}>
              {product.nameUa}
            </h2>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#C9A84C" color="#C9A84C" />)}
            </div>

            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--stone)', fontFamily: 'Jost', fontWeight: 300 }}>
              {product.description}
            </p>

            {/* Details */}
            <div className="space-y-2 mb-6">
              {product.weight && (
                <div className="flex justify-between text-xs" style={{ fontFamily: 'Jost', borderBottom: '1px solid var(--gold-light)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--stone)' }}>Вага</span>
                  <span>{product.weight}</span>
                </div>
              )}
              {product.size && (
                <div className="flex justify-between text-xs" style={{ fontFamily: 'Jost', borderBottom: '1px solid var(--gold-light)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--stone)' }}>Розмір</span>
                  <span>{product.size}</span>
                </div>
              )}
              <div className="flex justify-between text-xs" style={{ fontFamily: 'Jost', borderBottom: '1px solid var(--gold-light)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--stone)' }}>Статус</span>
                <span style={{ color: statusLabels[product.status].color }}>
                  {statusLabels[product.status].label}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-3xl mb-4" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold-dark)' }}>
              {product.price.toLocaleString('uk-UA')} ₴
            </div>
            {product.status !== 'sold' && (
              <button onClick={() => { addItem(product); onClose(); }}
                className="btn-gold w-full py-4 px-6 flex items-center justify-center gap-2">
                <ShoppingBag size={16} />
                Додати до кошика
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product, index = 0 }: { product: ExtendedProduct; index?: number }) {
  const { addItem } = useCartStore();
  const [showQuickView, setShowQuickView] = useState(false);
  const status = statusLabels[product.status];

  return (
    <>
      <div className="card-hover group cursor-pointer"
        style={{
          background: 'white',
          border: '1px solid #F0EAE0',
          animationDelay: `${index * 0.08}s`,
          opacity: product.status === 'sold' ? 0.7 : 1,
        }}>

        {/* Image container with hover flip */}
        <div className="img-flip-container relative" style={{ paddingBottom: '125%' }}>
          <img src={product.image} alt={product.nameUa}
            className="img-primary absolute inset-0 w-full h-full object-cover" />
          {product.image2 && (
            <img src={product.image2} alt={product.nameUa}
              className="img-secondary" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="px-2 py-1 text-white text-xs tracking-widest uppercase"
              style={{ background: materialColor[product.material], fontFamily: 'Jost', fontSize: '0.55rem' }}>
              {materialLabel[product.material]}
            </span>
            {product.badges?.map(badge => (
              <span key={badge} className="px-2 py-1 text-white text-xs tracking-widest uppercase"
                style={{ background: 'var(--charcoal)', fontFamily: 'Jost', fontSize: '0.55rem' }}>
                {badge}
              </span>
            ))}
          </div>

          {/* Status sold overlay */}
          {product.status === 'sold' && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(26,22,20,0.4)' }}>
              <span className="text-white px-4 py-1 border border-white text-xs tracking-widest uppercase"
                style={{ fontFamily: 'Jost' }}>Продано</span>
            </div>
          )}

          {/* Hover actions */}
          {product.status !== 'sold' && (
            <div className="absolute bottom-0 left-0 right-0 flex opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button onClick={() => addItem(product)}
                className="flex-1 btn-gold py-3 text-center text-xs tracking-widest flex items-center justify-center gap-2">
                <ShoppingBag size={13} /> До кошика
              </button>
              <button onClick={() => setShowQuickView(true)}
                className="px-4 py-3 flex items-center justify-center transition-colors"
                style={{ background: 'var(--charcoal)', color: 'white' }}
                title="Швидкий перегляд">
                <Eye size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pb-5">
          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#C9A84C" color="#C9A84C" />)}
          </div>

          <h3 className="text-lg leading-snug mb-1" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--dark)' }}>
            {product.nameUa}
          </h3>

          <p className="text-xs mb-3 line-clamp-1" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold-dark)' }}>
              {product.price.toLocaleString('uk-UA')} ₴
            </span>
            <span className="status-badge" style={{ background: status.color + '20', color: status.color }}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {showQuickView && <QuickView product={product} onClose={() => setShowQuickView(false)} />}
    </>
  );
}
