import { describe, expect, it } from "vitest";
import { injectRouteSpecificHtml, SECURE_AI_ROUTE_META, secureAiPrerenderHtml } from "./index";

const baseHtml = `
<!doctype html>
<html>
  <head>
    <title>DefenseEye | Secure Agentic AI Implementation</title>
    <meta name="description" content="Homepage description" />
    <link rel="canonical" href="https://defenseeye.ai/" />
    <meta property="og:title" content="Homepage title" />
    <meta property="og:description" content="Homepage OG" />
    <meta property="og:url" content="https://defenseeye.ai" />
    <meta property="og:image" content="https://example.test/social.png" />
    <meta name="twitter:title" content="Homepage title" />
    <meta name="twitter:description" content="Homepage Twitter" />
    <meta name="twitter:image" content="https://example.test/social.png" />
    <meta name="keywords" content="AttackSense, CMMCLens, CMMC" />
    <!-- Schema.org: ProfessionalService + Organization -->
    <script type="application/ld+json">[{"knowsAbout":["AttackSense","CMMCLens","CMMC"]}]</script>
  </head>
  <body>
    <div id="root"><div class="de-pr"><main><h1>Implement Agentic AI Securely</h1><p>Additional DefenseEye Capabilities: AttackSense CMMCLens CMMC</p></main></div></div>
    <!-- Google Analytics 4 - loads only after cookie consent granted -->
  </body>
</html>`;

describe("secure-ai-adoption direct route HTML", () => {
  it("has the required route metadata values", () => {
    expect(SECURE_AI_ROUTE_META).toEqual({
      title: "Secure Agentic AI Consulting | DefenseEye",
      description:
        "DefenseEye helps regulated organizations implement agentic AI with secure architecture, responsible governance, risk controls, and hands-on delivery support.",
    });
  });

  it("renders route-specific no-JavaScript content without homepage portfolio leakage", () => {
    const html = secureAiPrerenderHtml();

    expect(html).toContain("Implement Agentic AI Securely");
    expect(html).toContain("Secure Agentic AI Readiness");
    expect(html).toContain("Request a Secure AI Readiness Consultation");
    expect(html).not.toContain("AttackSense");
    expect(html).not.toContain("CMMCLens");
    expect(html).not.toContain("Target CMMC Level");
  });

  it("replaces the default prerender body and schema for /secure-ai-adoption", () => {
    const secureAiHtml = injectRouteSpecificHtml(baseHtml, "/secure-ai-adoption");

    expect(secureAiHtml).toContain("Implement Agentic AI Securely");
    expect(secureAiHtml).toContain("Secure Agentic AI Readiness");
    expect(secureAiHtml).toContain("Route-specific structured data");
    expect(secureAiHtml).toContain('"@type": "Service"');
    expect(secureAiHtml).not.toContain("Operationalize Secure AI Adoption and CMMC Readiness");
    expect(secureAiHtml).not.toContain("AttackSense CMMCLens CMMC");
    expect(secureAiHtml).not.toContain('"knowsAbout":["AttackSense","CMMCLens","CMMC"]');
  });
});
