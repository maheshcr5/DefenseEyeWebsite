import NavBar from "@/components/NavBar";
import DefenseEyeLogo from "@/components/DefenseEyeLogo";
import { useSeo } from "@/hooks/useSeo";

const SUPPORT_EMAIL = "support@defenseeye.ai";
const EFFECTIVE_DATE = "April 1, 2026";
const LAST_UPDATED = "April 1, 2026";
const CALENDLY_URL = "https://calendly.com/maheshcoimbatore/60-minute-meeting";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="font-heading text-xl font-bold text-foreground mb-3 pb-2 border-b border-border/40">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function TermsOfService() {
  useSeo(
    "Terms of Service | DefenseEye",
    "DefenseEye Terms of Service — the agreement governing your use of DefenseEye.ai and the CMMCLens compliance automation platform."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      {/* Hero */}
      <section className="pt-16 pb-10 px-4 section-navy">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Legal</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Effective: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="py-14 px-4 section-light">
        <div className="max-w-3xl mx-auto">

          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            These Terms of Service ("Terms") constitute a legally binding agreement between you (an individual or the organization you represent, "Customer" or "you") and <strong className="text-foreground">DefenseEye, Inc.</strong> ("DefenseEye," "we," or "us") governing your access to and use of the DefenseEye website at{" "}
            <a href="https://defenseeye.ai" className="text-primary hover:underline">defenseeye.ai</a>{" "}
            and the CMMCLens compliance automation platform (collectively, the "Services"). By accessing or using the Services, you accept these Terms. If you do not agree, do not use the Services. If you are accepting on behalf of an organization, you represent that you have authority to bind that organization.
          </p>

          <Section id="description" title="1. Description of Services">
            <p>DefenseEye provides:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">CMMCLens Platform:</strong> A software-as-a-service (SaaS) CMMC Level 2 compliance automation platform that automates evidence collection, NIST 800-171 control mapping, System Security Plan (SSP) generation, Plan of Action and Milestones (POA&M) tracking, and policy/procedure drafting for U.S. defense contractors.</li>
              <li><strong className="text-foreground">Advisory Services:</strong> CMMC readiness consulting, gap assessments, scoping engagements, and C3PAO assessment preparation services delivered by DefenseEye personnel.</li>
              <li><strong className="text-foreground">Website and Content:</strong> The DefenseEye.ai website, Knowledge Hub articles, blog content, and downloadable resources.</li>
            </ul>
            <p>Service features, pricing, and availability are subject to the applicable Order Form, Statement of Work, or subscription plan agreed between the parties.</p>
          </Section>

          <Section id="account" title="2. Account Registration and Access">
            <p>To access CMMCLens, you must register for an account with accurate, current, and complete information. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately at{" "}<a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>{" "}if you suspect unauthorized access. DefenseEye is not liable for losses caused by unauthorized use of your account where you failed to take reasonable precautions.</p>
            <p>You may not share accounts or access credentials with individuals outside your organization, or create accounts on behalf of another entity without authorization.</p>
          </Section>

          <Section id="license" title="3. License Grant">
            <p>Subject to your compliance with these Terms and timely payment of applicable fees, DefenseEye grants you a limited, non-exclusive, non-transferable, non-sublicensable license during the subscription term to access and use the CMMCLens platform solely for your internal compliance management purposes in connection with U.S. Department of Defense contracts and CMMC readiness.</p>
            <p>Website content (articles, guides, templates) is licensed for your personal, non-commercial reference use. You may not reproduce, republish, or distribute content without express written permission.</p>
          </Section>

          <Section id="restrictions" title="4. Use Restrictions">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Reverse engineer, decompile, disassemble, or attempt to derive source code from the CMMCLens platform</li>
              <li>Sublicense, resell, or provide time-sharing, service bureau, or managed-service access to the platform to third parties without our prior written consent</li>
              <li>Remove or obscure any proprietary notices or branding</li>
              <li>Use the Services in any manner that violates applicable law, including export control laws, ITAR, EAR, FCPA, or DFARS requirements</li>
              <li>Upload malicious code, conduct security penetration testing against our infrastructure, or interfere with the Services' operation</li>
              <li>Use automated tools to scrape or harvest content from the website or platform beyond normal API usage</li>
              <li>Misrepresent DefenseEye's role — we are an RPO-aligned advisory and platform provider, not a Certified Third-Party Assessment Organization (C3PAO) and do not issue CMMC certifications</li>
            </ul>
          </Section>

          <Section id="customer-data" title="5. Customer Data and Confidentiality">
            <p><strong className="text-foreground">Ownership:</strong> You retain all right, title, and interest in compliance data, documents, and artifacts you upload or create within CMMCLens ("Customer Data"). DefenseEye acquires no ownership rights in Customer Data.</p>
            <p><strong className="text-foreground">Processing:</strong> DefenseEye processes Customer Data solely to provide and improve the Services and as described in our{" "}<a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>. We will not use Customer Data for any other purpose or disclose it to third parties except as required to provide the Services or by law.</p>
            <p><strong className="text-foreground">Confidentiality:</strong> Each party agrees to protect the other's non-public information with at least the same degree of care used to protect its own confidential information (not less than reasonable care). This obligation survives termination for three (3) years, except for trade secrets which are protected indefinitely.</p>
            <p><strong className="text-foreground">CUI handling:</strong> Customer Data may include Controlled Unclassified Information (CUI). Customer is solely responsible for ensuring CUI stored in CMMCLens is appropriately marked and that use of the platform is consistent with their contracts, applicable DFARS clauses, and agency-specific requirements.</p>
          </Section>

          <Section id="payment" title="6. Fees and Payment">
            <p>Fees for subscription and advisory services are set forth in the applicable Order Form or Statement of Work. Unless otherwise specified:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Subscription fees are invoiced in advance and are non-refundable except as expressly stated in the Order Form</li>
              <li>Advisory service fees are invoiced per the payment schedule in the Statement of Work</li>
              <li>Taxes: You are responsible for all applicable taxes, duties, and levies; invoices exclude tax unless stated otherwise</li>
              <li>Late payments may accrue interest at 1.5% per month or the maximum rate permitted by law, whichever is lower</li>
            </ul>
          </Section>

          <Section id="ip" title="7. Intellectual Property">
            <p>DefenseEye retains all right, title, and interest in the CMMCLens platform, website, workflows, algorithms, documentation, templates, and any improvements thereto, including all associated intellectual property rights. These Terms do not transfer any IP ownership to you.</p>
            <p>Feedback you provide about the Services may be used freely by DefenseEye to improve the Services without obligation or compensation to you.</p>
          </Section>

          <Section id="warranties" title="8. Disclaimer of Warranties">
            <p>
              <strong className="text-foreground">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT.</strong>
            </p>
            <p>DefenseEye makes no warranty that:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use of the Services will guarantee a passing CMMC assessment or DoD contract award</li>
              <li>The Services will be uninterrupted, error-free, or entirely secure</li>
              <li>Documentation or artifacts generated by CMMCLens will satisfy all requirements of any specific C3PAO assessor or DoD agency</li>
              <li>The Services will meet every regulatory interpretation of CMMC or NIST 800-171 as administered by any particular assessor</li>
            </ul>
            <p>Advisory services reflect the professional judgment of DefenseEye's consultants based on information you provide. Outcomes depend on your accurate disclosure and your timely implementation of recommendations.</p>
          </Section>

          <Section id="liability" title="9. Limitation of Liability">
            <p>
              <strong className="text-foreground">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL DEFENSEEYE, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR CONTRACTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</strong>
            </p>
            <p>
              <strong className="text-foreground">DEFENSEEYE'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE TOTAL FEES PAID BY YOU TO DEFENSEEYE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).</strong>
            </p>
            <p>Some jurisdictions do not allow the exclusion or limitation of certain damages; in such jurisdictions, our liability is limited to the greatest extent permitted by law.</p>
          </Section>

          <Section id="indemnification" title="10. Indemnification">
            <p>You agree to defend, indemnify, and hold harmless DefenseEye and its affiliates, officers, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorney fees) arising from: (a) your use of the Services in violation of these Terms; (b) your violation of any applicable law or third-party rights; (c) Customer Data that infringes any third-party intellectual property or privacy rights; or (d) your breach of any representation or warranty herein.</p>
          </Section>

          <Section id="term-termination" title="11. Term and Termination">
            <p>These Terms commence when you first access the Services and continue until terminated. Subscriptions continue for the term stated in the applicable Order Form and renew automatically unless either party provides written notice of non-renewal at least 30 days before the renewal date.</p>
            <p>Either party may terminate for material breach if the breach is not cured within 30 days of written notice. DefenseEye may suspend or terminate your access immediately for violations of Section 4 (Use Restrictions) or non-payment.</p>
            <p>Upon termination: (a) your license to the platform ceases; (b) DefenseEye will make Customer Data available for export in a standard format for 30 days after termination and delete it thereafter; (c) provisions that by their nature should survive (IP, confidentiality, liability, indemnification, governing law) will survive.</p>
          </Section>

          <Section id="modifications" title="12. Changes to These Terms">
            <p>We may update these Terms from time to time. For material changes, we will provide at least 30 days' notice via email or an in-platform notice. Your continued use of the Services after the effective date of the updated Terms constitutes your acceptance. If you do not agree to a material change, you may terminate your subscription with a pro-rata refund of prepaid fees for the unused period.</p>
          </Section>

          <Section id="governing-law" title="13. Governing Law and Disputes">
            <p>These Terms are governed by the laws of the State of Delaware, without regard to conflict-of-law principles. Any dispute arising out of or related to these Terms that cannot be resolved through good-faith negotiation will be submitted to binding arbitration administered by the American Arbitration Association under its Commercial Arbitration Rules, with proceedings in Wilmington, Delaware. Each party retains the right to seek injunctive or other equitable relief in any court of competent jurisdiction to prevent breach of confidentiality or IP obligations.</p>
          </Section>

          <Section id="general" title="14. General Provisions">
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Entire Agreement:</strong> These Terms, together with any applicable Order Form or Statement of Work, constitute the entire agreement between the parties and supersede all prior agreements regarding the Services.</li>
              <li><strong className="text-foreground">Severability:</strong> If any provision is found unenforceable, it will be modified to the minimum extent necessary, and the remaining provisions will remain in full force.</li>
              <li><strong className="text-foreground">No Waiver:</strong> Failure to enforce any provision does not constitute a waiver of our right to enforce it in the future.</li>
              <li><strong className="text-foreground">Assignment:</strong> You may not assign these Terms without DefenseEye's prior written consent. DefenseEye may assign in connection with a merger, acquisition, or sale of assets.</li>
              <li><strong className="text-foreground">Notices:</strong> Legal notices to DefenseEye must be sent to {SUPPORT_EMAIL}. We may provide notices to you via email or in-platform notification.</li>
              <li><strong className="text-foreground">Force Majeure:</strong> Neither party is liable for delays caused by circumstances beyond their reasonable control.</li>
            </ul>
          </Section>

          <Section id="contact" title="15. Contact">
            <p>Questions about these Terms?</p>
            <address className="not-italic space-y-1">
              <p className="font-medium text-foreground">DefenseEye, Inc.</p>
              <p>
                Email:{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
              </p>
              <p>
                Website:{" "}
                <a href="https://defenseeye.ai" className="text-primary hover:underline">https://defenseeye.ai</a>
              </p>
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
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/support" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
