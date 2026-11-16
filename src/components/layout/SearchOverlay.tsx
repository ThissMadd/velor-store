"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Search, X } from "lucide-react";
import { PRODUCTS, defaultImages } from "@/data/products";
import { searchProducts } from "@/lib/search";
import { formatPrice } from "@/lib/format";
import { useDialog } from "@/lib/use-dialog";
import { Img } from "@/components/ui/Img";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const ref = useDialog<HTMLDivElement>(true, onClose);
  const results = useMemo(() => (query.trim() ? searchProducts(PRODUCTS, query) : PRODUCTS.slice(0, 3)), [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative max-h-[90vh] overflow-y-auto bg-ivory text-obsidian"
      >
        <div className="container-luxe py-6 md:py-10">
          <div className="flex justify-end">
            <button type="button" onClick={onClose} aria-label="Close search" className="grid size-11 place-items-center rounded-full hover:bg-obsidian/5">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <form onSubmit={submit} role="search" className="mx-auto mt-2 max-w-3xl">
            <label htmlFor="site-search" className="eyebrow text-stone">
              Search the collection
            </label>
            <div className="mt-3 flex items-center gap-3 border-b border-obsidian/30 pb-3 focus-within:border-obsidian">
              <Search aria-hidden className="size-5 shrink-0 text-stone" strokeWidth={1.5} />
              <input
                id="site-search"
                data-autofocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Classic, chronograph, leather…"
                autoComplete="off"
                className="w-full bg-transparent font-serif text-2xl outline-none placeholder:text-stone/50 md:text-4xl"
              />
              <button type="submit" className="btn btn-dark hidden min-h-11 px-5 sm:inline-flex">
                Search
              </button>
            </div>
          </form>

          <div className="mx-auto mt-8 max-w-3xl">
            <p className="eyebrow mb-4 text-stone" aria-live="polite">
              {query.trim() ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Popular pieces"}
            </p>
            {results.length === 0 ? (
              <p className="text-stone">No watches match “{query}”. Try “gold”, “minimal” or “leather”.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-3">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} onClick={onClose} className="group flex items-center gap-4 p-2 transition-colors hover:bg-obsidian/5 sm:block">
                      <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-ivory-deep sm:w-full">
                        <Img src={defaultImages(p)[0]} alt="" fill sizes="(min-width: 640px) 240px, 80px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="sm:mt-3">
                        <p className="font-serif text-lg">{p.name}</p>
                        <p className="text-sm text-stone">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {query.trim() && (
              <button type="button" onClick={submit} className="link-underline mt-6 text-sm font-medium">
                View all results in the shop <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
