import type { NextConfig } from "next";

/** Static media isn't fingerprinted, so cache it for a day and refresh quietly in the background. */
const MEDIA_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smallest), WebP fallback; keep optimised images cached for 30 days.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/videos/:path*", headers: [{ key: "Cache-Control", value: MEDIA_CACHE }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: MEDIA_CACHE }] },
    ];
  },
};

export default nextConfig;
