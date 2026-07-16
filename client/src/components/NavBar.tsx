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

type MenuItem = {
  label: string;
  desc: string;
  href: string;
  children?: MenuItem[];
};

type Menu = {
  label: string;
  key: string;
  cols?: number;
  items: MenuItem[];
};

const MENUS: Menu[] = [
  {
    label: "Portfolios",
    key: "portfolios",
    items: [
      { label: "Secure AI Adoption", desc: "AI governance, Copilot readiness, AI security, and responsible AI", href: "/secure-ai-adoption" },
      {
        label: "AttackSense",
        desc: "AI-assisted attack surface, vulnerability, and remediation intelligence",
        href: "/attacksense",
        children: [
          { label: "Docs", desc: "AttackSense Quick Start Guide", href: "/attacksense/docs" },
        ],
      },
      { label: "CMMC & Compliance Automation", desc: "CCP-led readiness, NIST 800-171, evidence automation, and CMMCLens", href: "/cmmc-compliance-automation" },
      { label: "Microsoft Copilot Readiness", desc: "Microsoft 365, data, identity, privacy, and rollout controls", href: "/solutions/microsoft-copilot-readiness" },
      { label: "Microsoft Cloud Security", desc: "Azure, Entra, Defender, Sentinel, Purview, and GCC High patterns", href: "/solutions/cloud-security" },
    ],
  },
  {
    label: "CMMCLens",
    key: "cmmclens",
    items: [
      { label: "CMMCLens Platform", desc: "Compliance evidence automation and readiness dashboards", href: "/cmmclens" },
      { label: "CMMCLens Product Sheet", desc: "Procurement-ready product overview", href: "/datasheets/cmmclens" },
      { label: "CMMC Evidence Automation", desc: "Evidence workflows and control traceability", href: "/cmmc-evidence-automation" },
    ],
  },
  {
    label: "Datasheets",
    key: "datasheets",
    items: [
      { label: "All Datasheets", desc: "AI adoption, CMMC automation, CMMCLens, Copilot, and supplier assets", href: "/datasheets" },
      { label: "Secure AI Adoption", desc: "One-page AI governance and secure adoption overview", href: "/datasheets/secure-ai-adoption" },
      { label: "CMMC Automation", desc: "One-page CCP-led readiness and evidence automation overview", href: "/datasheets/cmmc-compliance-automation" },
      { label: "Supplier Readiness", desc: "Identifiers, credentials, and engagement models", href: "/datasheets/supplier-readiness" },
    ],
  },
  {
    label: "Supplier Readiness",
    key: "supplier",
    items: [
      { label: "Supplier Readiness", desc: "Supplier identifiers, certifications, and engagement models", href: "/supplier-readiness" },
      { label: "Capability Statement", desc: "Procurement-ready company overview", href: "/capability-statement" },
      { label: "Delivery Model", desc: "How DefenseEye structures enterprise work", href: "/delivery-model" },
      { label: "Representative Engagements", desc: "Engagement types DefenseEye is positioned to support", href: "/representative-engagements" },
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
                      <div key={item.href}>
                        <a
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
                        {item.children?.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            className="ml-3 flex flex-col border-l border-gray-200 px-3 py-2 rounded-sm hover:bg-gray-50 transition-colors group"
                          >
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#0D1B33] group-hover:text-primary transition-colors">
                              {child.label}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5 leading-snug">
                              {child.desc}
                            </span>
                          </a>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Contact — plain link, no dropdown */}
          <a
            href="/contact"
            className="px-4 py-2 text-sm font-medium text-[#0D1B33] hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-5">
              Discuss Supplier Opportunities
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
                          <div key={item.href}>
                            <a
                              href={item.href}
                              className="flex flex-col px-3 py-2 rounded-sm hover:bg-gray-50 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              <span className="text-sm font-medium text-[#0D1B33]">{item.label}</span>
                              <span className="text-xs text-muted-foreground">{item.desc}</span>
                            </a>
                            {item.children?.map((child) => (
                              <a
                                key={child.href}
                                href={child.href}
                                className="ml-3 flex flex-col border-l border-gray-200 px-3 py-2 rounded-sm hover:bg-gray-50 transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#0D1B33]">{child.label}</span>
                                <span className="text-xs text-muted-foreground">{child.desc}</span>
                              </a>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Contact plain link */}
              <a
                href="/contact"
                className="px-3 py-2.5 text-sm font-semibold text-[#0D1B33] hover:text-primary rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </a>

              <div className="pt-2 border-t border-gray-100 mt-1">
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                  <Button className="bg-accent text-accent-foreground font-semibold w-full">
                    Discuss Supplier Opportunities
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
