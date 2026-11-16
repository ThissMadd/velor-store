import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct, getRelated } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Watch not found" };
  const description = `${product.tagline}. ${product.description.slice(0, 120)}… Illustrative price ${formatPrice(product.price)} (demo).`;
  return {
    title: product.name,
    description,
    openGraph: { title: `${product.name} | VÉLOR`, description },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelated(product);

  return (
    <>
      <div className="container-luxe py-8 md:py-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: product.name }]} />
        <div className="mt-8">
          <ProductDetail product={product} />
        </div>
      </div>

      <section aria-labelledby="related-title" className="border-t border-obsidian/10 py-16 md:py-24">
        <div className="container-luxe">
          <Reveal>
            <p className="eyebrow text-champagne-deep">Complete the collection</p>
            <h2 id="related-title" className="mt-3 font-serif text-3xl md:text-4xl">
              You may also like
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
            {related.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} sizes="(min-width: 768px) 33vw, 50vw" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
