import { lazy, Suspense, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CopilotChat = lazy(() => import("@/components/CopilotChat").then((mod) => ({ default: mod.CopilotChat })));

export default function CopilotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-[80] sm:bottom-4">
      {open && (
        <div className="mb-3 h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[430px] overflow-hidden rounded-lg">
          <Suspense fallback={<div className="h-full rounded-md border border-border/40 bg-card p-4 text-sm text-muted-foreground">Loading CMMC Copilot...</div>}>
            <CopilotChat compact />
          </Suspense>
        </div>
      )}
      <Button
        type="button"
        size="lg"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close CMMC Copilot" : "Open CMMC Copilot"}
        className="flex rounded-md bg-primary px-4 font-semibold text-primary-foreground shadow-lg shadow-black/30 ring-1 ring-primary-foreground/20 hover:bg-primary/90"
      >
        {open ? <X className="size-4" /> : <MessageSquare className="size-4" />}
        <span>{open ? "Close" : "CMMC Copilot"}</span>
      </Button>
    </div>
  );
}
