'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCartStore } from '@/store/cartStore';

// Кошик (Radix Dialog) вантажимо лише коли його вперше відкривають — менше JS на старті
const CartDrawer = dynamic(() => import('./Cart'), { ssr: false });

export default function CartMount() {
  const isOpen = useCartStore((s) => s.isOpen);
  const [ever, setEver] = useState(false);
  useEffect(() => {
    if (isOpen) setEver(true);
  }, [isOpen]);
  return ever ? <CartDrawer /> : null;
}
