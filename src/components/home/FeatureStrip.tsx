import { Gem, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

const FEATURES = [
  { icon: Gem, title: "Premium Materials", text: "Crafted with exceptional attention to detail" },
  { icon: Sparkles, title: "Timeless Design", text: "Elegance in every detail" },
  { icon: Layers, title: "Interchangeable Straps", text: "Designed for versatility" },
  { icon: ShieldCheck, title: "Quality Craftsmanship", text: "Precision meets sophistication" },
];

export function FeatureStrip() {
  return (
    <section aria-label="The VÉLOR difference" className="border-b border-ivory/10 bg-[#0B0B0B]">
      <Stagger
        as="div"
        className="container-luxe grid grid-cols-1 gap-x-8 gap-y-7 py-10 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-4 lg:py-12"
      >
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <StaggerItem key={title} className="group flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors duration-500 ease-(--ease-luxe) group-hover:border-champagne group-hover:text-champagne">
              <Icon aria-hidden className="size-[1.05rem]" strokeWidth={1.3} />
            </span>
            <div className="pt-0.5">
              <h3 className="text-[0.95rem] font-medium tracking-[0.01em] text-ivory">{title}</h3>
              <p className="mt-1 text-[0.8rem] leading-relaxed text-balance text-ivory/60">{text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
