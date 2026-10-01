import Image from 'next/image';
import { SITE } from '@/lib/site';

/** «Наші партнери» — логотипи у спільному стилі: монохром, колір при наведенні */
export default function Partners({ title = 'Наші партнери' }: { title?: string }) {
  return (
    <section aria-labelledby="partners-title" className="wrap py-12 md:py-16">
      <div className="mb-7 text-center">
        <span className="eyebrow justify-center">Співпраця</span>
        <h2 id="partners-title" className="section-title mt-2">
          {title}
        </h2>
      </div>
      <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-3 xs:grid-cols-3 sm:grid-cols-3 md:gap-5">
        {SITE.partners.map((p) => (
          <li
            key={p.name}
            className="group flex h-[118px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 transition duration-300 hover:border-line-2 hover:shadow-[var(--shadow-soft)]"
            title={p.name}
          >
            {p.logo ? (
              <span className="relative block h-[58px] w-full">
                <Image
                  src={p.logo}
                  alt={p.showName ? '' : p.name}
                  fill
                  sizes="220px"
                  className="object-contain opacity-70 mix-blend-multiply grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </span>
            ) : null}
            {p.showName ? (
              <span
                className={`text-center font-display leading-tight text-ink-2 transition-colors group-hover:text-ink ${
                  p.logo ? 'text-[15px] font-semibold' : 'text-[30px] font-semibold tracking-wide'
                }`}
              >
                {p.name}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
