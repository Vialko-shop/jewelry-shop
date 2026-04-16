import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Cart />
      <main>
        <Hero />
        <Catalog />

        {/* About section */}
        <section id="about" style={{ padding: 'clamp(72px, 8vw, 108px) 24px', background: 'white' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <p className="section-label" style={{ marginBottom: 20 }}>✦ Про нас ✦</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '0.06em', fontWeight: 400, marginBottom: 24 }}>
              Прикраси зі серця
            </h2>
            <div style={{ width: 40, height: '0.5px', background: 'var(--gold)', margin: '0 auto 32px' }} />
            <p style={{ fontSize: '0.9rem', lineHeight: 1.9, color: 'var(--stone)', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: 16 }}>
              Кожна прикраса VIALKO — це авторська робота з любов&apos;ю до деталей. Ми працюємо з золотом 585 проби,
              срібом 925, натуральними перлами та кристалами найвищої якості.
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.9, color: 'var(--stone)', fontFamily: 'var(--font-sans)', fontWeight: 300, marginBottom: 48 }}>
              Доставляємо по всій Україні Новою Поштою. Оплата зручним способом — карткою або накладеним платежем.
            </p>
            <a href="tel:+380957775000" className="btn-primary">
              <span>+38 (095) 777-50-00</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
