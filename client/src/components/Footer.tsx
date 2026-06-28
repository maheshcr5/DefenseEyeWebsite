import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { COMPANY } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";

export default function Footer() {
  return (
    <footer className="section-gray border-t border-border/30 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <DefenseEyeLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Secure AI adoption, Microsoft cloud security, CMMC readiness, and compliance automation for regulated organizations.
          </p>
          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            <p>Redmond, WA</p>
            <p>Consulting: <a className="hover:text-primary" href={`mailto:${COMPANY.enterpriseEmail}`} onClick={() => trackConversion("enterprise_email_click", { location: "footer" })}>{COMPANY.enterpriseEmail}</a></p>
            <p>Supplier: <a className="hover:text-primary" href={`mailto:${COMPANY.partnersEmail}`} onClick={() => trackConversion("partners_email_click", { location: "footer" })}>{COMPANY.partnersEmail}</a></p>
            <p>Product support: <a className="hover:text-primary" href={`mailto:${COMPANY.supportEmail}`} onClick={() => trackConversion("support_email_click", { location: "footer" })}>{COMPANY.supportEmail}</a></p>
          </div>
        </div>
        <FooterLinks title="Portfolios" links={[["Secure AI Adoption", "/secure-ai-adoption"], ["CMMC Automation", "/cmmc-compliance-automation"], ["Microsoft Copilot Readiness", "/solutions/microsoft-copilot-readiness"], ["Microsoft Cloud Security", "/solutions/cloud-security"]]} />
        <FooterLinks title="Resources" links={[["CMMCLens", "/cmmclens"], ["Datasheets", "/datasheets"], ["Knowledge Hub", "/knowledge-hub"], ["Capability Statement", "/capability-statement"]]} />
        <FooterLinks title="Company" links={[["Supplier Readiness", "/supplier-readiness"], ["Delivery Model", "/delivery-model"], ["Representative Engagements", "/representative-engagements"], ["Contact", "/contact"], ["Support", "/support"], ["Privacy Policy", "/privacy-policy"]]} />
      </div>

      <div className="mx-auto mt-10 max-w-6xl rounded-sm border border-border/60 bg-card/60 p-6">
        <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground">
          Government Capabilities & Diversity Credentials
        </h4>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {[
            "CAGE 9ZDL5",
            "UEI E4DYPCKN7YN8",
            "OMWBE-MBE Certified",
            "NMSDC-MBE Certified",
            "WA State SBE",
            "NAICS 541512, 541519, 541690, 561621",
            "Multiple CMMC Certified Professionals",
            "NIST SP 800-171 L2 In Progress",
          ].map((item) => (
            <span key={item} className="rounded-sm border border-primary/20 bg-background/80 px-3 py-1.5 font-medium text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-border/30 pt-5 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved. CMMCLens is a trademark of DefenseEye.
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h4 className="mb-4 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="text-sm text-muted-foreground transition-colors hover:text-primary">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
