'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { ExtendedProduct } from '@/data/products';
import { statusLabels } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import Ic from '@/components/Icons';
import PhotoSlot from '@/components/PhotoSlot';

/* ============================ static content (from the design) ============================ */
type Cat = { id: string; name: string; glyph: string; count: number; blurb: string };

const CATEGORIES: Cat[] = [
  { id: 'kabluchky', name: 'Каблучки', glyph: '◍', count: 64, blurb: 'Каблучки з золота та срібла' },
  { id: 'serezhky', name: 'Сережки', glyph: '✶', count: 88, blurb: 'Пусети, підвіски, доріжки' },
  { id: 'braslety', name: 'Браслети', glyph: '⌒', count: 47, blurb: 'Ланцюжки та тенісні браслети' },
  { id: 'pidviski', name: 'Підвіски', glyph: '✦', count: 53, blurb: 'Кулони, хрестики, медальйони' },
  { id: 'komplekty', name: 'Комплекти', glyph: '❖', count: 29, blurb: 'Сережки + каблучка в наборі' },
];

const SUBGROUPS: Record<string, string[]> = {
  kabluchky: ['Заручальні', 'Класичні', 'З каменем', 'Доріжки', 'Печатки', 'Тонкі'],
  serezhky: ['Пусети', 'Підвіски', 'Кільця', 'Доріжки', 'Англійський замок', 'Каффи'],
  braslety: ['Ланцюжки', 'Тенісні', 'Глідерні', 'Шкіряні', 'Жорсткі', 'З підвісками'],
  pidviski: ['Кулони', 'Хрестики', 'Медальйони', 'З каменем', 'Іконки', 'Знаки зодіаку'],
  komplekty: ['Класика', 'Весільні', 'Вечірні', 'З перлами', 'З фіанітами', 'Срібні'],
};

const MATERIALS = [
  { id: 'all', name: 'Всі' },
  { id: 'gold', name: 'Золото' },
  { id: 'silver', name: 'Срібло' },
  { id: 'bijouterie', name: 'Біжутерія' },
];

const STATS = [
  { num: '500+', label: 'Задоволених клієнтів' },
  { num: '5+', label: 'Років досвіду' },
  { num: '100%', label: 'Оригінал' },
];

const TRUST = [
  { icon: '🔐', title: 'Безпечна оплата', sub: 'LiqPay / ПриватБанк' },
  { icon: '🚚', title: 'Нова Пошта', sub: 'По всій Україні' },
  { icon: '💎', title: '100% Оригінал', sub: 'Сертифікати якості' },
  { icon: '🔄', title: 'Обмін 14 днів', sub: 'Гарантія повернення' },
];

const PARTNERS = ['Столична Ювелірна Фабрика', 'УКР Золото', 'Золотий Стандарт'];

const FREE_SHIP = 1500;
const fmt = (n: number) => n.toLocaleString('uk-UA') + ' ₴';
const matName = (m: string) => (({ gold: 'Золото', silver: 'Срібло', bijouterie: 'Біжутерія' } as Record<string, string>)[m] || m);
const probe = (m: string) => (m === 'gold' ? ' 585' : m === 'silver' ? ' 925' : '');
const PHONE = '095 777-50-00';
const TEL = '+380957775000';

/* ============================ scroll reveal ============================ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ============================ HEADER ============================ */
function Header({ onCatalog, onCart, cartCount, wishCount, onMenu, scrolled }: {
  onCatalog: () => void; onCart: () => void; cartCount: number; wishCount: number; onMenu: () => void; scrolled: boolean;
}) {
  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap">
        <div className="bar">
          <div className="left">
            <button className="cat-trigger" onClick={onCatalog}>
              <span className="burger"><i /><i /><i /></span>
              <span className="lbl">Каталог</span>
            </button>
            <button className="search-mini" type="button"><Ic.search /> Пошук прикрас…</button>
          </div>
          <a href="#top" className="logo" aria-label="VIALKO">
            <span className="mark">VIALKO</span>
            <span className="sub">Luxury Jewelry</span>
          </a>
          <div className="right">
            <a className="header-phone" href={`tel:${TEL}`}>
              <small>Дзвоніть щодня</small>
              <b>{PHONE}</b>
            </a>
            <button className="icon-btn" title="Кабінет" type="button"><Ic.user /></button>
            <button className="icon-btn" title="Бажане" type="button">
              <Ic.heart />
              {wishCount > 0 && <span className="badge">{wishCount}</span>}
            </button>
            <button className="icon-btn" title="Кошик" type="button" onClick={onCart}>
              <Ic.bag />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            <button className="icon-btn menu-btn" title="Меню" type="button" onClick={onMenu}><Ic.menu /></button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================ HERO ============================ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bg = ref.current;
    if (!bg) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) bg.style.transform = `translateY(${y * 0.28}px) scale(1.04)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="hero" id="top">
      <div className="hero-bg" ref={ref}>
        <PhotoSlot label="hero" />
      </div>
      <div className="wrap">
        <div className="hero-inner">
          <span className="eyebrow">Авторські прикраси</span>
          <h1 className="h-display">
            <span className="ln"><span>Краса у</span></span>
            <span className="ln"><span className="serif-italic">кожній деталі</span></span>
          </h1>
          <div className="diamond">◆</div>
          <p className="lead">Золото 585, срібло 925 та вишукана біжутерія ручної роботи. Доставка по всій Україні Новою Поштою.</p>
          <div className="cta-row">
            <a href="#catalog" className="btn btn-gold">Переглянути колекцію <Ic.arrow /></a>
            <a href={`tel:${TEL}`} className="btn btn-ghost">Зателефонувати</a>
          </div>
          <div className="hero-stats">
            {STATS.map((s) => (
              <div className="st" key={s.label}><b>{s.num}</b><span>{s.label.split(' ')[0]}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-scroll">Гортайте<span className="ln" /></div>
    </section>
  );
}

/* ============================ CATEGORIES ============================ */
function CategoryCard({ cat, delay, onOpen }: { cat: Cat; delay: number; onOpen: (id: string) => void }) {
  return (
    <div className="cat-card reveal" data-d={delay} onClick={() => onOpen(cat.id)}>
      <PhotoSlot label={cat.name} />
      <div className="veil" />
      <span className="glyph">{cat.glyph}</span>
      <div className="body">
        <h3>{cat.name}</h3>
        <div className="meta">{cat.count} виробів</div>
        <span className="go">Перейти <Ic.arrow /></span>
      </div>
    </div>
  );
}

function Categories({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section className="section wrap" id="categories">
      <div className="section-head">
        <span className="eyebrow reveal">Обирайте за категорією</span>
        <h2 className="h-section reveal" data-d="1">Наша колекція</h2>
        <p className="sub reveal" data-d="2">Від делікатних сережок до заручальних каблучок — кожна прикраса створена з любов&apos;ю до деталей.</p>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map((c, i) => (
          <CategoryCard key={c.id} cat={c} delay={(i % 5) + 1} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

/* ============================ PRODUCT CARD ============================ */
function ProductCard({ p, delay, onAdd, onQuick, wished, onWish }: {
  p: ExtendedProduct; delay: number; onAdd: (p: ExtendedProduct) => void; onQuick: (p: ExtendedProduct) => void;
  wished: boolean; onWish: (id: string) => void;
}) {
  const badge = p.badges?.[0];
  const stock = statusLabels[p.status] ?? statusLabels.in_stock;
  return (
    <article className="prod-card reveal" data-d={delay}>
      <div className="prod-media">
        <PhotoSlot className="img-a" src={p.image || null} alt={p.nameUa} label={p.nameUa} />
        <PhotoSlot className="img-b" src={p.image2 || p.image || null} alt={p.nameUa} label="ракурс 2" />
        {badge && <span className={`prod-tag${badge === 'Знижка' || badge === 'Sale' ? ' sale' : ''}`}>{badge}</span>}
        <span className="prod-mat">{matName(p.material)}</span>
        <div className="prod-actions">
          <button className="qa" title="Швидкий перегляд" type="button" onClick={() => onQuick(p)}><Ic.eye /></button>
          <button className="qa" title="У бажане" type="button" onClick={() => onWish(p.id)}>{wished ? <Ic.heartFill /> : <Ic.heart />}</button>
        </div>
        <div className="prod-cart-bar">
          <button className="btn btn-gold btn-sm" style={{ width: '100%' }} type="button" onClick={() => onAdd(p)}>До кошика</button>
        </div>
      </div>
      <div className="prod-info">
        <h3>{p.nameUa}</h3>
        <div className={`stock${p.status === 'sold' ? ' out' : ''}`}>{stock.label}</div>
        <div className="price">
          <span className="now">{fmt(p.price)}</span>
        </div>
      </div>
    </article>
  );
}

/* ============================ CATALOG ============================ */
function Catalog({ products, onAdd, onQuick, wishlist, onWish }: {
  products: ExtendedProduct[]; onAdd: (p: ExtendedProduct) => void; onQuick: (p: ExtendedProduct) => void;
  wishlist: Set<string>; onWish: (id: string) => void;
}) {
  const [mat, setMat] = useState('all');
  const [sort, setSort] = useState('pop');
  const list = useMemo(() => {
    let r = products.filter((p) => mat === 'all' || p.material === mat);
    if (sort === 'asc') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'desc') r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [products, mat, sort]);
  return (
    <section className="section wrap" id="catalog">
      <div className="section-head">
        <span className="eyebrow reveal">Наша колекція</span>
        <h2 className="h-section reveal" data-d="1">Каталог прикрас</h2>
      </div>
      <div className="catalog-controls reveal">
        <div className="filter-pills">
          {MATERIALS.map((m) => (
            <button key={m.id} className={`pill${mat === m.id ? ' active' : ''}`} type="button" onClick={() => setMat(m.id)}>{m.name}</button>
          ))}
        </div>
        <div className="sort-select">
          Сортування
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="pop">Популярні</option>
            <option value="asc">Ціна ↑</option>
            <option value="desc">Ціна ↓</option>
          </select>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="cat-loading">У цій категорії поки немає товарів.</div>
      ) : (
        <div className="prod-grid">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={(i % 4) + 1} onAdd={onAdd} onQuick={onQuick} wished={wishlist.has(p.id)} onWish={onWish} />
          ))}
        </div>
      )}
      <div className="reveal" style={{ textAlign: 'center', marginTop: '54px' }}>
        <a className="btn btn-ghost" href="#catalog">Показати всі прикраси <Ic.arrow /></a>
      </div>
    </section>
  );
}

/* ============================ ABOUT / TRUST / PARTNERS / FOOTER ============================ */
function About() {
  return (
    <section className="section wrap" id="about">
      <div className="about">
        <div className="about-media reveal">
          <PhotoSlot label="майстерня" />
          <div className="frame" />
        </div>
        <div className="about-copy">
          <span className="eyebrow reveal">Про нас</span>
          <h2 className="h-section reveal" data-d="1" style={{ marginTop: '18px' }}>Прикраси <span className="serif-italic">зі серця</span></h2>
          <p className="reveal" data-d="2">Кожна прикраса VIALKO — це авторська робота з любов&apos;ю до деталей. Ми працюємо із золотом 585 проби, срібом 925, натуральними перлами та кристалами найвищої якості.</p>
          <p className="reveal" data-d="2">Доставляємо по всій Україні Новою Поштою. Оплата зручним способом — карткою або накладеним платежем, доступна оплата частинами від ПриватБанку.</p>
          <div className="about-mini reveal" data-d="3">
            <div className="m"><b>585</b><span>проба золота</span></div>
            <div className="m"><b>925</b><span>проба срібла</span></div>
            <div className="m"><b>14 днів</b><span>на обмін</span></div>
          </div>
          <div className="sign reveal" data-d="3">— майстер VIALKO</div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="trust">
      <div className="wrap">
        {TRUST.map((t) => (
          <div className="t" key={t.title}>
            <span className="ic">{t.icon}</span>
            <div><b>{t.title}</b><span>{t.sub}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="section wrap partners">
      <span className="eyebrow solo reveal">Нам довіряють</span>
      <div className="rule reveal" data-d="1" style={{ margin: '22px 0 0' }}>◆</div>
      <div className="row reveal" data-d="2">
        {PARTNERS.map((p) => <span className="p" key={p}>{p}</span>)}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="top">
          <div className="brand">
            <div className="mark">VIALKO</div>
            <div className="sub">✦ Luxury Jewelry ✦</div>
            <p>Авторські прикраси з золота, срібла та вишукана біжутерія. Краса у кожній деталі.</p>
          </div>
          <div>
            <h4>Каталог</h4>
            <ul>{CATEGORIES.map((c) => <li key={c.id}><a href="#categories">{c.name}</a></li>)}</ul>
          </div>
          <div>
            <h4>Інформація</h4>
            <ul>
              <li><a href="#about">Про нас</a></li>
              <li><a href="#">Доставка та оплата</a></li>
              <li><a href="#">Обмін і повернення</a></li>
              <li><a href="#">Гарантія</a></li>
              <li><a href="#">Контакти</a></li>
            </ul>
          </div>
          <div>
            <h4>Контакти</h4>
            <ul>
              <li><a href={`tel:${TEL}`}>+38 (095) 777-50-00</a></li>
              <li>info@vialko.com.ua</li>
              <li>Доставка Новою Поштою<br />по всій Україні</li>
            </ul>
          </div>
        </div>
        <div className="pay">
          <span>© 2025 VIALKO. Всі права захищені.</span>
          <div className="cards"><span>Visa</span><span>Mastercard</span><span>LiqPay</span><span>ПриватБанк</span></div>
        </div>
      </div>
    </footer>
  );
}

/* ============================ CATALOG PANEL ============================ */
function CatalogPanel({ open, onClose, activeCat, setActiveCat, onJumpToCatalog }: {
  open: boolean; onClose: () => void; activeCat: string; setActiveCat: (id: string) => void; onJumpToCatalog: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === activeCat) || CATEGORIES[0];
  const subs = SUBGROUPS[cat.id] || [];
  const goldN = Math.round(cat.count * 0.58);
  const silverN = cat.count - goldN;
  const filters = ['Метал', 'Проба', 'Вставка', 'Колір металу', 'Для кого', 'Ціна'];
  return (
    <aside className={`catalog-panel${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="cp-rail">
        <div className="cp-logo">
          <div className="mark">VIALKO</div>
          <div className="sub">Каталог товарів</div>
        </div>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`cp-cat${c.id === activeCat ? ' active' : ''}`} type="button" onClick={() => setActiveCat(c.id)}>
            <span className="cg">{c.glyph}</span>
            {c.name}
            <span className="cnt">{c.count}</span>
          </button>
        ))}
      </div>
      <div className="cp-main">
        <button className="icon-btn cp-close" type="button" onClick={onClose}><Ic.close /></button>
        <div className="cp-top">
          <h2>{cat.name}</h2>
          <div className="cp-tabs">
            <a href="#catalog" onClick={onClose}>Комплекти</a>
            <a href="#catalog" onClick={onClose}>Колекція</a>
            <a href="#catalog" onClick={onClose}>Всі {cat.name.toLowerCase()}</a>
          </div>
        </div>
        <div className="cp-counts">
          <div className="cc gold"><b>{goldN}</b><span>виробів · Золото 585</span></div>
          <div className="cc silver"><b>{silverN}</b><span>виробів · Срібло 925</span></div>
        </div>
        <div className="cp-sub-grid">
          {subs.map((s) => (
            <button className="cp-sub" key={s} type="button" onClick={() => { onClose(); onJumpToCatalog(); }}>
              <span className="sg-ic">{cat.glyph}</span>
              <b>{s}</b>
            </button>
          ))}
        </div>
        <div className="cp-filters">
          {filters.map((f) => (
            <div className="cp-frow" key={f}>
              <span className="pls">+</span>
              <span className="lbl">{f}</span>
              <span className="all">ВСІ</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ============================ CART DRAWER (wired to Zustand store) ============================ */
function CartDrawer({ open, onClose, items, onQty, onRemove }: {
  open: boolean; onClose: () => void;
  items: { id: string; nameUa: string; material: string; price: number; quantity: number; image: string }[];
  onQty: (id: string, q: number) => void; onRemove: (id: string) => void;
}) {
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const count = items.reduce((s, it) => s + it.quantity, 0);
  const left = Math.max(0, FREE_SHIP - total);
  const pct = Math.min(100, (total / FREE_SHIP) * 100);
  return (
    <aside className={`cart-drawer${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="cart-head">
        <h3>Кошик <span className="n">{count} шт</span></h3>
        <button className="icon-btn" type="button" onClick={onClose}><Ic.close /></button>
      </div>
      {items.length === 0 ? (
        <div className="cart-empty">
          <span className="big">◆</span>
          <p>Ваш кошик порожній.<br />Оберіть прикрасу до душі.</p>
          <button className="btn btn-ghost btn-sm" type="button" onClick={onClose}>До каталогу</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((it) => (
              <div className="cart-row" key={it.id}>
                <PhotoSlot src={it.image || null} alt={it.nameUa} label=" " style={{ borderRadius: 10 }} />
                <div>
                  <div className="nm">{it.nameUa}</div>
                  <div className="mt">{matName(it.material)}</div>
                  <div className="qty">
                    <button type="button" onClick={() => onQty(it.id, it.quantity - 1)}>−</button>
                    <span>{it.quantity}</span>
                    <button type="button" onClick={() => onQty(it.id, it.quantity + 1)}>+</button>
                  </div>
                </div>
                <div>
                  <div className="pr">{fmt(it.price * it.quantity)}</div>
                  <button className="rm" type="button" onClick={() => onRemove(it.id)}>Видалити</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-foot">
            <div className="ship-note">
              {left > 0 ? <>До безкоштовної доставки: <b>{fmt(left)}</b></> : <>✦ Безкоштовна доставка активована</>}
            </div>
            <div className="bar"><i style={{ width: pct + '%' }} /></div>
            <div className="tot"><span>Разом</span><b>{fmt(total)}</b></div>
            <a className="btn btn-gold" href="/checkout">Оформити замовлення <Ic.arrow /></a>
          </div>
        </>
      )}
    </aside>
  );
}

/* ============================ QUICK VIEW ============================ */
function QuickView({ p, onClose, onAdd }: { p: ExtendedProduct | null; onClose: () => void; onAdd: (p: ExtendedProduct) => void }) {
  const stock = p ? statusLabels[p.status] ?? statusLabels.in_stock : statusLabels.in_stock;
  return (
    <div className={`qv-wrap${p ? ' show' : ''}`} onClick={onClose}>
      {p && (
        <div className="qv" onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn qv-close" type="button" onClick={onClose}><Ic.close /></button>
          <div className="qv-media">
            <PhotoSlot src={p.image || null} alt={p.nameUa} label={p.nameUa} />
          </div>
          <div className="qv-body">
            <div className="mat">{matName(p.material)}</div>
            <h2>{p.nameUa}</h2>
            <p className="desc">{p.description}</p>
            <div className="price">
              <span className="now">{fmt(p.price)}</span>
            </div>
            <div className="specs">
              <div className="sp"><span>Метал</span><b>{matName(p.material)}{probe(p.material)}</b></div>
              <div className="sp"><span>Наявність</span><b>{stock.label}</b></div>
              <div className="sp"><span>Доставка</span><b>Нова Пошта, 1–2 дні</b></div>
            </div>
            <div className="qv-cta">
              <button className="btn btn-gold" style={{ flex: 1 }} type="button" onClick={() => { onAdd(p); onClose(); }}>До кошика</button>
              <a href={`tel:${TEL}`} className="btn btn-ghost">Купити в 1 клік</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================ ROOT ============================ */
export default function Storefront({ initialProducts }: { initialProducts: ExtendedProduct[] }) {
  const products = initialProducts;

  const [scrolled, setScrolled] = useState(false);
  const [topHide, setTopHide] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [activeCat, setActiveCat] = useState('kabluchky');
  const [mnavOpen, setMnavOpen] = useState(false);
  const [quick, setQuick] = useState<ExtendedProduct | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());

  // cart from the existing Zustand store
  const items = useCartStore((s) => s.items);
  const cartOpen = useCartStore((s) => s.isOpen);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useReveal();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setTopHide(y > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeCart = useCallback(() => { if (useCartStore.getState().isOpen) toggleCart(); }, [toggleCart]);

  const anyOverlay = catalogOpen || cartOpen || mnavOpen || !!quick;
  useEffect(() => { document.body.style.overflow = anyOverlay ? 'hidden' : ''; }, [anyOverlay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCatalogOpen(false); setMnavOpen(false); setQuick(null); closeCart(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  const addToCart = useCallback((p: ExtendedProduct) => { addItem(p); }, [addItem]);
  const toggleWish = useCallback((id: string) => setWishlist((w) => { const n = new Set(w); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const openCatalog = useCallback((id?: string) => { if (id) setActiveCat(id); setCatalogOpen(true); }, []);
  const jumpToCatalog = useCallback(() => {
    const el = document.getElementById('catalog');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  }, []);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const closeAll = () => { setCatalogOpen(false); setMnavOpen(false); closeCart(); };

  return (
    <>
      <div className={`topbar${topHide ? ' hide' : ''}`}>
        <div className="wrap">
          <div className="ship"><span className="marquee-glyph">✦</span> Безкоштовна доставка від <b>1 500 ₴</b> · Оплата частинами ПриватБанк</div>
          <div className="links">
            <a href="#about">Про нас</a>
            <a href="#">Наші магазини</a>
            <a href="#">Акції</a>
            <a href="#">УКР</a>
          </div>
        </div>
      </div>

      <Header
        onCatalog={() => setCatalogOpen(true)}
        onCart={toggleCart}
        onMenu={() => setMnavOpen(true)}
        cartCount={cartCount}
        wishCount={wishlist.size}
        scrolled={scrolled}
      />

      <main>
        <Hero />
        <Categories onOpen={openCatalog} />
        <Catalog products={products} onAdd={addToCart} onQuick={setQuick} wishlist={wishlist} onWish={toggleWish} />
        <About />
        <Trust />
        <Partners />
      </main>
      <Footer />

      <nav className={`mnav${mnavOpen ? ' open' : ''}`}>
        <button className="icon-btn" style={{ alignSelf: 'flex-end' }} type="button" onClick={() => setMnavOpen(false)}><Ic.close /></button>
        <a href="#catalog" onClick={() => setMnavOpen(false)}>Каталог</a>
        {CATEGORIES.map((c) => <a key={c.id} href="#categories" onClick={() => setMnavOpen(false)}>{c.name}</a>)}
        <a href="#about" onClick={() => setMnavOpen(false)}>Про нас</a>
        <a href={`tel:${TEL}`} onClick={() => setMnavOpen(false)}>{PHONE}</a>
      </nav>

      <CatalogPanel open={catalogOpen} onClose={() => setCatalogOpen(false)} activeCat={activeCat} setActiveCat={setActiveCat} onJumpToCatalog={jumpToCatalog} />
      <CartDrawer open={cartOpen} onClose={closeCart} items={items} onQty={updateQuantity} onRemove={removeItem} />
      <QuickView p={quick} onClose={() => setQuick(null)} onAdd={addToCart} />

      <div className={`scrim${anyOverlay ? ' show' : ''}`} onClick={() => { closeAll(); setQuick(null); }} />
    </>
  );
}
