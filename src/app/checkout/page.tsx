'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Search, ChevronDown, CheckCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Link from 'next/link';

interface NpCity { Ref: string; Description: string; }
interface NpWarehouse { Ref: string; Description: string; Number: string; }

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    citySearch: '', cityRef: '', cityName: '',
    warehouseRef: '', warehouseName: '',
    comment: '',
  });

  const [cities, setCities] = useState<NpCity[]>([]);
  const [warehouses, setWarehouses] = useState<NpWarehouse[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [showWarehouses, setShowWarehouses] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search Nova Poshta cities
  useEffect(() => {
    if (form.citySearch.length < 2) { setCities([]); return; }
    const timer = setTimeout(async () => {
      setCityLoading(true);
      try {
        const res = await fetch('/api/novaposhta/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search: form.citySearch }),
        });
        const data = await res.json();
        setCities(data.data || []);
        setShowCities(true);
      } catch { setCities([]); }
      setCityLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [form.citySearch]);

  // Load warehouses when city selected
  useEffect(() => {
    if (!form.cityRef) return;
    setWarehouseLoading(true);
    fetch('/api/novaposhta/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityRef: form.cityRef }),
    })
      .then(r => r.json())
      .then(data => { setWarehouses(data.data || []); setShowWarehouses(true); })
      .catch(() => setWarehouses([]))
      .finally(() => setWarehouseLoading(false));
  }, [form.cityRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items, total }),
      });
      const data = await res.json();
      if (data.success) {
        // Initiate LiqPay payment
        const payRes = await fetch('/api/liqpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderId, amount: total, description: `Замовлення #${data.orderId}` }),
        });
        const payData = await payRes.json();
        if (payData.checkoutUrl) {
          window.location.href = payData.checkoutUrl;
        } else {
          setSubmitted(true);
          clearCart();
        }
      }
    } catch (err) {
      console.error(err);
      alert('Помилка. Спробуйте ще раз.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
          <div className="text-center max-w-md">
            <CheckCircle size={60} className="mx-auto mb-6" style={{ color: 'var(--gold)' }} />
            <h1 className="text-4xl mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>Дякуємо!</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
              Ваше замовлення прийнято. Ми зв&apos;яжемося з вами найближчим часом.
            </p>
            <Link href="/" className="btn-gold px-8 py-3 inline-block">
              На головну
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
          <div className="text-center">
            <p className="text-2xl mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>Кошик порожній</p>
            <Link href="/" className="btn-gold px-8 py-3 inline-block">Перейти до каталогу</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Cart />
      <div className="min-h-screen py-12 px-6" style={{ background: 'var(--cream)' }}>
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-xs tracking-widest uppercase mb-8 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
            <ArrowLeft size={14} /> Повернутись до каталогу
          </Link>

          <h1 className="text-4xl mb-10" style={{ fontFamily: 'Cormorant Garamond' }}>Оформлення замовлення</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Contact */}
                <div style={{ background: 'white', border: '1px solid var(--gold-light)' }} className="p-6">
                  <h2 className="text-xl mb-6" style={{ fontFamily: 'Cormorant Garamond' }}>Контактна інформація</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'lastName', label: "Прізвище", placeholder: "Петренко" },
                      { key: 'firstName', label: "Ім'я", placeholder: "Олена" },
                      { key: 'phone', label: "Телефон", placeholder: "+380 XX XXX XX XX" },
                      { key: 'email', label: "Email", placeholder: "your@email.com" },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs tracking-widest uppercase mb-2"
                          style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                          {field.label} *
                        </label>
                        <input
                          type={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'text'}
                          required
                          placeholder={field.placeholder}
                          value={form[field.key as keyof typeof form]}
                          onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full px-4 py-3 text-sm outline-none"
                          style={{ border: '1px solid var(--gold-light)', background: 'var(--cream)', fontFamily: 'Jost' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                <div style={{ background: 'white', border: '1px solid var(--gold-light)' }} className="p-6">
                  <h2 className="text-xl mb-6" style={{ fontFamily: 'Cormorant Garamond' }}>
                    🚚 Доставка Новою Поштою
                  </h2>
                  
                  {/* City search */}
                  <div className="mb-4 relative">
                    <label className="block text-xs tracking-widest uppercase mb-2"
                      style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                      Місто *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required={!form.cityRef}
                        placeholder="Почніть вводити назву міста..."
                        value={form.citySearch}
                        onChange={e => {
                          setForm(prev => ({ ...prev, citySearch: e.target.value, cityRef: '', cityName: '', warehouseRef: '', warehouseName: '' }));
                          setWarehouses([]);
                        }}
                        className="w-full px-4 py-3 text-sm outline-none pr-10"
                        style={{ border: '1px solid var(--gold-light)', background: 'var(--cream)', fontFamily: 'Jost' }}
                      />
                      <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--stone)' }} />
                    </div>
                    
                    {cityLoading && (
                      <p className="text-xs mt-1 text-center" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                        Пошук...
                      </p>
                    )}

                    {showCities && cities.length > 0 && !form.cityRef && (
                      <div className="absolute z-20 w-full mt-1 max-h-48 overflow-y-auto"
                        style={{ background: 'white', border: '1px solid var(--gold-light)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                        {cities.map(city => (
                          <button key={city.Ref} type="button"
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-amber-50 transition-colors"
                            style={{ fontFamily: 'Jost', borderBottom: '1px solid var(--gold-light)' }}
                            onClick={() => {
                              setForm(prev => ({ ...prev, cityRef: city.Ref, cityName: city.Description, citySearch: city.Description }));
                              setShowCities(false);
                            }}>
                            {city.Description}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {form.cityName && (
                      <p className="text-xs mt-1" style={{ color: 'var(--gold-dark)', fontFamily: 'Jost' }}>
                        ✓ Обрано: {form.cityName}
                      </p>
                    )}
                  </div>

                  {/* Warehouse */}
                  {form.cityRef && (
                    <div className="relative">
                      <label className="block text-xs tracking-widest uppercase mb-2"
                        style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                        Відділення / Поштомат *
                      </label>
                      
                      {warehouseLoading ? (
                        <p className="text-sm" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                          Завантаження відділень...
                        </p>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            value={form.warehouseRef}
                            onChange={e => {
                              const w = warehouses.find(w => w.Ref === e.target.value);
                              setForm(prev => ({ ...prev, warehouseRef: e.target.value, warehouseName: w?.Description || '' }));
                            }}
                            className="w-full px-4 py-3 text-sm outline-none appearance-none"
                            style={{ border: '1px solid var(--gold-light)', background: 'var(--cream)', fontFamily: 'Jost' }}>
                            <option value="">Оберіть відділення</option>
                            {warehouses.map(w => (
                              <option key={w.Ref} value={w.Ref}>
                                {w.Description}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'var(--stone)' }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Comment */}
                <div style={{ background: 'white', border: '1px solid var(--gold-light)' }} className="p-6">
                  <label className="block text-xs tracking-widest uppercase mb-2"
                    style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                    Коментар до замовлення
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Будь-які побажання щодо замовлення..."
                    value={form.comment}
                    onChange={e => setForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-4 py-3 text-sm outline-none resize-none"
                    style={{ border: '1px solid var(--gold-light)', background: 'var(--cream)', fontFamily: 'Jost' }}
                  />
                </div>
              </div>

              {/* Right: Order summary */}
              <div className="space-y-6">
                <div style={{ background: 'white', border: '1px solid var(--gold-light)' }} className="p-6 sticky top-24">
                  <h2 className="text-xl mb-6" style={{ fontFamily: 'Cormorant Garamond' }}>Ваше замовлення</h2>
                  
                  <div className="space-y-3 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.nameUa} className="w-14 h-14 object-cover flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm leading-tight" style={{ fontFamily: 'Cormorant Garamond', fontSize: '0.95rem' }}>
                            {item.nameUa}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                            {item.quantity} × {item.price.toLocaleString('uk-UA')} ₴
                          </p>
                        </div>
                        <p className="text-sm" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold-dark)' }}>
                          {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4" style={{ borderTop: '1px solid var(--gold-light)' }}>
                    <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                      <span>Доставка</span>
                      <span>За тарифами НП</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'Jost', color: 'var(--stone)' }}>
                        РАЗОМ
                      </span>
                      <span className="text-2xl" style={{ fontFamily: 'Cormorant Garamond', color: 'var(--dark)' }}>
                        {total.toLocaleString('uk-UA')} ₴
                      </span>
                    </div>
                  </div>

                  <button type="submit"
                    disabled={loading}
                    className="btn-gold w-full py-4 px-6 mt-6 disabled:opacity-50">
                    {loading ? 'Обробка...' : '💳 Оплатити через LiqPay'}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-xs" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                      Оплата захищена 🔒 SSL
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
                      Visa / MasterCard / ПриватБанк
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
