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

        {/* Trust section */}
        <section className="py-16 px-6" style={{ background: 'var(--charcoal)' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🔐', title: 'Безпечна оплата', desc: 'LiqPay / ПриватБанк' },
              { icon: '🚚', title: 'Нова Пошта', desc: 'Доставка по всій Україні' },
              { icon: '💎', title: '100% Оригінал', desc: 'Сертифікати якості' },
              { icon: '🔄', title: 'Обмін 14 днів', desc: 'Гарантія повернення' },
            ].map(item => (
              <div key={item.title} className="p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-white mb-1" style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem' }}>
                  {item.title}
                </h4>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Jost' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
