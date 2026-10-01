import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/site';
import { getCatalog, toLite } from '@/lib/catalog';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartMount from '@/components/CartMount';
import MobileBar from '@/components/MobileBar';
import Toast from '@/components/Toast';
import ChromeGate from '@/components/ChromeGate';
import { ldJson } from '@/lib/jsonld';

// Variable-шрифти: 1 файл на підмножину (latin + cyrillic) — менше запитів, швидший LCP
const display = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  style: ['normal'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: false, // заголовки — не критичний шлях; так банер (LCP) вантажиться раніше
});

// Курсив лише для акцентів у банері — без preload
const displayItalic = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  style: ['italic'],
  variable: '--font-cormorant-italic',
  display: 'swap',
  preload: false,
});

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'VIALKO — ювелірні прикраси із золота та срібла | Віалко',
    template: '%s | VIALKO',
  },
  description: SITE.description,
  keywords: ['vialko', 'віалко', 'прикраси', 'ювелірні прикраси', 'золото', 'срібло', 'каблучки', 'сережки', 'браслети', 'підвіски', 'біжутерія'],
  applicationName: 'VIALKO',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'VIALKO',
    title: 'VIALKO — ювелірні прикраси',
    description: SITE.description,
    url: SITE.url,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Шапці каталог потрібен лише для живого пошуку: якщо база тимчасово недоступна — сторінка все одно відкриється
  const catalog = await getCatalog().catch((e) => {
    console.error('[layout] catalog unavailable', e);
    return [];
  });
  const lite = catalog.map((p) => toLite(p));

  const orgLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'JewelryStore',
        '@id': `${SITE.url}/#store`,
        name: 'VIALKO',
        alternateName: 'Віалко',
        url: SITE.url,
        telephone: SITE.phoneIntl,
        email: SITE.email,
        priceRange: '₴₴',
        areaServed: 'UA',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: 'VIALKO',
        inLanguage: 'uk-UA',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="uk" className={`${display.variable} ${displayItalic.variable} ${sans.variable}`}>
      <body className="min-h-dvh pb-[calc(60px+env(safe-area-inset-bottom))] lg:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Перейти до вмісту
        </a>
        <ChromeGate>
          <TopBar />
          <Header items={lite} />
        </ChromeGate>
        <main id="main">{children}</main>
        <ChromeGate>
          <Footer />
        </ChromeGate>
        <CartMount />
        <MobileBar />
        <Toast />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(orgLd) }} />
      </body>
    </html>
  );
}
