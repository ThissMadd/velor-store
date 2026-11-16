"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { readDemoOrderRaw, type DemoOrder } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { Img } from "@/components/ui/Img";

export function Confirmation() {
  // Raw string snapshot is stable by value, so it is safe for useSyncExternalStore.
  const raw = useSyncExternalStore(
    () => () => {},
    readDemoOrderRaw,
    () => undefined,
  );
  const order = useMemo<DemoOrder | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as DemoOrder;
    } catch {
      return null;
    }
  }, [raw]);

  if (raw === undefined) return <div className="min-h-[60vh]" aria-busy="true" />;

  return (
    <div className="container-luxe max-w-3xl py-14 md:py-20">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-auto grid size-16 place-items-center rounded-full bg-champagne text-[#0B0B0B]"
      >
        <Check className="size-7" strokeWidth={1.6} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-8 text-center">
        <p className="eyebrow text-champagne-deep">Demo order confirmed</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Thank you{order ? `, ${order.name.split(" ")[0]}` : ""}</h1>
        <p className="mx-auto mt-4 max-w-lg text-stone">
          Your simulated order has been “placed”. In a live store this is where your confirmation email and delivery
          details would follow.
        </p>
      </motion.div>

      <DemoNotice className="mt-10">
        This was a portfolio demonstration. No payment was taken, no order was created, no email was sent and nothing
        will be shipped. The details below exist only in this browser tab.
      </DemoNotice>

      {order ? (
        <section aria-labelledby="order-summary" className="mt-8 border border-obsidian/10 bg-white/50 p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="order-summary" className="font-serif text-xl">
              Order summary
            </h2>
            <p className="text-sm text-stone">
              Reference <span className="font-medium text-obsidian">{order.number}</span>
            </p>
          </div>
          <ul className="mt-6 divide-y divide-obsidian/10">
            {order.lines.map((l, i) => (
              <li key={i} className="flex items-center gap-4 py-4">
                <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-ivory-deep">
                  <Img src={l.image} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-serif">{l.name}</p>
                  <p className="text-xs text-stone">
                    {l.color} / {l.strap} · Qty {l.quantity}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatPrice(l.price * l.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-obsidian/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">{order.shippingMethod}</dt>
              <dd className="tabular-nums">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="font-medium">Total (not charged)</dt>
              <dd className="font-serif text-2xl tabular-nums">{formatPrice(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-stone">
            Simulated delivery to {order.city}, {order.country}. Contact on file: {order.email}.
          </p>
        </section>
      ) : (
        <p className="mt-8 text-center text-sm text-stone">No recent demo order was found in this tab.</p>
      )}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-dark">
          Continue shopping <ArrowRight className="btn-arrow size-4" />
        </Link>
        <Link href="/" className="btn btn-outline-dark">
          Back to home
        </Link>
      </div>
    </div>
  );
}
