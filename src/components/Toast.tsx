'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useUi } from '@/store/uiStore';

export default function Toast() {
  const toast = useUi((s) => s.toast);
  const hide = useUi((s) => s.hideToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hide, 2800);
    return () => clearTimeout(t);
  }, [toast, hide]);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[100] lg:bottom-8">
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto absolute left-1/2 flex items-center gap-3 rounded-full bg-ink py-2.5 pl-4 pr-2.5 text-sm text-white shadow-[var(--shadow-pop)]"
          style={{ animation: 'toastIn .3s cubic-bezier(.22,.61,.36,1) both', transform: 'translateX(-50%)' }}
        >
          <Check size={16} className="text-gold" />
          <span className="whitespace-nowrap font-semibold">{toast.text}</span>
          {toast.href ? (
            <Link href={toast.href} onClick={hide} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20">
              {toast.cta ?? 'Відкрити'}
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
