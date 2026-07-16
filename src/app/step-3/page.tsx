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
import { FALLBACK_INSIGHTS } from "@/data/fallback-insights";
import { FALLBACK_ZODIAC } from "@/data/fallback-zodiac";

interface InsightsData {
  strengths: string[];
  growthAreas: string[];
  discussionAreas: string[];
  risks: { level: "low" | "medium" | "high"; items: string[] };
  recommendations: { text: string; checked: boolean }[];
}

function calculateScores() {
  return CATEGORIES.map((cat) => ({ category: cat.label, score: Number((Math.random() * 2 + 3).toFixed(1)) }));
}

export default function Step3Page() {
  const router = useRouter();
  const { logEntry } = useLedger();
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<InsightsData>(FALLBACK_INSIGHTS);
  const [zodiacProfile, setZodiacProfile] = useState<ZodiacProfile>(FALLBACK_ZODIAC);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [showZodiac, setShowZodiac] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      let astrologyOptIn = false;
      let userName = "Guest";
      let answers = {};
      let birthData = { cityOfBirth: "", timeOfBirth: "", dateOfBirth: "" };
      
      try {
        const step1Data = localStorage.getItem("marriage-readiness-step1");
        if (step1Data) {
          const parsed = JSON.parse(step1Data);
          astrologyOptIn = parsed.consent?.astrology || false;
          userName = parsed.profile?.name || "Guest";
          birthData = {
            cityOfBirth: parsed.zodiac?.cityOfBirth || "",
            timeOfBirth: parsed.zodiac?.timeOfBirth || "",
            dateOfBirth: parsed.profile?.dateOfBirth || "",
          };
        }
        
        const step2Data = localStorage.getItem("marriage-readiness-step2");
        if (step2Data) {
          const parsed = JSON.parse(step2Data);
          answers = parsed.answers || {};
        }
      } catch { /* ignore */ }
      
      setShowZodiac(astrologyOptIn);

      // Generate insights via API
      try {
        const insightsResponse = await fetch("/api/generate-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const insightsData = await insightsResponse.json();
        setInsights(insightsData);
        logEntry("GENERATED", "insights");
      } catch {
        setInsights(FALLBACK_INSIGHTS);
      }

      // Generate zodiac via API if opted in
      if (astrologyOptIn) {
        try {
          const zodiacResponse = await fetch("/api/generate-zodiac", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(birthData),
          });
          const zodiacData = await zodiacResponse.json();
          setZodiacProfile(zodiacData);
          logEntry("GENERATED", "zodiac-profile");
        } catch {
          setZodiacProfile(FALLBACK_ZODIAC);
        }
      }

      // Generate certificate data
      const scores = calculateScores();
      const uniqueId = `NB-${Date.now().toString(36).toUpperCase()}`;
      const issueDate = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

      setCertificateData({ name: userName, uniqueId, issueDate, scores });
      setIsLoading(false);
      setShowCelebration(true);
    };

    loadData();
  }, [logEntry]);

  const handleRecommendationToggle = useCallback((index: number) => {
    setInsights((prev) => {
      const newRecs = [...prev.recommendations];
      newRecs[index] = { ...newRecs[index], checked: !newRecs[index].checked };
      return { ...prev, recommendations: newRecs };
    });
  }, []);

  const handleNavigate = (phase: string) => {
    if (phase === "profile") router.push("/step-1");
    if (phase === "reflection") router.push("/step-2");
    setIsMobileDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="lg:ml-[280px] min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto"><InsightsLoading /></div>
      </div>
    );
  }

  if (!certificateData) return null;

  return (
    <>
      <CelebrationCanvas trigger={showCelebration} />
      
      <StepSidebar
        currentPhase="insights"
        currentSubStep="report"
        completedSubSteps={["personal-info", "consent", "personal", "family", "financial", "career", "relationship", "values", "health", "report", "certificate"]}
        onNavigate={handleNavigate}
      />
      
      <MobileStepDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentPhase="insights"
        currentSubStep="report"
        completedSubSteps={["personal-info", "consent", "personal", "family", "financial", "career", "relationship", "values", "health", "report", "certificate"]}
        onNavigate={handleNavigate}
      />

      <div className="lg:ml-[280px] min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
              {PHASE_LABELS.insights}
            </h1>
            <p className="text-[var(--color-slate)]">Based on your reflections, here&apos;s what emerged.</p>
          </div>

          <div className="space-y-6">
            <ReadinessScoreTable scores={certificateData.scores} />
            <InsightsTable insights={insights} onRecommendationToggle={handleRecommendationToggle} />
            {showZodiac && <ZodiacCard profile={zodiacProfile} />}
            
            <div className="pt-6 border-t border-[var(--color-sand-dark)]">
              <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4 text-center">Your Certificate</h2>
              <CertificateCard data={certificateData} />
            </div>

            <DataSummaryFooter />
          </div>
        </div>
      </div>
    </>
  );
}
