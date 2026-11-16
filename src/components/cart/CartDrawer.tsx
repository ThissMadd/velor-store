"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { useCart, useCartLines, useCartTotals } from "@/lib/store";
import { useDialog } from "@/lib/use-dialog";
import { formatPrice } from "@/lib/format";
import { CartLine } from "./CartLine";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const lines = useCartLines();
  const { count, subtotal } = useCartTotals();
  const pathname = usePathname();
  const ref = useDialog<HTMLDivElement>(isOpen, close);

  // Close when navigating elsewhere.
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-obsidian/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
          />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-ivory text-obsidian shadow-2xl outline-none"
          >
            <div className="flex items-center justify-between border-b border-obsidian/10 px-6 py-5">
              <h2 id="cart-title" className="font-serif text-2xl">
                Your Cart <span className="text-stone">({count})</span>
              </h2>
              <button type="button" onClick={close} aria-label="Close cart" className="grid size-11 place-items-center rounded-full hover:bg-obsidian/5">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="grid size-16 place-items-center rounded-full border border-obsidian/15">
                  <ShoppingBag className="size-6 text-stone" strokeWidth={1.3} />
                </div>
                <p className="mt-6 font-serif text-2xl">Your cart is empty</p>
                <p className="mt-2 max-w-xs text-sm text-stone">Discover pieces designed to be worn for a lifetime of moments.</p>
                <Link href="/shop" onClick={close} className="btn btn-dark mt-8">
                  Explore the collection <ArrowRight className="btn-arrow size-4" />
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <CartLine key={line.id} line={line} onNavigate={close} />
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-obsidian/10 bg-ivory-deep/60 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-stone">Subtotal</span>
                    <span className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone">Demo store — no payment is taken at checkout.</p>
                  <Link href="/checkout" onClick={close} className="btn btn-dark mt-5 w-full">
                    Proceed to checkout <ArrowRight className="btn-arrow size-4" />
                  </Link>
                  <Link href="/cart" onClick={close} className="btn btn-outline-dark mt-2.5 w-full">
                    View cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
