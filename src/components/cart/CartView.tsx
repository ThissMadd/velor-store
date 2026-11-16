"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartHydrated, useCartLines, useCartTotals } from "@/lib/store";
import { formatPrice } from "@/lib/format";

import { CartLine } from "./CartLine";

export function CartView() {
  const hydrated = useCartHydrated();
  const lines = useCartLines();
  const { count, subtotal } = useCartTotals();

  if (!hydrated) {
    return <div className="container-luxe min-h-[50vh] py-16" aria-busy="true" />;
  }

  return (
    <div className="container-luxe py-12 md:py-16">
      <h1 className="font-serif text-4xl md:text-5xl">
        Your Cart <span className="text-stone">({count})</span>
      </h1>

      {lines.length === 0 ? (
        <div className="mt-12 flex flex-col items-center border border-obsidian/10 bg-white/40 px-6 py-20 text-center">
          <ShoppingBag className="size-8 text-stone" strokeWidth={1.2} />
          <p className="mt-6 font-serif text-2xl">Nothing here yet</p>
          <p className="mt-2 text-sm text-stone">Your selected pieces will appear here.</p>
          <Link href="/shop" className="btn btn-dark mt-8">
            Shop all watches <ArrowRight className="btn-arrow size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
          <ul aria-label="Cart items">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartLine key={line.id} line={line} size="lg" />
              ))}
            </AnimatePresence>
          </ul>
          <aside aria-labelledby="summary-title" className="h-fit border border-obsidian/10 bg-white/50 p-6 md:p-8 lg:sticky lg:top-32">
            <h2 id="summary-title" className="font-serif text-xl">
              Order Summary
            </h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">Shipping</dt>
                <dd className="text-stone">Chosen at checkout (demo)</dd>
              </div>
              <div className="flex justify-between border-t border-obsidian/10 pt-4 text-base">
                <dt className="font-medium">Total</dt>
                <dd className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="btn btn-dark mt-7 w-full">
              Proceed to checkout <ArrowRight className="btn-arrow size-4" />
            </Link>
            <Link href="/shop" className="link-underline mt-5 text-sm">
              Continue shopping
            </Link>
            <p className="mt-6 text-xs leading-relaxed text-stone">
              This is a portfolio demo. Checkout is simulated — no card details are requested and no order is created.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
