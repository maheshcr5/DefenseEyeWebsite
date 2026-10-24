export const CMMC_LEVELS_CONTENT = {
  title: "CMMC Level 1 vs Level 2: Complete Comparison Guide for DoD Contractors",
  description: "Understand the difference between CMMC Level 1 (15 FAR requirements, FCI) and CMMC Level 2 (110 NIST SP 800-171 requirements, CUI), including assessment pathways, timing, and how solicitations identify the required CMMC status.",
  h1: "CMMC Level 1 vs Level 2: Which Do You Need? (2026 Guide)",
  lastUpdated: "September 2026",
  quickAnswer: [
    { text: "CMMC Level 1", strong: true },
    { text: " applies when a solicitation or contract requires Level 1 for an information system that will process, store, or transmit Federal Contract Information (FCI). It comprises 15 FAR 52.204-21 safeguarding requirements, mapped to 17 NIST SP 800-171 assessment references, and requires an annual self-assessment and annual affirmation. ", strong: false },
    { text: "CMMC Level 2", strong: true },
    { text: " protects Controlled Unclassified Information (CUI) through 110 NIST SP 800-171 Rev. 2 requirements. The regulations define triennial self-assessment and triennial C3PAO assessment pathways, both with annual affirmation. Current rollout policy is separate: implementation is paused in Phase I, which may require only self-assessments. Check the solicitation and resulting contract for the required CMMC status.", strong: false },
  ],
  toc: [{id:"level-1",label:"CMMC Level 1"},{id:"level-2",label:"CMMC Level 2"},{id:"comparison",label:"Side-by-Side Comparison"},{id:"determine-level",label:"How to Determine Your Level"},{id:"domain-breakdown",label:"Level 2 Domain Breakdown"},{id:"sprs-role",label:"Role of SPRS Score"},{id:"automation",label:"DefenseEye Support"},{id:"faq",label:"FAQ"}],
  related: [
    {title:"What is CMMC? Complete Guide",href:"/knowledge-hub/what-is-cmmc",description:"Foundational overview of CMMC 2.0, its history, and key definitions."},
    {title:"Understanding Your SPRS Score",href:"/knowledge-hub/sprs-score",description:"How SPRS scores are calculated, submitted, and improved."},
    {title:"CMMC Certification Process Step-by-Step",href:"/knowledge-hub/certification-process",description:"Complete walkthrough of the C3PAO assessment process and timeline."},
  ],
  level1: {
    id:"level-1", heading:"CMMC Level 1 — Federal Contract Information (FCI) Protection",
    paragraphs:[
      'CMMC Level 1, "Foundational," verifies basic safeguarding when an applicable solicitation or contract requires Level 1 for an information system that processes, stores, or transmits FCI. It comprises the 15 safeguarding requirements in FAR clause 52.204-21 (Basic Safeguarding of Covered Contractor Information Systems). Those 15 FAR requirements map to 17 NIST SP 800-171 assessment references because FAR 52.204-21(b)(1)(ix) maps to three NIST requirements while the other 14 map one-to-one.',
      "Level 1 requires an annual self-assessment and an affirmation after each assessment, both entered in the Supplier Performance Risk System (SPRS). An affirming official must also affirm continuing compliance annually. No C3PAO assessment is required for Level 1.",
    ],
    listHeading:"All 17 Mapped Level 1 Assessment References",
    practices:[
      "AC.L1-3.1.1 — Limit information system access to authorized users","AC.L1-3.1.2 — Limit information system access to transactions and functions authorized users are permitted to execute","AC.L1-3.1.20 — Verify and control all connections to external systems","AC.L1-3.1.22 — Control CUI posted or processed on publicly accessible systems","IA.L1-3.5.1 — Identify information system users, processes acting on behalf of users, and devices","IA.L1-3.5.2 — Authenticate the identities of users, processes, and devices before allowing access","MP.L1-3.8.3 — Sanitize or destroy information system media before disposal or reuse","PE.L1-3.10.1 — Limit physical access to organizational information systems to authorized individuals","PE.L1-3.10.3 — Escort visitors and monitor visitor activity","PE.L1-3.10.4 — Maintain audit logs of physical access","PE.L1-3.10.5 — Control and manage physical access devices","SC.L1-3.13.1 — Monitor, control, and protect organizational communications","SC.L1-3.13.5 — Implement subnetworks for publicly accessible system components","SI.L1-3.14.1 — Identify, report, and correct information and information system flaws","SI.L1-3.14.2 — Provide protection from malicious code at appropriate locations","SI.L1-3.14.4 — Update malicious code protection mechanisms","SI.L1-3.14.5 — Perform periodic scans of the information system and real-time scans of files from external sources",
    ],
    note:"These 17 entries are assessment references mapped from 15 FAR requirements, not 17 separate FAR requirements. Meeting Level 2 requirements also satisfies Level 1 for the same CMMC Assessment Scope.",
  },
  level2: {
    id:"level-2", heading:"CMMC Level 2 — Controlled Unclassified Information (CUI) Protection",
    paragraphs:[
      'CMMC Level 2, "Advanced," protects CUI when an applicable solicitation or contract requires Level 2. It uses all 110 security requirements in NIST SP 800-171 Rev. 2, organized across 14 requirement families.',
      "The regulatory framework defines two Level 2 pathways: a self-assessment every three years or a C3PAO assessment every three years. Both require affirmation after the assessment and annually thereafter; annual affirmation is not an annual reassessment. Current rollout policy is separate: CMMC implementation is paused in Phase I, which may require only Level 1 and Level 2 self-assessments.",
      "Level 2 requires a documented System Security Plan (SSP). Limited use of a Plan of Action and Milestones (POA&M) can produce Conditional Level 2 status only when the assessment score is at least 80 percent (88 of 110), every unmet requirement is eligible under 32 CFR 170.21, and closeout is confirmed within 180 days. Final Level 2 status requires all requirements to be MET.",
    ],
    stats:[{value:"110",label:"Total Requirements"},{value:"14",label:"Requirement Families"},{value:"3 yrs",label:"Level 2 Assessment Period"}],
  },
  comparison: {
    id:"comparison", heading:"Side-by-Side Comparison Table", introduction:"Use this table to quickly understand the key differences between CMMC Level 1 and Level 2 across all critical dimensions.",
    headers:["Dimension","Level 1 — Foundational","Level 2 — Advanced"],
    rows:[
      ["Requirements Count","15 FAR 52.204-21 requirements (mapped to 17 NIST assessment references)","110 NIST SP 800-171 Rev. 2 requirements"],["Data Protected","FCI (Federal Contract Information)","CUI (Controlled Unclassified Information)"],["Regulatory Assessment Pathway","Annual self-assessment","Self-assessment every 3 years or C3PAO assessment every 3 years"],["Affirmation","After each assessment and annually","After each assessment and annually thereafter"],["C3PAO Required","No","Only when the solicitation requires Level 2 (C3PAO); current Phase I rollout may require only self-assessments"],["CMMC Status and Score","All 15 requirements must be MET for Final Level 1","Final status requires all requirements MET; Conditional status requires at least 88 of 110 and a permitted POA&M"],["Documentation Required","Evidence supporting the assessment and affirmation","SSP, assessment evidence, and POA&M when permitted for Conditional status"],["Typical Timeline","2–4 weeks for preparation","6–18 months (manual); 60–90 days with CMMCLens"],["Cost Estimate","$5,000–$25,000 (preparation)","$150,000–$550,000 (manual); significantly less with automation"],["DefenseEye Support","Full automation of 17 mapped assessment references","Full 110-requirement evidence collection, SSP, POA&M, SPRS"],
    ],
  },
  determine: {
    id:"determine-level", heading:"How to Determine Your Required CMMC Level", introduction:"The requiring activity identifies the CMMC status for each solicitation based on the information systems that will process, store, or transmit FCI or CUI. Use this decision process:",
    items:[
      {step:"1",title:"Review your contracts and solicitations",description:"Check for DFARS 252.204-7012 when covered defense information is involved and for the CMMC solicitation provision at DFARS 252.204-7025. When CMMC applies, the solicitation identifies Level 1 (Self), Level 2 (Self), Level 2 (C3PAO), or Level 3 (DIBCAC)."},
      {step:"2",title:"Review information markings and security requirements",description:"DD Form 254 specifies classified-information security requirements and does not by itself determine a CMMC status. Review contract data markings, security requirements, and applicable CUI categories to identify the information each system will handle."},
      {step:"3",title:"Identify what information you receive and generate",description:"Design specifications, engineering drawings, technical data packages, and procurement information are not automatically CUI. Confirm whether the information falls within an applicable CUI category and is marked or otherwise identified through the contract."},
      {step:"4",title:"Consider your subcontractor relationships",description:"Prime contractors must flow down the appropriate CMMC requirement when subcontractor systems will process, store, or transmit FCI or CUI in performance of the subcontract. Check the subcontract for the required status and applicable systems."},
    ],
  },
  domains: {
    id:"domain-breakdown", heading:"CMMC Level 2 Requirement-Family Breakdown", introduction:"CMMC Level 2's 110 requirements are organized across 14 families drawn directly from NIST SP 800-171 Rev. 2. Here is a breakdown of each family, the number of requirements, and representative examples.",
    headers:["Family","Requirements","Example Requirements"],
    rows:[
      ["Access Control (AC)","22","Multi-factor authentication, least privilege, remote access controls, wireless access restrictions"],["Awareness and Training (AT)","3","Security awareness training, insider threat awareness, role-based security training"],["Audit and Accountability (AU)","9","Audit log generation, log review, protection, retention policies, user activity monitoring"],["Configuration Management (CM)","9","Baseline configurations, configuration change control, security configuration settings, software use restrictions"],["Identification and Authentication (IA)","11","Password management, MFA enforcement, authenticator management, identifier reuse policies"],["Incident Response (IR)","3","Incident response capability, incident tracking, post-incident review"],["Maintenance (MA)","6","Controlled maintenance, maintenance tools, remote maintenance, timely maintenance"],["Media Protection (MP)","9","Media access, marking, storage, transport, sanitization, and destruction controls"],["Personnel Security (PS)","2","Screening individuals before access, protecting CUI during and after personnel actions"],["Physical Protection (PE)","6","Physical access authorizations, access control for output devices, alternate work site security"],["Risk Assessment (RA)","3","Risk assessments, vulnerability scanning, remediation based on risk"],["Security Assessment (CA)","4","System assessment, plan of action development, operational monitoring, C3PAO-readiness"],["System and Comm. Protection (SC)","16","Network segmentation, data-in-transit encryption, network monitoring, denial-of-service protection"],["System and Info. Integrity (SI)","7","Malware protection, security alerts, patch management, integrity checking, spam protection"],["TOTAL","110","Full NIST SP 800-171 Rev. 2 requirement set"],
    ],
  },
  sprs: {
    id:"sprs-role", heading:"The Role of SPRS Score in CMMC Level 2",
    paragraphs:["For CMMC Level 2, assessment results and affirmations are recorded in the Supplier Performance Risk System (SPRS). Level 2 scoring applies the DoD Assessment Methodology to the 110 NIST SP 800-171 requirements, with a maximum score of 110 and possible negative scores when requirements are NOT MET.","There is no single minimum SPRS score that governs every DoD award. When a solicitation requires a CMMC status, the offeror must have that current status for each applicable information system and a current affirmation of continuous compliance. Final Level 2 requires every requirement to be MET; Conditional Level 2 requires a score of at least 88 of 110, only permitted POA&M items, and closeout within 180 days.","For a Level 2 C3PAO assessment, the organization must demonstrate implementation of the requirements to the assessor. The C3PAO submits the assessment result through the CMMC system for transmission to SPRS. If eligible deficiencies remain, Conditional rather than Final status may be issued subject to the POA&M rules."],
    link:{label:"Read the full SPRS Score guide",href:"/knowledge-hub/sprs-score"},
  },
  automation: {
    id:"automation", heading:"How CMMCLens Supports Both Levels", paragraph:"Whether your contracts require Level 1 or Level 2, CMMCLens by DefenseEye provides complete automation support — eliminating the manual burden of evidence collection, documentation, and continuous compliance monitoring.",
    groups:[
      {title:"Level 1 Support",features:["Automated evidence for all 17 mapped Level 1 assessment references","Annual self-assessment workflow and SPRS submission","Policy templates for all Level 1 requirement families","Annual assessment reminders and scheduling"]},
      {title:"Level 2 Support",features:["Full 110-control evidence collection from cloud environments","AI-generated SSP with all control descriptions and implementations","POA&M with prioritized remediation tasks and timeline","Live SPRS score calculation with drill-down by domain"]},
    ],
  },
  faq: {
    id:"faq", heading:"Frequently Asked Questions",
    items:[
      {question:"Can an organization hold Level 1 status and later pursue Level 2?",answer:"Yes. CMMC status applies to the information systems within an assessment scope, and a solicitation identifies the status required for systems used in contract performance. An organization can maintain different assessment scopes or later pursue Level 2. Meeting Level 2 requirements also satisfies Level 1 for the same CMMC Assessment Scope."},
      {question:"When does Level 2 require a C3PAO assessment?",answer:"The regulatory framework allows a solicitation to require Level 2 (Self) or Level 2 (C3PAO). Current rollout policy is narrower: Phase I began November 10, 2025, and on July 13, 2026 the Department suspended the planned Phase II requirements that had been scheduled for November 10, 2026. During the pause, the CMMC program may require only Level 1 and Level 2 self-assessments. Read each solicitation and resulting contract for the status actually required."},
      {question:"How long is a Final CMMC Level 2 C3PAO status current?",answer:"A Final Level 2 (C3PAO) status is current for three years from its CMMC Status Date, provided there are no changes in compliance and the affirming official submits an affirmation after the assessment and annually thereafter. The annual affirmation is not an annual self-assessment. A significant change may require a new assessment."},
      {question:"What is a 'conditional' CMMC Level 2 status?",answer:"Conditional Level 2 status may be achieved only when the assessment score is at least 80 percent (88 of 110), every unmet requirement is eligible for a POA&M under 32 CFR 170.21, and the applicable affirmation is submitted. All POA&M items must be closed and verified within 180 days of the Conditional CMMC Status Date to achieve Final status; otherwise the Conditional status expires."},
      {question:"Does CMMC Level 2 require FedRAMP-authorized cloud services?",answer:"Not for every cloud service. When an external cloud service provider stores, processes, or transmits covered defense information for a covered contractor information system, DFARS 252.204-7012(b)(2)(ii)(D) requires security equivalent to the FedRAMP Moderate baseline and specified incident-reporting and related obligations. CMMCLens integrates with Azure Commercial, Azure GCC, M365 Commercial, and M365 GCC High for evidence collection."},
    ],
  },
} as const;
