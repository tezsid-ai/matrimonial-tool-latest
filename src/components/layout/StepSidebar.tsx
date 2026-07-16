"use client";

import { useState, useEffect } from "react";
import SidebarPhaseGroup from "./SidebarPhaseGroup";
import { PHASE_LABELS } from "@/config/brand";

interface StepSidebarProps {
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

export default function StepSidebar({
  currentPhase,
  currentSubStep,
  completedSubSteps,
  onNavigate,
}: StepSidebarProps) {
  const [expandedPhase, setExpandedPhase] = useState<string>(currentPhase);
  const [justCompletedItems, setJustCompletedItems] = useState<Set<string>>(new Set());

  // Track newly completed items for animation
  useEffect(() => {
    const newJustCompleted = new Set<string>();
    completedSubSteps.forEach((id) => {
      if (!justCompletedItems.has(id)) {
        newJustCompleted.add(id);
      }
    });
    if (newJustCompleted.size > 0) {
      setJustCompletedItems(newJustCompleted);
      setTimeout(() => setJustCompletedItems(new Set()), 1000);
    }
  }, [completedSubSteps]);

  // Auto-expand current phase
  useEffect(() => {
    setExpandedPhase(currentPhase);
  }, [currentPhase]);

  const handleToggle = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? "" : phaseId);
  };

  const isPhaseCompleted = (phaseId: string) => {
    const phase = PHASES.find((p) => p.id === phaseId);
    if (!phase) return false;
    return phase.items.every((item) => completedSubSteps.includes(item.id));
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-[280px] bg-white shadow-[var(--shadow-soft-lg)] overflow-y-auto z-30">
      <div className="p-4">
        <h2
          className="text-lg font-semibold text-[var(--color-ink)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your Journey
        </h2>
      </div>

      <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-sand-dark)] mx-4 shadow-[var(--shadow-card)] overflow-hidden">
        {PHASES.map((phase) => (
          <SidebarPhaseGroup
            key={phase.id}
            title={phase.title}
            items={phase.items}
            isExpanded={expandedPhase === phase.id}
            isCurrentPhase={currentPhase === phase.id}
            isCompleted={isPhaseCompleted(phase.id)}
            currentSubStep={currentSubStep}
            completedSubSteps={completedSubSteps}
            onToggle={() => handleToggle(phase.id)}
            onNavigate={(subStep) => onNavigate(phase.id, subStep)}
            justCompletedItems={justCompletedItems}
          />
        ))}
      </div>
    </aside>
  );
}
