import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" style={{ background: 'var(--dark)', color: 'white' }}>
      {/* Top ornament */}
      <div className="text-center pt-12 pb-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-24" style={{ background: 'linear-gradient(to right, transparent, var(--gold))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.4em', fontFamily: 'Jost' }}>◆ VIALKO ◆</span>
          <div className="h-px w-24" style={{ background: 'linear-gradient(to left, transparent, var(--gold))' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-4xl mb-2 gold-gradient" style={{ fontFamily: 'Cormorant Garamond', letterSpacing: '0.1em' }}>
              VIALKO
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--gold)', fontFamily: 'Jost', letterSpacing: '0.2em' }}>
              LUXURY JEWELRY
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Jost', fontWeight: 300 }}>
              Авторські прикраси з золота, срібла та вишукана біжутерія. Кожен виріб — це маленька історія краси.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              Каталог
            </h4>
            {['Каблучки', 'Сережки', 'Браслети', 'Підвіски', 'Комплекти'].map(item => (
              <a key={item} href="#catalog"
                className="block text-sm py-1.5 transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Jost', fontWeight: 300 }}>
                {item}
              </a>
            ))}
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              Інформація
            </h4>
            {['Про нас', 'Доставка та оплата', 'Обмін та повернення', 'Гарантія якості'].map(item => (
              <a key={item} href="#about"
                className="block text-sm py-1.5 transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Jost', fontWeight: 300 }}>
                {item}
              </a>
            ))}
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              Контакти
            </h4>
            <div className="space-y-3">
              <a href="tel:+380957775000"
                className="flex items-center gap-3 text-sm transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Jost', fontWeight: 300 }}>
                <Phone size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                +38 (095) 777-50-00
              </a>
              <div className="flex items-center gap-3 text-sm"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Jost', fontWeight: 300 }}>
                <Mail size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                info@vialko.com.ua
              </div>
              <div className="flex items-start gap-3 text-sm"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Jost', fontWeight: 300 }}>
                <MapPin size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                Доставка по всій Україні<br />Нова Пошта
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 mb-8"
          style={{ borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          {[
            { icon: '🔐', title: 'Безпечна оплата', desc: 'LiqPay / ПриватБанк' },
            { icon: '🚚', title: 'Нова Пошта', desc: 'По всій Україні' },
            { icon: '💎', title: '100% Оригінал', desc: 'Сертифікати якості' },
            { icon: '🔄', title: 'Обмін 14 днів', desc: 'Гарантія повернення' },
          ].map(item => (
            <div key={item.title} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'white', fontFamily: 'Jost', fontWeight: 400 }}>
                {item.title}
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Jost' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Jost' }}>
            © 2025 VIALKO. Всі права захищені.
          </p>
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
              alt="Mastercard" className="h-5 opacity-40" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa" className="h-4 opacity-40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
