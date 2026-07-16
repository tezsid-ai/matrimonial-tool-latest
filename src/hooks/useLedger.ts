"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

export type LedgerAction = "COLLECTED" | "PURPOSE" | "CONSENT" | "SKIPPED" | "GENERATED";

export interface LedgerEntry {
  id: string;
  timestamp: string;
  action: LedgerAction;
  field: string;
  meta?: Record<string, unknown>;
}

interface LedgerContextType {
  entries: LedgerEntry[];
  logEntry: (action: LedgerAction, field: string, meta?: Record<string, unknown>) => void;
  clearEntries: () => void;
  resetApp: () => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

const STORAGE_KEY = "marriage-readiness-ledger";
const APP_STATE_KEY = "marriage-readiness-state";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-ZA", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [entries, isHydrated]);

  const logEntry = useCallback((action: LedgerAction, field: string, meta?: Record<string, unknown>) => {
    const newEntry: LedgerEntry = {
      id: generateId(),
      timestamp: formatTimestamp(new Date()),
      action,
      field,
      meta,
    };
    setEntries((prev) => [...prev, newEntry]);
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const resetApp = useCallback(() => {
    clearEntries();
    try {
      localStorage.removeItem(APP_STATE_KEY);
      // Clear any other app-specific keys
      const keysToRemove = Object.keys(localStorage).filter(
        (key) => key.startsWith("marriage-readiness-")
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Ignore
    }
    // Navigate to landing page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [clearEntries]);

  const value: LedgerContextType = {
    entries,
    logEntry,
    clearEntries,
    resetApp,
  };

  return React.createElement(LedgerContext.Provider, { value }, children);
}

export function useLedger(): LedgerContextType {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error("useLedger must be used within a LedgerProvider");
  }
  return context;
}
