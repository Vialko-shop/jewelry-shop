export default function Footer() {
  return (
    <footer id="about" style={{ background: 'var(--dark)', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-3xl mb-4 gold-gradient" style={{ fontFamily: 'Cormorant Garamond' }}>
              Каблучка & Co
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Jost', fontWeight: 300 }}>
              Авторські прикраси з золота, срібла та вишукана біжутерія. Кожен виріб — це маленька історія краси.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              Навігація
            </h4>
            {['Каталог', 'Золото', 'Срібло', 'Біжутерія', 'Про нас', 'Доставка та оплата'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="block text-sm py-1 transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Jost', fontWeight: 300 }}>
                {item}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              Контакти
            </h4>
            <div className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Jost', fontWeight: 300 }}>
              <p>📱 +380 XX XXX XX XX</p>
              <p>✉️ info@kabluchka.com.ua</p>
              <p>🚚 Доставка Новою Поштою<br/>по всій Україні</p>
              <p>💳 Оплата карткою ПриватБанку</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(201,168,76,0.3)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Jost' }}>
            © 2025 Каблучка & Co. Всі права захищені.
          </p>
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
              alt="Mastercard" className="h-6 opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa" className="h-4 opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  );
}
