"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { colorLabel, productImages, strapLabel, type ColorId, type Product, type StrapId } from "@/data/products";
import { useCart } from "@/lib/store";
import { cn, formatPrice } from "@/lib/format";
import { useDialog } from "@/lib/use-dialog";
import { Img } from "@/components/ui/Img";

/**
 * Variant picker for quick add. Nothing is pre-selected when a choice is required, so the visitor
 * always picks the colour (and strap, when there is more than one) before the existing cart is used.
 */
export function QuickAddDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const ref = useDialog<HTMLDivElement>(true, onClose);
  const singleColor = product.colors.length === 1;
  const singleStrap = product.straps.length === 1;
  const [color, setColor] = useState<ColorId | null>(singleColor ? product.colors[0].id : null);
  const [strap, setStrap] = useState<StrapId | null>(singleStrap ? product.straps[0] : null);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");

  const ready = color !== null && strap !== null;
  const preview = productImages(product, color ?? product.colors[0].id, strap ?? product.straps[0])[0];

  const add = () => {
    if (!ready) return;
    setStatus("adding");
    try {
      useCart.getState().add({ slug: product.slug, color, strap });
      setStatus("added");
      window.setTimeout(() => {
        onClose();
        useCart.getState().open();
      }, 700);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[85] grid place-items-center p-4">
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid w-full max-w-2xl gap-6 border border-white/10 bg-[#0B0B0B] p-6 text-[#F5F2ED] outline-none sm:grid-cols-[220px_1fr] sm:p-8"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-3 grid size-10 place-items-center rounded-full hover:bg-white/10">
          <X className="size-5" strokeWidth={1.5} />
        </button>

        <div className="relative mx-auto aspect-square w-40 sm:w-full">
          <Img src={preview} alt="" fill sizes="220px" className="object-contain" />
        </div>

        <div>
          <h2 id="quick-add-title" className="font-serif text-2xl">
            {product.name}
          </h2>
          <p className="mt-1 text-[#C8A46A] tabular-nums">{formatPrice(product.price)}</p>

          <fieldset className="mt-6">
            <legend className="text-sm">
              Color: <span className="text-white/60">{color ? colorLabel(product, color) : "Select a color"}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <label key={c.id} className="cursor-pointer">
                  <input type="radio" name="qa-color" value={c.id} checked={color === c.id} onChange={() => setColor(c.id)} className="peer sr-only" />
                  <span
                    aria-hidden
                    title={c.label}
                    className="block size-9 rounded-full ring-1 ring-white/25 ring-offset-[3px] ring-offset-[#0B0B0B] transition-shadow peer-checked:ring-2 peer-checked:ring-[#C8A46A] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#C8A46A]"
                    style={{ background: c.swatch }}
                  />
                  <span className="sr-only">{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {singleStrap ? (
            <p className="mt-5 text-sm">
              Strap: <span className="text-white/60">{strapLabel(product, product.straps[0])}</span>
            </p>
          ) : (
            <fieldset className="mt-5">
              <legend className="text-sm">
                Strap: <span className="text-white/60">{strap ? strapLabel(product, strap) : "Select a strap"}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.straps.map((s) => (
                  <label key={s} className="cursor-pointer">
                    <input type="radio" name="qa-strap" value={s} checked={strap === s} onChange={() => setStrap(s)} className="peer sr-only" />
                    <span className="flex min-h-10 items-center border border-white/20 px-4 text-sm transition-colors peer-checked:border-[#C8A46A] peer-checked:text-[#C8A46A]">
                      {strapLabel(product, s)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <button
            type="button"
            onClick={add}
            disabled={!ready || status === "adding" || status === "added"}
            className={cn(
              "mt-7 inline-flex h-12 w-full items-center justify-center gap-2 text-[0.75rem] font-medium tracking-[0.2em] uppercase transition-colors duration-[250ms]",
              ready ? "bg-[#C8A46A] text-[#050505] hover:bg-[#E5C58B]" : "cursor-not-allowed bg-white/10 text-white/40",
            )}
          >
            {status === "added" ? (
              <>
                <Check className="size-4" /> Added
              </>
            ) : status === "adding" ? (
              "Adding…"
            ) : ready ? (
              "Add to cart"
            ) : (
              "Select options"
            )}
          </button>
          <p role="status" className="mt-2 min-h-5 text-xs text-white/50">
            {status === "error" ? <span className="text-red-300">Something went wrong — please try again.</span> : null}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
