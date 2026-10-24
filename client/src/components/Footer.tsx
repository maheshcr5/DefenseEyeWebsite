import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { COMPANY } from "@/data/companyFacts";
import { trackConversion } from "@/lib/tracking";
import { FOOTER_NAVIGATION } from "@shared/siteArchitecture";

export default function Footer() {
  return (
    <footer className="section-gray border-t border-border/30 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
          <DefenseEyeLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Secure AI adoption, AI governance, cybersecurity, Microsoft cloud security, CMMC readiness, and compliance automation for regulated organizations.
          </p>
          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            <p>Redmond, WA</p>
            <p>Consulting: <a className="hover:text-primary" href={`mailto:${COMPANY.enterpriseEmail}`} onClick={() => trackConversion("enterprise_email_click", { location: "footer" })}>{COMPANY.enterpriseEmail}</a></p>
            <p>Supplier: <a className="hover:text-primary" href={`mailto:${COMPANY.partnersEmail}`} onClick={() => trackConversion("partners_email_click", { location: "footer" })}>{COMPANY.partnersEmail}</a></p>
            <p>Product support: <a className="hover:text-primary" href={`mailto:${COMPANY.supportEmail}`} onClick={() => trackConversion("support_email_click", { location: "footer" })}>{COMPANY.supportEmail}</a></p>
          </div>
        </div>
        {/* Shared with the server-rendered fallback so both link graphs match. */}
        {FOOTER_NAVIGATION.map((group) => (
          <FooterLinks key={group.title} title={group.title} links={group.links.map((link) => [link.label, link.href])} />
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-6xl rounded-sm border border-primary/20 bg-background/90 p-6 text-white">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-white">
          Government Capabilities & Diversity Credentials
        </h2>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {[
            "CAGE 9ZDL5",
            "UEI E4DYPCKN7YN8",
            "OMWBE-MBE Certified",
            "NMSDC-MBE Certified",
            "WA State SBE",
            "NAICS 541512, 541519, 541690, 561621",
            "Multiple CMMC Certified Professionals",
          ].map((item) => (
            <span key={item} className="rounded-sm border border-primary/20 bg-background/80 px-3 py-1.5 font-medium text-white">
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
      <h2 className="mb-4 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">{title}</h2>
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
