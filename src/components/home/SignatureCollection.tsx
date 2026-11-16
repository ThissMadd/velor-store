"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { defaultImages, getProduct, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/store";
import { Reveal } from "@/components/ui/Reveal";
import { QuickAddDialog } from "./QuickAddDialog";

/** Each rotation film paired with its real catalog product (slug is the source of truth). */
const SHOWCASE = [
  { slug: "velor-classic", video: "/videos/watches/classic.mp4" },
  { slug: "velor-chrono", video: "/videos/watches/chrono.mp4" },
  { slug: "velor-minimal", video: "/videos/watches/minimal.mp4" },
  { slug: "velor-royale", video: "/videos/watches/royale.mp4" },
].flatMap(({ slug, video }) => {
  const product = getProduct(slug);
  return product ? [{ product, video }] : [];
});

/** Optimised still of the product's default variant, used as the video poster. */
function posterFor(product: Product) {
  const src = defaultImages(product)[0];
  return `/_next/image?url=${encodeURIComponent(encodeURI(src))}&w=640&q=75`;
}

export function SignatureCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [load, setLoad] = useState(false); // attach video sources once the section approaches
  const [active, setActive] = useState(false); // section visible and tab visible
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let onScreen = false;
    const update = () => setActive(onScreen && !document.hidden);

    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "400px 0px" });
    const visible = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        update();
      },
      { threshold: 0.2 },
    );
    near.observe(el);
    visible.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      near.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const addToCart = (p: Product) => {
    if (p.colors.length === 1 && p.straps.length === 1) {
      useCart.getState().add({ slug: p.slug, color: p.colors[0].id, strap: p.straps[0] });
      useCart.getState().open();
    } else {
      setQuickAdd(p); // a colour/strap choice is required
    }
  };

  return (
    <section ref={sectionRef} aria-labelledby="signature-title" className="relative isolate overflow-hidden bg-[#050505] py-20 md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,164,106,0.07),transparent_55%)]" />

      <div className="container-luxe">
        <Reveal className="text-center">
          <p className="text-[0.72rem] font-medium tracking-[0.34em] text-[#C8A46A] uppercase">The Collection</p>
          <h2 id="signature-title" className="mt-3 font-serif text-4xl font-normal text-[#F5F2ED] md:text-5xl">
            Our Signature Collection
          </h2>
        </Reveal>

        <ul className="mx-auto mt-12 grid max-w-[1320px] grid-cols-1 gap-x-5 gap-y-12 min-[440px]:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-x-6">
          {SHOWCASE.map(({ product, video }) => (
            <li key={product.slug}>
              <WatchFilm product={product} video={video} load={load} play={active && !reduce} onAdd={() => addToCart(product)} />
            </li>
          ))}
        </ul>
      </div>

      {quickAdd && <QuickAddDialog product={quickAdd} onClose={() => setQuickAdd(null)} />}
    </section>
  );
}

function WatchFilm({
  product,
  video,
  load,
  play,
  onAdd,
}: {
  product: Product;
  video: string;
  load: boolean;
  play: boolean;
  onAdd: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const engaged = useRef(false); // pointer over the tile, or keyboard focus inside it

  // Play only while the section is active and this watch isn't being interacted with.
  // pause()/play() keep currentTime, so a hovered watch resumes exactly where it stopped.
  const sync = useRef(() => {});
  sync.current = () => {
    const v = ref.current;
    if (!v || !v.src) return;
    if (play && !engaged.current) v.play().catch(() => {});
    else v.pause();
  };
  useEffect(() => sync.current(), [play, load]);

  const engage = (on: boolean) => {
    engaged.current = on;
    sync.current();
  };

  return (
    <article
      className="group relative mx-auto max-w-[320px] text-center"
      onPointerEnter={(e) => e.pointerType === "mouse" && engage(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && engage(false)}
      onFocus={() => engage(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) engage(false);
      }}
    >
      <Link href={`/products/${product.slug}`} className="block" aria-label={`${product.name}, ${formatPrice(product.price)}`}>
        <div className="relative aspect-[9/16] w-full bg-[#050505] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent),linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)] [mask-composite:intersect]">
          <video
            ref={ref}
            src={load ? video : undefined}
            poster={posterFor(product)}
            className="absolute inset-0 size-full object-contain"
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden
            tabIndex={-1}
            onLoadedMetadata={() => sync.current()}
          />
        </div>
        <h3 className="mt-4 font-serif text-lg text-[#F5F2ED] md:text-xl">{product.name}</h3>
        <p className="mt-1 text-sm font-medium text-[#C8A46A] tabular-nums">{formatPrice(product.price)}</p>
      </Link>

      {/* Always visible on touch screens; revealed on hover/focus where a pointer can hover */}
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex h-11 items-center gap-2 bg-[#C8A46A] px-6 text-[0.72rem] font-medium tracking-[0.2em] text-[#050505] uppercase transition-[opacity,transform,background-color] duration-[250ms] ease-out hover:bg-[#E5C58B] focus-visible:translate-y-0 focus-visible:opacity-100 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
        aria-label={`Add ${product.name} to cart`}
      >
        <Plus className="size-3.5" aria-hidden /> Add to cart
      </button>
    </article>
  );
}
