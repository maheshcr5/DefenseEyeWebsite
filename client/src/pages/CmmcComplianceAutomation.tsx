import { useEffect } from "react";
import { ArrowRight, Award, CheckCircle2, ClipboardCheck, FileCheck, ShieldCheck, HelpCircle, AlertCircle, Server } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL, COMPANY, MARKETPLACE_URL } from "@/data/companyFacts";
import { useSeo } from "@/hooks/useSeo";
import { trackConversion } from "@/lib/tracking";

export default function CmmcComplianceAutomation() {
  useSeo(
    "CMMC & Compliance Automation | DefenseEye CCP-Led Readiness",
    "DefenseEye provides CCP-led CMMC Level 1 & 2 readiness, NIST SP 800-171 alignment, SSP/POA&M preparation, and evidence automation through CMMCLens."
  );

  useEffect(() => {
    const id = "cmmc-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "CMMC & Compliance Automation",
        description: "CCP-led CMMC readiness consulting and CMMCLens compliance evidence automation.",
        provider: { "@type": "ProfessionalService", name: "DefenseEye", url: "https://defenseeye.ai" },
        areaServed: "United States",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://defenseeye.ai/" },
          { "@type": "ListItem", position: 2, name: "CMMC Compliance Automation", item: "https://defenseeye.ai/cmmc-compliance-automation" },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Hero Section */}
      <section className="section-navy nvidia-grid-bg px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="size-4" /> CMMC Compliance Practice
          </div>
          <h1 className="font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl text-foreground">
            CMMC & Compliance Automation
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            DefenseEye provides CCP-led CMMC Level 1 and Level 2 readiness support, NIST SP 800-171 gap assessments, System Security Plan (SSP) execution, and compliance evidence automation for U.S. Defense Contractors.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "cmmc_hero" })}>
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                Assess CMMC Readiness <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
            <a href="/cmmclens" onClick={() => trackConversion("cmmclens_click", { location: "cmmc_hero" })}>
              <Button size="lg" variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10 sm:w-auto">
                Explore CMMCLens Platform
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Multiple CMMC Certified Professionals", "NIST SP 800-171 L2 In Progress", "CAGE 9ZDL5", "UEI E4DYPCKN7YN8"].map((badge) => (
              <span key={badge} className="rounded-sm border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary font-medium">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Services & Deliverables */}
      <section className="section-light px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Core Offering</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">CCP-Led Readiness & Evidence Workflows</h2>
            <p className="mt-3 text-muted-foreground">Practical guidance and automated evidence collection to prepare your organization for official C3PAO assessments.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-sm border border-border/60 bg-card p-6">
              <Award className="mb-4 size-6 text-primary" />
              <h3 className="font-heading text-xl font-bold mb-2">CCP-Led Gap Assessments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">Comprehensive evaluation of 110 NIST SP 800-171 controls led by CMMC Certified Professionals.</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Objective Evidence Review</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> CUI Boundary Scoping</li>
              </ul>
            </div>

            <div className="rounded-sm border border-border/60 bg-card p-6">
              <FileCheck className="mb-4 size-6 text-primary" />
              <h3 className="font-heading text-xl font-bold mb-2">SSP & POA&M Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">Authoring and updating compliant System Security Plans and Plans of Action & Milestones.</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> SPRS Score Benchmarking</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Remediation Workflow Tracking</li>
              </ul>
            </div>

            <div className="rounded-sm border border-border/60 bg-card p-6">
              <ClipboardCheck className="mb-4 size-6 text-primary" />
              <h3 className="font-heading text-xl font-bold mb-2">CMMCLens Evidence Platform</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">Continuous evidence collection, control mapping, and executive readiness dashboards.</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Automated Traceability</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Microsoft Marketplace Integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Microsoft Cloud Environment Readiness */}
      <section className="section-gray px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Cloud Security Alignment</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Microsoft Azure & GCC High Readiness</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We align security controls across Microsoft Azure Commercial, Azure Government, and Microsoft 365 GCC High architectures to protect Controlled Unclassified Information (CUI).
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Azure Government & GCC High", "Configuring Microsoft tenant security architectures tailored to DFARS 252.204-7012 requirements."],
              ["Entra ID & Defender Suite", "Implementing identity boundaries, multi-factor authentication, endpoint threat protection, and SIEM integration."],
              ["Purview Information Protection", "Automating sensitivity labeling and data loss prevention for CUI assets."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-sm border border-border/50 bg-card p-5">
                <Server className="mb-3 size-5 text-primary" />
                <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimers & Compliance Guardrails */}
      <section className="section-light px-4 py-12">
        <div className="mx-auto max-w-5xl rounded-sm border border-primary/20 bg-muted/20 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <h4 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Compliance Disclaimers & Performance Guardrails</h4>
              <p>
                DefenseEye provides CCP-led readiness support, advisory consulting, documentation, and compliance evidence automation. DefenseEye is not a Certified Third-Party Assessment Organization (C3PAO), does not certify organizations for CMMC, and does not guarantee assessment outcomes or SPRS score results.
              </p>
              <p>
                <em>CMMCLens may reduce manual evidence collection effort depending on environment maturity, integrations, available source data, and implementation scope.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Relocated CMMC Reference & Glossary Section (Bottom of Page) */}
      <section className="section-gray px-4 py-16 border-t border-border/40">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Educational Reference</p>
            <h2 className="font-heading text-3xl font-bold">CMMC 2.0 & Federal Compliance Reference</h2>
            <p className="mt-2 text-sm text-muted-foreground">Key terminology and regulatory definitions for defense supply-chain compliance.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              ["CMMC 2.0 Overview", "The Cybersecurity Maturity Model Certification (CMMC) 2.0 is the Department of Defense framework designed to enforce cybersecurity standards across the Defense Industrial Base (DIB)."],
              ["Controlled Unclassified Information (CUI)", "Government-created or possessed information that requires safeguarding or dissemination controls pursuant to applicable law, regulations, and government-wide policies."],
              ["Federal Contract Information (FCI)", "Information provided by or generated for the Government under a contract to develop or deliver a product or service to the Government."],
              ["Supplier Performance Risk System (SPRS)", "The DoD's single, authoritative application to retrieve supplier performance information and post NIST SP 800-171 self-assessment scores."],
              ["System Security Plan (SSP)", "A formal document describing how an organization meets security requirements and controls CUI within its environment."],
              ["Plan of Action & Milestones (POA&M)", "A management document identifying tasks to be accomplished to remediate security weaknesses and gaps."],
              ["C3PAO", "Certified Third-Party Assessment Organization accredited by The Cyber AB to perform official CMMC assessments."],
            ].map(([term, def]) => (
              <div key={term} className="rounded-sm border border-border/40 bg-card p-4">
                <h3 className="font-heading text-base font-bold text-primary mb-1">{term}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-navy px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-4xl font-bold">Prepare Your Organization for CMMC Level 2</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Contact DefenseEye to schedule a CCP-led readiness gap assessment and discuss CMMCLens evidence automation.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("consultation_click", { location: "cmmc_footer" })}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Assess CMMC Readiness <ArrowRight className="ml-2 size-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
