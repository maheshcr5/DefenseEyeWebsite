import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { getRouteMeta, renderSpaDocument } from "./index";
import { getSeoRoute, renderSitemapXml } from "../shared/seoRoutes";
import { getBreadcrumbTrail } from "../shared/siteArchitecture";
import { RELATED_LINKS } from "../shared/relatedLinks";
import { BANKING_AI_RISK_CONTENT, BANKING_AI_RISK_PATH, BANKING_DISCOVERY_HREF, DEFY_AI_RISK_URL } from "../shared/bankingAiRiskContent";

const template = fs.readFileSync(path.resolve(__dirname, "../client/index.html"), "utf-8");
const TITLE = "AI-Agent Risk Management for Banks and Fintechs | DefenseEye";
const DESCRIPTION =
  "DefenseEye helps banks and fintechs discover, govern, monitor, and guide remediation of AI-agent risk across sensitive data, tools, and workflows.";

describe("/solutions/banking-ai-agent-risk", () => {
  const page = renderSpaDocument(template, BANKING_AI_RISK_PATH);
  const root = page.html.slice(page.html.indexOf('<div id="root">'));

  it("renders with a unique title, description, Open Graph tags, canonical URL, and robots", () => {
    expect(page.status).toBe(200);
    expect(getRouteMeta(BANKING_AI_RISK_PATH)?.title).toBe(TITLE);
    expect(page.html).toContain(`<title>${TITLE}</title>`);
    expect(page.html).toContain(`<meta name="description" content="${DESCRIPTION}"`);
    expect(page.html).toContain(`<meta property="og:title" content="${TITLE}"`);
    expect(page.html).toContain(`<meta property="og:description" content="${DESCRIPTION}"`);
    expect(page.html).toContain('<meta property="og:url" content="https://defenseeye.ai/solutions/banking-ai-agent-risk"');
    expect(page.html).toContain('<link rel="canonical" href="https://defenseeye.ai/solutions/banking-ai-agent-risk"');
    expect(page.html).toContain('<meta name="robots" content="index, follow"');
  });

  it("server-renders one H1 and the page content as crawlable HTML", () => {
    expect(root.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(root).toContain(`<h1>${BANKING_AI_RISK_CONTENT.h1}</h1>`);
    expect(root).toContain(BANKING_AI_RISK_CONTENT.intro);
    for (const capability of BANKING_AI_RISK_CONTENT.capabilities) expect(root).toContain(capability.title);
    expect(root).toContain(BANKING_AI_RISK_CONTENT.productText);
    expect(root).toContain(`href="${BANKING_DISCOVERY_HREF.replace("&", "&amp;")}"`);
    expect(root).toContain(`href="${DEFY_AI_RISK_URL}"`);
  });

  it("emits WebPage and Service structured data only (no offers, ratings, or reviews)", () => {
    const blocks = Array.from(page.html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g), (match) => JSON.parse(match[1]));
    const nodes = blocks.flat(2).flatMap((node) => (node["@graph"] ? node["@graph"] : [node]));
    const types = nodes.map((node) => node["@type"]);
    expect(types).toContain("WebPage");
    expect(types).toContain("Service");
    const service = nodes.find((node) => node["@type"] === "Service");
    expect(service.name).toBe(BANKING_AI_RISK_CONTENT.h1);
    expect(service.url).toBe("https://defenseeye.ai/solutions/banking-ai-agent-risk");
    expect(JSON.stringify(blocks)).not.toMatch(/"(offers|aggregateRating|review|price)"/);
  });

  it("is in the sitemap with a breadcrumb under the financial-services hub", () => {
    expect(renderSitemapXml()).toContain("<loc>https://defenseeye.ai/solutions/banking-ai-agent-risk</loc>");
    expect(getSeoRoute(BANKING_AI_RISK_PATH)?.schemaKind).toBe("service");
    expect(getBreadcrumbTrail(BANKING_AI_RISK_PATH).map((crumb) => crumb.href)).toEqual([
      "/",
      "/secure-ai-adoption",
      "/industries/financial-services-credit-unions",
      BANKING_AI_RISK_PATH,
    ]);
  });

  it("is linked from the financial-services, AI governance, and AI security pages with descriptive anchor text", () => {
    for (const source of ["/industries/financial-services-credit-unions", "/solutions/ai-governance", "/solutions/ai-security"]) {
      const inbound = RELATED_LINKS[source].find((link) => link.href === BANKING_AI_RISK_PATH);
      expect(inbound, source).toBeTruthy();
      expect(inbound!.label.length, source).toBeGreaterThan(20);
    }
    const financialServices = renderSpaDocument(template, "/industries/financial-services-credit-unions").html;
    expect(financialServices).toContain(`href="${BANKING_AI_RISK_PATH}"`);
  });

  it("leaves the financial-services hub's own H1 and title unchanged", () => {
    const financialServices = renderSpaDocument(template, "/industries/financial-services-credit-unions").html;
    expect(financialServices).toContain("<h1>Secure AI for Financial Services and Credit Unions</h1>");
  });
});
