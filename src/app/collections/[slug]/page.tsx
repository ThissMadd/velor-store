import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopView } from "@/components/products/ShopView";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description,
    openGraph: { title: `${collection.name} | VÉLOR`, description: collection.description },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title={collection.name}
        intro={collection.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: collection.name }]}
      />
      <ShopView lockedCategory={collection.id} />
    </>
  );
}
