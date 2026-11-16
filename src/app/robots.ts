import type { MetadataRoute } from "next";
import { SITE } from "@/lib/format";

/**
 * Portfolio demo: crawling is allowed (so link previews work) but pages carry
 * `noindex` metadata, and transactional routes are disallowed outright.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/checkout"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
