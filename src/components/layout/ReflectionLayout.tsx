"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepSidebar from "./StepSidebar";
import MobileStepDrawer from "./MobileStepDrawer";

interface ReflectionLayoutProps {
  children: React.ReactNode;
  currentPhase: "profile" | "reflection" | "insights";
  currentSubStep: string;
  completedSubSteps: string[];
}

export default function ReflectionLayout({
  children,
  currentPhase,
  currentSubStep,
  completedSubSteps,
}: ReflectionLayoutProps) {
  const router = useRouter();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleNavigate = (phase: string, _subStep?: string) => {
    // Route based on phase
    switch (phase) {
      case "profile":
        router.push("/step-1");
        break;
      case "reflection":
        router.push("/step-2");
        break;
      case "insights":
        router.push("/step-3");
        break;
    }
  };

  return (
    <>
      <StepSidebar
        currentPhase={currentPhase}
        currentSubStep={currentSubStep}
        completedSubSteps={completedSubSteps}
        onNavigate={handleNavigate}
      />

      <MobileStepDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentPhase={currentPhase}
        currentSubStep={currentSubStep}
        completedSubSteps={completedSubSteps}
        onNavigate={handleNavigate}
      />

      {/* Main content with left sidebar space on desktop */}
      <div className="lg:ml-[280px]">
        {children}
      </div>

      {/* Pass drawer state setter to navbar via a data attribute for the menu button */}
      <div
        id="mobile-drawer-trigger"
        data-open="true"
        onClick={() => setIsMobileDrawerOpen(true)}
        className="hidden"
      />
    </>
  );
}

export { useMobileDrawer };

function useMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
}
