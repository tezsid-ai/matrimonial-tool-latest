"use client";

import { Trash2, ShieldCheck } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";

export default function DataSummaryFooter() {
  const { entries, resetApp } = useLedger();

  return (
    <div className="card bg-[var(--color-sand-light)] border border-[var(--color-sand-dark)]">
      <div className="flex items-start gap-3 mb-4">
        <ShieldCheck className="w-5 h-5 text-[var(--color-fynbos)] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-[var(--color-ink)] mb-1">
            Your Data Summary
          </h3>
          <p className="text-sm text-[var(--color-stone)]">
            You shared {entries.filter((e) => e.action === "COLLECTED").length} data points 
            during this reflection. All data is stored locally on your device only.
          </p>
        </div>
      </div>

      <div className="p-3 bg-white rounded-[var(--radius-input)] font-mono text-xs text-[var(--color-stone)] mb-4 max-h-32 overflow-y-auto">
        {entries.slice(-10).map((entry) => (
          <div key={entry.id} className="flex gap-2">
            <span>{entry.timestamp}</span>
            <span className="text-[var(--color-ink)]">{entry.action}</span>
            <span>{entry.field}</span>
          </div>
        ))}
        {entries.length > 10 && (
          <div className="text-[var(--color-stone)] italic">
            ... and {entries.length - 10} more entries
          </div>
        )}
      </div>

      <button
        onClick={resetApp}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-[var(--color-rooibos)]/30 text-[var(--color-rooibos)] hover:bg-[var(--color-rooibos)]/5 rounded-[var(--radius-button)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rooibos)]"
      >
        <Trash2 className="w-4 h-4" />
        <span className="font-medium">Delete my data now</span>
      </button>
    </div>
  );
}
