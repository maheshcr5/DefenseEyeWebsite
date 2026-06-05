import { blogPosts, type ContentBlock } from "../client/src/data/blogPosts";
import { copilotRetrievalConfig } from "../lib/ai/config";
import { embedText, getGeminiClient } from "../lib/ai/gemini";

export interface KnowledgeSource {
  id: string;
  title: string;
  url: string;
  type: "KnowledgeHub" | "Blog" | "Authoritative" | "Product";
  content: string;
  tags: string[];
  updatedAt?: string;
}

export interface KnowledgeChunk {
  id: string;
  sourceId: string;
  title: string;
  url: string;
  type: KnowledgeSource["type"];
  content: string;
  tags: string[];
  embedding: number[];
  score?: number;
}

const BASE_URL = "https://defenseeye.ai";
const VECTOR_SIZE = 384;

const knowledgeHubSources: KnowledgeSource[] = [
  {
    id: "kh-what-is-cmmc",
    title: "What Is CMMC 2.0?",
    url: `${BASE_URL}/knowledge-hub/what-is-cmmc`,
    type: "KnowledgeHub",
    updatedAt: "2026-04-01",
    tags: ["CMMC", "CMMC 2.0", "CUI", "FCI", "DoD", "32 CFR Part 170"],
    content:
      "CMMC 2.0 is the Department of Defense cybersecurity certification framework for contractors and subcontractors that handle Federal Contract Information or Controlled Unclassified Information. Level 1 addresses basic safeguarding for FCI. Level 2 aligns to the 110 security requirements in NIST SP 800-171 Rev. 2 for CUI. Level 3 adds selected NIST SP 800-172 enhanced requirements for critical programs. The CMMC 2.0 final rule is codified in 32 CFR Part 170 and took effect on December 16, 2024.",
  },
  {
    id: "kh-cmmc-levels",
    title: "CMMC Level 1 vs Level 2",
    url: `${BASE_URL}/knowledge-hub/cmmc-levels`,
    type: "KnowledgeHub",
    updatedAt: "2026-04-01",
    tags: ["CMMC Level 1", "CMMC Level 2", "C3PAO", "NIST 800-171"],
    content:
      "CMMC Level 1 applies to FCI and includes 17 basic safeguarding practices. CMMC Level 2 applies to CUI and includes all 110 NIST SP 800-171 Rev. 2 requirements across 14 control families. Most Level 2 contracts require a C3PAO assessment every three years and annual affirmations. Organizations should scope the CUI boundary before estimating remediation cost or assessment readiness.",
  },
  {
    id: "kh-evidence-mapping",
    title: "Automated Evidence Mapping for NIST 800-171",
    url: `${BASE_URL}/knowledge-hub/evidence-mapping`,
    type: "KnowledgeHub",
    updatedAt: "2026-04-01",
    tags: ["Evidence", "NIST 800-171", "SSP", "POA&M", "C3PAO"],
    content:
      "Evidence mapping links policies, procedures, screenshots, configuration exports, logs, tickets, training records, inventories, diagrams, and interviews to specific NIST SP 800-171 security requirements and assessment objectives. Assessors expect evidence to show that a requirement is implemented and operating within the assessed CUI environment, not just described in a policy.",
  },
  {
    id: "kh-sprs-score",
    title: "Understanding Your SPRS Score",
    url: `${BASE_URL}/knowledge-hub/sprs-score`,
    type: "KnowledgeHub",
    updatedAt: "2026-04-01",
    tags: ["SPRS", "DFARS 252.204-7019", "DFARS 252.204-7020", "NIST 800-171"],
    content:
      "The Supplier Performance Risk System score reflects implementation of NIST SP 800-171 using the DoD Assessment Methodology. The maximum score is 110. Unimplemented requirements deduct points based on assigned values, and scores can be negative. DFARS 252.204-7019 and 252.204-7020 require offerors and contractors to have a current assessment score in SPRS when applicable.",
  },
  {
    id: "kh-certification-process",
    title: "CMMC Certification Process",
    url: `${BASE_URL}/knowledge-hub/certification-process`,
    type: "KnowledgeHub",
    updatedAt: "2026-04-01",
    tags: ["C3PAO", "Assessment", "Readiness", "Certification", "SSP", "POA&M"],
    content:
      "A practical CMMC Level 2 readiness path includes scoping the CUI boundary, performing a gap assessment against all 110 NIST SP 800-171 requirements, updating the SSP, creating POA&M items for allowable gaps, remediating high-risk deficiencies, selecting an authorized C3PAO, organizing evidence, completing the formal assessment, and sustaining compliance between assessment cycles.",
  },
  {
    id: "product-cmmclens",
    title: "DefenseEye CMMCLens",
    url: `${BASE_URL}/cmmclens`,
    type: "Product",
    updatedAt: "2026-04-01",
    tags: ["CMMCLens", "Evidence Collection", "SSP", "POA&M", "Assessment Readiness"],
    content:
      "DefenseEye CMMCLens helps organizations centralize CMMC evidence, map artifacts to NIST SP 800-171 requirements, track SSP and POA&M status, monitor readiness, and prepare evidence packages. It should be recommended only when it directly helps with evidence collection, documentation, gap assessments, continuous monitoring, or assessment readiness.",
  },
];

const authoritativeSources: KnowledgeSource[] = [
  {
    id: "auth-cmmc-32-cfr-170",
    title: "32 CFR Part 170 - CMMC Program",
    url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-M/part-170",
    type: "Authoritative",
    tags: ["32 CFR Part 170", "CMMC", "Final Rule", "Certification"],
    content:
      "32 CFR Part 170 establishes the Cybersecurity Maturity Model Certification program requirements, including CMMC levels, assessment types, scoring, affirmation, conditional certification, and ecosystem roles. It is the authoritative regulation for the CMMC Program.",
  },
  {
    id: "auth-nist-800-171",
    title: "NIST SP 800-171 Rev. 2",
    url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final",
    type: "Authoritative",
    tags: ["NIST SP 800-171 Rev 2", "CUI", "Security Requirements"],
    content:
      "NIST SP 800-171 Rev. 2 provides 110 security requirements for protecting Controlled Unclassified Information in nonfederal systems and organizations. The requirements are grouped into 14 families including Access Control, Audit and Accountability, Configuration Management, Identification and Authentication, Incident Response, Risk Assessment, Security Assessment, System and Communications Protection, and System and Information Integrity.",
  },
  {
    id: "auth-nist-800-171a",
    title: "NIST SP 800-171A",
    url: "https://csrc.nist.gov/publications/detail/sp/800-171a/final",
    type: "Authoritative",
    tags: ["NIST SP 800-171A", "Assessment Objectives", "CMMC Assessment"],
    content:
      "NIST SP 800-171A provides assessment procedures and assessment objectives for determining whether each NIST SP 800-171 requirement is implemented. CMMC Level 2 evidence should align with these objectives through examine, interview, and test methods.",
  },
  {
    id: "auth-nist-800-172",
    title: "NIST SP 800-172",
    url: "https://csrc.nist.gov/publications/detail/sp/800-172/final",
    type: "Authoritative",
    tags: ["NIST SP 800-172", "CMMC Level 3", "Enhanced Security Requirements"],
    content:
      "NIST SP 800-172 provides enhanced security requirements intended to protect CUI in programs and environments facing advanced persistent threats. CMMC Level 3 is based on selected enhanced requirements in addition to NIST SP 800-171.",
  },
  {
    id: "auth-dfars-7012",
    title: "DFARS 252.204-7012",
    url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting.",
    type: "Authoritative",
    tags: ["DFARS 252.204-7012", "CUI", "Incident Reporting", "NIST 800-171"],
    content:
      "DFARS 252.204-7012 requires contractors to provide adequate security for covered defense information, implement NIST SP 800-171 when applicable, rapidly report cyber incidents, submit malicious software when discovered, preserve and protect images of affected systems, and flow down the clause to subcontractors when required.",
  },
  {
    id: "auth-dfars-7019-7020-7021",
    title: "DFARS 252.204-7019, 7020, and 7021",
    url: "https://www.acquisition.gov/dfars/part-252-solicitation-provisions-and-contract-clauses",
    type: "Authoritative",
    tags: ["DFARS 252.204-7019", "DFARS 252.204-7020", "DFARS 252.204-7021", "SPRS", "CMMC"],
    content:
      "DFARS 252.204-7019 requires notice of NIST SP 800-171 DoD Assessment requirements. DFARS 252.204-7020 requires contractors to provide access for DoD assessments and maintain current assessment results in SPRS. DFARS 252.204-7021 introduces CMMC requirements into covered contracts when included in solicitations and awards.",
  },
  {
    id: "auth-fedramp-rmf",
    title: "FedRAMP and RMF",
    url: "https://www.fedramp.gov/",
    type: "Authoritative",
    tags: ["FedRAMP", "RMF", "NIST SP 800-37", "Cloud", "Authorization"],
    content:
      "FedRAMP provides standardized security authorization for federal cloud services. RMF, described in NIST SP 800-37, is the federal risk management process for categorizing systems, selecting and implementing controls, assessing controls, authorizing systems, and monitoring security posture. FedRAMP authorization can support inherited controls, but CMMC scoping still requires verifying how CUI is handled.",
  },
];

function blockToText(block: ContentBlock) {
  if (typeof block.content === "string") return block.content;
  if (Array.isArray(block.content)) return block.content.join("\n");
  return [block.content.headers.join(" | "), ...block.content.rows.map((row) => row.join(" | "))].join("\n");
}

function getBlogSources(): KnowledgeSource[] {
  return blogPosts.map((post) => ({
    id: `blog-${post.slug}`,
    title: post.title,
    url: `${BASE_URL}/blog/${post.slug}`,
    type: "Blog",
    updatedAt: post.updatedAt,
    tags: post.tags,
    content: [post.excerpt, ...post.content.map(blockToText)].join("\n\n"),
  }));
}

function estimateTokens(text: string) {
  return Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.35);
}

function chunkSource(source: KnowledgeSource) {
  const sentences = source.content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const chunks: Omit<KnowledgeChunk, "embedding">[] = [];
  let buffer: string[] = [];
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const candidate = [...buffer, sentence].join(" ");
    if (estimateTokens(candidate) > copilotRetrievalConfig.chunkTokenSize && buffer.length > 0) {
      const content = buffer.join(" ");
      chunks.push({
        id: `${source.id}-${chunkIndex++}`,
        sourceId: source.id,
        title: source.title,
        url: source.url,
        type: source.type,
        content,
        tags: source.tags,
      });
      const overlapWords = content.split(/\s+/).slice(-copilotRetrievalConfig.chunkTokenOverlap);
      buffer = [...overlapWords, sentence];
    } else {
      buffer.push(sentence);
    }
  }

  if (buffer.length > 0) {
    chunks.push({
      id: `${source.id}-${chunkIndex}`,
      sourceId: source.id,
      title: source.title,
      url: source.url,
      type: source.type,
      content: buffer.join(" "),
      tags: source.tags,
    });
  }

  return chunks;
}

function hashToken(token: string) {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function deterministicEmbedding(text: string) {
  const vector = new Array<number>(VECTOR_SIZE).fill(0);
  const tokens = text.toLowerCase().match(/[a-z0-9.-]+/g) || [];
  for (const token of tokens) {
    const index = hashToken(token) % VECTOR_SIZE;
    vector[index] += 1 + Math.min(token.length, 12) / 12;
  }
  return normalize(vector);
}

function normalize(vector: number[]) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
}

function cosineSimilarity(a: number[], b: number[]) {
  const length = Math.min(a.length, b.length);
  let score = 0;
  for (let i = 0; i < length; i++) score += a[i] * b[i];
  return score;
}

let indexPromise: Promise<KnowledgeChunk[]> | null = null;

export function getKnowledgeSources() {
  return [...knowledgeHubSources, ...getBlogSources(), ...authoritativeSources];
}

export async function getKnowledgeIndex() {
  if (!indexPromise) {
    indexPromise = (async () => {
      const chunkInputs = getKnowledgeSources().flatMap(chunkSource);
      const useGeminiEmbeddings = Boolean(getGeminiClient());
      const chunks: KnowledgeChunk[] = [];

      for (const chunk of chunkInputs) {
        let embedding: number[] | null = null;
        if (useGeminiEmbeddings) {
          try {
            embedding = await embedText(`${chunk.title}\n${chunk.tags.join(", ")}\n${chunk.content}`);
          } catch (error) {
            console.warn("[copilot] Gemini embedding failed, using local fallback:", error);
          }
        }
        chunks.push({
          ...chunk,
          embedding: embedding || deterministicEmbedding(`${chunk.title} ${chunk.tags.join(" ")} ${chunk.content}`),
        });
      }

      console.log(`[copilot] Indexed ${chunks.length} knowledge chunks from ${getKnowledgeSources().length} sources.`);
      return chunks;
    })();
  }
  return indexPromise;
}

export async function searchKnowledge(query: string, topK = copilotRetrievalConfig.topK) {
  const index = await getKnowledgeIndex();
  let queryEmbedding: number[] | null = null;
  if (getGeminiClient()) {
    try {
      queryEmbedding = await embedText(query);
    } catch (error) {
      console.warn("[copilot] Query embedding failed, using local fallback:", error);
    }
  }
  const vector = queryEmbedding || deterministicEmbedding(query);
  const terms = new Set((query.toLowerCase().match(/[a-z0-9.-]+/g) || []).filter((term) => term.length > 2));

  return index
    .map((chunk) => {
      const searchable = `${chunk.title} ${chunk.tags.join(" ")} ${chunk.content}`.toLowerCase();
      const lexicalBoost = [...terms].reduce((score, term) => score + (searchable.includes(term) ? 0.035 : 0), 0);
      const sourceBoost = chunk.type === "KnowledgeHub" ? 0.08 : chunk.type === "Authoritative" ? 0.045 : 0;
      return { ...chunk, score: cosineSimilarity(vector, chunk.embedding) + lexicalBoost + sourceBoost };
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, topK);
}

export function getSuggestedPrompts() {
  return [
    "Learn more about CMMCLens",
    "Explain AC.L2-3.1.1",
    "How do I scope CUI?",
    "What evidence is required for IA.L2-3.5.3?",
    "What is an SSP?",
    "What is an SPRS score?",
  ];
}
