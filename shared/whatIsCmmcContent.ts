export type WhatIsCmmcCard = { title: string; description: string };
export type WhatIsCmmcTimelineItem = { year: string; event: string; description: string };
export type WhatIsCmmcTable = { headers: string[]; rows: string[][] };
export type WhatIsCmmcFaq = { question: string; answer: string };
export type WhatIsCmmcLink = { label: string; href: string };

export const WHAT_IS_CMMC_CONTENT = {
  title: "What is CMMC? The Complete Guide to Cybersecurity Maturity Model Certification",
  description:
    "CMMC (Cybersecurity Maturity Model Certification) is a DoD framework requiring defense contractors to demonstrate cybersecurity practices protecting Federal Contract Information and Controlled Unclassified Information. Learn everything about CMMC 2.0 levels, requirements, and certification.",
  h1: "What is CMMC? The Complete Guide for DoD Contractors (2026)",
  lastUpdated: "September 2026",
  quickAnswer:
    "CMMC (Cybersecurity Maturity Model Certification) is a U.S. Department of Defense program implemented through solicitation and contract requirements to verify that defense contractors protect Federal Contract Information and Controlled Unclassified Information. Its regulations define three levels with annual Level 1 self-assessment, triennial Level 2 self-assessment or C3PAO assessment pathways, and triennial Level 3 government assessment. Phase I began November 10, 2025. On July 13, 2026, the Department suspended the planned Phase II requirements; Phase I self-assessment requirements remain in effect.",
  quickAnswerEmphasis: ["CMMC (Cybersecurity Maturity Model Certification)"],
  toc: [
    { id: "definition-purpose", label: "Definition & Purpose" },
    { id: "history", label: "History of CMMC" },
    { id: "who-needs-it", label: "Who Needs CMMC?" },
    { id: "three-levels", label: "The Three Levels" },
    { id: "vs-nist", label: "CMMC vs. NIST 800-171" },
    { id: "key-terms", label: "Key Terms Explained" },
    { id: "automation", label: "Automate with DefenseEye" },
    { id: "faq", label: "FAQ" },
  ],
  relatedArticles: [
    { title: "CMMC Level 1 vs Level 2: Complete Comparison", href: "/knowledge-hub/cmmc-levels", description: "Understand which CMMC level applies to your contracts and what controls are required." },
    { title: "Understanding Your SPRS Score", href: "/knowledge-hub/sprs-score", description: "Learn how SPRS scores are calculated, submitted, and improved for DoD contracts." },
    { title: "CMMC Certification Process Step-by-Step", href: "/knowledge-hub/certification-process", description: "A complete walkthrough of the C3PAO assessment process and timeline." },
  ],
  definition: {
    id: "definition-purpose",
    heading: "CMMC Definition and Purpose",
    paragraphs: [
      "The Cybersecurity Maturity Model Certification (CMMC) is a verification mechanism created by the U.S. Department of Defense (DoD) to ensure that defense contractors adequately protect sensitive government information. It combines cybersecurity standards, processes, and practices into a unified certification framework.",
      "Prior to CMMC, defense contractors self-attested compliance with DFARS clause 252.204-7012 and NIST SP 800-171. This self-attestation model produced inconsistent results — a 2019 DoD Inspector General audit found that only 1 of 5 sampled contractors had properly implemented the required controls. CMMC was designed to close this verification gap.",
      "The core purpose of CMMC is twofold: first, to protect Federal Contract Information (FCI) — information the government provides to contractors for contract performance; and second, to protect Controlled Unclassified Information (CUI) — sensitive but unclassified information that, if compromised, could damage national security.",
    ],
    paragraphEmphasis: [
      ["Cybersecurity Maturity Model Certification (CMMC)"],
      [],
      ["Federal Contract Information (FCI)", "Controlled Unclassified Information (CUI)"],
    ],
    cards: [
      { title: "Protects FCI", description: "Federal Contract Information — data provided by or generated for the government under contract" },
      { title: "Protects CUI", description: "Controlled Unclassified Information — sensitive data requiring safeguarding per Executive Order 13556" },
      { title: "Verifiable", description: "Assessment types include self-assessments, C3PAO assessments, and government assessments, depending on the required CMMC level and assessment pathway" },
      { title: "Scalable", description: "Three tiered levels allow proportional requirements based on contract sensitivity" },
    ] as WhatIsCmmcCard[],
  },
  history: {
    id: "history",
    heading: "The History of CMMC — From DFARS to CMMC 2.0",
    introduction: "Understanding CMMC requires context about how DoD cybersecurity requirements evolved over the past decade.",
    items: [
      { year: "2015", event: "DFARS 252.204-7012", description: "DoD issues DFARS clause requiring contractors to implement NIST 800-171 controls and report cyber incidents. Self-attestation only." },
      { year: "2017", event: "NIST SP 800-171 Rev 1", description: "NIST publishes revised guidance with 110 security requirements across 14 families for protecting CUI in non-federal systems." },
      { year: "Jan 2020", event: "CMMC 1.0 Released", description: "DoD releases CMMC Version 1.0 with five maturity levels (1–5) and requirement for third-party assessments. Initial rollout planned for select contracts." },
      { year: "Nov 2021", event: "CMMC 2.0 Announced", description: "DoD revises CMMC to three levels, removes unique process maturity practices, aligns Level 2 to NIST 800-171, and allows self-assessment for some Level 2 contracts." },
      { year: "Dec 2023", event: "CMMC Proposed Rule", description: "DoD publishes the proposed 32 CFR part 170 CMMC program rule on December 26, 2023." },
      { year: "Oct 2024", event: "CMMC Program Final Rule", description: "DoD publishes the 32 CFR part 170 final rule on October 15, 2024; it becomes effective December 16, 2024." },
      { year: "2025–2026", event: "Phase I Begins; Phase II Suspended", description: "Phase I begins November 10, 2025. On July 13, 2026, the Department suspends the planned Phase II requirements, originally scheduled for November 10, 2026, while keeping Phase I self-assessment requirements in effect." },
    ] as WhatIsCmmcTimelineItem[],
  },
  whoNeedsIt: {
    id: "who-needs-it",
    heading: "Who Needs CMMC Certification?",
    introduction: "CMMC requirements apply when a DoD solicitation, contract, or covered subcontract requires a CMMC status for information systems that process, store, or transmit FCI or CUI. Organizations potentially in scope include:",
    items: [
      "Prime contractors directly contracting with the DoD",
      "Subcontractors at any tier in the DoD supply chain",
      "Managed Service Providers (MSPs) that handle DoD contractor data",
      "Cloud Service Providers (CSPs) whose platforms store or process CUI",
      "Foreign subsidiaries of U.S. defense contractors handling FCI/CUI",
    ],
    note: "Even if you do not directly handle CUI, if your subcontract requires you to access DoD systems or government-furnished information, you may still need CMMC Level 1 certification. The required level will be specified in the contract's Request for Proposal (RFP).",
  },
  levels: {
    id: "three-levels",
    heading: "The Three Levels of CMMC 2.0",
    introduction: "CMMC 2.0 streamlined the original five levels into three, each targeting a different category of contractor and data sensitivity.",
    table: {
      headers: ["Criterion", "Level 1 — Foundational", "Level 2 — Advanced", "Level 3 — Expert"],
      rows: [
        ["Requirements", "15 requirements (FAR 52.204-21)", "110 requirements (NIST SP 800-171 Rev. 2)", "24 selected NIST SP 800-172 requirements, after achieving Final Level 2 (C3PAO)"],
        ["Data Type Protected", "FCI only", "CUI", "CUI in high-priority programs"],
        ["Assessment Method", "Annual self-assessment and annual affirmation", "Triennial self-assessment or triennial C3PAO assessment, with annual affirmation", "Triennial DCMA DIBCAC assessment and annual affirmation"],
        ["Who Needs It", "Contractors required to hold Level 1 for systems handling FCI", "Contractors required to hold Level 2 for systems handling CUI", "Contractors required to hold Level 3 for designated high-priority CUI programs"],
        ["SPRS Record", "Self-assessment result and affirmation", "Assessment result and affirmation", "Government assessment result and affirmation"],
        ["POA&M Allowed", "No", "Yes, subject to Level 2 limits and 180-day closeout", "Yes, subject to Level 3 limits and 180-day DIBCAC closeout"],
      ],
    } as WhatIsCmmcTable,
    note: "These assessment types are defined in 32 CFR part 170. Current rollout policy is separate: Phase I began November 10, 2025, and the Department suspended the planned Phase II requirements on July 13, 2026 while keeping Phase I self-assessment requirements in effect.",
  },
  comparison: {
    id: "vs-nist",
    heading: "CMMC vs. NIST 800-171: What's the Difference?",
    introduction: "CMMC and NIST 800-171 are closely related but distinct. NIST 800-171 is the standard; CMMC is the verification mechanism that ensures contractors actually implement it.",
    table: {
      headers: ["Dimension", "NIST SP 800-171", "CMMC 2.0"],
      rows: [
        ["Published by", "National Institute of Standards and Technology", "Department of Defense"],
        ["Nature", "Technical standard / guidance document", "Contractual certification program"],
        ["Verification", "Self-assessment under the DoD Assessment Methodology", "Self-assessment, C3PAO assessment, or DCMA DIBCAC assessment, depending on level and pathway"],
        ["Controls", "110 requirements across 14 families", "Incorporates all 110 NIST 800-171 controls at Level 2"],
        ["Enforcement", "Required by DFARS 252.204-7012 when that clause applies", "Contract award eligibility condition when required by the applicable solicitation"],
        ["Current program basis", "NIST SP 800-171 Rev. 2 for the current CMMC model", "32 CFR part 170 final rule published October 15, 2024"],
      ],
    } as WhatIsCmmcTable,
  },
  terms: {
    id: "key-terms",
    heading: "Key CMMC Terms Explained",
    introduction: "The CMMC ecosystem has its own vocabulary. Understanding these terms is essential for any DoD contractor navigating the certification process.",
    items: [
      { title: "CUI — Controlled Unclassified Information", description: "Information the government creates or possesses, or that an entity creates or possesses for or on behalf of the government, that a law, regulation, or government-wide policy requires or permits an agency to handle using safeguarding or dissemination controls. CUI is sensitive but not classified. Examples include export-controlled technical data, personally identifiable information (PII), and defense acquisition program information." },
      { title: "FCI — Federal Contract Information", description: "Information provided by or generated for the government under a contract to develop or deliver a product or service to the government, but not intended for public release. FCI is a broader category than CUI and has less stringent protection requirements. CMMC Level 1 uses the 15 basic safeguarding requirements in FAR 52.204-21. Its assessment mapping contains 17 NIST SP 800-171 references because FAR 52.204-21(b)(1)(ix) maps to three separate NIST requirements." },
      { title: "C3PAO — Certified Third-Party Assessment Organization", description: "An organization certified by the CMMC Accreditation Body (Cyber AB) to conduct official CMMC Level 2 assessments. C3PAOs employ Certified CMMC Assessors (CCAs) who perform the actual assessment of a contractor's cybersecurity practices. A list of authorized C3PAOs is published at cyberab.org." },
      { title: "SPRS — Supplier Performance Risk System", description: "The DoD's Supplier Performance Risk System where contractors submit their self-assessed NIST 800-171 score. The SPRS score ranges from -203 to +110, with 110 representing full compliance. Contracting Officers can view SPRS scores during source selection. A negative score is permissible with an active POA&M showing remediation progress." },
      { title: "POA&M — Plan of Action and Milestones", description: "A documented plan that identifies tasks needed to remediate security requirement deficiencies, assigns resources, and establishes milestones and completion dates. CMMC permits limited POA&Ms at Levels 2 and 3 when the applicable minimum score and requirement restrictions are met. POA&M closeout must be confirmed within 180 days; Level 1 does not permit POA&Ms." },
      { title: "SSP — System Security Plan", description: "A formal document that describes the security requirements for an information system and describes the security controls in place or planned for meeting those requirements. The SSP is a core CMMC deliverable documenting all 110 NIST 800-171 controls and is reviewed during C3PAO assessments. CMMC Lens automates SSP generation from collected evidence." },
    ] as WhatIsCmmcCard[],
  },
  automation: {
    id: "automation",
    heading: "How DefenseEye Automates CMMC Readiness",
    paragraphs: [
      "For most DoD contractors, the path to CMMC Level 2 certification is daunting: 110 controls to implement, hundreds of evidence artifacts to collect, SSPs and POA&Ms to write, and an SPRS score to calculate and submit. Without automation, this process typically takes 12–18 months and $150,000–$500,000 in consultant fees.",
      "CMMC Lens by DefenseEye uses AI-driven automation to compress this timeline to 60–90 days for most small and mid-size contractors. The platform connects to your cloud environments (Azure Commercial, Azure GCC, Microsoft 365 Commercial, and M365 GCC High), automatically collects evidence for each NIST 800-171 control, generates a pre-populated SSP, calculates your live SPRS score, and produces remediation guidance ranked by priority.",
    ],
    paragraphEmphasis: [[], ["CMMC Lens by DefenseEye"]],
    title: "CMMC Lens — Key Capabilities",
    subtitle: "AI-powered CMMC 2.0 readiness in a single platform",
    capabilities: [
      "Automated evidence collection across 110 controls",
      "AI-generated SSP with control descriptions",
      "Live SPRS score calculation and SPRS submission support",
      "POA&M generation with prioritized remediation tasks",
      "Continuous compliance monitoring with drift alerts",
      "C3PAO readiness scoring and gap analysis",
    ],
    links: [
      { label: "CMMC Level 1 vs Level 2 →", href: "/knowledge-hub/cmmc-levels" },
      { label: "Understanding Your SPRS Score →", href: "/knowledge-hub/sprs-score" },
      { label: "CMMC Certification Process →", href: "/knowledge-hub/certification-process" },
    ] as WhatIsCmmcLink[],
  },
  faq: {
    id: "faq",
    heading: "Frequently Asked Questions About CMMC",
    items: [
      { question: "When does CMMC 2.0 go into effect for DoD contracts?", answer: "Phase I began November 10, 2025. On July 13, 2026, the Department suspended the planned Phase II requirements, which had been scheduled to begin November 10, 2026. Phase I self-assessment requirements remain in effect. Contractors should read each solicitation and contract to identify the CMMC level and status required for the information systems used in performance." },
      { question: "Can small businesses self-attest to CMMC Level 2?", answer: "Company size does not determine the assessment pathway. The CMMC regulations define a Level 2 self-assessment pathway conducted every three years and a Level 2 C3PAO assessment pathway conducted every three years, both with annual affirmation. The applicable CMMC level and assessment type are identified through solicitation and contract requirements. Current rollout policy keeps Phase I self-assessment requirements in effect while the planned Phase II requirements are suspended." },
      { question: "How much does CMMC Level 2 certification cost?", answer: "A C3PAO assessment typically costs $50,000–$150,000 depending on company size, system complexity, and scope. Pre-assessment preparation (gap analysis, remediation, SSP writing) can cost an additional $100,000–$400,000 using traditional consultants. With tools like CMMC Lens, preparation costs can be reduced by 60–80% through automation of evidence collection and documentation." },
      { question: "What happens if I lose my CMMC certification?", answer: "If a contractor fails to maintain CMMC compliance after certification, they may lose their certification status, which can result in contract termination for the relevant contract and ineligibility for future DoD contracts requiring CMMC. Contractors should maintain continuous compliance monitoring — a key capability provided by platforms like CMMC Lens." },
      { question: "Does CMMC apply to foreign companies with U.S. DoD contracts?", answer: "Yes. CMMC requirements apply to all entities receiving DoD contracts that handle FCI or CUI, regardless of country of domicile. Non-U.S. companies must comply with CMMC just as U.S.-based contractors do, though implementation may have additional complexity due to cross-border data handling and foreign ownership, control, or influence (FOCI) considerations." },
    ] as WhatIsCmmcFaq[],
  },
} as const;
