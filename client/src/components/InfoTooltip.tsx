import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InfoTooltipProps {
  explanation: string;
  controls?: string[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function InfoTooltip({
  explanation,
  controls,
  side = "bottom",
  align = "start",
}: InfoTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex w-[18px] h-[18px] rounded-full border border-primary/50 bg-primary/10 items-center justify-center hover:bg-primary/25 transition-colors shrink-0 focus:outline-none focus:ring-1 focus:ring-primary/40"
          aria-label="Learn how this helps CMMC Level 2 readiness"
        >
          <Info className="w-3 h-3 text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={8}
        className="w-80 p-0 border-primary/25 bg-[oklch(0.19_0.06_250)] text-[oklch(0.94_0.01_250)] shadow-xl shadow-black/40 rounded-sm"
      >
        {/* Accent bar */}
        <div className="h-[3px] bg-primary rounded-t-sm" />
        <div className="p-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-2.5">
            CMMC Level 2 Readiness Impact
          </p>
          <p className="text-xs leading-relaxed text-[oklch(0.80_0.02_255)]">
            {explanation}
          </p>
          {controls && controls.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
              {controls.map((ctrl) => (
                <span
                  key={ctrl}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary font-medium"
                >
                  {ctrl}
                </span>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
