/*
 * NavBar — Shared mega-menu navigation component
 * Rendered on every page. Hover dropdowns on desktop, accordion on mobile.
 */

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";

const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

const MENUS = [
  {
    label: "Products",
    key: "products",
    items: [
      { label: "CMMCLens", desc: "AI-powered CMMC compliance automation", href: "/cmmclens" },
      { label: "Sprint Guide", desc: "4-week CMMC readiness playbook", href: "/cmmc-readiness-sprint-guide" },
    ],
  },
  {
    label: "Solutions",
    key: "solutions",
    items: [
      { label: "CMMC Readiness Sprint", desc: "Gap assessment to C3PAO-ready in 2–4 weeks", href: "/services/cmmc-readiness-sprint" },
      { label: "CMMC Scoping", desc: "Define your CUI boundary before the assessment", href: "/services/cmmc-scoping" },
    ],
  },
  {
    label: "Why DefenseEye?",
    key: "why",
    items: [
      { label: "Why Us", desc: "CCP-led, defense-only, real deliverables", href: "/why-defenseeye" },
      { label: "Case Studies", desc: "How defense contractors got CMMC-ready", href: "/case-studies" },
      { label: "FAQ", desc: "Common CMMC questions answered directly", href: "/faq" },
    ],
  },
  {
    label: "Knowledge Hub",
    key: "knowledge",
    cols: 2,
    items: [
      { label: "Hub Overview", desc: "All CMMC resources in one place", href: "/knowledge-hub" },
      { label: "What is CMMC?", desc: "Framework fundamentals explained", href: "/knowledge-hub/what-is-cmmc" },
      { label: "CMMC Levels", desc: "Level 1, 2, and 3 requirements", href: "/knowledge-hub/cmmc-levels" },
      { label: "Evidence Mapping", desc: "NIST 800-171 control evidence guide", href: "/knowledge-hub/evidence-mapping" },
      { label: "SPRS Score", desc: "Calculate and improve your score", href: "/knowledge-hub/sprs-score" },
      { label: "Certification Process", desc: "C3PAO assessment process walkthrough", href: "/knowledge-hub/certification-process" },
      { label: "Blog", desc: "CMMC news, analysis, and updates", href: "/blog" },
    ],
  },
];

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const toggleMobileCategory = (key: string) => {
    setMobileExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm section-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <DefenseEyeLogo href="/" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {MENUS.map((menu) => (
            <div
              key={menu.key}
              className="relative"
              onMouseEnter={() => handleEnter(menu.key)}
              onMouseLeave={handleLeave}
            >
              {/* Trigger */}
              <button
                className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  openMenu === menu.key
                    ? "text-primary bg-gray-50"
                    : "text-[#0D1B33] hover:text-primary hover:bg-gray-50"
                }`}
                aria-expanded={openMenu === menu.key}
                aria-haspopup="true"
              >
                {menu.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === menu.key ? "rotate-180 text-primary" : ""}`}
                />
              </button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {openMenu === menu.key && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3 ${
                      menu.cols === 2 ? "w-[480px] grid grid-cols-2 gap-1" : "w-[260px] flex flex-col gap-1"
                    }`}
                    onMouseEnter={() => handleEnter(menu.key)}
                    onMouseLeave={handleLeave}
                  >
                    {menu.items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex flex-col px-3 py-2.5 rounded-sm hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-sm font-semibold text-[#0D1B33] group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {item.desc}
                        </span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Pricing — plain link, no dropdown */}
          <a
            href="/pricing"
            className="px-4 py-2 text-sm font-medium text-[#0D1B33] hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-5">
              Book a Call
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#0D1B33] p-1"
          onClick={() => { setMobileOpen(!mobileOpen); setMobileExpanded(null); }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">

              {/* Dropdown categories */}
              {MENUS.map((menu) => (
                <div key={menu.key}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-[#0D1B33] hover:text-primary rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => toggleMobileCategory(menu.key)}
                  >
                    {menu.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === menu.key ? "rotate-180 text-primary" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileExpanded === menu.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden pl-3"
                      >
                        {menu.items.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="flex flex-col px-3 py-2 rounded-sm hover:bg-gray-50 transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="text-sm font-medium text-[#0D1B33]">{item.label}</span>
                            <span className="text-xs text-muted-foreground">{item.desc}</span>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Pricing plain link */}
              <a
                href="/pricing"
                className="px-3 py-2.5 text-sm font-semibold text-[#0D1B33] hover:text-primary rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </a>

              <div className="pt-2 border-t border-gray-100 mt-1">
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                  <Button className="bg-accent text-accent-foreground font-semibold w-full">
                    Book a Call
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
