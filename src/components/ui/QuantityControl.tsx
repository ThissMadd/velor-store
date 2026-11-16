"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/format";
import { MAX_QTY } from "@/lib/store";

export function QuantityControl({
  value,
  onChange,
  min = 1,
  label = "Quantity",
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const btn = cn(
    "grid place-items-center text-obsidian transition-colors hover:bg-obsidian/5 disabled:opacity-30",
    size === "sm" ? "size-9" : "size-12",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center border border-obsidian/15 bg-white/60", className)}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-3.5" strokeWidth={1.6} />
      </button>
      <output aria-live="polite" className={cn("text-center text-sm tabular-nums", size === "sm" ? "w-7" : "w-10")}>
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <Plus className="size-3.5" strokeWidth={1.6} />
      </button>
    </div>
  );
}
