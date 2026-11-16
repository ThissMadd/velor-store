"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Heart } from "lucide-react";
import { colorLabel, galleryLabel, productImages, strapLabel, type ColorId, type Product, type StrapId } from "@/data/products";
import { useCart, useWishlist } from "@/lib/store";
import { cn, formatPrice } from "@/lib/format";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { ProductGallery } from "./ProductGallery";
import { Accordion } from "./Accordion";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const [color, setColor] = useState<ColorId>(product.colors[0].id);
  const [strap, setStrap] = useState<StrapId>(product.straps[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const wished = useWishlist((s) => s.slugs.includes(product.slug));
  const toggleWish = useWishlist((s) => s.toggle);

  const images = productImages(product, color, strap);
  const labels = images.map((_, i) => galleryLabel(product, i));
  const variantLabel = `${colorLabel(product, color)}, ${strapLabel(product, strap)}`;

  const addToCart = () => {
    add({ slug: product.slug, color, strap }, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
    window.setTimeout(openCart, 300);
  };

  const buyNow = () => {
    add({ slug: product.slug, color, strap }, qty);
    router.push("/checkout");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
      <ProductGallery images={images} labels={labels} alt={`${product.name} — ${variantLabel}`} />

      <div className="lg:py-4">
        <p className="eyebrow text-champagne-deep">{product.tagline}</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{product.name}</h1>
        <p className="mt-4 text-2xl tabular-nums">{formatPrice(product.price)}</p>
        {product.shortDescription && <p className="mt-5 font-serif text-lg text-obsidian/85 italic">{product.shortDescription}</p>}
        <div className="mt-5 max-w-lg space-y-3 text-[0.95rem] leading-relaxed text-stone">
          {product.description.split(/\n\s*\n/).map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        {/* Color */}
        <fieldset className="mt-8">
          <legend className="text-sm">
            Color: <span className="text-stone">{colorLabel(product, color)}</span>
          </legend>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c) => (
              <label key={c.id} className="relative cursor-pointer">
                <input type="radio" name="color" value={c.id} checked={color === c.id} onChange={() => setColor(c.id)} className="peer sr-only" />
                <span
                  aria-hidden
                  title={c.label}
                  className="block size-10 rounded-full ring-1 ring-obsidian/20 ring-offset-[3px] ring-offset-ivory transition-[box-shadow,transform] duration-300 hover:scale-105 peer-checked:ring-2 peer-checked:ring-obsidian peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-champagne"
                  style={{ background: c.swatch }}
                />
                <span className="sr-only">{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Strap — a single fixed option is shown as text rather than a one-button choice */}
        {product.straps.length === 1 ? (
          <p className="mt-7 text-sm">
            Strap: <span className="text-stone">{strapLabel(product, strap)}</span>
          </p>
        ) : (
        <fieldset className="mt-7">
          <legend className="text-sm">
            Strap: <span className="text-stone">{strapLabel(product, strap)}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.straps.map((s) => (
              <label key={s} className="cursor-pointer">
                <input type="radio" name="strap" value={s} checked={strap === s} onChange={() => setStrap(s)} className="peer sr-only" />
                <span className="flex min-h-11 items-center border border-obsidian/20 px-5 text-sm transition-colors duration-300 hover:border-obsidian peer-checked:border-obsidian peer-checked:bg-obsidian peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne">
                  {strapLabel(product, s)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <QuantityControl value={qty} onChange={setQty} />
          <button type="button" onClick={addToCart} className="btn btn-dark min-w-48 flex-1" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="added" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <Check className="size-4" /> Added to cart
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  Add to cart
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            onClick={() => toggleWish(product.slug)}
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="grid size-12 place-items-center border border-obsidian/20 transition-colors hover:border-obsidian"
          >
            <Heart className={cn("size-[1.1rem] transition-transform", wished && "scale-110 fill-obsidian")} strokeWidth={1.5} />
          </button>
        </div>
        <button type="button" onClick={buyNow} className="btn btn-outline-dark mt-3 w-full">
          Buy now <ArrowRight className="btn-arrow size-4" />
        </button>
        <p className="mt-3 text-xs text-stone">Demo checkout — no payment details are requested and no order is placed.</p>

        <Accordion
          className="mt-10"
          items={[
            {
              title: "Specifications",
              content: (
                <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5">
                  {product.specs.map((s) => (
                    <div key={s.label} className="contents">
                      <dt className="text-stone">{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
            {
              title: "Design details",
              content: (
                <ul className="list-disc space-y-1.5 pl-5">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: "Shipping & Returns",
              content: (
                <p>
                  VÉLOR is a portfolio concept, so nothing ships and no returns are processed. In a live build, this panel
                  would hold the retailer&apos;s actual delivery times and return policy.
                </p>
              ),
            },
            {
              title: "Care Guide",
              content: (
                <p>
                  Wipe the case and bracelet with a soft, dry cloth. Keep leather straps away from prolonged moisture and
                  store your watch away from strong magnets and direct sunlight. (General guidance for the demo.)
                </p>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
