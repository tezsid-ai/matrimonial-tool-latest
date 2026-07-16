"use client";

import { Sparkles } from "lucide-react";

interface ZodiacProfile {
  sign: string;
  element: string;
  traits: string[];
  compatibility: string;
  advice: string;
}

interface ZodiacCardProps {
  profile: ZodiacProfile;
}

export default function ZodiacCard({ profile }: ZodiacCardProps) {
  // Get only the first sentence of the advice paragraph to keep it condensed
  const shortAdvice = profile.advice ? profile.advice.split(/[.!?]/)[0] + "." : "";

  return (
    <div className="card relative overflow-hidden bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] text-[var(--color-slate)]">
      {/* Constellation background pattern - light styling */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15%" cy="25%" r="1" fill="var(--color-gold)" />
          <circle cx="40%" cy="15%" r="1.5" fill="var(--color-gold)" />
          <circle cx="75%" cy="20%" r="1" fill="var(--color-gold)" />
          <circle cx="85%" cy="65%" r="2" fill="var(--color-gold)" />
          <circle cx="45%" cy="85%" r="1" fill="var(--color-gold)" />
          <circle cx="20%" cy="75%" r="1.5" fill="var(--color-gold)" />
          <circle cx="60%" cy="45%" r="1" fill="var(--color-gold)" />
          <line x1="15%" y1="25%" x2="40%" y2="15%" stroke="var(--color-gold)" strokeWidth="0.4" strokeDasharray="3 3" />
          <line x1="40%" y1="15%" x2="60%" y2="45%" stroke="var(--color-gold)" strokeWidth="0.4" strokeDasharray="3 3" />
          <line x1="60%" y1="45%" x2="75%" y2="20%" stroke="var(--color-gold)" strokeWidth="0.4" strokeDasharray="3 3" />
          <line x1="60%" y1="45%" x2="85%" y2="65%" stroke="var(--color-gold)" strokeWidth="0.4" strokeDasharray="3 3" />
          <line x1="15%" y1="25%" x2="20%" y2="75%" stroke="var(--color-gold)" strokeWidth="0.4" strokeDasharray="3 3" />
          <line x1="20%" y1="75%" x2="45%" y2="85%" stroke="var(--color-gold)" strokeWidth="0.4" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Top Bonus Label */}
      <div className="flex items-center gap-1.5 mb-5 relative z-10">
        <Sparkles className="w-3.5 h-3.5 text-[var(--color-gold-dark)]" />
        <span className="text-[10px] font-semibold text-[var(--color-gold-dark)] uppercase tracking-wider">
          Optional — Astrology &amp; Personality Profile
        </span>
      </div>

      {/* Main Focus: Circular Badge + Info */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div className="w-14 h-14 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-sand-light)] flex items-center justify-center shadow-sm shrink-0">
          <span className="text-xl font-bold text-[var(--color-ink)] font-serif uppercase">
            {profile.sign.slice(0, 2)}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--color-ink)] tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            {profile.sign}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[var(--color-sand-dark)] text-[var(--color-ink)] border border-[var(--color-sand-dark)]/80 mt-1">
            {profile.element} Element
          </span>
        </div>
      </div>

      {/* Condensed Traits & Insight */}
      <div className="space-y-4 relative z-10">
        {/* Key Traits Tags */}
        <div className="flex flex-wrap gap-1.5">
          {profile.traits.map((trait) => (
            <span
              key={trait}
              className="px-2 py-0.5 bg-[var(--color-gold)]/10 text-[var(--color-ink)] text-xs rounded border border-[var(--color-gold)]/20 font-medium"
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Relationship Insight */}
        <div className="border-t border-[var(--color-sand-dark)]/50 pt-3">
          <p className="text-xs text-[var(--color-slate)] italic leading-relaxed">
            &ldquo;{profile.compatibility}&rdquo;
          </p>
        </div>

        {/* Condensed Guidance */}
        {shortAdvice && (
          <div className="bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/25 rounded-[var(--radius-input)] p-3 text-xs leading-relaxed text-[var(--color-slate)]">
            <span className="font-semibold text-[var(--color-gold-dark)] block mb-0.5">Key Focus</span>
            {shortAdvice}
          </div>
        )}
      </div>
    </div>
  );
}

export type { ZodiacProfile };
