"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRight, Gem, Infinity as InfinityIcon, Layers } from "lucide-react";
import { Img } from "@/components/ui/Img";

const EASE = [0.22, 1, 0.36, 1] as const;
const GOLD = "#C8A46A";

const FEATURES = [
  { icon: Gem, label: "Refined Craftsmanship" },
  { icon: Layers, label: "Premium Materials" },
  { icon: InfinityIcon, label: "Timeless Design" },
];

const content: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};
const featureList: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const featureItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="px-0 pb-20 md:px-5 md:pb-28 lg:px-8">
      {/* Same footprint as before: max 1600px, 560px / 620px tall */}
      <div className="relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-none bg-[#0B0B0B] md:rounded-2xl md:border md:border-ivory/10 text-ivory md:min-h-[620px]">
        {/* Watch photography on the left, melting into black toward the copy */}
        <div className="relative aspect-[16/11] w-full md:absolute md:inset-y-0 md:left-0 md:aspect-auto md:w-[64%]">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Img
              src="/images/editorial/velor-house-silver.png"
              alt="VÉLOR Royale in polished steel with a black dial, resting on dark leather"
              fill
              sizes="(min-width: 768px) 64vw, 100vw"
              quality={88}
              className="object-cover object-[56%_center]"
            />
          </motion.div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-[#0B0B0B] md:bg-gradient-to-r md:from-transparent md:from-55% md:via-[#0B0B0B]/70 md:via-85% md:to-[#0B0B0B]"
          />
        </div>

        {/* Editorial copy */}
        <div className="relative flex md:min-h-[620px] md:justify-end">
          <motion.div
            className="-mt-6 flex w-full flex-col justify-center px-5 pb-14 sm:px-8 md:mt-0 md:w-[48%] md:py-14 md:pr-10 lg:w-[42%] lg:pr-14 xl:pr-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={content}
          >
            <motion.p
              variants={rise}
              className="flex items-center gap-5 text-[0.72rem] font-medium tracking-[0.34em] uppercase"
              style={{ color: GOLD }}
            >
              The House of VÉLOR
              <span aria-hidden className="h-px w-16" style={{ background: GOLD }} />
            </motion.p>

            <motion.h2
              variants={rise}
              id="story-title"
              className="mt-6 font-serif text-[2.5rem] leading-[1.05] font-normal text-ivory md:text-5xl lg:text-[3.75rem]"
            >
              Precision in
              <br />
              Every Detail
            </motion.h2>

            <motion.p variants={rise} className="mt-6 max-w-[480px] text-base leading-[1.75] text-ivory/80">
              From the curve of the case to the final polish of each index, every VÉLOR timepiece is crafted with
              purpose, where timeless design meets modern refinement.
            </motion.p>

            <motion.ul variants={featureList} className="mt-9 grid max-w-[540px] grid-cols-3" aria-label="What defines VÉLOR">
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  variants={featureItem}
                  className={`flex flex-col items-center gap-3 px-2 py-1 text-center ${i > 0 ? "border-l border-ivory/20" : ""}`}
                >
                  <Icon aria-hidden className="size-8 lg:size-9" strokeWidth={1.1} style={{ color: GOLD }} />
                  <span className="text-[0.75rem] leading-snug text-ivory/90 md:text-[0.82rem]">{label}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={rise} className="mt-9">
              <Link
                href="/about"
                className="group inline-flex h-[52px] items-center gap-3 border px-10 text-[0.78rem] font-medium tracking-[0.2em] text-ivory uppercase transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#C8A46A] hover:text-[#0B0B0B] focus-visible:bg-[#C8A46A] focus-visible:text-[#0B0B0B]"
                style={{ borderColor: GOLD }}
              >
                Learn more
                <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
