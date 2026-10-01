import { create } from 'zustand';

type Panel = null | 'menu' | 'search' | 'catalog';

interface UiStore {
  panel: Panel;
  open: (p: Exclude<Panel, null>) => void;
  close: () => void;
  toast: { id: number; text: string; href?: string; cta?: string } | null;
  notify: (text: string, href?: string, cta?: string) => void;
  hideToast: () => void;
}

export const useUi = create<UiStore>((set) => ({
  panel: null,
  open: (p) => set({ panel: p }),
  close: () => set({ panel: null }),
  toast: null,
  notify: (text, href, cta) => set({ toast: { id: Date.now(), text, href, cta } }),
  hideToast: () => set({ toast: null }),
}));
