import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SubscriptionGuard from "@/components/auth/SubscriptionGuard";
import React, { Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const FreeCVChecker = React.lazy(() => import("./pages/FreeCVChecker"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const CVATSTips = React.lazy(() => import("./pages/tips/CVATSTips"));
const InterviewTips = React.lazy(() => import("./pages/tips/InterviewTips"));
const LinkedInTips = React.lazy(() => import("./pages/tips/LinkedInTips"));
const CoverLetterTips = React.lazy(() => import("./pages/tips/CoverLetterTips"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CVBuilder = React.lazy(() => import("./pages/CVBuilder"));
const ModuleReader = React.lazy(() => import("./pages/ModuleReader"));
const Admin = React.lazy(() => import("./pages/Admin"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const LinkedInOptimizer = React.lazy(() => import("./pages/LinkedInOptimizer"));
const CoverLetterGenerator = React.lazy(() => import("./pages/CoverLetterGenerator"));
const PromptLibrary = React.lazy(() => import("./pages/PromptLibrary"));
const SatelliteArticle = React.lazy(() => import("./pages/SatelliteArticle"));
const CareerHub = React.lazy(() => import("./pages/CareerHub"));
const KeywordIndex = React.lazy(() => import("./pages/KeywordIndex"));
const MemberCVChecker = React.lazy(() => import("./pages/MemberCVChecker"));

const queryClient = new QueryClient();

const LazyFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="font-display text-xl uppercase animate-pulse">Memuat...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/cv-builder" element={<SubscriptionGuard><CVBuilder /></SubscriptionGuard>} />
              <Route path="/dashboard/module/:id" element={<SubscriptionGuard><ModuleReader /></SubscriptionGuard>} />
              <Route path="/dashboard/linkedin-optimizer" element={<SubscriptionGuard><LinkedInOptimizer /></SubscriptionGuard>} />
              <Route path="/dashboard/cover-letter" element={<SubscriptionGuard><CoverLetterGenerator /></SubscriptionGuard>} />
              <Route path="/dashboard/prompt-library" element={<SubscriptionGuard><PromptLibrary /></SubscriptionGuard>} />
              <Route path="/dashboard/cv-checker" element={<SubscriptionGuard><MemberCVChecker /></SubscriptionGuard>} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/gratis/cek-cv" element={<FreeCVChecker />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/tips/cv-ats-friendly" element={<CVATSTips />} />
              <Route path="/tips/interview-kerja" element={<InterviewTips />} />
              <Route path="/tips/linkedin-optimization" element={<LinkedInTips />} />
              <Route path="/tips/cover-letter" element={<CoverLetterTips />} />
              <Route path="/karir" element={<CareerHub />} />
              <Route path="/karir/:slug" element={<SatelliteArticle />} />
              <Route path="/seo/keywords" element={<KeywordIndex />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
