import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "de_cookie_consent";

type ConsentState = "accepted" | "declined" | null;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState;
    if (!stored) {
      // Small delay so it doesn't flash immediately on page load
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    if (typeof window !== "undefined" && typeof (window as any).loadGA4 === "function") {
      (window as any).loadGA4();
    }
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60]
                     bg-card border border-border/60 shadow-2xl backdrop-blur-xl p-5"
        >
          {/* Dismiss */}
          <button
            onClick={decline}
            aria-label="Dismiss cookie banner"
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Cookie className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <p className="font-heading font-semibold text-sm text-foreground mb-1">
                We use cookies
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use essential cookies for site functionality and optional analytics
                cookies (Google Analytics) to understand how visitors use our site.
                Umami analytics are always active — they collect no personal data.
                Read our{" "}
                <a href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold flex-1"
              onClick={accept}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Accept All
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border/60 text-muted-foreground flex-1"
              onClick={decline}
            >
              Essential Only
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
