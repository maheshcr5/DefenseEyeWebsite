import { lazy, Suspense, useState } from "react";
import { MessageCircleQuestion, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CopilotChat = lazy(() => import("@/components/CopilotChat").then((mod) => ({ default: mod.CopilotChat })));

export default function CopilotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex max-w-[calc(100vw-2rem)] flex-col items-end sm:bottom-5">
      {open && (
        <div className="mb-3 h-[min(680px,calc(100vh-6.5rem))] w-[calc(100vw-2rem)] max-w-[460px] overflow-hidden rounded-lg">
          <Suspense fallback={<div className="h-full rounded-md border border-border/40 bg-card p-4 text-sm text-muted-foreground">Loading CMMC Copilot...</div>}>
            <CopilotChat compact />
          </Suspense>
        </div>
      )}
      <Button
        type="button"
        size="icon"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close CMMC Copilot" : "Open CMMC Copilot"}
        className="h-12 w-12 rounded-md bg-primary text-primary-foreground shadow-xl shadow-black/35 ring-1 ring-primary-foreground/20 hover:bg-primary/90 sm:h-14 sm:w-14"
      >
        {open ? <X className="size-5" /> : <MessageCircleQuestion className="size-5" />}
      </Button>
    </div>
  );
}
