"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StepSidebar from "@/components/layout/StepSidebar";
import MobileStepDrawer from "@/components/layout/MobileStepDrawer";
import InsightsLoading from "@/components/steps/step3/InsightsLoading";
import ReadinessScoreTable from "@/components/steps/step3/ReadinessScoreTable";
import InsightsTable from "@/components/steps/step3/InsightsTable";
import ZodiacCard, { ZodiacProfile } from "@/components/steps/step3/ZodiacCard";
import CertificateCard, { CertificateData } from "@/components/steps/step3/CertificateCard";
import DataSummaryFooter from "@/components/steps/step3/DataSummaryFooter";
import CelebrationCanvas from "@/components/steps/step3/CelebrationCanvas";
import { useLedger } from "@/hooks/useLedger";
import { CATEGORIES, PHASE_LABELS } from "@/config/brand";

interface InsightsData {
  strengths: string[];
  growthAreas: string[];
  discussionAreas: string[];
  risks: { level: "low" | "medium" | "high"; items: string[] };
  recommendations: { text: string; checked: boolean }[];
}

const calculateScores = () =>
  CATEGORIES.map((cat) => ({ category: cat.label, score: Number((Math.random() * 2 + 3).toFixed(1)) }));

const ErrorState = ({ msg, onRetry }: { msg: string; onRetry: () => void }) => (
  <div className="card p-5 border border-[var(--color-rooibos)]/20 bg-[var(--color-rooibos)]/5 text-center space-y-2.5">
    <p className="text-xs text-[var(--color-rooibos)] font-semibold">{msg}</p>
    <button onClick={onRetry} className="btn btn-secondary text-[10px] py-1 px-2.5 cursor-pointer">Try again</button>
  </div>
);

export default function Step3Page() {
  const router = useRouter();
  const { logEntry } = useLedger();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showZodiac, setShowZodiac] = useState(false);
  
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [zodiac, setZodiac] = useState<ZodiacProfile | null>(null);
  const [zodiacError, setZodiacError] = useState<string | null>(null);
  const [certData, setCertData] = useState<CertificateData | null>(null);

  const fetchInsights = useCallback(async (answers: any) => {
    setInsightsError(null);
    try {
      const res = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.message || `Server error (Status ${res.status})`);
      }
      setInsights(data);
      logEntry("GENERATED", "insights");
    } catch (err: any) {
      setInsightsError(err.message || "Failed to generate insights.");
    }
  }, [logEntry]);

  const fetchZodiac = useCallback(async (birth: any) => {
    setZodiacError(null);
    try {
      const res = await fetch("/api/generate-zodiac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birth),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.message || `Server error (Status ${res.status})`);
      }
      setZodiac(data);
      logEntry("GENERATED", "zodiac-profile");
    } catch (err: any) {
      setZodiacError(err.message || "Failed to generate astrology profile.");
    }
  }, [logEntry]);

  useEffect(() => {
    const init = async () => {
      let optIn = false, user = "Guest", answers = {}, birth = { cityOfBirth: "", timeOfBirth: "", dateOfBirth: "" };
      try {
        const step1 = localStorage.getItem("marriage-readiness-step1");
        if (step1) {
          const p = JSON.parse(step1);
          optIn = p.consent?.astrology || false;
          user = p.profile?.name || "Guest";
          birth = { cityOfBirth: p.zodiac?.cityOfBirth || "", timeOfBirth: p.zodiac?.timeOfBirth || "", dateOfBirth: p.profile?.dateOfBirth || "" };
        }
        const step2 = localStorage.getItem("marriage-readiness-step2");
        if (step2) answers = JSON.parse(step2).answers || {};
      } catch {}
      setShowZodiac(optIn);
      setCertData({ name: user, uniqueId: `NB-${Date.now().toString(36).toUpperCase()}`, issueDate: new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }), scores: calculateScores() });
      await Promise.all([fetchInsights(answers), optIn ? fetchZodiac(birth) : Promise.resolve()]);
      setIsLoading(false);
    };
    init();
  }, [fetchInsights, fetchZodiac]);

  const handleRetryInsights = () => {
    let answers = {};
    try {
      const step2 = localStorage.getItem("marriage-readiness-step2");
      if (step2) answers = JSON.parse(step2).answers || {};
    } catch {}
    setInsights(null);
    fetchInsights(answers);
  };

  const handleRetryZodiac = () => {
    let birth = { cityOfBirth: "", timeOfBirth: "", dateOfBirth: "" };
    try {
      const step1 = localStorage.getItem("marriage-readiness-step1");
      if (step1) {
        const p = JSON.parse(step1);
        birth = { cityOfBirth: p.zodiac?.cityOfBirth || "", timeOfBirth: p.zodiac?.timeOfBirth || "", dateOfBirth: p.profile?.dateOfBirth || "" };
      }
    } catch {}
    setZodiac(null);
    fetchZodiac(birth);
  };

  const handleRecToggle = useCallback((idx: number) => {
    setInsights((prev) => {
      if (!prev) return null;
      const newRecs = [...prev.recommendations];
      newRecs[idx] = { ...newRecs[idx], checked: !newRecs[idx].checked };
      return { ...prev, recommendations: newRecs };
    });
  }, []);

  if (isLoading) {
    return (
      <div className="lg:ml-[280px] min-h-screen px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <InsightsLoading />
      </div>
    );
  }

  return (
    <>
      <CelebrationCanvas trigger={!isLoading && !insightsError} />
      <StepSidebar currentPhase="insights" currentSubStep="report" completedSubSteps={["personal-info", "consent", "personal", "family", "financial", "career", "relationship", "values", "health", "report", "certificate"]} onNavigate={(p) => router.push(p === "profile" ? "/step-1" : "/step-2")} />
      <MobileStepDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} currentPhase="insights" currentSubStep="report" completedSubSteps={["personal-info", "consent", "personal", "family", "financial", "career", "relationship", "values", "health", "report", "certificate"]} onNavigate={(p) => router.push(p === "profile" ? "/step-1" : "/step-2")} />
      <div className="lg:ml-[280px] min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-3" style={{ fontFamily: "var(--font-display)" }}>{PHASE_LABELS.insights}</h1>
            <p className="text-[var(--color-slate)]">Based on your reflections, here&apos;s what emerged.</p>
          </div>
          {certData && <ReadinessScoreTable scores={certData.scores} />}
          {!insights ? (
            insightsError ? <ErrorState msg={insightsError} onRetry={handleRetryInsights} /> :
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-gold)]" /></div>
          ) : <InsightsTable insights={insights} onRecommendationToggle={handleRecToggle} />}
          {showZodiac && (
            !zodiac ? (
              zodiacError ? <ErrorState msg={zodiacError} onRetry={handleRetryZodiac} /> :
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-gold)]" /></div>
            ) : <ZodiacCard profile={zodiac} />
          )}
          {certData && (
            <div className="pt-6 border-t border-[var(--color-sand-dark)]">
              <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4 text-center">Your Certificate</h2>
              <CertificateCard data={certData} />
            </div>
          )}
          <DataSummaryFooter />
        </div>
      </div>
    </>
  );
}
