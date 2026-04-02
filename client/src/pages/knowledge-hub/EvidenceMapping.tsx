/*
 * Automated Evidence Mapping for NIST 800-171
 * /knowledge-hub/evidence-mapping
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Shield, CheckCircle2, Zap } from "lucide-react";
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
  { id: "what-is-evidence-mapping", label: "What is Evidence Mapping?" },
  { id: "control-families", label: "14 Control Families" },
  { id: "manual-vs-automated", label: "Manual vs. Automated" },
  { id: "how-ai-works", label: "How AI Collection Works" },
  { id: "cloud-integration", label: "Cloud Environment Integration" },
  { id: "ssp-poam", label: "SSP & POA&M Generation" },
  { id: "cmmc-lens", label: "CMMC Lens Automation" },
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
    title: "CMMC Level 1 vs Level 2",
    href: "/knowledge-hub/cmmc-levels",
    description:
      "Side-by-side comparison of both CMMC levels and their control requirements.",
  },
  {
    title: "CMMC Certification Process",
    href: "/knowledge-hub/certification-process",
    description:
      "Step-by-step walkthrough of the C3PAO assessment and certification process.",
  },
];

const CONTROL_FAMILIES = [
  { family: "Access Control (AC)", count: 22, examples: "User access management, least privilege, remote access, wireless access restrictions, CUI flow control" },
  { family: "Awareness and Training (AT)", count: 3, examples: "Security awareness training, insider threat training, role-based training for privileged users" },
  { family: "Audit and Accountability (AU)", count: 9, examples: "Event logging, log protection, user activity monitoring, audit record review, audit log retention" },
  { family: "Configuration Management (CM)", count: 9, examples: "Baseline configuration, change control, security configuration settings, user-installed software restrictions" },
  { family: "Identification and Authentication (IA)", count: 11, examples: "Multi-factor authentication, password management, device authentication, replay-resistant authentication" },
  { family: "Incident Response (IR)", count: 3, examples: "Incident response policy, incident tracking, post-incident review and lessons learned" },
  { family: "Maintenance (MA)", count: 6, examples: "Controlled maintenance, maintenance tools, remote maintenance controls, maintenance records" },
  { family: "Media Protection (MP)", count: 9, examples: "Media access, marking, storage, transport sanitization, media use restrictions" },
  { family: "Personnel Security (PS)", count: 2, examples: "Individual screening before granting access, CUI protection during and after personnel termination" },
  { family: "Physical Protection (PE)", count: 6, examples: "Physical access authorization, visitor controls, physical access logs, CUI output device protection" },
  { family: "Risk Assessment (RA)", count: 3, examples: "Periodic risk assessments, vulnerability scanning, risk response and remediation tracking" },
  { family: "Security Assessment (CA)", count: 4, examples: "Periodic system assessments, POA&M development, operational monitoring, connection security" },
  { family: "System and Communications Protection (SC)", count: 16, examples: "Network segmentation, CUI encryption in transit, network traffic monitoring, DNS filtering" },
  { family: "System and Information Integrity (SI)", count: 7, examples: "Malware protection, security alerts, patch management, software integrity verification" },
];

export default function EvidenceMapping() {
  return (
    <KnowledgeHubLayout
      title="Automated Evidence Mapping for NIST 800-171: How AI Transforms CMMC Readiness"
      description="Learn how automated evidence mapping for NIST 800-171 works, covering all 14 control families. Compare manual vs. AI-driven collection and see how CMMC Lens automates SSP and POA&M generation for DoD contractors."
      lastUpdated="April 2025"
      tocItems={TOC_ITEMS}
      relatedArticles={RELATED_ARTICLES}
    >
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
        Automated Evidence Mapping for NIST 800-171: A Complete Guide
      </h1>

      {/* Quick Answer */}
      <div className="bg-primary/5 border-l-4 border-primary p-5 mb-10 rounded-r">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          Quick Answer
        </p>
        <p className="text-foreground leading-relaxed">
          <strong>NIST 800-171 evidence mapping</strong> is the process of
          collecting, organizing, and documenting proof that each of the 110
          security controls is implemented in your environment. Historically
          done manually — requiring hundreds of hours of screenshots,
          configuration exports, and policy documents — AI-driven evidence
          mapping tools like{" "}
          <strong>CMMC Lens</strong> now automate this process by connecting
          directly to your cloud infrastructure and generating control evidence
          automatically, reducing preparation time by up to 80%.
        </p>
      </div>

      {/* What is Evidence Mapping */}
      <section id="what-is-evidence-mapping" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          What is NIST 800-171 Evidence Mapping?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Evidence mapping is the systematic process of linking specific
          artifacts — log files, configuration settings, policy documents,
          screenshots, API outputs — to the specific NIST SP 800-171 security
          requirements they satisfy. Every one of the 110 NIST 800-171
          controls requires documented evidence of implementation for your
          System Security Plan (SSP) and for C3PAO assessment.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          In a C3PAO assessment, assessors don't take your word that controls
          are implemented — they examine evidence. For example, to satisfy
          control AC.L2-3.1.5 (Least Privilege), assessors look for evidence
          such as: access control policy documents, Active Directory group
          membership exports, privileged access management (PAM) tool reports,
          and user access review records.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The challenge is scale: with 110 controls and multiple evidence
          artifacts per control, a typical CMMC Level 2 assessment package
          contains 300–600 individual evidence files. Collecting, naming,
          organizing, and mapping these manually is the primary reason CMMC
          preparation is so time-consuming and expensive.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { value: "110", label: "Controls Requiring Evidence" },
            { value: "300–600", label: "Avg. Evidence Artifacts" },
            { value: "80%", label: "Time Reduction with Automation" },
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

      {/* 14 Control Families */}
      <section id="control-families" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          The 14 Control Families of NIST SP 800-171
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          NIST SP 800-171 Rev 2 organizes its 110 security requirements into 14
          control families, each addressing a distinct security domain. Evidence
          mapping requires collecting artifacts for every applicable control
          within each family.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Control Family
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40 w-20">
                  Controls
                </th>
                <th className="text-left p-3 font-heading font-semibold text-foreground">
                  Evidence Examples
                </th>
              </tr>
            </thead>
            <tbody>
              {CONTROL_FAMILIES.map((row, i) => (
                <tr
                  key={row.family}
                  className={`border border-border/30 ${
                    i % 2 === 0 ? "bg-card/20" : "bg-card/40"
                  }`}
                >
                  <td className="p-3 font-medium text-foreground border-r border-border/30">
                    {row.family}
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
                  Full NIST SP 800-171 Rev 2 evidence scope
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Manual vs Automated */}
      <section id="manual-vs-automated" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          Manual Evidence Collection vs. Automated Evidence Mapping
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The traditional approach to CMMC preparation relies on consultants
          conducting interviews, manually pulling configuration exports, and
          organizing evidence in spreadsheets. Automated evidence mapping
          changes this paradigm fundamentally.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Dimension
                </th>
                <th className="text-left p-3 font-heading font-semibold text-muted-foreground border-r border-border/40">
                  Manual Collection
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary">
                  Automated Mapping (CMMC Lens)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: "Time to collect evidence", manual: "400–800 hours", auto: "8–24 hours (initial scan)" },
                { dim: "Accuracy", manual: "Human error; outdated at collection", auto: "Real-time configuration data; always current" },
                { dim: "Cost", manual: "$100,000–$300,000 in consultant fees", auto: "Flat SaaS subscription; 60–80% cost reduction" },
                { dim: "Scalability", manual: "Linear with contractor count; not scalable", auto: "Scales to thousands of controls; multi-environment" },
                { dim: "Audit readiness", manual: "Point-in-time; stale within weeks", auto: "Continuous; evidence refreshed on schedule" },
                { dim: "Gap identification", manual: "Manual review; often incomplete", auto: "Automated gap analysis with prioritized remediation" },
                { dim: "SSP generation", manual: "3–6 weeks of writing; prone to errors", auto: "AI-generated first draft in hours" },
                { dim: "POA&M creation", manual: "Spreadsheet-based; manual tracking", auto: "Auto-generated from gaps; tracked to closure" },
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
                    {row.manual}
                  </td>
                  <td className="p-3 text-primary font-medium">{row.auto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How AI Works */}
      <section id="how-ai-works" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How AI-Driven Evidence Collection Works
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          AI-driven evidence collection uses a combination of API integrations,
          configuration management database (CMDB) queries, and machine learning
          to automatically identify, collect, and map evidence to the correct
          NIST 800-171 controls. Here's how CMMC Lens accomplishes this in
          five steps:
        </p>
        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "Environment Discovery",
              desc: "CMMC Lens connects to your Microsoft Azure Commercial, Azure GCC, Microsoft 365 Commercial, and M365 GCC High environments via read-only API integrations. It performs an automated asset discovery to identify all systems, applications, and data stores within your CMMC assessment boundary.",
            },
            {
              step: "02",
              title: "Control Mapping Engine",
              desc: "The AI engine maps every discovered asset and configuration setting to the relevant NIST 800-171 controls using a proprietary control taxonomy. For example, Azure Conditional Access policies are automatically mapped to controls in the Access Control (AC) and Identification & Authentication (IA) families.",
            },
            {
              step: "03",
              title: "Evidence Extraction",
              desc: "For each mapped control, CMMC Lens extracts the relevant evidence artifacts: configuration exports, access logs, policy definitions, encryption settings, vulnerability scan results, and more. Evidence is timestamped and stored in an audit-ready format.",
            },
            {
              step: "04",
              title: "Gap Analysis",
              desc: "The AI analyzes extracted evidence against the control requirements to identify gaps — controls with no evidence, partial evidence, or evidence indicating non-compliance. Each gap is scored by severity and weighted impact on your SPRS score.",
            },
            {
              step: "05",
              title: "Continuous Refresh",
              desc: "Evidence is refreshed on a configurable schedule (daily, weekly, or monthly). Drift alerts notify you when a previously compliant control falls out of compliance — for example, if MFA is disabled for a user or a security policy is modified.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 bg-card/40 border border-border/30 p-5">
              <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 font-heading font-bold text-primary text-sm">
                {item.step}
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground mb-2">
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

      {/* Cloud Integration */}
      <section id="cloud-integration" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          Cloud Environment Integration
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          CMMC Lens integrates with the cloud platforms most commonly used by
          DoD contractors. Here's what evidence is collected from each
          environment:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              platform: "Microsoft 365 GCC High",
              color: "border-blue-500/30 bg-blue-500/5",
              evidence: [
                "Conditional Access policy configurations",
                "MFA enrollment and compliance reports",
                "SharePoint and OneDrive data loss prevention policies",
                "Exchange Online transport rules and encryption settings",
                "Intune device compliance policies and enrollment status",
                "Azure AD privileged role assignments and PIM configurations",
              ],
            },
            {
              platform: "Microsoft Azure Government",
              color: "border-blue-400/30 bg-blue-400/5",
              evidence: [
                "Azure Policy assignments and compliance scores",
                "Network Security Group (NSG) rule configurations",
                "Azure Defender for Cloud security posture reports",
                "Key Vault access logs and encryption configurations",
                "Azure Monitor diagnostic logs and alert rules",
                "Role-Based Access Control (RBAC) assignments",
              ],
            },
            {
              platform: "Amazon Web Services (GovCloud)",
              color: "border-orange-500/30 bg-orange-500/5",
              evidence: [
                "Note: CMMC Lens currently supports Azure Commercial, Azure GCC, M365 Commercial, and M365 GCC High. AWS GovCloud integration is on our roadmap — contact us to be notified when available.",
              ],
            },
            {
              platform: "On-Premises / Hybrid",
              color: "border-primary/30 bg-primary/5",
              evidence: [
                "Active Directory group policy exports",
                "Windows Event Log audit configurations",
                "Vulnerability scan results (Tenable, Qualys)",
                "Endpoint protection deployment and status reports",
                "Network device configuration backups",
                "Patch management compliance reports (SCCM, WSUS)",
              ],
            },
          ].map((item) => (
            <div
              key={item.platform}
              className={`border p-5 ${item.color}`}
            >
              <h3 className="font-heading font-semibold text-foreground mb-3">
                {item.platform}
              </h3>
              <ul className="space-y-1.5">
                {item.evidence.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SSP & POA&M */}
      <section id="ssp-poam" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          SSP and POA&M Generation from Evidence
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Once evidence is collected and mapped, the most labor-intensive
          documentation tasks — writing the SSP and creating the POA&M — can be
          automated.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-5">
            <h3 className="font-heading font-semibold text-foreground mb-3">
              System Security Plan (SSP)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              The SSP is required by NIST 800-171 (control CA.L2-3.12.4) and
              reviewed in detail by C3PAO assessors. It must describe the
              information system, define the assessment boundary, and document
              the implementation status of all 110 controls.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CMMC Lens generates a pre-populated SSP using collected evidence
              to auto-fill control implementation descriptions, system component
              inventory, network diagrams, and interconnection tables — a
              process that typically takes consultants 3–6 weeks to complete
              manually.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-5">
            <h3 className="font-heading font-semibold text-foreground mb-3">
              Plan of Action and Milestones (POA&M)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              The POA&M documents all identified control gaps, assigns
              responsibility, establishes remediation milestones, and tracks
              progress. An active POA&M demonstrating remediation progress is
              required to maintain a negative SPRS score while achieving
              compliance.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CMMC Lens auto-generates a prioritized POA&M from the gap
              analysis, ranks items by SPRS score impact and remediation
              complexity, and tracks remediation progress with evidence
              re-collection to confirm closure.
            </p>
          </div>
        </div>
      </section>

      {/* CMMC Lens CTA */}
      <section id="cmmc-lens" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How CMMC Lens Automates Evidence Mapping
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          CMMC Lens is DefenseEye's AI-powered compliance platform built
          specifically for DoD contractors pursuing CMMC 2.0 certification.
          It eliminates the manual burden of evidence collection, documentation,
          and continuous monitoring.
        </p>
        <div className="bg-card/60 backdrop-blur-sm border border-primary/20 p-6 bracket-decoration mb-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground mb-1">
                CMMC Lens Evidence Automation
              </p>
              <p className="text-sm text-muted-foreground">
                From connection to assessment-ready evidence in 24 hours
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {[
              "Connect cloud environments in under 30 minutes",
              "Auto-collect evidence for all 110 NIST 800-171 controls",
              "AI-generated SSP with pre-populated control descriptions",
              "Auto-generated POA&M ranked by SPRS score impact",
              "Continuous compliance monitoring with drift alerts",
              "C3PAO readiness score showing pre-assessment preparedness",
              "Evidence versioning and audit trail for assessors",
              "One-click SPRS score calculation and export",
            ].map((cap) => (
              <div key={cap} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10"
            >
              Book a Demo
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Related:{" "}
          <Link href="/knowledge-hub/what-is-cmmc" className="text-primary hover:underline">
            What is CMMC?
          </Link>{" "}
          ·{" "}
          <Link href="/knowledge-hub/cmmc-levels" className="text-primary hover:underline">
            CMMC Level 1 vs Level 2
          </Link>{" "}
          ·{" "}
          <Link href="/knowledge-hub/certification-process" className="text-primary hover:underline">
            Certification Process
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          <FAQItem
            question="How long does automated evidence collection take with CMMC Lens?"
            answer="Initial evidence collection for a typical small-to-mid-size contractor using Microsoft 365 GCC High and Azure Government takes 4–8 hours for the first full scan. Subsequent refreshes typically run in under 2 hours. This compares to 400–800 hours for manual evidence collection using a traditional consultant approach."
          />
          <FAQItem
            question="Does automated evidence collection replace the need for a C3PAO assessment?"
            answer="No. Automated evidence collection accelerates your preparation for a C3PAO assessment — it doesn't replace it. For CMMC Level 2 contracts requiring third-party assessment, you must still engage an accredited C3PAO to conduct the official assessment. However, arriving at that assessment with comprehensive, organized evidence dramatically reduces assessment duration and the risk of findings."
          />
          <FAQItem
            question="What if my environment is entirely on-premises with no cloud services?"
            answer="CMMC Lens supports on-premises environments through agent-based collection and integration with common enterprise tools such as Active Directory, SCCM, Tenable, Qualys, and Splunk. Evidence can also be manually uploaded for systems that don't support API-based collection, which the platform then maps to the appropriate NIST 800-171 controls."
          />
          <FAQItem
            question="How does CMMC Lens handle multi-tenant or multi-entity environments?"
            answer="CMMC Lens supports multi-entity environments with separate assessment boundaries for each entity. This is particularly useful for managed service providers (MSPs) or holding companies supporting multiple subsidiaries with distinct CMMC scopes. Each entity maintains independent evidence, SSP, and POA&M while benefiting from centralized administration."
          />
          <FAQItem
            question="Is evidence collected by CMMC Lens accepted by C3PAO assessors?"
            answer="Yes. Evidence collected by CMMC Lens is formatted according to CMMC assessment guide standards and includes timestamps, source identifiers, and version history that satisfy C3PAO evidence requirements. CMMC Lens produces evidence packages in formats compatible with leading C3PAO workflow tools, streamlining the assessment intake process."
          />
        </div>
      </section>
    </KnowledgeHubLayout>
  );
}
