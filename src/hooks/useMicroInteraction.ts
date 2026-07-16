"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function usePulseAnimation(isActive: boolean): string {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return "";
  return isActive ? "animate-pulse-once" : "";
}

export function useSelectionAnimation(isSelected: boolean): string {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return isSelected ? "bg-[var(--color-gold)] border-[var(--color-gold)] text-white" : "";
  return isSelected ? "selected-animate" : "";
}
