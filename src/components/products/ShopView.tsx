"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import {
  COLLECTIONS,
  COLOR_META,
  PRICE_BOUNDS,
  PRODUCTS,
  STRAP_META,
  type CategoryId,
  type ColorId,
  type Product,
  type StrapId,
} from "@/data/products";
import { searchProducts } from "@/lib/search";
import { cn, formatPrice } from "@/lib/format";
import { useDialog } from "@/lib/use-dialog";
import { ProductCard } from "./ProductCard";

export const SORTS = {
  best: "Best Selling",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  name: "Name: A–Z",
  new: "Newest",
} as const;
type SortKey = keyof typeof SORTS;

interface Filters {
  q: string;
  categories: CategoryId[];
  straps: StrapId[];
  colors: ColorId[];
  price: [number, number];
}

const EMPTY: Omit<Filters, "q"> = { categories: [], straps: [], colors: [], price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max] };

function applyFilters(list: Product[], f: Filters, sort: SortKey) {
  const out = searchProducts(list, f.q).filter(
    (p) =>
      (f.categories.length === 0 || f.categories.some((c) => p.categories.includes(c))) &&
      (f.straps.length === 0 || f.straps.some((s) => p.straps.includes(s))) &&
      (f.colors.length === 0 || f.colors.some((c) => p.colors.some((pc) => pc.id === c))) &&
      p.price >= f.price[0] &&
      p.price <= f.price[1],
  );
  const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
    best: (a, b) => a.bestsellerRank - b.bestsellerRank,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
    new: (a, b) => b.releaseOrder - a.releaseOrder,
  };
  return [...out].sort(sorters[sort]);
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function ShopView({
  initialQuery = "",
  initialCategory,
  lockedCategory,
}: {
  initialQuery?: string;
  initialCategory?: CategoryId;
  /** When rendered on a collection page, the category is fixed and hidden from filters. */
  lockedCategory?: CategoryId;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const base = useMemo(
    () => (lockedCategory ? PRODUCTS.filter((p) => p.categories.includes(lockedCategory)) : PRODUCTS),
    [lockedCategory],
  );
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY,
    q: initialQuery,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sort, setSort] = useState<SortKey>("best");
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => applyFilters(base, filters, sort), [base, filters, sort]);
  const activeCount =
    filters.categories.length +
    filters.straps.length +
    filters.colors.length +
    (filters.price[0] !== PRICE_BOUNDS.min || filters.price[1] !== PRICE_BOUNDS.max ? 1 : 0);

  const setQuery = (q: string) => {
    setFilters((f) => ({ ...f, q }));
    const params = new URLSearchParams(window.location.search);
    if (q) params.set("q", q);
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const reset = () => setFilters((f) => ({ ...EMPTY, q: f.q }));

  const panel = (
    <FilterPanel filters={filters} setFilters={setFilters} base={base} hideCategories={Boolean(lockedCategory)} onReset={reset} activeCount={activeCount} />
  );

  return (
    <div className="container-luxe py-10 md:py-14">
      {/* toolbar */}
      <div className="flex flex-col gap-4 border-b border-obsidian/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <label htmlFor="shop-search" className="sr-only">
            Search watches
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" strokeWidth={1.5} />
          <input
            id="shop-search"
            type="search"
            value={filters.q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, metal, strap…"
            className="field pl-11"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="btn btn-outline-dark min-h-11 flex-1 px-5 lg:hidden"
            aria-expanded={drawer}
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} /> Filters
            {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-champagne text-[0.65rem] text-[#0B0B0B]">{activeCount}</span>}
          </button>
          <div className="relative flex-1 md:flex-none">
            <label htmlFor="shop-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="field min-h-11 cursor-pointer appearance-none py-2.5 pr-10 text-sm md:w-60"
            >
              {Object.entries(SORTS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-14">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28">{panel}</div>
        </aside>

        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="sr-only">
            Results
          </h2>
          <p className="mb-6 text-sm text-stone" aria-live="polite">
            Showing {results.length} of {base.length} {base.length === 1 ? "watch" : "watches"}
            {filters.q && (
              <>
                {" "}
                for “<span className="text-obsidian">{filters.q}</span>”
              </>
            )}
          </p>

          {results.length === 0 ? (
            <div className="border border-obsidian/10 bg-white/40 px-6 py-16 text-center">
              <p className="font-serif text-2xl">No watches match your selection</p>
              <p className="mt-2 text-sm text-stone">Try removing a filter or searching for something broader.</p>
              <button
                type="button"
                className="btn btn-dark mt-6"
                onClick={() => {
                  reset();
                  setQuery("");
                }}
              >
                Clear all
              </button>
            </div>
          ) : (
            <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                  >
                    <ProductCard product={p} priority={i < 3} sizes="(min-width: 1024px) 28vw, (min-width: 768px) 33vw, 50vw" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </section>
      </div>

      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} count={results.length}>
        {panel}
      </FilterDrawer>
    </div>
  );
}

/* ----------------------------------------------------------- filter panel */

function FilterPanel({
  filters,
  setFilters,
  base,
  hideCategories,
  onReset,
  activeCount,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  base: Product[];
  hideCategories: boolean;
  onReset: () => void;
  activeCount: number;
}) {
  const count = (pred: (p: Product) => boolean) => base.filter(pred).length;
  const strapIds = (Object.keys(STRAP_META) as StrapId[]).filter((s) => base.some((p) => p.straps.includes(s)));
  const colorIds = (Object.keys(COLOR_META) as ColorId[]).filter((c) => base.some((p) => p.colors.some((x) => x.id === c)));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="font-serif text-xl">Filters</p>
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="link-underline text-xs text-stone hover:text-obsidian">
            Clear ({activeCount})
          </button>
        )}
      </div>

      {!hideCategories && (
        <FilterGroup legend="Category">
          {COLLECTIONS.map((c) => (
            <Checkbox
              key={c.id}
              label={c.shortName}
              count={count((p) => p.categories.includes(c.id))}
              checked={filters.categories.includes(c.id)}
              onChange={() => setFilters((f) => ({ ...f, categories: toggle(f.categories, c.id) }))}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup legend="Price">
        <PriceRange value={filters.price} onChange={(price) => setFilters((f) => ({ ...f, price }))} />
      </FilterGroup>

      <FilterGroup legend="Strap">
        {strapIds.map((s) => (
          <Checkbox
            key={s}
            label={STRAP_META[s].label}
            count={count((p) => p.straps.includes(s))}
            checked={filters.straps.includes(s)}
            onChange={() => setFilters((f) => ({ ...f, straps: toggle(f.straps, s) }))}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Color">
        <div className="flex flex-wrap gap-3">
          {colorIds.map((c) => {
            const on = filters.colors.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                aria-label={COLOR_META[c].label}
                title={COLOR_META[c].label}
                onClick={() => setFilters((f) => ({ ...f, colors: toggle(f.colors, c) }))}
                className={cn(
                  "size-9 rounded-full ring-1 ring-obsidian/20 ring-offset-2 ring-offset-ivory transition-[box-shadow,transform] duration-300 hover:scale-105",
                  on && "ring-2 ring-obsidian",
                )}
                style={{ background: COLOR_META[c].swatch }}
              />
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-obsidian/10 pt-6">
      <legend className="float-left mb-4 w-full text-[0.72rem] font-medium tracking-[0.18em] text-obsidian uppercase">{legend}</legend>
      <div className="clear-both space-y-1">{children}</div>
    </fieldset>
  );
}

function Checkbox({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="group flex min-h-10 cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className="grid size-[18px] place-items-center border border-obsidian/30 transition-colors group-hover:border-obsidian peer-checked:border-obsidian peer-checked:bg-obsidian peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne"
      >
        <svg viewBox="0 0 12 12" className={cn("size-3 text-[#0B0B0B] transition-opacity", checked ? "opacity-100" : "opacity-0")}>
          <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-xs text-stone tabular-nums">({count})</span>
    </label>
  );
}

function PriceRange({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const { min, max } = PRICE_BOUNDS;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const STEP = 10;
  return (
    <div>
      <div className="relative h-6">
        <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-ivory/20" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-champagne"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        <input
          type="range"
          className="range-dual"
          min={min}
          max={max}
          step={STEP}
          value={value[0]}
          aria-label="Minimum price"
          aria-valuetext={formatPrice(value[0])}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - STEP), value[1]])}
        />
        <input
          type="range"
          className="range-dual"
          min={min}
          max={max}
          step={STEP}
          value={value[1]}
          aria-label="Maximum price"
          aria-valuetext={formatPrice(value[1])}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + STEP)])}
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-stone tabular-nums">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  );
}

function FilterDrawer({ open, onClose, count, children }: { open: boolean; onClose: () => void; count: number; children: React.ReactNode }) {
  const ref = useDialog<HTMLDivElement>(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75] lg:hidden">
          <motion.div className="absolute inset-0 bg-obsidian/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-ivory outline-none"
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-obsidian/15" />
            </div>
            <div className="flex justify-end px-3">
              <button type="button" onClick={onClose} aria-label="Close filters" className="grid size-11 place-items-center rounded-full hover:bg-obsidian/5">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
            <div className="border-t border-obsidian/10 p-4">
              <button type="button" onClick={onClose} className="btn btn-dark w-full">
                Show {count} {count === 1 ? "watch" : "watches"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
