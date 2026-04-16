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
        <section className="py-20 px-6" style={{ background: 'white' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              ✦ Про нас ✦
            </p>
            <h2 className="text-4xl md:text-5xl mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
              Прикраси зі серця
            </h2>
            <div className="ornament-divider max-w-xs mx-auto mb-8">
              <span style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.3em', fontFamily: 'Jost' }}>◆</span>
            </div>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--stone)', fontFamily: 'Jost', fontWeight: 300 }}>
              Кожна прикраса VIALKO — це авторська робота з любов&apos;ю до деталей. Ми працюємо з золотом 585 проби,
              срібом 925, натуральними перлами та кристалами найвищої якості.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--stone)', fontFamily: 'Jost', fontWeight: 300 }}>
              Доставляємо по всій Україні Новою Поштою. Оплата зручним для вас способом — карткою ПриватБанку або накладеним платежем.
            </p>
            <div className="mt-10">
              <a href="tel:+380957775000" className="btn-gold px-10 py-4 inline-block">
                Зателефонувати: +38 (095) 777-50-00
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
