import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function DemoNotice({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      role="note"
      className={cn(
        "flex items-start gap-2.5 border px-4 py-3 text-[0.82rem] leading-relaxed",
        tone === "light"
          ? "border-champagne/40 bg-champagne/[0.07] text-champagne-deep"
          : "border-ivory/15 bg-ivory/[0.04] text-ivory/75",
        className,
      )}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
      <span>{children}</span>
    </p>
  );
}
