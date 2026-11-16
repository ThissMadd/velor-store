"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { Logo, NAV_LINKS, isActive } from "./Logo";
import { useDialog } from "@/lib/use-dialog";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MobileNav({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const pathname = usePathname();
  const ref = useDialog<HTMLDivElement>(open, onClose);
  const links = [...NAV_LINKS, { href: "/contact", label: "Contact" }];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="absolute inset-y-0 left-0 flex w-[min(88vw,380px)] flex-col bg-obsidian text-ivory outline-none"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <Logo onClick={onClose} />
              <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-11 place-items-center rounded-full hover:bg-ivory/10">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pt-8">
              <ul className="space-y-1">
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive(pathname, link.href) ? "page" : undefined}
                      className="block py-3 font-serif text-3xl text-ivory/80 transition-colors hover:text-ivory aria-[current=page]:text-champagne"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <button type="button" onClick={onSearch} className="mt-8 flex w-full items-center gap-3 border border-ivory/15 px-4 py-3.5 text-left text-sm text-ivory/70">
                <Search className="size-4" strokeWidth={1.5} /> Search watches
              </button>
            </nav>
            <p className="px-5 pb-8 text-xs leading-relaxed text-ivory/50">
              VÉLOR is a fictional brand created as a portfolio concept by Madd Agency.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
