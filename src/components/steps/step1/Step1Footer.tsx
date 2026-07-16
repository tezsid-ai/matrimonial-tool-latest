"use client";

import { ArrowRight } from "lucide-react";

interface Step1FooterProps {
  canContinue: boolean;
  onContinue: () => void;
}

export default function Step1Footer({ canContinue, onContinue }: Step1FooterProps) {
  return (
    <div className="flex justify-end pt-6 border-t border-[var(--color-sand-dark)]">
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="btn btn-primary"
        aria-disabled={!canContinue}
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
