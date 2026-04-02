import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieConsent from "@/components/CookieConsent";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";

// Lazy-load all secondary pages to keep initial bundle small
const KnowledgeHub = lazy(() => import("./pages/KnowledgeHub"));
const WhatIsCMMC = lazy(() => import("./pages/knowledge-hub/WhatIsCMMC"));
const CMMCLevels = lazy(() => import("./pages/knowledge-hub/CMMCLevels"));
const EvidenceMapping = lazy(() => import("./pages/knowledge-hub/EvidenceMapping"));
const SPRSScore = lazy(() => import("./pages/knowledge-hub/SPRSScore"));
const CertificationProcess = lazy(() => import("./pages/knowledge-hub/CertificationProcess"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));

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

        {/* Case Studies */}
        <Route path="/case-studies" component={CaseStudies} />

        {/* Fallback */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
