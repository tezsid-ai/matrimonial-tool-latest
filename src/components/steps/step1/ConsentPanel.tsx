"use client";

import { useCallback } from "react";
import { Info } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";
import { AI_PROVIDER } from "@/config/brand";

interface ConsentState {
  processing: boolean;
  aiProvider: boolean;
  astrology: boolean;
}

interface ConsentPanelProps {
  value: ConsentState;
  onChange: (consent: ConsentState) => void;
}

export default function ConsentPanel({ value, onChange }: ConsentPanelProps) {
  const { logEntry } = useLedger();

  const handleConsentChange = useCallback((
    key: keyof ConsentState,
    checked: boolean
  ) => {
    const newConsent = { ...value, [key]: checked };
    onChange(newConsent);
    logEntry("CONSENT", key, { checked });
  }, [value, onChange, logEntry]);

  return (
    <div className="card border border-[var(--color-sand-dark)]">
      <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-4">
        Before we begin
      </h3>
      
      <div className="space-y-4">
        {/* Required: Processing Consent */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={value.processing}
            onChange={(e) => handleConsentChange("processing", e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[var(--color-sand-dark)] text-[var(--color-gold)] focus:ring-[var(--color-gold)] cursor-pointer"
          />
          <span className="text-sm text-[var(--color-slate)] leading-relaxed">
            I consent to my reflection answers being processed to generate my personal insights.{" "}
            <span className="text-[var(--color-rooibos)]">*</span>
          </span>
        </label>

        {/* Required: AI Provider Consent */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={value.aiProvider}
            onChange={(e) => handleConsentChange("aiProvider", e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[var(--color-sand-dark)] text-[var(--color-gold)] focus:ring-[var(--color-gold)] cursor-pointer"
          />
          <span className="text-sm text-[var(--color-slate)] leading-relaxed">
            I consent to my answers being sent to our AI provider ({AI_PROVIDER.name}) for processing, 
            which may involve international data transfer.{" "}
            <span className="text-[var(--color-rooibos)]">*</span>
            <span className="inline-flex items-center ml-1 group/tooltip relative">
              <Info className="w-4 h-4 text-[var(--color-stone)] cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[var(--color-ink)] text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                Your data is sent to {AI_PROVIDER.name} for analysis. 
                We do not store your responses on our servers.
              </span>
            </span>
          </span>
        </label>

        {/* Optional: Astrology */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value.astrology}
            onChange={(e) => handleConsentChange("astrology", e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[var(--color-sand-dark)] text-[var(--color-gold)] focus:ring-[var(--color-gold)] cursor-pointer"
          />
          <span className="text-sm text-[var(--color-slate)] leading-relaxed">
            I&apos;d like to also generate my Astrology &amp; Personality Profile (optional).
          </span>
        </label>
      </div>

      <p className="mt-4 text-xs text-[var(--color-stone)]">
        <span className="text-[var(--color-rooibos)]">*</span> Required to continue
      </p>
    </div>
  );
}

export type { ConsentState };
