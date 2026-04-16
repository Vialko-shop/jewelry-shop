import { Phone, Mail, MapPin } from 'lucide-react';

// Partner logos - direct Google Drive viewer URLs
const PARTNERS = [
  {
    name: 'Столична Ювелірна Фабрика',
    // Using local file downloaded from Google Drive
    src: '/logos/logo1.jpg',
  },
  {
    name: 'УКР Золото',
    src: 'https://drive.google.com/thumbnail?id=1bwZQjW4iZuiWlnopPMd506JVAqqjkASC&sz=w400',
  },
  {
    name: 'Золотий Вік',
    src: 'https://drive.google.com/thumbnail?id=1hZSrVDvcw41RVMUY42T5AZxG_PUIcrej&sz=w400',
  },
];

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
            <h4 className="text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>Каталог</h4>
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
            <h4 className="text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>Інформація</h4>
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
            <h4 className="text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>Контакти</h4>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 mb-10"
          style={{ borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          {[
            { icon: '🔐', title: 'Безпечна оплата', desc: 'LiqPay / ПриватБанк' },
            { icon: '🚚', title: 'Нова Пошта', desc: 'По всій Україні' },
            { icon: '💎', title: '100% Оригінал', desc: 'Сертифікати якості' },
            { icon: '🔄', title: 'Обмін 14 днів', desc: 'Гарантія повернення' },
          ].map(item => (
            <div key={item.title} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'white', fontFamily: 'Jost', fontWeight: 400 }}>{item.title}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Jost' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* ✦ PARTNERS SECTION ✦ */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--stone)', fontFamily: 'Jost' }}>
              Наші партнери
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-px w-16" style={{ background: 'rgba(201,168,76,0.3)' }} />
              <span style={{ color: 'var(--gold)', fontSize: '0.5rem' }}>◆</span>
              <div className="h-px w-16" style={{ background: 'rgba(201,168,76,0.3)' }} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {PARTNERS.map((partner) => (
              <div key={partner.name}
                className="flex flex-col items-center gap-2 transition-all duration-300 hover:opacity-100"
                style={{ opacity: 0.6 }}
                title={partner.name}>
                <div className="bg-white flex items-center justify-center"
                  style={{ width: '180px', height: '100px', padding: '10px', borderRadius: '4px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.src}
                    alt={partner.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Jost', fontSize: '0.6rem', letterSpacing: '0.1em', textAlign: 'center' }}>
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Jost' }}>
            © 2025 VIALKO. Всі права захищені.
          </p>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
              alt="Mastercard" className="h-5 opacity-40" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa" className="h-4 opacity-40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
