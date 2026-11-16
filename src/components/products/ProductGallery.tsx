"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/format";
import { Img } from "@/components/ui/Img";

export function ProductGallery({ images, labels, alt }: { images: string[]; labels: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  // When the variant changes (new image set), jump back to the first image.
  const [prevSet, setPrevSet] = useState(images[0]);
  if (prevSet !== images[0]) {
    setPrevSet(images[0]);
    setIndex(0);
  }
  const safeIndex = Math.min(index, images.length - 1);
  const current = images[safeIndex];
  const isPlaceholder = current.endsWith(".svg");
  // Transparent photos sit on the page colour and are shown whole; SVG placeholders fill the frame.
  const fit = (src: string) => (src.endsWith(".svg") ? "object-cover" : "object-contain");

  return (
    // self-start + items-start stop grid/flex stretching from overriding the 4:5 aspect ratio
    <div className="flex flex-col-reverse gap-3 self-start md:flex-row md:items-start md:gap-4 lg:sticky lg:top-28">
      <div role="tablist" aria-label="Product images" className="no-scrollbar flex gap-2.5 overflow-x-auto md:w-20 md:flex-col md:overflow-visible">
        {images.map((src, i) => (
          <button
            key={`${i}-${src}`}
            type="button"
            role="tab"
            aria-selected={i === safeIndex}
            aria-label={labels[i] ?? `Image ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-ivory transition-[opacity,box-shadow] duration-300 md:w-full",
              i === safeIndex ? "opacity-100 ring-1 ring-obsidian ring-offset-2 ring-offset-ivory" : "opacity-60 hover:opacity-100",
            )}
          >
            <Img src={src} alt="" fill sizes="80px" className={fit(src)} />
          </button>
        ))}
      </div>

      <div
        className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden bg-ivory"
        role="tabpanel"
        aria-label={labels[safeIndex]}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Img
              src={current}
              alt={`${alt} — ${labels[safeIndex] ?? "view"}`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={fit(current)}
            />
          </motion.div>
        </AnimatePresence>
        {isPlaceholder && (
          <p className="absolute bottom-3 left-3 bg-ivory/80 px-2.5 py-1 text-[0.65rem] tracking-[0.14em] text-[#5E5A54] uppercase backdrop-blur">
            Concept render
          </p>
        )}
      </div>
    </div>
  );
}
