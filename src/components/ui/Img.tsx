import Image, { type ImageProps } from "next/image";

/**
 * Local paths with spaces or accented characters (e.g. "Vélor Silver Watch on White.png")
 * must be URL-encoded, otherwise the Next.js image optimiser can't fetch them.
 * Paths that already contain "%" are assumed to be encoded.
 */
function encodeLocalPath(src: string): string {
  if (!src.startsWith("/") || src.includes("%")) return src;
  return /[^\x21-\x7e]/.test(src) ? encodeURI(src) : src;
}

/**
 * next/image wrapper. Placeholder art is vector SVG, which doesn't benefit from the
 * raster optimiser, so SVG sources bypass it. Real photography (jpg/png/webp/avif)
 * is optimised automatically.
 */
export function Img({ alt, src, ...props }: ImageProps) {
  const path = typeof src === "string" ? src : "";
  return (
    <Image
      alt={alt}
      src={typeof src === "string" ? encodeLocalPath(src) : src}
      {...props}
      unoptimized={props.unoptimized ?? path.endsWith(".svg")}
    />
  );
}
