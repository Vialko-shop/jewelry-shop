'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Search, CheckCircle, ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import PhotoSlot from '@/components/PhotoSlot';
import { FreeShipBar } from '@/components/Cart';
import { PayBadge } from '@/components/Icons';
import { useHydrated } from '@/lib/useHydrated';
import { categoryByKey } from '@/lib/taxonomy';
import { SITE } from '@/lib/site';

// ⚠️ Логіка оформлення (Nova Poshta + /api/orders + LiqPay) не змінена — оновлено лише вигляд.

interface NpCity { Ref: string; Description: string; }
interface NpWarehouse { Ref: string; Description: string; Number: string; }

const fmt = (n: number) => `${n.toLocaleString('uk-UA')} ₴`;

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 md:p-7">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-extrabold">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CheckoutPage() {
  const hydrated = useHydrated();
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
      <div className="wrap grid min-h-[60vh] place-items-center py-16 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-soft text-gold-deep">
            <CheckCircle size={40} />
          </span>
          <h1 className="display mt-6 text-5xl">Дякуємо!</h1>
          <p className="mt-3 text-ink-2">Ваше замовлення прийнято. Ми зв&apos;яжемося з вами найближчим часом.</p>
          <Link href="/" className="btn btn-ink mt-8">На головну</Link>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="wrap py-10">
        <div className="skeleton h-10 w-72 rounded-xl" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="skeleton h-[520px] rounded-2xl" />
          <div className="skeleton h-[420px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="wrap grid min-h-[55vh] place-items-center py-16 text-center">
        <div>
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ivory text-gold-deep">
            <ShoppingBag size={34} strokeWidth={1.4} />
          </span>
          <p className="display mt-6 text-4xl">Кошик порожній</p>
          <p className="mt-2 text-ink-2">Додайте прикраси, щоб оформити замовлення.</p>
          <Link href="/catalog" className="btn btn-ink mt-7">Перейти до каталогу</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory">
      <div className="wrap py-6 md:py-10">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-2 hover:text-ink">
          <ArrowLeft size={16} /> Повернутись до каталогу
        </Link>
        <h1 className="display mt-4 text-[38px] md:text-[52px]">Оформлення замовлення</h1>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
            <div className="space-y-5">
              <Step n={1} title="Контактна інформація">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { key: 'lastName', label: 'Прізвище', placeholder: 'Петренко', auto: 'family-name' },
                    { key: 'firstName', label: "Ім'я", placeholder: 'Олена', auto: 'given-name' },
                    { key: 'phone', label: 'Телефон', placeholder: '+380 XX XXX XX XX', auto: 'tel' },
                    { key: 'email', label: 'Email', placeholder: 'your@email.com', auto: 'email' },
                  ].map(field => (
                    <div key={field.key} className="field">
                      <label className="label" htmlFor={`co-${field.key}`}>{field.label} *</label>
                      <input
                        id={`co-${field.key}`}
                        type={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'text'}
                        required
                        autoComplete={field.auto}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="input"
                      />
                    </div>
                  ))}
                </div>
              </Step>

              <Step n={2} title="Доставка Новою поштою">
                <div className="field relative">
                  <label className="label" htmlFor="co-city">Місто *</label>
                  <div className="relative">
                    <input
                      id="co-city"
                      type="text"
                      required={!form.cityRef}
                      autoComplete="off"
                      placeholder="Почніть вводити назву міста..."
                      value={form.citySearch}
                      onChange={e => {
                        setForm(prev => ({ ...prev, citySearch: e.target.value, cityRef: '', cityName: '', warehouseRef: '', warehouseName: '' }));
                        setWarehouses([]);
                      }}
                      className="input pr-10"
                    />
                    <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
                  </div>

                  {cityLoading && <p className="mt-1 text-xs text-ink-3">Пошук...</p>}

                  {showCities && cities.length > 0 && !form.cityRef && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-[var(--shadow-soft)]">
                      {cities.map(city => (
                        <button key={city.Ref} type="button"
                          className="block w-full px-4 py-2.5 text-left text-sm hover:bg-mist"
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
                    <p className="mt-1 text-xs font-semibold text-ok">✓ Обрано: {form.cityName}</p>
                  )}
                </div>

                {form.cityRef && (
                  <div className="field mt-4">
                    <label className="label" htmlFor="co-wh">Відділення / Поштомат *</label>
                    {warehouseLoading ? (
                      <p className="text-sm text-ink-3">Завантаження відділень...</p>
                    ) : (
                      <select
                        id="co-wh"
                        required
                        value={form.warehouseRef}
                        onChange={e => {
                          const w = warehouses.find(w => w.Ref === e.target.value);
                          setForm(prev => ({ ...prev, warehouseRef: e.target.value, warehouseName: w?.Description || '' }));
                        }}
                        className="select">
                        <option value="">Оберіть відділення</option>
                        {warehouses.map(w => (
                          <option key={w.Ref} value={w.Ref}>
                            {w.Description}
                          </option>
                        ))}
                      </select>
                    )}
                    {showWarehouses && !warehouseLoading && warehouses.length === 0 && (
                      <p className="mt-1 text-xs text-ink-3">Відділень не знайдено — оберіть сусіднє місто або зателефонуйте нам: {SITE.phone}.</p>
                    )}
                  </div>
                )}
              </Step>

              <Step n={3} title="Коментар до замовлення">
                <label className="sr-only" htmlFor="co-comment">Коментар</label>
                <textarea
                  id="co-comment"
                  rows={3}
                  placeholder="Розмір, побажання до пакування, зручний час для дзвінка…"
                  value={form.comment}
                  onChange={e => setForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="textarea"
                />
              </Step>
            </div>

            <aside className="lg:sticky lg:top-[140px] lg:self-start">
              <div className="rounded-2xl border border-line bg-white p-5 md:p-7">
                <h2 className="font-display text-2xl font-semibold">Ваше замовлення</h2>
                <ul className="mt-5 space-y-4">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-3">
                      <span className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-[#f6f3ee]">
                        <PhotoSlot src={item.image || null} alt={item.nameUa} sizes="64px" icon={categoryByKey(item.category)?.icon} label="" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug">{item.nameUa}</p>
                        <p className="text-xs text-ink-3">
                          {item.quantity} × {fmt(item.price)}{item.selectedSize ? ` · розмір ${item.selectedSize}` : ''}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-bold">{fmt(item.price * item.quantity)}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 space-y-3 border-t border-line pt-5">
                  <FreeShipBar total={total} />
                  <div className="flex justify-between text-sm text-ink-2">
                    <span>Доставка</span>
                    <span className="font-semibold">{total >= SITE.freeShippingFrom ? 'Безкоштовно' : 'За тарифами НП'}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold uppercase tracking-[.14em] text-ink-3">Разом</span>
                    <span className="text-3xl font-extrabold tracking-tight">{fmt(total)}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-gold btn-lg btn-block mt-6">
                  <Lock size={17} /> {loading ? 'Обробка...' : 'Оплатити через LiqPay'}
                </button>

                <div className="mt-4 text-center text-xs text-ink-3">
                  <p>Оплата захищена · дані картки вводяться на сторінці LiqPay</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <PayBadge>VISA</PayBadge>
                    <PayBadge>Mastercard</PayBadge>
                    <PayBadge>LiqPay</PayBadge>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
