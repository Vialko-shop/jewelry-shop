'use client';
import { useState } from 'react';
import { products as initialProducts, statusLabels, ExtendedProduct, ProductStatus } from '@/data/products';
import { Lock, Save, Eye, EyeOff, Package, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';

const ADMIN_PASSWORD = 'vialko2025';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<ExtendedProduct[]>(initialProducts);
  const [saved, setSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setError('Невірний пароль');
    }
  };

  const updateProduct = (id: string, field: keyof ExtendedProduct, value: string | number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const inStock = products.filter(p => p.status === 'in_stock').length;
  const sold = products.filter(p => p.status === 'sold').length;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--dark)' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2 gold-gradient" style={{ fontFamily: 'Cormorant Garamond', letterSpacing: '0.1em' }}>
              VIALKO
            </div>
            <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              Admin Panel
            </p>
          </div>
          <form onSubmit={handleLogin} className="p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <div className="flex items-center gap-2 mb-6 justify-center" style={{ color: 'var(--gold)' }}>
              <Lock size={16} />
              <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'Jost' }}>Захищений вхід</span>
            </div>
            <div className="relative mb-4">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm outline-none text-white pr-10"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'Jost' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--stone)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mb-3 text-center" style={{ fontFamily: 'Jost' }}>{error}</p>}
            <button type="submit" className="btn-gold w-full py-3">Увійти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f0d0c', color: 'white' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="text-xl gold-gradient" style={{ fontFamily: 'Cormorant Garamond', letterSpacing: '0.1em' }}>VIALKO</div>
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
            / Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank"
            className="text-xs tracking-widest uppercase px-4 py-2 transition-colors hover:text-yellow-400"
            style={{ color: 'var(--stone)', fontFamily: 'Jost', border: '1px solid rgba(201,168,76,0.3)' }}>
            Переглянути сайт ↗
          </a>
          <button onClick={handleSave}
            className="btn-gold px-5 py-2 flex items-center gap-2 text-xs">
            <Save size={14} />
            {saved ? '✓ Збережено!' : 'Зберегти'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Всього товарів', value: products.length, color: '#C9A84C' },
            { icon: ShoppingBag, label: 'В наявності', value: inStock, color: '#22c55e' },
            { icon: TrendingUp, label: 'Продано', value: sold, color: '#ef4444' },
            { icon: DollarSign, label: 'Сума каталогу', value: totalValue.toLocaleString('uk-UA') + ' ₴', color: '#C9A84C' },
          ].map(stat => (
            <div key={stat.label} className="p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <stat.icon size={20} style={{ color: stat.color, marginBottom: 8 }} />
              <div className="text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond', color: 'white' }}>
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
            <h2 className="text-lg" style={{ fontFamily: 'Cormorant Garamond' }}>Управління товарами</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
              Редагуйте ціни, назви та статуси прямо в таблиці
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                  {['Фото', 'Назва', 'Ціна (₴)', 'Статус', 'Матеріал'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase"
                      style={{ color: 'var(--gold)', fontFamily: 'Jost', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr key={product.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td className="px-4 py-3">
                      <img src={product.image} alt="" className="w-12 h-12 object-cover" />
                    </td>
                    <td className="px-4 py-3 min-w-[200px]">
                      <input
                        value={product.nameUa}
                        onChange={e => updateProduct(product.id, 'nameUa', e.target.value)}
                        className="w-full text-sm bg-transparent outline-none border-b border-transparent hover:border-yellow-700 focus:border-yellow-600 transition-colors text-white py-1"
                        style={{ fontFamily: 'Cormorant Garamond', fontSize: '1rem' }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.price}
                        onChange={e => updateProduct(product.id, 'price', Number(e.target.value))}
                        className="w-24 text-sm bg-transparent outline-none border-b border-transparent hover:border-yellow-700 focus:border-yellow-600 transition-colors text-white py-1"
                        style={{ fontFamily: 'Jost', color: 'var(--gold)' }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={product.status}
                        onChange={e => updateProduct(product.id, 'status', e.target.value as ProductStatus)}
                        className="text-xs py-1 px-2 outline-none bg-transparent border rounded"
                        style={{
                          fontFamily: 'Jost',
                          color: statusLabels[product.status as ProductStatus].color,
                          borderColor: statusLabels[product.status as ProductStatus].color + '50',
                        }}>
                        <option value="in_stock">В наявності</option>
                        <option value="on_order">Під замовлення</option>
                        <option value="sold">Продано</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 uppercase tracking-wider" style={{
                        fontFamily: 'Jost',
                        background: product.material === 'gold' ? 'rgba(201,168,76,0.15)' : 'rgba(168,168,179,0.15)',
                        color: product.material === 'gold' ? '#C9A84C' : '#A8A8B3',
                      }}>
                        {product.material === 'gold' ? 'Золото' : product.material === 'silver' ? 'Срібло' : 'Біжутерія'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
          ⚠️ Зміни зберігаються локально. Для постійного збереження — оновіть файл /data/products.ts
        </p>
      </div>
    </div>
  );
}
