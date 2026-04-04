/*
 * CMMC Level 1 vs Level 2 — Complete Comparison Guide
 * /knowledge-hub/cmmc-levels
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import KnowledgeHubLayout from "@/components/KnowledgeHubLayout";

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

const TOC_ITEMS = [
  { id: "level-1", label: "CMMC Level 1" },
  { id: "level-2", label: "CMMC Level 2" },
  { id: "comparison", label: "Side-by-Side Comparison" },
  { id: "determine-level", label: "How to Determine Your Level" },
  { id: "domain-breakdown", label: "Level 2 Domain Breakdown" },
  { id: "sprs-role", label: "Role of SPRS Score" },
  { id: "automation", label: "DefenseEye Support" },
  { id: "faq", label: "FAQ" },
];

const RELATED_ARTICLES = [
  {
    title: "What is CMMC? Complete Guide",
    href: "/knowledge-hub/what-is-cmmc",
    description:
      "Foundational overview of CMMC 2.0, its history, and key definitions.",
  },
  {
    title: "Understanding Your SPRS Score",
    href: "/knowledge-hub/sprs-score",
    description:
      "How SPRS scores are calculated, submitted, and improved.",
  },
  {
    title: "CMMC Certification Process Step-by-Step",
    href: "/knowledge-hub/certification-process",
    description:
      "Complete walkthrough of the C3PAO assessment process and timeline.",
  },
];

const LEVEL_1_PRACTICES = [
  "AC.L1-3.1.1 — Limit information system access to authorized users",
  "AC.L1-3.1.2 — Limit information system access to transactions and functions authorized users are permitted to execute",
  "AC.L1-3.1.20 — Verify and control all connections to external systems",
  "AC.L1-3.1.22 — Control CUI posted or processed on publicly accessible systems",
  "IA.L1-3.5.1 — Identify information system users, processes acting on behalf of users, and devices",
  "IA.L1-3.5.2 — Authenticate the identities of users, processes, and devices before allowing access",
  "MP.L1-3.8.3 — Sanitize or destroy information system media before disposal or reuse",
  "PE.L1-3.10.1 — Limit physical access to organizational information systems to authorized individuals",
  "PE.L1-3.10.3 — Escort visitors and monitor visitor activity",
  "PE.L1-3.10.4 — Maintain audit logs of physical access",
  "PE.L1-3.10.5 — Control and manage physical access devices",
  "SC.L1-3.13.1 — Monitor, control, and protect organizational communications",
  "SC.L1-3.13.5 — Implement subnetworks for publicly accessible system components",
  "SI.L1-3.14.1 — Identify, report, and correct information and information system flaws",
  "SI.L1-3.14.2 — Provide protection from malicious code at appropriate locations",
  "SI.L1-3.14.4 — Update malicious code protection mechanisms",
  "SI.L1-3.14.5 — Perform periodic scans of the information system and real-time scans of files from external sources",
];

const LEVEL_2_DOMAINS = [
  { domain: "Access Control (AC)", count: 22, examples: "Multi-factor authentication, least privilege, remote access controls, wireless access restrictions" },
  { domain: "Awareness and Training (AT)", count: 3, examples: "Security awareness training, insider threat awareness, role-based security training" },
  { domain: "Audit and Accountability (AU)", count: 9, examples: "Audit log generation, log review, protection, retention policies, user activity monitoring" },
  { domain: "Configuration Management (CM)", count: 9, examples: "Baseline configurations, configuration change control, security configuration settings, software use restrictions" },
  { domain: "Identification and Authentication (IA)", count: 11, examples: "Password management, MFA enforcement, authenticator management, identifier reuse policies" },
  { domain: "Incident Response (IR)", count: 3, examples: "Incident response capability, incident tracking, post-incident review" },
  { domain: "Maintenance (MA)", count: 6, examples: "Controlled maintenance, maintenance tools, remote maintenance, timely maintenance" },
  { domain: "Media Protection (MP)", count: 9, examples: "Media access, marking, storage, transport, sanitization, and destruction controls" },
  { domain: "Personnel Security (PS)", count: 2, examples: "Screening individuals before access, protecting CUI during and after personnel actions" },
  { domain: "Physical Protection (PE)", count: 6, examples: "Physical access authorizations, access control for output devices, alternate work site security" },
  { domain: "Risk Assessment (RA)", count: 3, examples: "Risk assessments, vulnerability scanning, remediation based on risk" },
  { domain: "Security Assessment (CA)", count: 4, examples: "System assessment, plan of action development, operational monitoring, C3PAO-readiness" },
  { domain: "System and Comm. Protection (SC)", count: 16, examples: "Network segmentation, data-in-transit encryption, network monitoring, denial-of-service protection" },
  { domain: "System and Info. Integrity (SI)", count: 7, examples: "Malware protection, security alerts, patch management, integrity checking, spam protection" },
];

export default function CMMCLevels() {
  return (
    <KnowledgeHubLayout
      title="CMMC Level 1 vs Level 2: Complete Comparison Guide for DoD Contractors"
      description="Understand the difference between CMMC Level 1 (17 practices, FCI) and CMMC Level 2 (110 controls, CUI). Includes side-by-side comparison table, all 14 NIST 800-171 domains, and how to determine which level your contract requires."
      lastUpdated="April 2025"
      tocItems={TOC_ITEMS}
      relatedArticles={RELATED_ARTICLES}
    >
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
        CMMC Level 1 vs Level 2: Which Do You Need? (2025 Guide)
      </h1>

      {/* Quick Answer */}
      <div className="bg-primary/5 border-l-4 border-primary p-5 mb-10 rounded-r">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          Quick Answer
        </p>
        <p className="text-foreground leading-relaxed">
          <strong>CMMC Level 1</strong> applies to all DoD contractors that
          handle Federal Contract Information (FCI) — it requires just 17
          cybersecurity practices and annual self-attestation.{" "}
          <strong>CMMC Level 2</strong> applies to contractors handling
          Controlled Unclassified Information (CUI) — it requires all 110 NIST
          SP 800-171 controls, and most contractors must undergo a triennial
          third-party assessment by a C3PAO. Check your contract's Statement of
          Work or DD Form 254 to determine which level is required.
        </p>
      </div>

      {/* Level 1 */}
      <section id="level-1" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          CMMC Level 1 — Federal Contract Information (FCI) Protection
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          CMMC Level 1, "Foundational," establishes a minimum cybersecurity
          baseline for all DoD contractors. It incorporates the 17 practices
          from FAR clause 52.204-21 (Basic Safeguarding of Covered Contractor
          Information Systems). These practices cover the most fundamental
          security hygiene: access control, physical security, and basic system
          integrity.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Level 1 requires annual self-assessment submitted by a senior company
          official (typically the CIO or CEO) to the Supplier Performance Risk
          System (SPRS). No third-party assessor is required.
        </p>
        <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-5 mb-4">
          <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            All 17 CMMC Level 1 Practices
          </h3>
          <ul className="space-y-2">
            {LEVEL_1_PRACTICES.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-accent/5 border border-accent/20 p-4 rounded text-sm text-foreground">
          <strong className="text-accent">Note:</strong> All 17 Level 1
          practices are also included in Level 2. Companies pursuing Level 2
          must implement all 17 Level 1 practices plus the additional 93
          practices for the full 110-control NIST 800-171 requirement.
        </div>
      </section>

      {/* Level 2 */}
      <section id="level-2" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          CMMC Level 2 — Controlled Unclassified Information (CUI) Protection
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          CMMC Level 2, "Advanced," is the level that applies to the vast
          majority of Defense Industrial Base companies — approximately 80,000
          organizations. It requires full implementation of all 110 security
          requirements in NIST SP 800-171 Rev 2, organized across 14 control
          families (domains).
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          For most Level 2 contracts, a triennial assessment by a Certified
          Third-Party Assessment Organization (C3PAO) is required. In between
          C3PAO assessments, contractors must conduct annual self-assessments
          and submit their SPRS scores. A subset of contracts (non-prioritized
          acquisitions) may satisfy Level 2 through annual self-assessment and
          senior official attestation.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Level 2 also requires a documented System Security Plan (SSP)
          describing all 110 controls, and a Plan of Action and Milestones
          (POA&M) for any controls not yet fully implemented. Note that certain
          controls are considered "high-weighted" — these must be fully
          implemented before a C3PAO assessment can result in certification.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { value: "110", label: "Total Controls Required" },
            { value: "14", label: "Control Domains" },
            { value: "3 yrs", label: "C3PAO Assessment Cycle" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card/60 backdrop-blur-sm border border-border/40 p-4 text-center"
            >
              <p className="font-heading text-2xl font-bold text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          Side-by-Side Comparison Table
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Use this table to quickly understand the key differences between CMMC
          Level 1 and Level 2 across all critical dimensions.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Dimension
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40">
                  Level 1 — Foundational
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary">
                  Level 2 — Advanced
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: "Controls Count", l1: "17 practices", l2: "110 controls (all NIST 800-171)" },
                { dim: "Data Protected", l1: "FCI (Federal Contract Information)", l2: "CUI (Controlled Unclassified Information)" },
                { dim: "Assessment Type", l1: "Annual self-assessment", l2: "Triennial C3PAO or annual self-assessment" },
                { dim: "Assessment Frequency", l1: "Annually", l2: "C3PAO every 3 years; self-assessment annually between" },
                { dim: "C3PAO Required", l1: "No", l2: "Yes (for prioritized acquisition programs)" },
                { dim: "SPRS Score", l1: "Self-submitted", l2: "Assessed and submitted; minimum score required" },
                { dim: "Documentation Required", l1: "Minimal; basic access records", l2: "SSP, POA&M, asset inventory, network diagrams, policy set" },
                { dim: "Typical Timeline", l1: "2–4 weeks for preparation", l2: "6–18 months (manual); 60–90 days with CMMC Lens" },
                { dim: "Cost Estimate", l1: "$5,000–$25,000 (preparation)", l2: "$150,000–$550,000 (manual); significantly less with automation" },
                { dim: "DefenseEye Support", l1: "Full automation of 17 controls", l2: "Full 110-control evidence collection, SSP, POA&M, SPRS" },
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
                    {row.l1}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.l2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Determine Level */}
      <section id="determine-level" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How to Determine Your Required CMMC Level
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Your required CMMC level is determined by the type of information you
          handle under DoD contracts. Follow this decision process:
        </p>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Review your contracts and solicitations",
              desc: "Check for DFARS clause 252.204-7012 (requires NIST 800-171 compliance, indicates CUI) and DFARS 252.204-7021 (CMMC requirement). The required CMMC level will be explicitly stated in the solicitation.",
            },
            {
              step: "2",
              title: "Review your DD Form 254",
              desc: "The Contract Security Classification Specification (DD Form 254) details what classified and controlled information you'll handle. Presence of CUI categories (export-controlled, technical data, etc.) typically indicates Level 2.",
            },
            {
              step: "3",
              title: "Identify what information you receive and generate",
              desc: "If your contract involves design specifications, engineering drawings, technical data packages, procurement information, or any government-provided technical data — that's likely CUI requiring Level 2.",
            },
            {
              step: "4",
              title: "Consider your subcontractor relationships",
              desc: "If you're a subcontractor, your required level is determined by the data you handle, not your prime contractor's level. Your prime contractor should flow down CMMC requirements in your subcontract.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 bg-card/40 border border-border/30 p-4"
            >
              <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 font-heading font-bold text-primary text-sm">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Domain Breakdown */}
      <section id="domain-breakdown" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          CMMC Level 2 Domain Breakdown
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          CMMC Level 2's 110 controls are organized across 14 domains drawn
          directly from NIST SP 800-171. Here is a breakdown of each domain,
          the number of controls, and representative control examples.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Domain
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40 w-16">
                  Controls
                </th>
                <th className="text-left p-3 font-heading font-semibold text-foreground">
                  Example Controls
                </th>
              </tr>
            </thead>
            <tbody>
              {LEVEL_2_DOMAINS.map((row, i) => (
                <tr
                  key={row.domain}
                  className={`border border-border/30 ${
                    i % 2 === 0 ? "bg-card/20" : "bg-card/40"
                  }`}
                >
                  <td className="p-3 font-medium text-foreground border-r border-border/30">
                    {row.domain}
                  </td>
                  <td className="p-3 text-center text-primary font-semibold border-r border-border/30">
                    {row.count}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs leading-relaxed">
                    {row.examples}
                  </td>
                </tr>
              ))}
              <tr className="bg-primary/10 border border-primary/30">
                <td className="p-3 font-heading font-bold text-foreground border-r border-border/30">
                  TOTAL
                </td>
                <td className="p-3 text-center font-heading font-bold text-primary border-r border-border/30">
                  110
                </td>
                <td className="p-3 text-muted-foreground text-xs">
                  Full NIST SP 800-171 Rev 2 control set
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SPRS Role */}
      <section id="sprs-role" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          The Role of SPRS Score in CMMC Level 2
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          For CMMC Level 2, your Supplier Performance Risk System (SPRS) score
          is a critical compliance indicator. The SPRS score is calculated from
          the 110 NIST 800-171 controls, with each control assigned a point
          value. A perfect score is 110 (full compliance); scores can go as low
          as -203 if all controls are missing.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Contracting Officers review SPRS scores during source selection. While
          there is no mandated minimum SPRS score for contract award, a very
          low score (particularly negative values) signals high cybersecurity
          risk and can disadvantage contractors in competitive bids.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          For CMMC Level 2 C3PAO assessments, you must demonstrate actual
          implementation of controls — your SPRS score is reassessed by the
          C3PAO and reported to the DoD. Gaps identified during assessment must
          be remediated per your POA&M before conditional or full certification
          is granted.
        </p>
        <div className="mt-5">
          <Link
            href="/knowledge-hub/sprs-score"
            className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
          >
            Read the full SPRS Score guide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Automation CTA */}
      <section id="automation" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How CMMC Lens Supports Both Levels
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Whether your contracts require Level 1 or Level 2, CMMC Lens by
          DefenseEye provides complete automation support — eliminating the
          manual burden of evidence collection, documentation, and continuous
          compliance monitoring.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            {
              title: "Level 1 Support",
              features: [
                "Automated evidence for all 17 FCI protection practices",
                "Annual self-assessment workflow and SPRS submission",
                "Policy templates for all Level 1 control families",
                "Annual assessment reminders and scheduling",
              ],
            },
            {
              title: "Level 2 Support",
              features: [
                "Full 110-control evidence collection from cloud environments",
                "AI-generated SSP with all control descriptions and implementations",
                "POA&M with prioritized remediation tasks and timeline",
                "Live SPRS score calculation with drill-down by domain",
              ],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card/60 backdrop-blur-sm border border-border/40 p-5"
            >
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {item.title}
              </h3>
              <ul className="space-y-2">
                {item.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          <FAQItem
            question="Can a company be certified at Level 1 and then upgrade to Level 2 later?"
            answer="Yes. CMMC levels are determined by individual contracts, not company-wide status. A company may hold Level 1 certification for some contracts and pursue Level 2 certification separately for contracts requiring it. However, since Level 1 practices are a subset of Level 2, companies planning to pursue Level 2 should implement the full 110 controls from the start to avoid duplicating effort."
          />
          <FAQItem
            question="What is a 'prioritized acquisition program' that requires a C3PAO assessment?"
            answer="Prioritized acquisition programs are DoD programs that the Under Secretary of Defense for Research and Engineering (OUSD R&E) has identified as having elevated risk of CUI exposure due to the nature of the technology or information involved. These include advanced weapons systems, critical technology programs, and contracts involving export-controlled technical data. The specific designation appears in the contract solicitation."
          />
          <FAQItem
            question="How long is a CMMC Level 2 C3PAO assessment valid?"
            answer="A CMMC Level 2 C3PAO assessment is valid for three years. During this period, the contractor must conduct and submit annual self-assessments (at Years 1 and 2) and undergo a new C3PAO assessment at Year 3. Any significant changes to the contractor's information system scope may trigger a requirement for an earlier reassessment."
          />
          <FAQItem
            question="What is a 'conditional' CMMC Level 2 certification?"
            answer="A conditional certification is granted when a C3PAO assessment identifies deficiencies that are documented in a POA&M. The contractor receives a conditional CMMC Level 2 certification and has 180 days to remediate the identified deficiencies. Upon successful remediation and verification, the certification becomes final. Note: no 'high-weighted' control deficiencies are permitted in a conditional certification — those must be resolved before certification is granted."
          />
          <FAQItem
            question="Does CMMC Level 2 require FedRAMP-authorized cloud services?"
            answer="Not necessarily for all cloud services, but if you store or process CUI in a cloud environment, that cloud service must meet FedRAMP Moderate or equivalent security standards (DoD IL2+) under DFARS 252.239-7010. Microsoft 365 GCC High and Azure Government are commonly used FedRAMP-authorized environments for CMMC Level 2 compliance. CMMC Lens integrates with Azure Commercial, Azure GCC, M365 Commercial, and M365 GCC High for evidence collection."
          />
        </div>
      </section>
    </KnowledgeHubLayout>
  );
}
