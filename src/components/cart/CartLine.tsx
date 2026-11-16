"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { colorLabel, productImages, strapLabel } from "@/data/products";
import { useCart, type useCartLines } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { Img } from "@/components/ui/Img";

type Line = ReturnType<typeof useCartLines>[number];

export function CartLine({ line, onNavigate, size = "sm" }: { line: Line; onNavigate?: () => void; size?: "sm" | "lg" }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const img = productImages(line.product, line.color, line.strap)[0];
  const variant = `${colorLabel(line.product, line.color)} / ${strapLabel(line.product, line.strap)}`;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-4 border-b border-obsidian/10 py-5 last:border-b-0 sm:gap-5"
    >
      <Link
        href={`/products/${line.slug}`}
        onClick={onNavigate}
        className={`relative shrink-0 overflow-hidden bg-ivory-deep ${size === "lg" ? "aspect-[4/5] w-24 sm:w-32" : "aspect-[4/5] w-20"}`}
      >
        <Img src={img} alt={`${line.product.name}, ${variant}`} fill sizes="128px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${line.slug}`} onClick={onNavigate} className={`font-serif hover:underline ${size === "lg" ? "text-xl" : "text-base"}`}>
              {line.product.name}
            </Link>
            <p className="mt-1 text-xs text-stone">{variant}</p>
            <p className="mt-1.5 text-sm">{formatPrice(line.product.price)}</p>
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums">{formatPrice(line.lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityControl size="sm" value={line.quantity} min={1} onChange={(q) => setQuantity(line.id, q)} label={`Quantity for ${line.product.name}`} />
          <button
            type="button"
            onClick={() => remove(line.id)}
            className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs text-stone transition-colors hover:text-obsidian"
            aria-label={`Remove ${line.product.name} (${variant}) from cart`}
          >
            <Trash2 className="size-3.5" strokeWidth={1.6} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </motion.li>
  );
}
