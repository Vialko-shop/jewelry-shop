import Link from 'next/link';
import { DiamondMark } from './Icons';

export default function Logo({ compact = false, invert = false }: { compact?: boolean; invert?: boolean }) {
  return (
    <Link href="/" aria-label={compact ? "VIALKO — на головну" : "VIALKO ювелірний дім — на головну"} className="group inline-flex flex-col items-center leading-none">
      <span className={`flex items-center gap-2 ${invert ? 'text-white' : 'text-ink'}`}>
        <DiamondMark size={compact ? 15 : 18} className="text-gold transition-transform duration-500 group-hover:rotate-[18deg]" />
        <span
          className="font-display font-semibold"
          style={{ fontSize: compact ? 23 : 29, letterSpacing: '0.26em', marginRight: '-0.26em' }}
        >
          VIALKO
        </span>
      </span>
      {!compact && (
        <span
          className={`mt-1 text-[9px] font-bold uppercase ${invert ? 'text-gold' : 'text-gold-deep'}`}
          style={{ letterSpacing: '0.42em', marginRight: '-0.42em' }}
        >
          ювелірний дім
        </span>
      )}
    </Link>
  );
}
