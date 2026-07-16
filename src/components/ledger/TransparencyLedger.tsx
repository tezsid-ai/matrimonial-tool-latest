"use client";

import { useState } from "react";
import { ShieldCheck, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";

export default function TransparencyLedger() {
  const { entries, resetApp } = useLedger();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop: Fixed right rail */}
      <aside className="hidden lg:block fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-[var(--color-sand-dark)] shadow-[var(--shadow-soft)] z-40">
        <LedgerContent entries={entries} resetApp={resetApp} />
      </aside>

      {/* Mobile: Collapsible bottom drawer */}
      <div
        className={`lg:hidden fixed left-0 right-0 bg-white border-t border-[var(--color-sand-dark)] shadow-[var(--shadow-soft-lg)] z-40 transition-transform duration-300 ${
          isExpanded ? "bottom-0" : "bottom-0 translate-y-[calc(100%-48px)]"
        }`}
      >
        {/* Pull tab */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[var(--color-sand-light)] border-b border-[var(--color-sand-dark)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          aria-expanded={isExpanded}
          aria-controls="ledger-content"
        >
          <ShieldCheck className="w-4 h-4 text-[var(--color-fynbos)]" />
          <span className="text-sm font-medium text-[var(--color-ink)]">
            Your Data, In Real Time
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[var(--color-stone)]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[var(--color-stone)]" />
          )}
        </button>

        {/* Drawer content */}
        <div
          id="ledger-content"
          className="h-[60vh] overflow-hidden"
        >
          <LedgerContent entries={entries} resetApp={resetApp} />
        </div>
      </div>
    </>
  );
}

interface LedgerContentProps {
  entries: Array<{
    id: string;
    timestamp: string;
    action: string;
    field: string;
    meta?: Record<string, unknown>;
  }>;
  resetApp: () => void;
}

function LedgerContent({ entries, resetApp }: LedgerContentProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-sand-dark)] bg-[var(--color-sand-light)]">
        <ShieldCheck className="w-4 h-4 text-[var(--color-fynbos)]" />
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">
          Your Data, In Real Time
        </h3>
      </div>

      {/* Ledger entries */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] space-y-2 bg-white">
        {entries.length === 0 ? (
          <p className="text-[var(--color-stone)] italic">
            No data collected yet. Your entries will appear here.
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-3 items-start ledger-line"
            >
              <span className="text-[var(--color-stone)] shrink-0 w-20">
                {entry.timestamp}
              </span>
              <span
                className={`shrink-0 w-20 font-medium ${
                  entry.action === "CONSENT"
                    ? "text-[var(--color-fynbos)]"
                    : entry.action === "SKIPPED"
                    ? "text-[var(--color-stone)]"
                    : entry.action === "GENERATED"
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-ink)]"
                }`}
              >
                {entry.action}
              </span>
              <span className="text-[var(--color-slate)] break-all">
                {entry.field}
                {entry.meta?.checked !== undefined && (
                  <span
                    className={`ml-1 ${
                      entry.meta.checked ? "text-[var(--color-fynbos)]" : "text-[var(--color-stone)]"
                    }`}
                  >
                    {entry.meta.checked ? "✓" : "○"}
                  </span>
                )}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer with delete button */}
      <div className="p-4 border-t border-[var(--color-sand-dark)] bg-[var(--color-sand-light)]">
        <button
          onClick={resetApp}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[var(--color-rooibos)] hover:bg-[var(--color-rooibos)]/5 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rooibos)]"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Delete everything now</span>
        </button>
      </div>
    </div>
  );
}
