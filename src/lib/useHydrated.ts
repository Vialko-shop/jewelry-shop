'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** true only after hydration — for values persisted in localStorage (cart, wishlist) */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
