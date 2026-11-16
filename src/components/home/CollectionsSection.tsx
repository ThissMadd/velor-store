import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS } from "@/data/products";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Img } from "@/components/ui/Img";

export function CollectionCard({ collection, sizes }: { collection: (typeof COLLECTIONS)[number]; sizes?: string }) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group relative isolate block aspect-[4/5] overflow-hidden rounded-[10px] bg-obsidian text-white"
    >
      <Img
        src={collection.image}
        alt={`${collection.name} — featured VÉLOR watch`}
        fill
        quality={82}
        sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 360px) 50vw, 100vw"}
        style={{ objectPosition: collection.imagePosition }}
        className="-z-10 object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
      />
      {/* Base gradient for legibility, plus a second layer that fades in to deepen it on hover */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/15 via-45% to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/35 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
        <h3 className="font-serif text-lg leading-tight sm:text-xl lg:text-2xl">{collection.name}</h3>
        <p className="mt-1.5 flex items-center gap-2 text-[0.72rem] tracking-[0.14em] text-white/85 uppercase sm:mt-2 sm:text-[0.78rem]">
          Discover
          <ArrowRight aria-hidden className="size-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1.5" />
        </p>
      </div>
    </Link>
  );
}

export function CollectionsSection() {
  return (
    <section aria-labelledby="collections-title" className="py-20 md:py-28">
      <div className="container-luxe">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="eyebrow text-champagne">Curated families</p>
          <h2 id="collections-title" className="mt-3 font-serif text-4xl md:text-5xl">
            Shop by Collection
          </h2>
        </Reveal>
        <Stagger as="div" className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {COLLECTIONS.map((c) => (
            <StaggerItem key={c.id}>
              <CollectionCard collection={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
