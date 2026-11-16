import { Check } from "lucide-react";
import { cn } from "@/lib/format";

export function Stepper({ steps, current, className }: { steps: readonly string[]; current: number; className?: string }) {
  return (
    <ol className={cn("flex items-center", className)} aria-label="Checkout progress">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")} aria-current={active ? "step" : undefined}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border text-sm transition-colors duration-500",
                  done && "border-champagne bg-champagne text-[#0B0B0B]",
                  active && "border-ivory bg-ivory text-[#0B0B0B] ring-4 ring-ivory/10",
                  !done && !active && "border-obsidian/25 text-stone",
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn("text-xs", active ? "font-medium text-obsidian" : "text-stone")}>
                {label}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden className="relative mx-3 mb-6 h-px flex-1 bg-obsidian/15">
                <span className="absolute inset-y-0 left-0 bg-champagne transition-[width] duration-700 ease-(--ease-luxe)" style={{ width: done ? "100%" : "0%" }} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
