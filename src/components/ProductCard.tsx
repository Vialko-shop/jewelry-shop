'use client';
import { Product } from '@/store/cartStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Star } from 'lucide-react';

const materialLabel: Record<string, string> = {
  gold: 'Золото',
  silver: 'Срібло',
  bijouterie: 'Біжутерія',
};

const materialColor: Record<string, string> = {
  gold: '#C9A84C',
  silver: '#A8A8B3',
  bijouterie: '#D4A5A5',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  return (
    <div className="card-hover group cursor-pointer"
      style={{ background: 'white', border: '1px solid #F0EAE0' }}>
      
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '120%' }}>
        <img
          src={product.image}
          alt={product.nameUa}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(26,22,20,0.15)' }} />
        
        {/* Material badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-white text-xs tracking-widest uppercase"
            style={{ background: materialColor[product.material], fontFamily: 'Jost', fontSize: '0.6rem' }}>
            {materialLabel[product.material]}
          </span>
        </div>

        {/* Quick add button */}
        <button
          onClick={() => addItem(product)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 btn-gold px-6 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
          Додати до кошика
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} fill="#C9A84C" color="#C9A84C" />
          ))}
          <span className="text-xs ml-1" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>5.0</span>
        </div>
        
        <h3 className="text-lg leading-snug mb-1" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--dark)' }}>
          {product.nameUa}
        </h3>
        
        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold-dark)' }}>
            {product.price.toLocaleString('uk-UA')} ₴
          </span>
          <button
            onClick={() => addItem(product)}
            className="p-2 transition-colors"
            style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}
            title="Додати до кошика">
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
