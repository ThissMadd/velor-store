import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS, getProductsByCategory } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Img } from "@/components/ui/Img";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore the four VÉLOR collections: Men's, Women's, Chronograph and Minimal.",
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Four families, one philosophy"
        title="Collections"
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        intro="Each collection interprets the same quiet design language for a different moment and wrist."
      />
      <div className="container-luxe space-y-20 py-16 md:space-y-28 md:py-24">
        {COLLECTIONS.map((c, i) => {
          const count = getProductsByCategory(c.id).length;
          return (
            <Reveal key={c.id} as="section">
              <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <Link href={`/collections/${c.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-obsidian md:aspect-[5/6]">
                  <Img src={c.image} alt={`${c.name} — featured watch`} fill sizes="(min-width: 768px) 50vw, 100vw" style={{ objectPosition: c.imagePosition }} className="object-cover transition-transform duration-[1600ms] ease-(--ease-luxe) group-hover:scale-105" />
                </Link>
                <div className="max-w-md">
                  <p className="eyebrow text-champagne-deep">
                    {String(i + 1).padStart(2, "0")} · {count} {count === 1 ? "piece" : "pieces"}
                  </p>
                  <h2 className="mt-4 font-serif text-4xl md:text-5xl">{c.name}</h2>
                  <p className="mt-5 leading-relaxed text-stone">{c.description}</p>
                  <Link href={`/collections/${c.id}`} className="btn btn-dark mt-8">
                    Discover {c.shortName} <ArrowRight className="btn-arrow size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
