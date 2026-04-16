'use client';
import { useCartStore } from '@/store/cartStore';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={toggleCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col w-full max-w-md"
        style={{ background: 'var(--cream)', boxShadow: '-20px 0 60px rgba(0,0,0,0.2)' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--gold-light)' }}>
          <div>
            <h2 className="text-2xl" style={{ fontFamily: 'Cormorant Garamond' }}>Ваш кошик</h2>
            <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
              {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товари' : 'товарів'}
            </p>
          </div>
          <button onClick={toggleCart} className="p-2 hover:opacity-60 transition-opacity">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={40} className="mx-auto mb-4" style={{ color: 'var(--gold-light)' }} />
              <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', color: 'var(--stone)' }}>
                Кошик порожній
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                Додайте прикраси до кошика
              </p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3" style={{ borderBottom: '1px solid var(--gold-light)', paddingBottom: '1rem' }}>
                <img src={item.image} alt={item.nameUa}
                  className="w-20 h-20 object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm leading-tight mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '1rem' }}>
                    {item.nameUa}
                  </h4>
                  <p className="text-xs mb-2" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                    {item.price.toLocaleString('uk-UA')} ₴
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center"
                        style={{ border: '1px solid var(--gold-light)' }}>
                        <Minus size={10} />
                      </button>
                      <span className="text-sm w-4 text-center" style={{ fontFamily: 'Jost' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center"
                        style={{ border: '1px solid var(--gold-light)' }}>
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-sm font-medium" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold-dark)' }}>
                      {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                    </span>
                    <button onClick={() => removeItem(item.id)} className="p-1 hover:opacity-60 transition-opacity">
                      <Trash2 size={14} style={{ color: 'var(--stone)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid var(--gold-light)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'Jost', color: 'var(--stone)' }}>
                Разом
              </span>
              <span className="text-2xl" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--dark)' }}>
                {getTotalPrice().toLocaleString('uk-UA')} ₴
              </span>
            </div>
            <a href="/checkout"
              className="btn-gold block w-full text-center py-4 px-6"
              onClick={toggleCart}>
              Оформити замовлення
            </a>
            <p className="text-center text-xs mt-3" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
              🚚 Доставка Новою Поштою по всій Україні
            </p>
          </div>
        )}
      </div>
    </>
  );
}
