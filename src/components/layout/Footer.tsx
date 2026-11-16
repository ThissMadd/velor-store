import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { FooterNewsletter } from "./FooterNewsletter";

/**
 * Only routes that exist are linked. Not yet built (so not shown): New Arrivals,
 * Shipping & Delivery, Returns & Refunds, FAQ, Sustainability. Social links are omitted
 * because no real accounts are configured, and no payment logos are shown because the
 * checkout is a demo that accepts no payment methods.
 */
const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/collections/men", label: "Men’s Watches" },
      { href: "/collections/women", label: "Women’s Watches" },
      { href: "/collections", label: "Collections" },
    ],
  },
  {
    title: "Support",
    links: [{ href: "/contact", label: "Contact Us" }],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/#craft", label: "Craftsmanship" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#080808] text-[#F5F2ED]">
      {/* Brand & newsletter — barely-visible watch macro behind */}
      <section aria-labelledby="footer-brand" className="relative isolate overflow-hidden">
        <Img
          src="/images/editorial/velor-precision-macro.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={70}
          className="-z-20 object-cover object-[20%_center] opacity-35"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,#080808_25%,rgba(8,8,8,0.85)_55%,rgba(8,8,8,0.55)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-[#080808]" />

        <div className="container-luxe py-20 text-center md:py-24">
          <p id="footer-brand" className="font-serif text-5xl tracking-[0.12em] md:text-6xl">
            VÉLOR
          </p>
          <p className="mt-6 text-[0.72rem] tracking-[0.36em] text-[#C8A46A] uppercase md:text-[0.8rem]">
            Timepieces for a modern classic
          </p>
          <FooterNewsletter />
        </div>
      </section>

      {/* Navigation */}
      <div className="container-luxe">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-t border-[#333333] py-14 md:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-0">
          <div className="col-span-2 max-w-sm lg:col-span-1 lg:pr-10">
            <Link href="/" className="font-serif text-3xl tracking-[0.12em] transition-colors duration-[250ms] hover:text-[#C8A46A]">
              VÉLOR
            </Link>
            <p className="mt-6 leading-relaxed text-[#B8B5B0]">
              A contemporary watch brand blending timeless design with modern refinement.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:border-l lg:border-[#333333] lg:pl-12 xl:pl-16">
              <h2 className="text-[0.78rem] font-medium tracking-[0.24em] uppercase">{col.title}</h2>
              <ul className="mt-6 space-y-4">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-serif text-[1.05rem] text-[#F5F2ED]/90 transition-colors duration-[250ms] hover:text-[#C8A46A] focus-visible:text-[#C8A46A]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-[#333333] py-8 text-sm text-[#B8B5B0] md:flex-row md:items-center md:justify-between">
          <p>© {year} VÉLOR. All rights reserved.</p>
          <p className="max-w-xl text-xs leading-relaxed text-[#B8B5B0]/80 md:text-right">
            Portfolio concept by Madd Agency. VÉLOR is a fictional brand: prices are illustrative, no payments are
            processed and no orders are fulfilled.
          </p>
        </div>
      </div>
    </footer>
  );
}
