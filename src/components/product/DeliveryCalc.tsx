'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Truck, Search } from 'lucide-react';
import { SITE } from '@/lib/site';
import { money } from '@/lib/format';

interface City {
  Ref: string;
  Description: string;
}

/** Калькулятор доставки: місто → відділення Нової пошти, термін, вартість (використовує існуючі API-роути) */
export default function DeliveryCalc({ price }: { price: number }) {
  const [q, setQ] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (city || q.trim().length < 2) {
      setCities([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/novaposhta/cities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ search: q.trim() }) });
        const d = await r.json();
        setCities((d.data as City[]) || []);
        setOpen(true);
      } catch {
        setCities([]);
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [q, city]);

  useEffect(() => {
    if (!city) return;
    setPoints(null);
    fetch('/api/novaposhta/warehouses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cityRef: city.Ref }) })
      .then((r) => r.json())
      .then((d) => setPoints(Array.isArray(d.data) ? d.data.length : 0))
      .catch(() => setPoints(0));
  }, [city]);

  const free = price >= SITE.freeShippingFrom;

  return (
    <div className="rounded-2xl border border-line p-5">
      <p className="flex items-center gap-2 text-sm font-extrabold">
        <Truck size={18} className="text-gold-deep" /> Розрахунок доставки
      </p>
      <div ref={box} className="relative mt-3">
        <label htmlFor="dc-city" className="sr-only">
          Ваше місто
        </label>
        <input
          id="dc-city"
          className="input h-11 pl-10 text-sm"
          placeholder="Введіть ваше місто"
          value={city ? city.Description : q}
          autoComplete="off"
          onChange={(e) => {
            setCity(null);
            setQ(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
        {open && !city && (loading || cities.length > 0) && (
          <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-56 overflow-auto rounded-xl border border-line bg-white py-1 shadow-[var(--shadow-soft)]">
            {loading && <li className="px-4 py-2 text-sm text-ink-3">Пошук…</li>}
            {cities.map((c) => (
              <li key={c.Ref}>
                <button type="button" className="block w-full px-4 py-2 text-left text-sm hover:bg-mist" onMouseDown={(e) => e.preventDefault()} onClick={() => setCity(c)}>
                  {c.Description}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="mt-4 space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <MapPin size={17} className="mt-0.5 flex-none text-ink-3" />
          <span>
            <b>Нова пошта — відділення або поштомат</b>
            <span className="block text-ink-2">
              {city
                ? points == null
                  ? 'Перевіряємо відділення…'
                  : points > 0
                    ? `У місті ${points >= 100 ? '100+' : points} відділень і поштоматів · зазвичай 1–3 дні`
                    : 'Уточнимо найближче відділення при підтвердженні'
                : 'Зазвичай 1–3 дні по Україні'}
            </span>
          </span>
          <span className={`ml-auto whitespace-nowrap font-bold ${free ? 'text-ok' : ''}`}>{free ? 'Безкоштовно' : 'за тарифом НП'}</span>
        </li>
      </ul>
      {!free && (
        <p className="mt-4 rounded-xl bg-ivory px-3 py-2 text-[12.5px] text-ink-2">
          Додайте ще <b className="text-ink">{money(SITE.freeShippingFrom - price)}</b> — і доставка буде безкоштовною.
        </p>
      )}
    </div>
  );
}
