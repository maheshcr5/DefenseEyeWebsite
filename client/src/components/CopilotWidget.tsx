import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, MessageCircleQuestion, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CopilotChat = lazy(() => import("@/components/CopilotChat").then((mod) => ({ default: mod.CopilotChat })));
const POPUP_STORAGE_KEY = "defenseeye-copilot-popup-dismissed-at";
const POPUP_COOLDOWN_MS = 12 * 60 * 60 * 1000;

export default function CopilotWidget() {
  const [open, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem(POPUP_STORAGE_KEY) || "0");
    if (dismissedAt && Date.now() - dismissedAt < POPUP_COOLDOWN_MS) return;

    const timer = window.setTimeout(() => setShowPrompt(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  function openCopilot() {
    setOpen(true);
    setShowPrompt(false);
  }

  function dismissPrompt() {
    localStorage.setItem(POPUP_STORAGE_KEY, String(Date.now()));
    setShowPrompt(false);
  }

  return (
    <div className="fixed bottom-20 right-4 z-[80] flex max-w-[calc(100vw-2rem)] flex-col items-end sm:bottom-5">
      {open && (
        <div className="mb-3 h-[min(700px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[460px] overflow-hidden rounded-lg">
          <Suspense fallback={<div className="h-full rounded-md border border-border/40 bg-card p-4 text-sm text-muted-foreground">Loading CMMC Copilot...</div>}>
            <CopilotChat compact />
          </Suspense>
        </div>
      )}
      {showPrompt && !open && (
        <div className="relative mb-3 w-[calc(100vw-2rem)] max-w-[390px] rounded-md border border-primary/40 bg-card/95 p-4 text-card-foreground shadow-2xl shadow-black/35 ring-1 ring-primary/15 backdrop-blur">
          <button
            type="button"
            onClick={dismissPrompt}
            aria-label="Dismiss CMMC Copilot prompt"
            className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
          <div className="flex gap-3 pr-6">
            <div className="relative flex size-11 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
              <Sparkles className="absolute -right-1 -top-1 size-3.5 text-accent" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold leading-snug">Ask the CMMC Copilot</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Get quick answers on CUI scoping, SPRS, SSPs, evidence, CMMCLens, and assessment readiness.
              </p>
              <button
                type="button"
                onClick={openCopilot}
                className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <Sparkles className="size-3.5" />
                Start chat
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <Button
        type="button"
        size="lg"
        onClick={() => {
          setShowPrompt(false);
          setOpen((value) => !value);
        }}
        aria-label={open ? "Close CMMC Copilot" : "Open CMMC Copilot"}
        className="group flex h-12 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-xl shadow-black/35 ring-1 ring-primary-foreground/20 hover:bg-primary/90 sm:h-14 sm:px-5"
      >
        {open ? (
          <X className="size-4" />
        ) : (
          <span className="relative flex size-5 items-center justify-center">
            <MessageCircleQuestion className="size-5" />
            <Sparkles className="absolute -right-1 -top-1 size-3 text-accent transition-transform group-hover:scale-110" />
          </span>
        )}
        <span>{open ? "Close" : "Ask CMMC Copilot"}</span>
      </Button>
    </div>
  );
}
