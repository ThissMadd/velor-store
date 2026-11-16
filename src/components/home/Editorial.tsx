import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Img } from "@/components/ui/Img";

const MATERIALS = [
  {
    n: "01",
    title: "The Case",
    text: "Alternating brushed and polished surfaces catch light differently as the wrist turns.",
    image: "/images/editorial/velor-the-case.png",
    alt: "Macro of a VÉLOR rose gold case and black sunray dial",
  },
  {
    n: "02",
    title: "The Dial",
    text: "Sunray textures, applied indices and registers balanced to the tenth of a millimetre.",
    image: "/images/editorial/velor-the-dial.png",
    alt: "VÉLOR chronograph dial with three subdials and rose gold hands",
  },
  {
    n: "03",
    title: "The Strap",
    text: "Contrast-stitched leather, articulated steel or fine mesh — each chosen to age gracefully.",
    image: "/images/editorial/velor-the-strap.png",
    alt: "Brown leather VÉLOR strap with cream contrast stitching",
  },
];

export function Editorial() {
  return (
    <section id="craft" aria-labelledby="craft-title" className="scroll-mt-24 bg-obsidian py-20 text-ivory md:py-28">
      <div className="container-luxe">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-20">
          <Reveal>
            <p className="eyebrow text-champagne">Craftsmanship</p>
            <h2 id="craft-title" className="mt-4 font-serif text-4xl leading-[1.05] md:text-6xl">
              The anatomy of
              <br />
              <em className="font-normal text-silver">quiet luxury</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl leading-relaxed text-ivory/70">
              We think of a watch as three conversations — between metal and light, between hands and indices, and
              between the piece and the wrist that wears it. Each is designed with the same restraint.
            </p>
          </Reveal>
        </div>

        <Reveal className="relative mt-14 aspect-[16/9] overflow-hidden md:mt-20 md:aspect-[21/9]">
          <Img src="/images/editorial/velor-royale-wide.png" alt="VÉLOR Royale in rose gold with a black dial, resting on dark leather" fill sizes="(min-width: 1440px) 1360px, 100vw" quality={85} className="object-cover object-[35%_center] md:object-[center_40%]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
          <p className="absolute bottom-5 left-5 font-serif text-xl md:bottom-8 md:left-8 md:text-3xl">VÉLOR Royale</p>
        </Reveal>

        <Stagger as="div" className="mt-5 grid gap-5 md:grid-cols-3">
          {MATERIALS.map((m) => (
            <StaggerItem key={m.n} className="group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Img src={m.image} alt={m.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1600ms] ease-(--ease-luxe) group-hover:scale-105" />
              </div>
              <div className="mt-5 flex gap-5">
                <span className="font-serif text-sm text-champagne">{m.n}</span>
                <div>
                  <h3 className="font-serif text-2xl">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/65">{m.text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-14 text-center">
          <Link href="/collections" className="btn btn-outline-light">
            Explore the collections <ArrowRight className="btn-arrow size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
