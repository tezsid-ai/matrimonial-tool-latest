"use client";

import { useState } from "react";
import { Info, Scale, ChevronDown, ChevronUp } from "lucide-react";

interface InlineTipProps {
  category: string;
}

const tips: Record<string, { title: string; short: string; full: string }> = {
  financial: {
    title: "Legal Awareness",
    short: "Understand your financial rights before marriage.",
    full: "Marriage affects how assets are owned and divided. Different arrangements exist depending on where you live and what you agree to. Consider consulting a legal professional about a pre-marriage agreement if you haven't already.",
  },
  family: {
    title: "Cultural Considerations",
    short: "Traditional practices may have legal weight.",
    full: "Traditional or customary practices can sometimes carry legal significance depending on local laws and where you live. It's worth understanding how these might interact with formal marriage arrangements.",
  },
  relationship: {
    title: "Protection Resources",
    short: "Know your rights in difficult situations.",
    full: "Protection resources exist regardless of marital status. If you have concerns about behavior patterns in your relationship, support services are available in most communities.",
  },
  personal: {
    title: "Identity Documents",
    short: "Marriage affects your legal documentation.",
    full: "After marriage, you may need to update official documents, especially if changing your name. Government offices typically require specific documentation for these changes.",
  },
  default: {
    title: "Did you know?",
    short: "Marriage is a legal contract with binding obligations.",
    full: "Beyond the ceremony, marriage creates legal duties of support, inheritance rights, and tax implications. Understanding these upfront helps prevent future disputes.",
  },
};

export default function InlineTip({ category }: InlineTipProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tip = tips[category] || tips.default;

  return (
    <div className="p-4 bg-[var(--color-ink)]/5 rounded-[var(--radius-lg)] border border-[var(--color-ink)]/10">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {category === "financial" ? (
            <Scale className="w-5 h-5 text-[var(--color-gold)]" />
          ) : (
            <Info className="w-5 h-5 text-[var(--color-gold)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[var(--color-ink)] mb-1">
            {tip.title}
          </h4>
          <p className="text-sm text-[var(--color-slate)]">
            {tip.short}
          </p>
          
          {isExpanded && (
            <p className="mt-3 text-sm text-[var(--color-stone)] animate-in slide-in-from-top-1 duration-200">
              {tip.full}
            </p>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center gap-1 text-xs text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded px-1"
          >
            {isExpanded ? (
              <>
                Read less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
