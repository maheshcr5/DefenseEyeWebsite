/*
 * What is CMMC? — Complete Guide
 * /knowledge-hub/what-is-cmmc
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import KnowledgeHubLayout from "@/components/KnowledgeHubLayout";

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-foreground pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── TOC & Related Articles data ─────────────────────────────────────────────

const TOC_ITEMS = [
  { id: "definition-purpose", label: "Definition & Purpose" },
  { id: "history", label: "History of CMMC" },
  { id: "who-needs-it", label: "Who Needs CMMC?" },
  { id: "three-levels", label: "The Three Levels" },
  { id: "vs-nist", label: "CMMC vs. NIST 800-171" },
  { id: "key-terms", label: "Key Terms Explained" },
  { id: "automation", label: "Automate with DefenseEye" },
  { id: "faq", label: "FAQ" },
];

const RELATED_ARTICLES = [
  {
    title: "CMMC Level 1 vs Level 2: Complete Comparison",
    href: "/knowledge-hub/cmmc-levels",
    description:
      "Understand which CMMC level applies to your contracts and what controls are required.",
  },
  {
    title: "Understanding Your SPRS Score",
    href: "/knowledge-hub/sprs-score",
    description:
      "Learn how SPRS scores are calculated, submitted, and improved for DoD contracts.",
  },
  {
    title: "CMMC Certification Process Step-by-Step",
    href: "/knowledge-hub/certification-process",
    description:
      "A complete walkthrough of the C3PAO assessment process and timeline.",
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function WhatIsCMMC() {
  return (
    <KnowledgeHubLayout
      title="What is CMMC? The Complete Guide to Cybersecurity Maturity Model Certification"
      description="CMMC (Cybersecurity Maturity Model Certification) is a DoD framework requiring defense contractors to demonstrate cybersecurity practices protecting Federal Contract Information and Controlled Unclassified Information. Learn everything about CMMC 2.0 levels, requirements, and certification."
      lastUpdated="April 2025"
      tocItems={TOC_ITEMS}
      relatedArticles={RELATED_ARTICLES}
      schemaType="FAQPage"
    >
      {/* ── H1 ── */}
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
        What is CMMC? The Complete Guide for DoD Contractors (2025)
      </h1>

      {/* ── Quick Answer Box ── */}
      <div className="bg-primary/5 border-l-4 border-primary p-5 mb-10 rounded-r">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          Quick Answer
        </p>
        <p className="text-foreground leading-relaxed">
          <strong>CMMC (Cybersecurity Maturity Model Certification)</strong> is
          a U.S. Department of Defense framework that requires defense
          contractors to meet specific cybersecurity standards before they can
          be awarded or maintain DoD contracts. CMMC 2.0 has three levels
          aligned to NIST 800-171 and NIST 800-172, with Level 2 requiring
          third-party assessment by a Certified Third-Party Assessment
          Organization (C3PAO). As of 2025, CMMC requirements are being phased
          into new DoD solicitations and will eventually apply to all 300,000+
          companies in the Defense Industrial Base.
        </p>
      </div>

      {/* ── Definition & Purpose ── */}
      <section id="definition-purpose" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          CMMC Definition and Purpose
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The <strong className="text-foreground">Cybersecurity Maturity Model Certification (CMMC)</strong> is
          a verification mechanism created by the U.S. Department of Defense
          (DoD) to ensure that defense contractors adequately protect sensitive
          government information. It combines cybersecurity standards,
          processes, and practices into a unified certification framework.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Prior to CMMC, defense contractors self-attested compliance with DFARS
          clause 252.204-7012 and NIST SP 800-171. This self-attestation model
          produced inconsistent results — a 2019 DoD Inspector General audit
          found that only 1 of 5 sampled contractors had properly implemented
          the required controls. CMMC was designed to close this verification
          gap.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The core purpose of CMMC is twofold: first, to protect{" "}
          <strong className="text-foreground">
            Federal Contract Information (FCI)
          </strong>{" "}
          — information the government provides to contractors for contract
          performance; and second, to protect{" "}
          <strong className="text-foreground">
            Controlled Unclassified Information (CUI)
          </strong>{" "}
          — sensitive but unclassified information that, if compromised, could
          damage national security.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Protects FCI",
              desc: "Federal Contract Information — data provided by or generated for the government under contract",
            },
            {
              title: "Protects CUI",
              desc: "Controlled Unclassified Information — sensitive data requiring safeguarding per Executive Order 13556",
            },
            {
              title: "Verifiable",
              desc: "Third-party assessments replace self-attestation for Level 2 and Level 3 contractors",
            },
            {
              title: "Scalable",
              desc: "Three tiered levels allow proportional requirements based on contract sensitivity",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card/60 backdrop-blur-sm border border-border/40 p-4 flex gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── History ── */}
      <section id="history" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          The History of CMMC — From DFARS to CMMC 2.0
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Understanding CMMC requires context about how DoD cybersecurity
          requirements evolved over the past decade.
        </p>
        <div className="space-y-0 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" />
          {[
            {
              year: "2015",
              event: "DFARS 252.204-7012",
              desc: "DoD issues DFARS clause requiring contractors to implement NIST 800-171 controls and report cyber incidents. Self-attestation only.",
            },
            {
              year: "2017",
              event: "NIST SP 800-171 Rev 1",
              desc: "NIST publishes revised guidance with 110 security requirements across 14 families for protecting CUI in non-federal systems.",
            },
            {
              year: "Jan 2020",
              event: "CMMC 1.0 Released",
              desc: "DoD releases CMMC Version 1.0 with five maturity levels (1–5) and requirement for third-party assessments. Initial rollout planned for select contracts.",
            },
            {
              year: "Nov 2021",
              event: "CMMC 2.0 Announced",
              desc: "DoD revises CMMC to three levels, removes unique process maturity practices, aligns Level 2 to NIST 800-171, and allows self-assessment for some Level 2 contracts.",
            },
            {
              year: "Dec 2023",
              event: "CMMC Final Rule (32 CFR Part 170)",
              desc: "DoD publishes the CMMC program final rule. The phased implementation begins with contracts issued after October 1, 2025.",
            },
            {
              year: "2025–2026",
              event: "Phase 1 & 2 Rollout",
              desc: "CMMC requirements begin appearing in DoD solicitations. Phase 1 focuses on Tier 1 programs; Phase 2 expands to all contracts handling CUI.",
            },
          ].map((item) => (
            <div key={item.year} className="relative pl-10 pb-8">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary" />
              <div className="bg-card/40 border border-border/30 p-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {item.year}
                  </span>
                  <span className="font-heading font-semibold text-foreground text-sm">
                    {item.event}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who Needs It ── */}
      <section id="who-needs-it" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          Who Needs CMMC Certification?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          CMMC applies to any organization that works on DoD contracts and
          handles FCI or CUI. This includes:
        </p>
        <ul className="space-y-3 mb-6">
          {[
            "Prime contractors directly contracting with the DoD",
            "Subcontractors at any tier in the DoD supply chain",
            "Managed Service Providers (MSPs) that handle DoD contractor data",
            "Cloud Service Providers (CSPs) whose platforms store or process CUI",
            "Foreign subsidiaries of U.S. defense contractors handling FCI/CUI",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-muted-foreground">
              <ChevronDown className="w-4 h-4 text-primary shrink-0 mt-1 rotate-[-90deg]" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <div className="bg-accent/5 border border-accent/20 p-4 rounded">
          <p className="text-sm text-foreground">
            <strong className="text-accent">Important:</strong> Even if you do
            not directly handle CUI, if your subcontract requires you to access
            DoD systems or government-furnished information, you may still need
            CMMC Level 1 certification. The required level will be specified in
            the contract's Request for Proposal (RFP).
          </p>
        </div>
      </section>

      {/* ── Three Levels ── */}
      <section id="three-levels" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          The Three Levels of CMMC 2.0
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          CMMC 2.0 streamlined the original five levels into three, each
          targeting a different category of contractor and data sensitivity.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Criterion
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40">
                  Level 1 — Foundational
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40">
                  Level 2 — Advanced
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary">
                  Level 3 — Expert
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  criterion: "Controls",
                  l1: "17 practices",
                  l2: "110 practices (NIST 800-171)",
                  l3: "110+ practices (NIST 800-172)",
                },
                {
                  criterion: "Data Type Protected",
                  l1: "FCI only",
                  l2: "CUI",
                  l3: "CUI in high-priority programs",
                },
                {
                  criterion: "Assessment Method",
                  l1: "Annual self-assessment",
                  l2: "Triennial C3PAO or annual self-assessment",
                  l3: "Triennial government-led assessment",
                },
                {
                  criterion: "Who Needs It",
                  l1: "All DoD contractors with FCI",
                  l2: "Contractors handling CUI (majority of DIB)",
                  l3: "Critical programs (OUSD R&E priority programs)",
                },
                {
                  criterion: "SPRS Score Required",
                  l1: "Yes (self-submitted)",
                  l2: "Yes (assessed)",
                  l3: "Yes (government assessed)",
                },
                {
                  criterion: "POA&M Allowed",
                  l1: "No",
                  l2: "Yes, limited",
                  l3: "No",
                },
              ].map((row, i) => (
                <tr
                  key={row.criterion}
                  className={`border border-border/30 ${
                    i % 2 === 0 ? "bg-card/20" : "bg-card/40"
                  }`}
                >
                  <td className="p-3 font-medium text-foreground border-r border-border/30">
                    {row.criterion}
                  </td>
                  <td className="p-3 text-muted-foreground border-r border-border/30">
                    {row.l1}
                  </td>
                  <td className="p-3 text-muted-foreground border-r border-border/30">
                    {row.l2}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.l3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          The vast majority of DIB contractors — approximately 80,000
          organizations — will need CMMC Level 2.
        </p>
      </section>

      {/* ── vs NIST ── */}
      <section id="vs-nist" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          CMMC vs. NIST 800-171: What's the Difference?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          CMMC and NIST 800-171 are closely related but distinct. NIST 800-171
          is the standard; CMMC is the verification mechanism that ensures
          contractors actually implement it.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Dimension
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40">
                  NIST SP 800-171
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary">
                  CMMC 2.0
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  dim: "Published by",
                  nist: "National Institute of Standards and Technology",
                  cmmc: "Department of Defense",
                },
                {
                  dim: "Nature",
                  nist: "Technical standard / guidance document",
                  cmmc: "Contractual certification program",
                },
                {
                  dim: "Verification",
                  nist: "Self-attestation historically",
                  cmmc: "Third-party C3PAO assessment (Level 2+)",
                },
                {
                  dim: "Controls",
                  nist: "110 requirements across 14 families",
                  cmmc: "Incorporates all 110 NIST 800-171 controls at Level 2",
                },
                {
                  dim: "Enforcement",
                  nist: "Required by DFARS 252.204-7012",
                  cmmc: "Contract award eligibility requirement",
                },
                {
                  dim: "Current version",
                  nist: "Rev 2 (2021), Rev 3 Final (2024)",
                  cmmc: "Version 2.0 (Final Rule Dec 2023)",
                },
              ].map((row, i) => (
                <tr
                  key={row.dim}
                  className={`border border-border/30 ${
                    i % 2 === 0 ? "bg-card/20" : "bg-card/40"
                  }`}
                >
                  <td className="p-3 font-medium text-foreground border-r border-border/30">
                    {row.dim}
                  </td>
                  <td className="p-3 text-muted-foreground border-r border-border/30">
                    {row.nist}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.cmmc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Key Terms ── */}
      <section id="key-terms" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          Key CMMC Terms Explained
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The CMMC ecosystem has its own vocabulary. Understanding these terms
          is essential for any DoD contractor navigating the certification
          process.
        </p>
        <div className="space-y-4">
          {[
            {
              term: "CUI — Controlled Unclassified Information",
              definition:
                "Information the government creates or possesses, or that an entity creates or possesses for or on behalf of the government, that a law, regulation, or government-wide policy requires or permits an agency to handle using safeguarding or dissemination controls. CUI is sensitive but not classified. Examples include export-controlled technical data, personally identifiable information (PII), and defense acquisition program information.",
            },
            {
              term: "FCI — Federal Contract Information",
              definition:
                "Information provided by or generated for the government under a contract to develop or deliver a product or service to the government, but not intended for public release. FCI is a broader category than CUI and has less stringent protection requirements (CMMC Level 1 with 17 practices).",
            },
            {
              term: "C3PAO — Certified Third-Party Assessment Organization",
              definition:
                "An organization certified by the CMMC Accreditation Body (Cyber AB) to conduct official CMMC Level 2 assessments. C3PAOs employ Certified CMMC Assessors (CCAs) who perform the actual assessment of a contractor's cybersecurity practices. A list of authorized C3PAOs is published at cyberab.org.",
            },
            {
              term: "SPRS — Supplier Performance Risk System",
              definition:
                "The DoD's Supplier Performance Risk System where contractors submit their self-assessed NIST 800-171 score. The SPRS score ranges from -203 to +110, with 110 representing full compliance. Contracting Officers can view SPRS scores during source selection. A negative score is permissible with an active POA&M showing remediation progress.",
            },
            {
              term: "POA&M — Plan of Action and Milestones",
              definition:
                "A documented plan that identifies tasks needed to remediate security control deficiencies, assigns responsibilities, allocates resources, and establishes milestones. Under CMMC 2.0, a limited POA&M is allowed at Level 2 — contractors may receive a conditional certification while completing remediations, provided no high-weighted deficiencies remain unresolved.",
            },
            {
              term: "SSP — System Security Plan",
              definition:
                "A formal document that describes the security requirements for an information system and describes the security controls in place or planned for meeting those requirements. The SSP is a core CMMC deliverable documenting all 110 NIST 800-171 controls and is reviewed during C3PAO assessments. CMMC Lens automates SSP generation from collected evidence.",
            },
          ].map((item) => (
            <div
              key={item.term}
              className="bg-card/60 backdrop-blur-sm border border-border/40 p-5"
            >
              <h3 className="font-heading font-bold text-foreground mb-2">
                {item.term}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Automation / Product ── */}
      <section id="automation" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How DefenseEye Automates CMMC Readiness
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          For most DoD contractors, the path to CMMC Level 2 certification is
          daunting: 110 controls to implement, hundreds of evidence artifacts to
          collect, SSPs and POA&Ms to write, and an SPRS score to calculate and
          submit. Without automation, this process typically takes 12–18 months
          and $150,000–$500,000 in consultant fees.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          <strong className="text-foreground">CMMC Lens by DefenseEye</strong>{" "}
          uses AI-driven automation to compress this timeline to 60–90 days for
          most small and mid-size contractors. The platform connects to your
          cloud environments (Azure Commercial, Azure GCC, Microsoft 365 Commercial, and M365 GCC High), automatically
          collects evidence for each NIST 800-171 control, generates a
          pre-populated SSP, calculates your live SPRS score, and produces
          remediation guidance ranked by priority.
        </p>
        <div className="bg-card/60 backdrop-blur-sm border border-primary/20 p-6 bracket-decoration">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground mb-1">
                CMMC Lens — Key Capabilities
              </p>
              <p className="text-sm text-muted-foreground">
                AI-powered CMMC 2.0 readiness in a single platform
              </p>
            </div>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 mb-6">
            {[
              "Automated evidence collection across 110 controls",
              "AI-generated SSP with control descriptions",
              "Live SPRS score calculation and SPRS submission support",
              "POA&M generation with prioritized remediation tasks",
              "Continuous compliance monitoring with drift alerts",
              "C3PAO readiness scoring and gap analysis",
            ].map((cap) => (
              <li
                key={cap}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{cap}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Book Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10"
            >
              Free Consultation
            </Button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>
            Learn more:{" "}
            <Link
              href="/knowledge-hub/cmmc-levels"
              className="text-primary hover:underline"
            >
              CMMC Level 1 vs Level 2 →
            </Link>
          </span>
          <span>
            <Link
              href="/knowledge-hub/sprs-score"
              className="text-primary hover:underline"
            >
              Understanding Your SPRS Score →
            </Link>
          </span>
          <span>
            <Link
              href="/knowledge-hub/certification-process"
              className="text-primary hover:underline"
            >
              CMMC Certification Process →
            </Link>
          </span>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Frequently Asked Questions About CMMC
        </h2>
        <div className="space-y-2">
          <FAQItem
            question="When does CMMC 2.0 go into effect for DoD contracts?"
            answer="CMMC 2.0 requirements began appearing in DoD solicitations in Phase 1 starting October 1, 2025. Phase 2, covering the broader Defense Industrial Base, is expected throughout 2026. All new DoD contracts issued after the full rollout will include CMMC requirements. Existing contracts may be modified to add CMMC requirements at option periods or contract renewals."
          />
          <FAQItem
            question="Can small businesses self-attest to CMMC Level 2?"
            answer="Yes, for a subset of Level 2 contracts designated as 'non-prioritized acquisition programs,' annual self-assessment and attestation by a senior company official is sufficient. However, for 'prioritized acquisition programs' — which include most contracts involving sensitive CUI — a triennial C3PAO assessment is required regardless of company size."
          />
          <FAQItem
            question="How much does CMMC Level 2 certification cost?"
            answer="A C3PAO assessment typically costs $50,000–$150,000 depending on company size, system complexity, and scope. Pre-assessment preparation (gap analysis, remediation, SSP writing) can cost an additional $100,000–$400,000 using traditional consultants. With tools like CMMC Lens, preparation costs can be reduced by 60–80% through automation of evidence collection and documentation."
          />
          <FAQItem
            question="What happens if I lose my CMMC certification?"
            answer="If a contractor fails to maintain CMMC compliance after certification, they may lose their certification status, which can result in contract termination for the relevant contract and ineligibility for future DoD contracts requiring CMMC. Contractors should maintain continuous compliance monitoring — a key capability provided by platforms like CMMC Lens."
          />
          <FAQItem
            question="Does CMMC apply to foreign companies with U.S. DoD contracts?"
            answer="Yes. CMMC requirements apply to all entities receiving DoD contracts that handle FCI or CUI, regardless of country of domicile. Non-U.S. companies must comply with CMMC just as U.S.-based contractors do, though implementation may have additional complexity due to cross-border data handling and foreign ownership, control, or influence (FOCI) considerations."
          />
        </div>
      </section>
    </KnowledgeHubLayout>
  );
}
