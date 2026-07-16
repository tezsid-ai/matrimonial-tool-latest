"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import SidebarPhaseGroup from "./SidebarPhaseGroup";
import { PHASE_LABELS } from "@/config/brand";

interface MobileStepDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: "profile" | "reflection" | "insights";
  currentSubStep: string;
  completedSubSteps: string[];
  onNavigate: (phase: string, subStep?: string) => void;
}

const PHASES = [
  {
    id: "profile" as const,
    get title() { return PHASE_LABELS.profile; },
    items: [
      { id: "personal-info", label: "Personal Info" },
      { id: "consent", label: "Consent" },
    ],
  },
  {
    id: "reflection" as const,
    get title() { return PHASE_LABELS.reflection; },
    items: [
      { id: "personal", label: "Personal" },
      { id: "family", label: "Family" },
      { id: "financial", label: "Financial" },
      { id: "career", label: "Career" },
      { id: "relationship", label: "Relationship" },
      { id: "values", label: "Values" },
      { id: "health", label: "Health" },
    ],
  },
  {
    id: "insights" as const,
    get title() { return PHASE_LABELS.insights; },
    items: [
      { id: "report", label: "Your Report" },
      { id: "certificate", label: "Certificate" },
    ],
  },
];

export default function MobileStepDrawer({
  isOpen,
  onClose,
  currentPhase,
  currentSubStep,
  completedSubSteps,
  onNavigate,
}: MobileStepDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleNavigate = (phase: string, subStep?: string) => {
    onNavigate(phase, subStep);
    onClose();
  };

  const isPhaseCompleted = (phaseId: string) => {
    const phase = PHASES.find((p) => p.id === phaseId);
    if (!phase) return false;
    return phase.items.every((item) => completedSubSteps.includes(item.id));
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-[var(--color-ink)]/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 lg:hidden transition-transform duration-300 ease-out shadow-[var(--shadow-soft-lg)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-sand-dark)]">
          <h2
            className="text-lg font-semibold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Journey
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-sand-light)] rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[var(--color-stone)]" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-73px)]">
          <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-sand-dark)] shadow-[var(--shadow-card)] overflow-hidden">
            {PHASES.map((phase) => (
              <SidebarPhaseGroup
                key={phase.id}
                title={phase.title}
                items={phase.items}
                isExpanded={currentPhase === phase.id}
                isCurrentPhase={currentPhase === phase.id}
                isCompleted={isPhaseCompleted(phase.id)}
                currentSubStep={currentSubStep}
                completedSubSteps={completedSubSteps}
                onToggle={() => {}}
                onNavigate={(subStep) => handleNavigate(phase.id, subStep)}
                justCompletedItems={new Set()}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
