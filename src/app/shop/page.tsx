import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopView } from "@/components/products/ShopView";
import { COLLECTIONS, type CategoryId } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All Watches",
  description: "Browse every VÉLOR concept watch — filter by collection, strap, color and price.",
  openGraph: { title: "Shop All Watches | VÉLOR" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category } = await searchParams;
  const initialCategory = COLLECTIONS.some((c) => c.id === category) ? (category as CategoryId) : undefined;
  return (
    <>
      <PageHeader
        title="Shop All Watches"
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        intro="Six concept pieces, each available in considered metals and strap pairings."
      />
      {/* key resets local filter state when the header search navigates here with a new query */}
      <ShopView key={`${q ?? ""}|${initialCategory ?? ""}`} initialQuery={q ?? ""} initialCategory={initialCategory} />
    </>
  );
}
