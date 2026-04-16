'use client';
import { Phone, Mail, MapPin } from 'lucide-react';

const PARTNERS = [
  { name: 'Столична Ювелірна Фабрика', src: '/logos/logo1.jpg' },
  { name: 'УКР Золото', src: 'https://drive.google.com/thumbnail?id=1bwZQjW4iZuiWlnopPMd506JVAqqjkASC&sz=w400' },
  { name: 'Золотий Вік', src: 'https://drive.google.com/thumbnail?id=1hZSrVDvcw41RVMUY42T5AZxG_PUIcrej&sz=w400' },
];

export default function Footer() {
  return (
    <footer id="about-footer" style={{ background: 'var(--black)', color: 'white' }}>

      {/* Top divider */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '48px 0 0' }}>
        <div style={{ height: '0.5px', width: 60, background: 'linear-gradient(to right, transparent, var(--gold))' }} />
        <span style={{ fontSize: '0.5rem', letterSpacing: '0.5em', fontFamily: 'var(--font-sans)', color: 'var(--gold)', fontWeight: 400 }}>◆ VIALKO ◆</span>
        <div style={{ height: '0.5px', width: 60, background: 'linear-gradient(to left, transparent, var(--gold))' }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px clamp(20px, 4vw, 48px) 0' }}>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', letterSpacing: '0.18em', marginBottom: 6 }}
              className="gold-text">VIALKO</div>
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-sans)', marginBottom: 16 }}>
              Luxury Jewelry
            </p>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
              Авторські прикраси з золота, срібла та вишукана біжутерія.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h4 style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-sans)', marginBottom: 20, fontWeight: 500 }}>Каталог</h4>
            {['Каблучки', 'Сережки', 'Браслети', 'Підвіски', 'Комплекти'].map(item => (
              <a key={item} href="#catalog"
                style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)', padding: '6px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 300, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                {item}
              </a>
            ))}
          </div>

          {/* Contacts */}
          <div>
            <h4 style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-sans)', marginBottom: 20, fontWeight: 500 }}>Контакти</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href="tel:+380957775000" style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 300, transition: 'color 0.2s', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                <Phone size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} /> +38 (095) 777-50-00
              </a>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.38)', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 300, alignItems: 'center' }}>
                <Mail size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} /> info@vialko.com.ua
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.38)', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 300, alignItems: 'flex-start' }}>
                <MapPin size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} /> Доставка Новою Поштою по всій Україні
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '0.5px solid rgba(255,255,255,0.07)', marginBottom: 40 }} />

        {/* Trust badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 40 }}>
          <style>{`@media(min-width:640px){.trust-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>
          {[
            { icon: '🔐', title: 'Безпечна оплата', desc: 'LiqPay / ПриватБанк' },
            { icon: '🚚', title: 'Нова Пошта', desc: 'По всій Україні' },
            { icon: '💎', title: '100% Оригінал', desc: 'Сертифікати якості' },
            { icon: '🔄', title: 'Обмін 14 днів', desc: 'Гарантія повернення' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 400, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-sans)' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '0.5px solid rgba(255,255,255,0.07)', marginBottom: 40 }} />

        {/* Partners */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)', marginBottom: 24 }}>
            Наші партнери
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, alignItems: 'center' }}>
            {PARTNERS.map(p => (
              <div key={p.name} title={p.name}
                style={{ background: 'white', width: 160, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, opacity: 0.55, transition: 'opacity 0.25s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '0.5px solid rgba(255,255,255,0.07)', marginBottom: 24 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, paddingBottom: 32 }}>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)' }}>
            © 2025 VIALKO. Всі права захищені.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" style={{ height: 18, opacity: 0.3 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: 14, opacity: 0.3 }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
