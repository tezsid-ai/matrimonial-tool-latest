"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import StepSidebar from "@/components/layout/StepSidebar";
import MobileStepDrawer from "@/components/layout/MobileStepDrawer";
import QuestionCard from "@/components/steps/step2/QuestionCard";
import SpecialCategoryConsent from "@/components/steps/step2/SpecialCategoryConsent";
import InlineTip from "@/components/steps/step2/InlineTip";
import { CATEGORIES, PHASE_LABELS } from "@/config/brand";
import { useLedger } from "@/hooks/useLedger";
import { QUESTIONS } from "@/data/questions";

interface Answers {
  [questionId: string]: { value: string | string[] | number; touched: boolean };
}

export default function Step2Page() {
  const router = useRouter();
  const { logEntry } = useLedger();
  
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [answers, setAnswers] = useState<Answers>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [specialConsents, setSpecialConsents] = useState<Record<string, boolean>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const categoryQuestions = QUESTIONS[activeCategory] || [];
  const categoryIndex = CATEGORIES.findIndex((c) => c.id === activeCategory);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("marriage-readiness-step2");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setCompletedCategories(parsed.completedCategories || []);
        if (parsed.activeCategory) setActiveCategory(parsed.activeCategory);
      }
    } catch { /* ignore */ }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("marriage-readiness-step2", JSON.stringify({ 
        answers, 
        completedCategories,
        activeCategory 
      }));
    }
  }, [answers, completedCategories, activeCategory, isHydrated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  const handleAnswerChange = useCallback((questionId: string, value: string | string[] | number, touched: boolean = true) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { value, touched } }));
  }, []);

  const isQuestionAnswered = (questionId: string): boolean => {
    const answer = answers[questionId];
    if (!answer || !answer.touched) return false;
    if (Array.isArray(answer.value)) return answer.value.length > 0;
    return answer.value !== undefined && answer.value !== "";
  };

  const allQuestionsAnswered = categoryQuestions.every((q) => isQuestionAnswered(q.id));

  const handleContinue = useCallback(() => {
    const newCompleted = [...completedCategories, activeCategory];
    setCompletedCategories(newCompleted);
    
    const nextCategory = CATEGORIES.find((cat) => !newCompleted.includes(cat.id));
    
    if (nextCategory) {
      setActiveCategory(nextCategory.id);
    } else {
      logEntry("GENERATED", "assessment-complete");
      router.push("/step-3");
    }
  }, [activeCategory, completedCategories, router, logEntry]);

  const handleBack = useCallback(() => {
    const prevCategoryIndex = categoryIndex - 1;
    if (prevCategoryIndex >= 0) {
      setActiveCategory(CATEGORIES[prevCategoryIndex].id);
    } else {
      router.push("/step-1");
    }
  }, [categoryIndex, router]);

  const handleSpecialConsent = useCallback((questionId: string, consented: boolean) => {
    setSpecialConsents((prev) => ({ ...prev, [questionId]: consented }));
  }, []);

  const handleNavigate = (phase: string, subStep?: string) => {
    if (phase === "profile") router.push("/step-1");
    if (phase === "insights") router.push("/step-3");
    if (phase === "reflection" && subStep) {
      const category = CATEGORIES.find((c) => c.id === subStep);
      if (category && completedCategories.includes(subStep)) {
        setActiveCategory(subStep);
      }
    }
    setIsMobileDrawerOpen(false);
  };

  const getQuestionValue = (questionId: string) => answers[questionId]?.value;

  if (!isHydrated) return null;

  const isReligionQuestion = (qId: string) => qId === "family-3-religion";

  return (
    <>
      <StepSidebar
        currentPhase="reflection"
        currentSubStep={activeCategory}
        completedSubSteps={completedCategories}
        onNavigate={handleNavigate}
      />
      
      <MobileStepDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentPhase="reflection"
        currentSubStep={activeCategory}
        completedSubSteps={completedCategories}
        onNavigate={handleNavigate}
      />

      <div className="lg:ml-[280px] min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
              {PHASE_LABELS.reflection}
            </h1>
            <p className="text-[var(--color-slate)]">Answer honestly. There are no right or wrong answers.</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-ink)]">
              {CATEGORIES.find((c) => c.id === activeCategory)?.label}
            </h2>
            <p className="text-sm text-[var(--color-stone)]">
              {categoryQuestions.length} {categoryQuestions.length === 1 ? "question" : "questions"}
            </p>
          </div>

          <div className="space-y-6">
            {categoryQuestions.map((question) => (
              <div key={question.id}>
                {isReligionQuestion(question.id) ? (
                  <SpecialCategoryConsent
                    onConsentChange={(consented) => handleSpecialConsent(question.id, consented)}
                  >
                    <QuestionCard
                      question={question}
                      value={getQuestionValue(question.id)}
                      onChange={(value, touched) => handleAnswerChange(question.id, value, touched)}
                    />
                  </SpecialCategoryConsent>
                ) : (
                  <QuestionCard
                    question={question}
                    value={getQuestionValue(question.id)}
                    onChange={(value, touched) => handleAnswerChange(question.id, value, touched)}
                  />
                )}
                
                {(activeCategory as string) === "financial" && question.id === "financial-1" && (
                  <div className="mt-4"><InlineTip category="financial" /></div>
                )}
                {(activeCategory as string) === "family" && question.id === "family-1" && (
                  <div className="mt-4"><InlineTip category="family" /></div>
                )}
                {(activeCategory as string) === "relationship" && question.id === "relationship-1" && (
                  <div className="mt-4"><InlineTip category="relationship" /></div>
                )}
              </div>
            ))}

            {/* Category Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--color-sand-dark)]">
              <button onClick={handleBack} className="btn btn-secondary order-2 sm:order-1">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={handleContinue}
                disabled={!allQuestionsAnswered}
                className="btn btn-primary order-1 sm:order-2"
              >
                {completedCategories.length === CATEGORIES.length - 1 ? "View My Insights" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
