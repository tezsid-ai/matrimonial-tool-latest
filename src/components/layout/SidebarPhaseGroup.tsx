"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Lock, Sparkles } from "lucide-react";

interface SubItem {
  id: string;
  label: string;
}

interface SidebarPhaseGroupProps {
  title: string;
  items: readonly SubItem[];
  isExpanded: boolean;
  isCurrentPhase: boolean;
  isCompleted: boolean;
  currentSubStep: string;
  completedSubSteps: string[];
  onToggle: () => void;
  onNavigate: (subStep: string) => void;
  justCompletedItems: Set<string>;
}

export default function SidebarPhaseGroup({
  title,
  items,
  isExpanded,
  isCurrentPhase,
  isCompleted,
  currentSubStep,
  completedSubSteps,
  onToggle,
  onNavigate,
  justCompletedItems,
}: SidebarPhaseGroupProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, items, completedSubSteps, currentSubStep]);

  const getItemStatus = (itemId: string): "completed" | "active" | "upcoming" => {
    if (itemId === currentSubStep) return "active";
    if (completedSubSteps.includes(itemId)) return "completed";
    return "upcoming";
  };

  // Find which items to show: completed + active + next peek
  const visibleItems = items.filter((item, index) => {
    const status = getItemStatus(item.id);
    if (status === "completed" || status === "active") return true;
    // Show next upcoming item as peek
    const prevItem = items[index - 1];
    if (prevItem && (getItemStatus(prevItem.id) === "completed" || getItemStatus(prevItem.id) === "active")) {
      return true;
    }
    return false;
  });

  // Find last completed index for progress line
  const lastCompletedIndex = items.reduce((lastIndex, item, index) => {
    return completedSubSteps.includes(item.id) ? index : lastIndex;
  }, -1);
  const progressPercent = items.length > 1 ? ((lastCompletedIndex + 1) / (items.length - 1)) * 100 : 0;

  return (
    <div className="border-b border-[var(--color-sand-dark)] last:border-b-0">
      {/* Phase Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-sand-light)]/50 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
      >
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[var(--color-fynbos)]" />
          ) : isCurrentPhase ? (
            <div className="w-5 h-5 rounded-full border-2 border-[var(--color-gold)] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gold)]" />
            </div>
          ) : (
            <Circle className="w-5 h-5 text-[var(--color-stone)]" />
          )}
          <span
            className={`text-[15px] font-semibold transition-colors ${
              isCompleted
                ? "text-[var(--color-fynbos)]"
                : isCurrentPhase
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-stone)]"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </span>
        </div>
        <div className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
          <ChevronDown className="w-4 h-4 text-[var(--color-stone)]" />
        </div>
      </button>

      {/* Expanded Items with smooth height animation */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: contentHeight }}
      >
        <div ref={contentRef} className="pb-4">
          {/* Vertical progress line */}
          <div className="relative ml-[27px]">
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--color-sand-dark)] rounded-full">
              <div
                className="w-full bg-[var(--color-gold)] rounded-full transition-all duration-500 ease-out"
                style={{ height: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Sub-items */}
          <div className="space-y-0.5">
            {items.map((item, index) => {
              const status = getItemStatus(item.id);
              const isJustCompleted = justCompletedItems.has(item.id);
              const isVisible = visibleItems.includes(item);
              const isPeek = isVisible && status === "upcoming";

              if (!isVisible) return null;

              return (
                <div
                  key={item.id}
                  onClick={() => status === "completed" && onNavigate(item.id)}
                  className={`relative flex items-center gap-3 px-4 py-2.5 ml-0 transition-all duration-300 ${
                    status === "active"
                      ? "bg-[var(--color-gold)]/10 border-l-[3px] border-[var(--color-gold)] cursor-default"
                      : status === "completed"
                      ? "hover:bg-[var(--color-sand-light)]/70 cursor-pointer"
                      : "cursor-not-allowed opacity-60"
                  } ${isJustCompleted ? "animate-[fade-slide-in_200ms_ease-out]" : ""}`}
                  style={{
                    animation: isJustCompleted ? "fade-slide-in 200ms ease-out" : undefined,
                  }}
                >
                  {/* Status icon */}
                  <div className="w-5 flex justify-center shrink-0 z-10 relative">
                    {status === "completed" ? (
                      <>
                        <CheckCircle2
                          className={`w-4 h-4 text-[var(--color-fynbos)] transition-all duration-300 ${
                            isJustCompleted ? "animate-[check-pop_300ms_ease-out]" : ""
                          }`}
                        />
                        {isJustCompleted && (
                          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-[var(--color-gold)] animate-ping" />
                        )}
                      </>
                    ) : status === "active" ? (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
                    ) : (
                      <Lock className="w-3 h-3 text-[var(--color-stone)]" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm transition-colors ${
                      status === "active"
                        ? "text-[var(--color-ink)] font-medium"
                        : status === "completed"
                        ? "text-[var(--color-slate)]"
                        : "text-[var(--color-stone)]"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Peek indicator */}
                  {isPeek && (
                    <span className="ml-auto text-[10px] text-[var(--color-stone)] uppercase tracking-wide">
                      Next
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
