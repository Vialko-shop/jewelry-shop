// Єдине місце для контактів, порогів і перемикачів функцій магазину.
// Змінюйте тут — оновиться на всьому сайті.

export const SITE = {
  name: 'VIALKO',
  nameUa: 'Віалко',
  tagline: 'Ювелірний дім',
  description:
    'VIALKO — ювелірний інтернет-магазин: каблучки, сережки, браслети, підвіски та комплекти із золота, срібла й біжутерія. Доставка Новою поштою по всій Україні.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vialko.com.ua').replace(/\/$/, ''),

  phone: '095 777-50-00',
  phoneDisplay: '+38 (095) 777-50-00',
  phoneIntl: '+380957775000',
  phoneHref: 'tel:+380957775000',
  email: 'info@vialko.com.ua',
  hours: 'Приймаємо дзвінки щодня',

  /** Безкоштовна доставка від цієї суми (₴) */
  freeShippingFrom: 1500,

  /**
   * Оплата частинами (LiqPay / ПриватБанк). Поки не підключено — вимкнено.
   * Щоб показати блок на сайті: enabled: true
   */
  installments: {
    enabled: false,
    payments: 3,
    provider: 'ПриватБанк «Оплата частинами»',
  },

  /** Соцмережі: вставте посилання — іконки з'являться у футері автоматично */
  socials: {
    instagram: '',
    facebook: '',
    telegram: '',
    viber: '',
  },

  /** Партнери. logo: '' → показуємо назву шрифтом бренду (поки немає файлу логотипу) */
  partners: [
    { name: 'Столична ювелірна фабрика', logo: '/partners/stolychna.webp', showName: true },
    { name: 'Укрзолото', logo: '', showName: true },
    { name: 'Золотий Вік', logo: '/partners/zolotyi-vik.webp', showName: false },
  ],
} as const;

export const INFO_LINKS = [
  { href: '/dostavka-i-oplata', label: 'Доставка і оплата' },
  { href: '/obmin-i-povernennia', label: 'Обмін і повернення' },
  { href: '/garantiia', label: 'Гарантія' },
  { href: '/rozmirna-sitka', label: 'Розмірна сітка' },
  { href: '/blog', label: 'Блог' },
  { href: '/pro-nas', label: 'Про нас' },
  { href: '/kontakty', label: 'Контакти' },
] as const;
