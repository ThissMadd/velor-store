"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct, type ColorId, type StrapId } from "@/data/products";

export interface CartItem {
  id: string;
  slug: string;
  color: ColorId;
  strap: StrapId;
  quantity: number;
}

export const MAX_QTY = 10;

export const lineId = (slug: string, color: ColorId, strap: StrapId) => `${slug}__${color}__${strap}`;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item, quantity = 1) =>
        set((state) => {
          const id = lineId(item.slug, item.color, item.strap);
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, id, quantity: Math.min(MAX_QTY, quantity) }] };
        }),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i)),
        })),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      // Guarded so mount-time calls never trigger a persist write before rehydration.
      open: () => {
        if (!get().isOpen) set({ isOpen: true });
      },
      close: () => {
        if (get().isOpen) set({ isOpen: false });
      },
    }),
    {
      name: "velor-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

/** Cart lines joined with live catalog data; unknown products or variants are dropped. */
export function useCartLines() {
  const items = useCart((s) => s.items);
  return items.flatMap((item) => {
    const product = getProduct(item.slug);
    // Drop lines whose product or variant no longer exists in the catalog (e.g. an older saved cart).
    if (!product || !product.straps.includes(item.strap) || !product.colors.some((c) => c.id === item.color)) return [];
    return [{ ...item, product, lineTotal: product.price * item.quantity }];
  });
}

export function useCartTotals() {
  const lines = useCartLines();
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  return { count, subtotal };
}

/* ------------------------------------------------------------- wishlist */

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) =>
        set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug] })),
    }),
    { name: "velor-wishlist", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

/* --------------------------------------------------------- demo orders */

export interface DemoOrder {
  number: string;
  createdAt: string;
  email: string;
  name: string;
  city: string;
  country: string;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  lines: { name: string; color: string; strap: string; quantity: number; price: number; image: string }[];
}

const ORDER_KEY = "velor-demo-order";

export function saveDemoOrder(order: DemoOrder) {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable — confirmation page shows a generic message */
  }
}

export function readDemoOrderRaw(): string | null {
  try {
    return sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
}

/** True once the persisted cart has loaded from localStorage (always false during SSR). */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}
