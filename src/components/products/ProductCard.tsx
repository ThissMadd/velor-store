"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Heart, Plus } from "lucide-react";
import { defaultImages, type Product } from "@/data/products";
import { useCart, useWishlist } from "@/lib/store";
import { cn, formatPrice } from "@/lib/format";
import { Img } from "@/components/ui/Img";

export function ProductCard({ product, priority = false, sizes }: { product: Product; priority?: boolean; sizes?: string }) {
  const [primary, secondary] = defaultImages(product);
  // Transparent product photos sit directly on the page colour and are shown whole (contain);
  // generated SVG placeholders carry their own backdrop and keep filling the frame (cover).
  const fit = (src: string) => (src.endsWith(".svg") ? "object-cover" : "object-contain");
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const wished = useWishlist((s) => s.slugs.includes(product.slug));
  const toggleWish = useWishlist((s) => s.toggle);
  const [added, setAdded] = useState(false);

  const quickAdd = () => {
    add({ slug: product.slug, color: product.colors[0].id, strap: product.straps[0] });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
    window.setTimeout(openCart, 350);
  };

  return (
    <article className="group relative">
      {/* Hover (pointer devices only): background ivory → black, image 1 crossfades to image 2, slight zoom */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#151413] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#111111]">
        <Link href={`/products/${product.slug}`} className="absolute inset-0" aria-label={`${product.name}, ${formatPrice(product.price)}`}>
          <Img
            src={primary}
            alt={`${product.name} in ${product.colors[0].label.toLowerCase()}`}
            fill
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
            className={`${fit(primary)} transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0 motion-safe:group-hover:scale-[1.04]`}
          />
          <Img
            src={secondary}
            alt=""
            aria-hidden
            fill
            sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
            className={`${fit(secondary)} opacity-0 transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 motion-safe:group-hover:scale-[1.04]`}
          />
        </Link>

        <button
          type="button"
          onClick={() => toggleWish(product.slug)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 z-10 grid size-10 place-items-center rounded-full bg-ivory/80 text-[#0B0B0B] backdrop-blur transition-[transform,background-color] duration-300 group-hover:bg-ivory hover:scale-105 active:scale-95"
        >
          <motion.span key={String(wished)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
            <Heart className={cn("size-[1.05rem]", wished && "fill-obsidian")} strokeWidth={1.5} />
          </motion.span>
        </button>

        <button
          type="button"
          onClick={quickAdd}
          className="absolute inset-x-2.5 bottom-2.5 z-10 flex min-h-11 items-center justify-center gap-2 bg-obsidian/90 text-[0.72rem] font-medium tracking-[0.14em] text-ivory uppercase backdrop-blur transition-[opacity,transform] duration-500 ease-(--ease-luxe) hover:bg-obsidian lg:bg-ivory/95 lg:text-obsidian lg:hover:bg-white lg:translate-y-3 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="ok" className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <Check className="size-3.5" /> Added
              </motion.span>
            ) : (
              <motion.span key="add" className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <Plus className="size-3.5" /> <span className="hidden sm:inline">Add to cart</span>
                <span className="sm:hidden">Add</span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-[1.05rem] leading-snug md:text-lg">
            <Link href={`/products/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-stone">{product.tagline}</p>
        </div>
        <p className="shrink-0 text-[0.95rem] tabular-nums">{formatPrice(product.price)}</p>
      </div>
      <ul className="mt-2.5 flex gap-1.5" aria-label="Available colors">
        {product.colors.map((c) => (
          <li key={c.id} title={c.label} className="size-3 rounded-full ring-1 ring-obsidian/15" style={{ background: c.swatch }}>
            <span className="sr-only">{c.label}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
