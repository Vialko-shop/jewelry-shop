'use client';

import { usePathname } from 'next/navigation';

/** Ховає шапку/футер магазину в адмінці */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path?.startsWith('/vialko-admin')) return null;
  return <>{children}</>;
}
