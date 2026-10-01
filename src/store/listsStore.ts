import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IdList {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => boolean; // returns new state (true = added)
  remove: (id: string) => void;
  clear: () => void;
}

const makeList = (name: string, limit?: number) =>
  create<IdList>()(
    persist(
      (set, get) => ({
        ids: [],
        has: (id) => get().ids.includes(id),
        toggle: (id) => {
          const ids = get().ids;
          if (ids.includes(id)) {
            set({ ids: ids.filter((x) => x !== id) });
            return false;
          }
          const next = [...ids, id];
          set({ ids: limit ? next.slice(-limit) : next });
          return true;
        },
        remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
        clear: () => set({ ids: [] }),
      }),
      { name },
    ),
  );

/** Обране (wishlist) */
export const useWishlist = makeList('vialko-wishlist');
/** Порівняння — до 4 товарів */
export const useCompare = makeList('vialko-compare', 4);
