import { COLLECTIONS, STRAP_META, strapLabel, type Product } from "@/data/products";

function haystack(p: Product): string {
  return [
    p.name,
    p.tagline,
    p.description,
    ...p.categories,
    ...p.categories.map((c) => COLLECTIONS.find((x) => x.id === c)?.name ?? ""),
    ...p.colors.map((c) => c.label),
    ...p.straps.flatMap((s) => [STRAP_META[s].label, strapLabel(p, s)]),
    p.series ?? "",
  ]
    .join(" ")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/** Every whitespace-separated term must match (accent-insensitive). */
export function searchProducts(products: Product[], query: string): Product[] {
  const terms = query
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (terms.length === 0) return products;
  return products.filter((p) => {
    const h = haystack(p);
    return terms.every((t) => h.includes(t));
  });
}
