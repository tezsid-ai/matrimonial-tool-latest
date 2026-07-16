"use client";

import { useCallback, useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";

type QuestionType = "single-select" | "slider" | "multi-select";

interface Option {
  value: string;
  label: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  minLabel?: string;
  maxLabel?: string;
}

interface QuestionCardProps {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number, touched?: boolean) => void;
}

export default function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const { logEntry } = useLedger();
  const [sliderValue, setSliderValue] = useState<number>(typeof value === "number" ? value : 0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Sync with external value
  useEffect(() => {
    if (typeof value === "number") {
      setSliderValue(value);
      setIsTouched(true);
    }
  }, [value]);

  const handleLog = useCallback((val: unknown) => {
    logEntry("COLLECTED", question.id, { value: val });
  }, [question.id, logEntry]);

  const handleSingleSelect = (optionValue: string) => {
    onChange(optionValue, true);
    handleLog(optionValue);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    setSliderValue(numValue);
    setIsTouched(true);
    onChange(numValue, true);
  };

  const handleSliderStart = () => setIsDragging(true);
  
  const handleSliderEnd = () => {
    setIsDragging(false);
    handleLog(sliderValue);
  };

  const handleMultiSelect = (optionValue: string) => {
    const currentValues = (value as string[]) || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues, true);
    handleLog(newValues);
  };

  const isSelected = (optionValue: string): boolean => {
    if (question.type === "single-select") return value === optionValue;
    if (question.type === "multi-select") {
      const values = value as string[] || [];
      return values.includes(optionValue);
    }
    return false;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-[var(--color-ink)] mb-6">
        {question.text}
      </h3>

      {question.type === "single-select" && question.options && (
        <div className="flex flex-wrap gap-3">
          {question.options.map((option) => {
            const selected = isSelected(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSingleSelect(option.value)}
                className={`pill transition-all duration-200 ${
                  selected
                    ? "bg-[var(--color-gold)] border-[var(--color-gold-dark)] text-[var(--color-ink)] font-semibold shadow-sm"
                    : "bg-white border-[var(--color-sand-dark)] text-[var(--color-slate)] hover:border-[var(--color-gold)]"
                }`}
                style={selected ? { animation: "pill-select 300ms ease-out" } : undefined}
                aria-pressed={selected}
              >
                {selected && (
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {question.type === "slider" && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={10}
              value={sliderValue}
              onChange={handleSliderChange}
              onMouseDown={handleSliderStart}
              onMouseUp={handleSliderEnd}
              onTouchStart={handleSliderStart}
              onTouchEnd={handleSliderEnd}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: "var(--color-gold)",
                background: `linear-gradient(to right, var(--color-gold) 0%, var(--color-gold) ${sliderValue * 10}%, var(--color-sand-dark) ${sliderValue * 10}%, var(--color-sand-dark) 100%)`,
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--color-gold);
                cursor: pointer;
                transition: transform 200ms ease;
                transform: ${isDragging ? "scale(1.15)" : "scale(1)"};
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--color-gold);
                cursor: pointer;
                border: none;
                transition: transform 200ms ease;
                transform: ${isDragging ? "scale(1.15)" : "scale(1)"};
              }
            `}</style>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-stone)]">
            <span>{question.minLabel || "0"}</span>
            <span className={`font-medium text-[var(--color-ink)] transition-transform duration-200 ${isDragging ? "scale-110" : ""}`}>
              {sliderValue}
              {!isTouched && <span className="text-[var(--color-stone)] text-xs ml-1">(default)</span>}
            </span>
            <span>{question.maxLabel || "10"}</span>
          </div>
        </div>
      )}

      {question.type === "multi-select" && question.options && (
        <div className="flex flex-wrap gap-3">
          {question.options.map((option) => {
            const selected = isSelected(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleMultiSelect(option.value)}
                className={`pill transition-all duration-200 ${
                  selected
                    ? "bg-[var(--color-gold)] border-[var(--color-gold-dark)] text-[var(--color-ink)] font-semibold shadow-sm"
                    : "bg-white border-[var(--color-sand-dark)] text-[var(--color-slate)] hover:border-[var(--color-gold)]"
                }`}
                style={selected ? { animation: "pill-select 300ms ease-out" } : undefined}
                aria-pressed={selected}
              >
                {selected && (
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type { Question, QuestionType };
