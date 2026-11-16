import Link from "next/link";
import { cn } from "@/lib/format";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="VÉLOR — home"
      className={cn("font-serif text-[1.6rem] leading-none tracking-[0.14em] md:text-[1.85rem]", className)}
    >
      VÉLOR
    </Link>
  );
}

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
] as const;

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
