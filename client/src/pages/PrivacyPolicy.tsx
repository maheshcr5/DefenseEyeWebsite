import NavBar from "@/components/NavBar";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";

const SUPPORT_EMAIL = "support@defenseeye.ai";
const EFFECTIVE_DATE = "April 1, 2026";
const LAST_UPDATED = "April 1, 2026";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="font-heading text-xl font-bold text-foreground mb-3 pb-2 border-b border-border/40">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  useSeo(
    "Privacy Policy | DefenseEye",
    "DefenseEye Privacy Policy — how we collect, use, and protect your information when you use DefenseEye.ai and CMMCLens."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Hero */}
      <section className="pt-16 pb-10 px-4 section-navy">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Legal</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Effective: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="py-14 px-4 section-light">
        <div className="max-w-3xl mx-auto">

          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            DefenseEye, Inc. ("DefenseEye," "we," "our," or "us") operates{" "}
            <a href="https://defenseeye.ai" className="text-primary hover:underline">defenseeye.ai</a>{" "}
            and the CMMCLens compliance automation platform (collectively, the "Services").
            This Privacy Policy explains what information we collect, how we use it, with whom we share it,
            and your choices about your data. By accessing or using our Services, you agree to this Policy.
          </p>

          <Section id="information-collected" title="1. Information We Collect">
            <p><strong className="text-foreground">Information you provide directly:</strong> When you complete a contact or inquiry form, request a CMMC assessment, create a CMMCLens account, or correspond with us, we collect your name, business email address, company name, job title, phone number (if provided), and any information you include in your message.</p>
            <p><strong className="text-foreground">Usage and technical data:</strong> When you visit our website or use CMMCLens, we automatically receive your IP address (truncated), browser type and version, operating system, referring URL, pages viewed, session duration, and click patterns. This data is collected via server logs and analytics tools.</p>
            <p><strong className="text-foreground">Cookies and similar technologies:</strong> We use first-party cookies for session management and site functionality, and analytics cookies to understand aggregate traffic patterns. See Section 7 for details.</p>
            <p><strong className="text-foreground">Customer compliance data (CMMCLens):</strong> Customers who use the CMMCLens platform may upload or generate compliance artifacts — including System Security Plans (SSPs), Plans of Action and Milestones (POA&Ms), control assessments, and policy documents. This data is processed solely to provide the CMMCLens service and is treated as confidential customer data under our Terms of Service.</p>
          </Section>

          <Section id="how-we-use" title="2. How We Use Your Information">
            <p>We use information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Respond to inquiries, schedule consultations, and deliver contracted advisory or platform services</li>
              <li>Operate, maintain, and improve the CMMCLens platform and this website</li>
              <li>Send service-related communications, including onboarding, account notices, and support responses</li>
              <li>Send marketing communications about CMMC resources, guides, and DefenseEye services — only with your consent, and with an easy opt-out in every email</li>
              <li>Analyze aggregate usage trends to improve content and product features</li>
              <li>Comply with applicable law, including responding to lawful government requests</li>
              <li>Detect, investigate, and prevent fraudulent or unauthorized use</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </Section>

          <Section id="sharing" title="3. How We Share Your Information">
            <p>We share information only as described below:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Service providers:</strong> We use trusted third-party vendors (hosting infrastructure, email delivery, analytics, CRM) who process data on our behalf under written agreements that restrict their use of your data.</li>
              <li><strong className="text-foreground">Microsoft Azure:</strong> CMMCLens is hosted on Microsoft Azure. Your data is stored and processed in Azure datacenters subject to Microsoft's data protection commitments. See <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft's Privacy Statement</a>.</li>
              <li><strong className="text-foreground">Legal obligations:</strong> We may disclose information when required by law, court order, or a lawful government request, or to protect our rights and the safety of our users.</li>
              <li><strong className="text-foreground">Business transfers:</strong> If DefenseEye is acquired or merged, customer data may transfer to the successor entity under equivalent privacy protections.</li>
            </ul>
            <p>We do not share customer compliance artifacts (SSPs, POA&Ms, etc.) with any third party other than the infrastructure providers necessary to operate the platform.</p>
          </Section>

          <Section id="data-retention" title="4. Data Retention">
            <p>
              We retain contact and inquiry records for up to three (3) years after our last interaction, unless you request deletion earlier. CMMCLens customer data is retained for the duration of the active subscription and deleted or returned within 90 days of contract termination, per the terms of the applicable customer agreement. Analytics data is retained in aggregate, anonymized form. Backup copies may persist for up to 90 additional days in encrypted form.
            </p>
          </Section>

          <Section id="user-rights" title="5. Your Rights and Choices">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong className="text-foreground">Correction:</strong> Request that we correct inaccurate or incomplete information.</li>
              <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information, subject to legal retention obligations.</li>
              <li><strong className="text-foreground">Opt-out of marketing:</strong> Unsubscribe from marketing emails at any time via the link in any email, or by contacting us.</li>
              <li><strong className="text-foreground">Data portability:</strong> Request your data in a structured, machine-readable format where technically feasible.</li>
              <li><strong className="text-foreground">Withdraw consent:</strong> Where processing is based on consent, withdraw consent at any time without affecting prior lawful processing.</li>
            </ul>
            <p>
              To exercise any right, email us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>{" "}
              with "Privacy Request" in the subject line. We will respond within 30 days (45 days for complex requests). We may verify your identity before fulfilling a request.
            </p>
            <p>
              <strong className="text-foreground">California residents (CCPA/CPRA):</strong> You have the right to know what categories of personal information we collect and sell (we do not sell personal information), and to opt out of any future sale. Requests may be submitted to the email address above.
            </p>
          </Section>

          <Section id="cookies" title="6. Cookies and Tracking">
            <p>We use the following categories of cookies:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Strictly necessary:</strong> Required for the website and platform to function (session tokens, CSRF protection). Cannot be disabled.</li>
              <li><strong className="text-foreground">Analytics:</strong> Aggregate, non-identifiable usage data to improve the site. You may opt out by declining cookies via our cookie consent banner or using browser privacy settings.</li>
            </ul>
            <p>We do not use tracking cookies for advertising or behavioral profiling. You can manage cookies through your browser settings; note that disabling certain cookies may affect site functionality.</p>
          </Section>

          <Section id="security" title="7. Data Security">
            <p>
              We implement technical and organizational safeguards appropriate to the sensitivity of the data we process, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>TLS encryption for all data in transit</li>
              <li>Encryption at rest for customer compliance data stored in CMMCLens</li>
              <li>Role-based access controls limiting data access to authorized personnel</li>
              <li>Regular security reviews and vulnerability assessments</li>
              <li>Incident response procedures with customer notification for qualifying breaches</li>
            </ul>
            <p>No system is 100% secure. We encourage you to use strong passwords, keep credentials confidential, and notify us immediately if you suspect unauthorized access.</p>
          </Section>

          <Section id="third-party-links" title="8. Third-Party Links">
            <p>
              Our website links to external resources including DODCIO, NIST, NARA, and the Cyber AB. These third-party sites have their own privacy policies. DefenseEye is not responsible for the content or privacy practices of external sites.
            </p>
          </Section>

          <Section id="childrens-privacy" title="9. Children's Privacy">
            <p>
              Our Services are designed for business professionals and are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, contact us immediately and we will delete it.
            </p>
          </Section>

          <Section id="international-transfers" title="10. International Data Transfers">
            <p>
              DefenseEye is based in the United States and our Services are hosted in U.S.-based Azure datacenters. If you access our Services from outside the United States, your information will be transferred to and processed in the United States. By using our Services, you acknowledge this transfer.
            </p>
          </Section>

          <Section id="changes" title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will post the revised Policy with an updated "Last updated" date. For material changes affecting how we handle customer compliance data, we will provide 30 days' prior notice by email or via the CMMCLens platform. Your continued use of the Services after the effective date constitutes acceptance of the updated Policy.
            </p>
          </Section>

          <Section id="contact" title="12. Contact Us">
            <p>For privacy questions, requests, or concerns, contact:</p>
            <address className="not-italic space-y-1">
              <p className="font-medium text-foreground">DefenseEye, Inc.</p>
              <p>Attn: Privacy</p>
              <p>
                Email:{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
              </p>
              <p>Website: <a href="https://defenseeye.ai" className="text-primary hover:underline">https://defenseeye.ai</a></p>
            </address>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 section-gray">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <DefenseEyeLogo size="sm" />
          <span>&copy; {new Date().getFullYear()} DefenseEye, Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/support" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
