import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieConsent from "@/components/CookieConsent";
import CopilotWidget from "@/components/CopilotWidget";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { captureUtmParameters, trackConversion } from "@/lib/tracking";

// Lazy-load all secondary pages to keep initial bundle small
const KnowledgeHub = lazy(() => import("./pages/KnowledgeHub"));
const WhatIsCMMC = lazy(() => import("./pages/knowledge-hub/WhatIsCMMC"));
const CMMCLevels = lazy(() => import("./pages/knowledge-hub/CMMCLevels"));
const EvidenceMapping = lazy(() => import("./pages/knowledge-hub/EvidenceMapping"));
const SPRSScore = lazy(() => import("./pages/knowledge-hub/SPRSScore"));
const CertificationProcess = lazy(() => import("./pages/knowledge-hub/CertificationProcess"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CMMCReadinessSprint = lazy(() => import("./pages/CMMCReadinessSprint"));
const Pricing = lazy(() => import("./pages/Pricing"));
const CMMCLens = lazy(() => import("./pages/CMMCLens"));
const SprintGuide = lazy(() => import("./pages/SprintGuide"));
const FAQ = lazy(() => import("./pages/FAQ"));
const CMMCScoping = lazy(() => import("./pages/CMMCScoping"));
const WhyDefenseEye = lazy(() => import("./pages/WhyDefenseEye"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Support = lazy(() => import("./pages/Support"));
const ThoughtLeadership = lazy(() => import("./pages/ThoughtLeadership"));
const SolutionPage = lazy(() => import("./pages/SolutionPage"));
const SupplierReadiness = lazy(() => import("./pages/SupplierReadiness"));
const SecureAiAdoption = lazy(() => import("./pages/SecureAiAdoption"));
const CmmcComplianceAutomation = lazy(() => import("./pages/CmmcComplianceAutomation"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const Datasheets = lazy(() => import("./pages/Datasheets"));
const CapabilityStatement = lazy(() => import("./pages/CapabilityStatement"));
const DeliveryModel = lazy(() => import("./pages/DeliveryModel"));
const RepresentativeEngagements = lazy(() => import("./pages/RepresentativeEngagements"));
const MicrosoftEcosystem = lazy(() => import("./pages/MicrosoftEcosystem"));
const CMMCArchitecturePage = lazy(() => import("./pages/CMMCArchitecturePage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

// Minimal loading fallback that matches the dark theme
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded border border-primary/40 animate-pulse bg-primary/10" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />

        {/* Knowledge Hub */}
        <Route path="/knowledge-hub" component={KnowledgeHub} />
        <Route path="/knowledge-hub/what-is-cmmc" component={WhatIsCMMC} />
        <Route path="/knowledge-hub/cmmc-levels" component={CMMCLevels} />
        <Route path="/knowledge-hub/evidence-mapping" component={EvidenceMapping} />
        <Route path="/knowledge-hub/sprs-score" component={SPRSScore} />
        <Route path="/knowledge-hub/certification-process" component={CertificationProcess} />

        {/* Blog */}
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />

        {/* Representative engagements */}
        <Route path="/case-studies" component={LegacyRepresentativeEngagementsRedirect} />
        <Route path="/services" component={CMMCReadinessSprint} />
        <Route path="/services/cmmc-readiness-sprint" component={CMMCReadinessSprint} />
        <Route path="/services/cmmc-scoping" component={CMMCScoping} />
        <Route path="/why-defenseeye" component={WhyDefenseEye} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/cmmclens" component={CMMCLens} />
        <Route path="/cmmc-readiness-sprint-guide" component={SprintGuide} />
        <Route path="/faq" component={FAQ} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/contact" component={ContactUs} />
        <Route path="/support" component={Support} />
        <Route path="/supplier-readiness" component={SupplierReadiness} />
        <Route path="/secure-ai-adoption" component={SecureAiAdoption} />
        <Route path="/cmmc-compliance-automation" component={CmmcComplianceAutomation} />
        <Route path="/datasheets" component={Datasheets} />
        <Route path="/datasheets/secure-ai-adoption" component={Datasheets} />
        <Route path="/datasheets/cmmc-compliance-automation" component={Datasheets} />
        <Route path="/datasheets/cmmclens" component={Datasheets} />
        <Route path="/datasheets/microsoft-copilot-readiness" component={Datasheets} />
        <Route path="/datasheets/supplier-readiness" component={Datasheets} />
        <Route path="/capability-statement" component={CapabilityStatement} />
        <Route path="/delivery-model" component={DeliveryModel} />
        <Route path="/representative-engagements" component={RepresentativeEngagements} />
        <Route path="/microsoft-ecosystem" component={MicrosoftEcosystem} />
        <Route path="/solutions/ai-governance" component={SolutionPage} />
        <Route path="/solutions/ai-transformation" component={SolutionPage} />
        <Route path="/solutions/ai-security" component={SolutionPage} />
        <Route path="/solutions/microsoft-copilot-enablement" component={SolutionPage} />
        <Route path="/solutions/microsoft-copilot-readiness" component={SolutionPage} />
        <Route path="/solutions/cybersecurity-risk" component={SolutionPage} />
        <Route path="/solutions/compliance-automation" component={SolutionPage} />
        <Route path="/solutions/cloud-security" component={SolutionPage} />
        <Route path="/solutions/cmmclens-platform" component={SolutionPage} />
        <Route path="/cmmc" component={CMMCArchitecturePage} />
        <Route path="/cmmc-level-2-readiness" component={CMMCArchitecturePage} />
        <Route path="/cmmc-readiness-sprint" component={CMMCArchitecturePage} />
        <Route path="/cmmc-evidence-automation" component={CMMCArchitecturePage} />
        <Route path="/nist-800-171" component={CMMCArchitecturePage} />
        <Route path="/lp/ai-governance-consulting" component={LandingPage} />
        <Route path="/lp/secure-ai-adoption" component={LandingPage} />
        <Route path="/lp/microsoft-copilot-readiness" component={LandingPage} />
        <Route path="/lp/cmmc-compliance-automation" component={LandingPage} />
        <Route path="/lp/cmmc-level-2-readiness" component={LandingPage} />
        <Route path="/lp/cmmc-evidence-automation" component={LandingPage} />
        <Route path="/lp/cmmclens-demo" component={LandingPage} />
        <Route path="/lp/microsoft-supplier-ai-consulting" component={LandingPage} />
        <Route path="/lp/azure-cloud-security" component={LandingPage} />
        <Route path="/lp/compliance-automation" component={LandingPage} />
        <Route path="/insights/:slug" component={ThoughtLeadership} />

        {/* Fallback */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function LegacyRepresentativeEngagementsRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/representative-engagements", { replace: true });
  }, [setLocation]);

  return <PageLoader />;
}

function RouteAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    captureUtmParameters();
  }, []);

  useEffect(() => {
    if (location === "/supplier-readiness") trackConversion("supplier_readiness_view");
    if (location === "/capability-statement") trackConversion("capability_statement_view");
    if (location.startsWith("/datasheets")) trackConversion("datasheet_view", { location });
    if (location === "/datasheets/cmmclens") trackConversion("cmmclens_product_sheet_view", { location });
    if (location === "/datasheets/supplier-readiness") trackConversion("supplier_datasheet_view", { location });
    if (location.includes("microsoft") || location === "/microsoft-ecosystem") trackConversion("microsoft_ecosystem_view", { location });
    if (location.includes("cmmc")) trackConversion("cmmc_readiness_view", { location });
    if (location === "/solutions/ai-governance" || location === "/lp/ai-governance-consulting") trackConversion("ai_governance_view", { location });
  }, [location]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <RouteAnalytics />
          <Router />
          <CopilotWidget />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
