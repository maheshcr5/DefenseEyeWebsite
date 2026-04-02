/*
 * Understanding Your SPRS Score
 * /knowledge-hub/sprs-score
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Shield, CheckCircle2, TrendingUp } from "lucide-react";
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
  { id: "what-is-sprs", label: "What is an SPRS Score?" },
  { id: "how-calculated", label: "How Scores Are Calculated" },
  { id: "score-ranges", label: "Score Ranges & Meaning" },
  { id: "controls-impact", label: "Controls & Their Impact" },
  { id: "how-to-submit", label: "How to Submit Your Score" },
  { id: "improve-score", label: "10 Ways to Improve Fast" },
  { id: "vs-cmmc", label: "SPRS vs. CMMC Certification" },
  { id: "cmmc-lens", label: "CMMC Lens Score Tracking" },
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

const DOMAIN_WEIGHTS = [
  { domain: "Access Control (AC)", controls: 22, maxPoints: 22, notes: "Highest weight; MFA, least privilege, remote access key drivers" },
  { domain: "Awareness and Training (AT)", controls: 3, maxPoints: 3, notes: "Training program and records required" },
  { domain: "Audit and Accountability (AU)", controls: 9, maxPoints: 9, notes: "Logging and monitoring configurations" },
  { domain: "Configuration Management (CM)", controls: 9, maxPoints: 9, notes: "Baseline configs and change control" },
  { domain: "Identification and Authentication (IA)", controls: 11, maxPoints: 11, notes: "MFA is a high-impact control in this domain" },
  { domain: "Incident Response (IR)", controls: 3, maxPoints: 3, notes: "Incident response plan required" },
  { domain: "Maintenance (MA)", controls: 6, maxPoints: 6, notes: "Controlled maintenance processes" },
  { domain: "Media Protection (MP)", controls: 9, maxPoints: 9, notes: "Media handling, sanitization policies" },
  { domain: "Personnel Security (PS)", controls: 2, maxPoints: 2, notes: "Screening and termination procedures" },
  { domain: "Physical Protection (PE)", controls: 6, maxPoints: 6, notes: "Physical access controls" },
  { domain: "Risk Assessment (RA)", controls: 3, maxPoints: 3, notes: "Formal risk assessment process" },
  { domain: "Security Assessment (CA)", controls: 4, maxPoints: 4, notes: "System assessment and monitoring" },
  { domain: "System & Comm. Protection (SC)", controls: 16, maxPoints: 16, notes: "Network segmentation, encryption high impact" },
  { domain: "System & Info. Integrity (SI)", controls: 7, maxPoints: 7, notes: "Patch management, malware protection" },
];

export default function SPRSScore() {
  return (
    <KnowledgeHubLayout
      title="Understanding Your SPRS Score: How to Calculate and Improve It"
      description="Learn how SPRS scores work for DoD contractors. Understand the -203 to 110 scoring range, how each NIST 800-171 control affects your score, how to submit your score to the DoD, and 10 proven ways to improve your SPRS score fast."
      lastUpdated="April 2025"
      tocItems={TOC_ITEMS}
      relatedArticles={RELATED_ARTICLES}
    >
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
        SPRS Score Explained: How to Calculate, Submit, and Improve Your Score
      </h1>

      {/* Quick Answer */}
      <div className="bg-primary/5 border-l-4 border-primary p-5 mb-10 rounded-r">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          Quick Answer
        </p>
        <p className="text-foreground leading-relaxed">
          An <strong>SPRS score</strong> (Supplier Performance Risk System) is
          a numerical rating from <strong>-203 to +110</strong> that represents
          a DoD contractor's level of compliance with NIST SP 800-171's 110
          security controls. A score of 110 means all controls are fully
          implemented. Every unimplemented control reduces the score, with
          higher-weight controls deducting more points. Contractors must
          self-assess and submit their score to the SPRS system before
          performing work on DoD contracts with DFARS clause 252.204-7019.
        </p>
      </div>

      {/* What is SPRS */}
      <section id="what-is-sprs" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          What is an SPRS Score?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The <strong className="text-foreground">Supplier Performance Risk System (SPRS)</strong> is
          a DoD database that aggregates contractor performance and risk
          information. Within the context of CMMC and DFARS 252.204-7019, SPRS
          refers specifically to the NIST SP 800-171 self-assessment score that
          contractors are required to calculate, attest to, and upload.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The SPRS score was established by the DoD as an interim measure to
          gain visibility into the cybersecurity posture of the Defense
          Industrial Base while CMMC certification was being rolled out. It
          provides Contracting Officers with a quick signal about a company's
          cybersecurity risk before and after contract award.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Unlike CMMC certification, which requires third-party verification,
          the SPRS score is self-assessed. However, false self-assessment can
          trigger False Claims Act liability — contractors have been
          prosecuted for submitting inflated SPRS scores.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { value: "-203", label: "Minimum possible score (0 controls met)" },
            { value: "110", label: "Maximum score (all 110 controls met)" },
            { value: "SPRS.mil", label: "Portal for score submission" },
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

      {/* How Calculated */}
      <section id="how-calculated" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How SPRS Scores Are Calculated
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The SPRS scoring methodology is defined in DoD Assessment Methodology
          for NIST SP 800-171 (October 2020). Here are the mechanics:
        </p>
        <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-5 mb-6">
          <h3 className="font-heading font-semibold text-foreground mb-3">
            Scoring Formula
          </h3>
          <div className="bg-background/50 border border-border/30 p-4 font-mono text-sm mb-4">
            <p className="text-primary mb-1">Starting Score = 110</p>
            <p className="text-muted-foreground">
              For each unimplemented control: Score -= control point value
            </p>
            <p className="text-muted-foreground mt-1">
              Final SPRS Score = 110 - (sum of point values for all
              unimplemented controls)
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each control is assigned a point value of 1 or 3 or 5 based on
            its relative importance to protecting CUI. Missing a single
            5-point control brings your score to 105. Missing all controls
            in the Access Control family (22 controls) could reduce your
            score by 22+ points. The lowest possible score is -203, which
            occurs when all controls are missing and the maximum deduction
            is applied for each.
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Controls are assessed as either: <strong className="text-foreground">Met</strong> (fully
          implemented — no deduction), <strong className="text-foreground">Not Met</strong> (not
          implemented — full point deduction applies), or{" "}
          <strong className="text-foreground">Partially Met</strong> (some implementation
          — partial credit may apply under self-assessment; C3PAOs may treat
          partial as Not Met).
        </p>
      </section>

      {/* Score Ranges */}
      <section id="score-ranges" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          SPRS Score Ranges and What They Mean
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Score Range
                </th>
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Risk Level
                </th>
                <th className="text-left p-3 font-heading font-semibold text-foreground">
                  Impact on DoD Contracting
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  range: "110",
                  risk: "None (Fully Compliant)",
                  color: "text-green-400",
                  impact: "Maximum competitive advantage; full CMMC Level 2 readiness",
                },
                {
                  range: "88–109",
                  risk: "Low",
                  color: "text-green-400",
                  impact: "Minor gaps; good competitive position; limited POA&M required",
                },
                {
                  range: "70–87",
                  risk: "Moderate",
                  color: "text-yellow-400",
                  impact: "Noticeable gaps; active POA&M required; may limit competitive bids",
                },
                {
                  range: "50–69",
                  risk: "Medium-High",
                  color: "text-orange-400",
                  impact: "Significant gaps; high-priority remediation needed; Contracting Officers will scrutinize",
                },
                {
                  range: "1–49",
                  risk: "High",
                  color: "text-red-400",
                  impact: "Major cybersecurity program gaps; competitive disadvantage; increased risk of contract loss",
                },
                {
                  range: "0 to -50",
                  risk: "Very High",
                  color: "text-red-500",
                  impact: "Fundamental security gaps; major liability; contract award unlikely for sensitive programs",
                },
                {
                  range: "-51 to -203",
                  risk: "Critical",
                  color: "text-red-600",
                  impact: "Security program essentially non-existent; high False Claims Act risk for self-attestation",
                },
              ].map((row, i) => (
                <tr
                  key={row.range}
                  className={`border border-border/30 ${
                    i % 2 === 0 ? "bg-card/20" : "bg-card/40"
                  }`}
                >
                  <td className={`p-3 font-heading font-bold border-r border-border/30 ${row.color}`}>
                    {row.range}
                  </td>
                  <td className="p-3 font-medium text-foreground border-r border-border/30">
                    {row.risk}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Controls & Impact */}
      <section id="controls-impact" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          The 110 NIST 800-171 Controls and Their SPRS Impact
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The 110 controls are distributed across 14 domains. The following
          table shows how controls in each domain contribute to your SPRS
          score. Prioritize domains with the highest control counts for
          maximum score improvement.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Domain
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40 w-20">
                  Controls
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40 w-24">
                  Max Points
                </th>
                <th className="text-left p-3 font-heading font-semibold text-foreground">
                  Key Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {DOMAIN_WEIGHTS.map((row, i) => (
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
                    {row.controls}
                  </td>
                  <td className="p-3 text-center font-semibold text-foreground border-r border-border/30">
                    {row.maxPoints}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs leading-relaxed">
                    {row.notes}
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
                <td className="p-3 text-center font-heading font-bold text-primary border-r border-border/30">
                  110
                </td>
                <td className="p-3 text-muted-foreground text-xs">
                  Perfect score; full NIST 800-171 compliance
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Submit */}
      <section id="how-to-submit" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How to Submit Your SPRS Score to the DoD
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Submitting your SPRS score is a required step before performing work
          on contracts covered by DFARS 252.204-7019. Here's the process:
        </p>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Complete your NIST 800-171 self-assessment",
              desc: "Use the DoD Assessment Methodology (DODM) to evaluate each of the 110 controls as Met, Not Met, or Partially Met. Document your findings and calculate your raw score. CMMC Lens can automate this assessment from your cloud evidence.",
            },
            {
              step: "2",
              title: "Ensure your company is registered in SAM.gov",
              desc: "Your company must have an active registration in the System for Award Management (SAM.gov) before you can submit to SPRS. SAM registration is also required for all DoD contract awards.",
            },
            {
              step: "3",
              title: "Access SPRS at sprs.peoaviation.navy.mil",
              desc: "Log into the SPRS portal using a CAC (Common Access Card) or a PKI certificate. If you don't have a CAC, you can request access through your cognizant security officer or use a PKI certificate from an approved provider.",
            },
            {
              step: "4",
              title: "Submit your Basic Assessment score",
              desc: "Navigate to 'Assessment Scores' in SPRS and submit a Level 1 (Basic) Assessment. Enter your calculated NIST 800-171 score, the assessment date, the name of the assessor, and optionally a summary of findings. Attach your SSP reference.",
            },
            {
              step: "5",
              title: "Attest by a senior company official",
              desc: "Per DFARS 252.204-7019 and CMMC Level 1 requirements, a senior company official (e.g., CEO, CIO, CISO) must affirm the accuracy of the self-assessment. This creates legal liability for false attestation under the False Claims Act.",
            },
            {
              step: "6",
              title: "Update annually (Level 1) or per C3PAO cycle (Level 2)",
              desc: "SPRS scores must be updated annually for Level 1 self-assessments. For Level 2, the score is updated after each C3PAO assessment and with the annual self-assessment between triennial C3PAO assessments.",
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
                <p className="font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Improve Score */}
      <section id="improve-score" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          10 Ways to Improve Your SPRS Score Fast
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Not all controls are equal. Focus on high-impact, relatively
          low-effort controls first for the fastest score improvement. These
          ten actions consistently deliver the most SPRS score gain per hour
          of implementation effort:
        </p>
        <div className="space-y-3">
          {[
            {
              num: 1,
              title: "Enable Multi-Factor Authentication (MFA) organization-wide",
              detail: "MFA is one of the highest-weighted controls across AC and IA domains. Enabling MFA for all users in Microsoft 365 or Azure via Conditional Access Policy can be done in hours and immediately satisfies multiple high-value controls.",
            },
            {
              num: 2,
              title: "Deploy endpoint malware protection on all workstations and servers",
              detail: "SI.L2-3.14.2, 3.14.4, and 3.14.5 cover malware protection, updates, and scanning. Deploying and configuring Microsoft Defender (or equivalent) addresses three controls quickly with significant point values.",
            },
            {
              num: 3,
              title: "Implement a formal patch management process",
              detail: "SI.L2-3.14.1 requires identifying and correcting information system flaws. Enabling Windows Update or deploying WSUS/Intune patch policies and documenting the process satisfies this control and demonstrates active patch management.",
            },
            {
              num: 4,
              title: "Configure centralized audit logging",
              detail: "AU domain controls require audit logging, review, and protection. Enabling Microsoft 365 Unified Audit Log, Azure Monitor, or AWS CloudTrail and configuring a 3-year retention period satisfies multiple AU family controls efficiently.",
            },
            {
              num: 5,
              title: "Implement network segmentation between CUI and non-CUI systems",
              detail: "SC.L2-3.13.1 and 3.13.3 require monitoring communications and separating user functionality from management. Creating a dedicated VLAN or subnet for CUI systems satisfies key SC domain controls.",
            },
            {
              num: 6,
              title: "Enforce encryption for CUI data at rest and in transit",
              detail: "Enabling BitLocker on all workstations and servers (data at rest) and enforcing TLS 1.2+ for all network communications (data in transit) addresses multiple SC and MP domain controls with high point values.",
            },
            {
              num: 7,
              title: "Document and enforce a formal access control policy",
              detail: "AC.L2-3.1.1 through 3.1.3 require formal access control policies and least privilege enforcement. Documenting your IAM policies, removing unnecessary admin rights, and performing an access review addresses the entire access control foundation.",
            },
            {
              num: 8,
              title: "Deploy a Security Awareness Training program",
              detail: "AT.L2-3.2.1, 3.2.2, and 3.2.3 require security awareness training, insider threat awareness, and security training records. Deploying a platform like KnowBe4 or Microsoft Viva Learning and documenting completion satisfies all three AT controls.",
            },
            {
              num: 9,
              title: "Conduct and document a formal risk assessment",
              detail: "RA.L2-3.11.1 requires periodic risk assessments of operations and assets. Documenting a formal risk assessment (even a lightweight table-top exercise using NIST risk management guidelines) and recording the date and participants satisfies this control.",
            },
            {
              num: 10,
              title: "Write and implement a formal incident response plan",
              detail: "IR.L2-3.6.1, 3.6.2, and 3.6.3 require an incident response capability, incident tracking, and testing. A documented incident response plan (using NIST SP 800-61 as a template), assigned roles, and annual tabletop exercise records satisfies all three IR controls.",
            },
          ].map((item) => (
            <div
              key={item.num}
              className="flex gap-4 bg-card/40 border border-border/30 p-4 hover:border-primary/30 transition-colors"
            >
              <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 font-heading font-bold text-primary text-sm">
                {item.num}
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1.5">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPRS vs CMMC */}
      <section id="vs-cmmc" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          SPRS Score vs. CMMC Certification: What's the Difference?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5">
          SPRS scores and CMMC certification are related but distinct
          requirements. Here's how they differ:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="bg-card border border-border/40">
                <th className="text-left p-3 font-heading font-semibold text-foreground border-r border-border/40">
                  Dimension
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary border-r border-border/40">
                  SPRS Score
                </th>
                <th className="text-left p-3 font-heading font-semibold text-primary">
                  CMMC Certification
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: "Nature", sprs: "Numerical score (-203 to 110)", cmmc: "Pass/fail certification at Level 1, 2, or 3" },
                { dim: "Verified by", sprs: "Self-assessed; senior official attestation", cmmc: "Third-party C3PAO (Level 2); Government (Level 3)" },
                { dim: "Basis", sprs: "Self-assessment of NIST 800-171 controls", cmmc: "Validated implementation of NIST 800-171 controls" },
                { dim: "Frequency", sprs: "Annual (Level 1); annual + triennial (Level 2)", cmmc: "Once certified, valid 3 years with annual self-assessments" },
                { dim: "Visibility", sprs: "Visible to all Contracting Officers in SPRS", cmmc: "Posted in CMMC Enterprise Mission Assurance Support Service (eMASS)" },
                { dim: "Required for award", sprs: "Yes — before performing DoD contract work (DFARS 7019)", cmmc: "Yes — once phased into solicitation (DFARS 7021)" },
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
                    {row.sprs}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.cmmc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CMMC Lens CTA */}
      <section id="cmmc-lens" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          How CMMC Lens Tracks and Improves Your SPRS Score
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          CMMC Lens provides a live, always-accurate SPRS score dashboard that
          shows your current score, the projected score after implementing
          pending POA&M items, and a prioritized remediation queue ranked by
          score impact per hour of effort.
        </p>
        <div className="bg-card/60 backdrop-blur-sm border border-primary/20 p-6 bracket-decoration mb-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground mb-1">
                SPRS Score Management in CMMC Lens
              </p>
              <p className="text-sm text-muted-foreground">
                Real-time visibility and automated improvement tracking
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {[
              "Live SPRS score calculated from evidence (not manual inputs)",
              "Score trend chart showing improvement over time",
              "Drill-down by domain to identify score improvement opportunities",
              "Projected score after implementing each POA&M item",
              "SPRS submission report formatted for SPRS.mil upload",
              "Annual self-assessment workflow with senior official attestation",
              "Compliance drift alerts when score changes due to configuration changes",
              "Remediation task assignment and tracking with evidence re-collection",
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
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          <FAQItem
            question="Is there a minimum SPRS score required to win a DoD contract?"
            answer="There is no universally mandated minimum SPRS score for contract award. However, Contracting Officers can and do consider SPRS scores during source selection as part of their overall risk assessment. A negative score or a very low positive score can be disqualifying for sensitive programs. Some prime contractors require subcontractors to achieve a minimum SPRS score (often 70 or higher) as part of their supply chain risk management programs."
          />
          <FAQItem
            question="What are the consequences of submitting a false SPRS score?"
            answer="Submitting a false SPRS score can expose a company and its executives to prosecution under the False Claims Act (31 U.S.C. § 3729), which allows for treble damages (3x the amount of the contract) plus civil penalties. In 2022, Aerojet Rocketdyne settled a False Claims Act case for $9 million related to misrepresentation of its cybersecurity practices. The DoJ has made clear that CMMC and SPRS fraud is a prosecutorial priority."
          />
          <FAQItem
            question="Can I submit an SPRS score lower than 110 and still win contracts?"
            answer="Yes, contractors with scores below 110 can still compete for and win DoD contracts, provided they have an active Plan of Action and Milestones (POA&M) showing remediation progress. However, a score with no active POA&M, or a score that shows regression from a previous submission, is a significant red flag for Contracting Officers."
          />
          <FAQItem
            question="How quickly can I improve my SPRS score?"
            answer="Significant score improvement is achievable within 30–90 days by focusing on high-impact, low-effort controls such as enabling MFA, deploying endpoint protection, implementing centralized logging, and documenting key policies. CMMC Lens's prioritized remediation queue specifically ranks controls by score-points-per-implementation-hour to help you maximize improvement speed."
          />
          <FAQItem
            question="Does a C3PAO assessment replace or update my SPRS score?"
            answer="Yes. After a successful C3PAO Level 2 assessment, the C3PAO submits the assessment results directly to the DoD, which updates your SPRS record with a Medium Assessment (Level 2) score. This supersedes your previous self-assessed Basic Assessment (Level 1) score and carries significantly more weight with Contracting Officers."
          />
        </div>
      </section>
    </KnowledgeHubLayout>
  );
}
