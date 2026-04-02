import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useSeo } from "@/hooks/useSeo";

export default function NotFound() {
  const [, setLocation] = useLocation();

  useSeo(
    "404 Page Not Found | DefenseEye.ai",
    "The page you are looking for does not exist. Return to DefenseEye.ai to explore CMMC 2.0 compliance automation tools and resources for DoD contractors."
  );

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-lg mx-4 text-center border border-border/30 bg-card/60 backdrop-blur-sm rounded-lg p-10">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-14 w-14 text-destructive" />
        </div>

        <h1 className="text-5xl font-bold text-foreground mb-2 font-heading">404</h1>

        <h2 className="text-xl font-semibold text-muted-foreground mb-4">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist.
          <br />
          It may have been moved or deleted.
        </p>

        <Button
          onClick={handleGoHome}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
