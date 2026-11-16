import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Img } from "@/components/ui/Img";
import { DemoNotice } from "@/components/ui/DemoNotice";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The design philosophy behind VÉLOR, a fictional luxury watch house created as a portfolio concept.",
};

const PRINCIPLES = [
  { title: "Restraint", text: "Every element on a dial must earn its place. If it doesn't help you read the time or feel the moment, it goes." },
  { title: "Proportion", text: "Case, lugs and strap are drawn as one continuous line, so the watch sits naturally on the wrist." },
  { title: "Longevity", text: "Designs that ignore trends, finished in materials and tones meant to look better with every year of wear." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-obsidian text-ivory">
        <div className="container-luxe grid gap-12 pt-8 pb-16 md:grid-cols-2 md:items-center md:gap-20 md:pb-24">
          <div>
            <Breadcrumbs tone="light" items={[{ label: "Home", href: "/" }, { label: "About" }]} />
            <Reveal className="mt-12">
              <p className="eyebrow text-champagne">Our Story</p>
              <h1 className="mt-4 font-serif text-5xl leading-[1.02] md:text-7xl">
                Time, told
                <br />
                <em className="font-normal text-silver">quietly.</em>
              </h1>
              <p className="mt-8 max-w-md leading-relaxed text-ivory/70">
                VÉLOR imagines a watch house for people who prefer understatement to spectacle — where elegance comes from
                proportion, finish and the confidence to leave things out.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="relative aspect-[4/5] overflow-hidden">
            <Img src="/images/editorial/about-portrait.svg" alt="VÉLOR Heritage chronograph on a leather strap" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <p className="font-serif text-3xl leading-snug md:text-4xl">
            “A great watch shouldn&apos;t demand attention. It should reward it.”
          </p>
          <p className="mt-6 text-sm text-stone">— The VÉLOR design principle</p>
        </Reveal>

        <Stagger className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
          {PRINCIPLES.map((p, i) => (
            <StaggerItem key={p.title} className="border-t border-obsidian/15 pt-6">
              <span className="font-serif text-sm text-champagne-deep">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-3 font-serif text-2xl">{p.title}</h2>
              <p className="mt-3 leading-relaxed text-stone">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-ivory-deep/70 py-20 md:py-28">
        <div className="container-luxe grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-obsidian">
            <Img src="/images/editorial/material-dial.svg" alt="Detail of a VÉLOR chronograph dial" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow text-champagne-deep">About this project</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">A portfolio concept by Madd Agency</h2>
            <p className="mt-6 leading-relaxed text-stone">
              VÉLOR was created to demonstrate how a premium e-commerce experience can feel: cinematic storytelling,
              editorial layouts, considered motion and a frictionless path from discovery to checkout.
            </p>
            <DemoNotice className="mt-8">
              VÉLOR is fictional. Products, specifications and prices are illustrative; there is no real inventory,
              shipping, warranty or payment processing behind this site.
            </DemoNotice>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-dark">
                Explore the collection <ArrowRight className="btn-arrow size-4" />
              </Link>
              <Link href="/contact" className="btn btn-outline-dark">
                Contact (demo)
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
