"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Logo, NAV_LINKS, isActive } from "./Logo";
import { MobileNav } from "./MobileNav";
import { useCart, useCartTotals, useWishlist } from "@/lib/store";
import { cn } from "@/lib/format";

const SearchOverlay = dynamic(() => import("./SearchOverlay").then((m) => m.SearchOverlay), { ssr: false });


export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openCart = useCart((s) => s.open);
  const { count } = useCartTotals();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;
  const iconBtn =
    "relative grid size-11 place-items-center rounded-full transition-colors duration-300 hover:bg-ivory/10";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-ivory">
        {/* Announcement — honest demo messaging instead of retail claims */}
        <div
          className={cn(
            "overflow-hidden bg-obsidian text-center text-[0.7rem] tracking-[0.18em] text-ivory/75 uppercase transition-[height,opacity] duration-500 ease-(--ease-luxe)",
            scrolled ? "h-0 opacity-0" : "h-9 opacity-100",
          )}
        >
          <p className="flex h-9 items-center justify-center gap-3 px-4">
            <span>Portfolio concept</span>
            <span aria-hidden className="text-champagne">·</span>
            <span className="hidden sm:inline">Fictional brand</span>
            <span aria-hidden className="hidden text-champagne sm:inline">·</span>
            <span>Illustrative prices</span>
          </p>
        </div>

        <div
          className={cn(
            "transition-[background-color,backdrop-filter,border-color] duration-500 ease-(--ease-luxe) border-b",
            transparent
              ? "border-transparent bg-transparent"
              : "border-ivory/10 bg-obsidian/90 backdrop-blur-md supports-[backdrop-filter]:bg-obsidian/75",
          )}
        >
          <div className="container-luxe grid h-[72px] grid-cols-[1fr_auto_1fr] items-center lg:grid-cols-[auto_1fr_auto] lg:gap-12">
            <div className="flex items-center lg:hidden">
              <button type="button" className={cn(iconBtn, "-ml-2.5")} aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
                <Menu className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <Logo className="justify-self-center lg:justify-self-start" />

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center justify-center gap-10 text-[0.9rem]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(pathname, link.href) ? "page" : undefined}
                      className="link-underline py-2 text-ivory/85 transition-colors hover:text-ivory aria-[current=page]:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center justify-self-end gap-0.5">
              <button type="button" className={iconBtn} aria-label="Search watches" onClick={() => setSearchOpen(true)}>
                <Search className="size-[1.15rem]" strokeWidth={1.5} />
              </button>
              <AccountMenu className={cn(iconBtn, "hidden sm:grid")} />
              <button type="button" className={cn(iconBtn, "-mr-2.5")} onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}>
                <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 26 }}
                      aria-hidden
                      className="absolute top-1.5 right-1 grid min-w-[1.1rem] place-items-center rounded-full bg-champagne px-1 text-[0.62rem] leading-[1.1rem] font-semibold text-[#0B0B0B]"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => { setMenuOpen(false); setSearchOpen(true); }} />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/** Account placeholder — accounts are out of scope for this demo. */
function AccountMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const wishlist = useWishlist((s) => s.slugs.length);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button type="button" className={className} aria-label="Account" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((v) => !v)}>
        <User className="size-[1.15rem]" strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Account (demo)"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full right-0 mt-3 w-72 border border-obsidian/10 bg-ivory p-5 text-obsidian shadow-2xl"
          >
            <p className="font-serif text-lg">Your account</p>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              Sign-in isn&apos;t part of this portfolio demo. Your cart and wishlist are saved in this browser only.
            </p>
            <p className="mt-4 flex items-center gap-2 border-t border-obsidian/10 pt-4 text-sm">
              <Heart className="size-4 text-champagne-deep" strokeWidth={1.6} />
              {wishlist} {wishlist === 1 ? "piece" : "pieces"} in your wishlist
            </p>
            <Link href="/shop" onClick={() => setOpen(false)} className="link-underline mt-3 text-sm font-medium">
              Browse the collection
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Pushes non-hero pages below the fixed header. */
export function HeaderSpacer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <div aria-hidden className="h-[108px] bg-obsidian" />;
}
