"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useCart, useWishlist } from "@/lib/store";
import { CartDrawer } from "@/components/cart/CartDrawer";

/**
 * Persisted stores hydrate after mount so server and client markup match.
 * Rendered as the first child so its effect runs before any sibling effect
 * could write default state over what is saved in localStorage.
 */
function StoreHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useWishlist.persist.rehydrate();
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <StoreHydrator />
      {children}
      <CartDrawer />
    </MotionConfig>
  );
}
