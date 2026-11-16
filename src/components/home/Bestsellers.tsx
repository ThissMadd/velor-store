import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBestsellers } from "@/data/products";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/products/ProductCard";

export function Bestsellers() {
  const products = getBestsellers(4);
  return (
    <section aria-labelledby="bestsellers-title" className="pb-20 md:pb-28">
      <div className="container-luxe">
        <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="eyebrow text-champagne">Most loved</p>
            <h2 id="bestsellers-title" className="mt-3 font-serif text-4xl md:text-5xl">
              Our Bestsellers
            </h2>
          </div>
          <Link href="/shop" className="link-underline shrink-0 text-sm font-medium">
            View all <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Reveal>
        <Stagger as="div" className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {products.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
