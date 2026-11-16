import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-xs ${tone === "dark" ? "text-stone" : "text-ivory/60"}`}>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-current hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "dark" ? "text-obsidian" : "text-ivory"}>
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight aria-hidden className="size-3 opacity-60" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  eyebrow,
  intro,
  crumbs,
  children,
}: {
  title: string;
  eyebrow?: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="bg-obsidian text-ivory">
      <div className="container-luxe pt-8 pb-12 md:pt-10 md:pb-16">
        {crumbs && <Breadcrumbs items={crumbs} tone="light" />}
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow mb-4 text-champagne">{eyebrow}</p>}
            <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl">{title}</h1>
            {intro && <div className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ivory/70">{intro}</div>}
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}
