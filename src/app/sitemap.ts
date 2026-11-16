import type { MetadataRoute } from "next";
import { COLLECTIONS, PRODUCTS } from "@/data/products";
import { SITE } from "@/lib/format";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/shop", "/collections", "/about", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 })),
    ...COLLECTIONS.map((c) => ({ url: `${SITE.url}/collections/${c.id}`, lastModified: now, priority: 0.6 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/products/${p.slug}`, lastModified: now, priority: 0.8 })),
  ];
}
