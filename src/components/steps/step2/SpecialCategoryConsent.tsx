"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";

interface SpecialCategoryConsentProps {
  onConsentChange: (consented: boolean) => void;
  children: React.ReactNode;
}

export default function SpecialCategoryConsent({
  onConsentChange,
  children,
}: SpecialCategoryConsentProps) {
  const [hasConsented, setHasConsented] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const { logEntry } = useLedger();

  const handleConsent = () => {
    setHasConsented(true);
    setIsSkipped(false);
    onConsentChange(true);
    logEntry("CONSENT", "special-category-religion", { consented: true });
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setHasConsented(false);
    onConsentChange(false);
    logEntry("SKIPPED", "special-category-religion");
  };

  if (isSkipped) {
    return (
      <div className="p-4 bg-[var(--color-sand-dark)]/50 rounded-[var(--radius-card)] text-center">
        <p className="text-sm text-[var(--color-stone)]">
          Question skipped. You can continue with the rest of the assessment.
        </p>
        <button
          onClick={() => {
            setIsSkipped(false);
            setHasConsented(false);
          }}
          className="mt-3 text-sm text-[var(--color-gold)] hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded px-1"
        >
          Change my mind
        </button>
      </div>
    );
  }

  if (!hasConsented) {
    return (
      <div className="p-5 border-2 border-[var(--color-gold)]/30 rounded-[var(--radius-card)] bg-[var(--color-gold)]/5">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-[var(--color-gold)] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-[var(--color-ink)] mb-1">
              Sensitive Question
            </h4>
            <p className="text-sm text-[var(--color-slate)]">
              This question relates to religious or cultural beliefs — a sensitive 
              category of personal information. Answer only if you&apos;re comfortable.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleConsent}
            className="btn btn-primary text-sm py-2 px-4"
          >
            I&apos;m comfortable answering
          </button>
          <button
            onClick={handleSkip}
            className="btn btn-secondary text-sm py-2 px-4"
          >
            Skip this question
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
