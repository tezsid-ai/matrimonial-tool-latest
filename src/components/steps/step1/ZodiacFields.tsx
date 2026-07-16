"use client";

import { useCallback } from "react";
import { Sparkles } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";

interface ZodiacData {
  cityOfBirth: string;
  timeOfBirth: string;
}

interface ZodiacFieldsProps {
  value: ZodiacData;
  onChange: (data: ZodiacData) => void;
}

export default function ZodiacFields({ value, onChange }: ZodiacFieldsProps) {
  const { logEntry } = useLedger();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, cityOfBirth: e.target.value });
  };

  const handleCityBlur = useCallback(() => {
    if (value.cityOfBirth.trim()) {
      logEntry("COLLECTED", "cityOfBirth");
      logEntry("PURPOSE", "cityOfBirth", { purpose: "astrology profile calculation" });
    }
  }, [value.cityOfBirth, logEntry]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, timeOfBirth: e.target.value });
  };

  const handleTimeBlur = useCallback(() => {
    if (value.timeOfBirth) {
      logEntry("COLLECTED", "timeOfBirth");
      logEntry("PURPOSE", "timeOfBirth", { purpose: "astrology profile calculation" });
    }
  }, [value.timeOfBirth, logEntry]);

  return (
    <div className="animate-in slide-in-from-top-2 duration-300">
      <div className="card border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
          <span className="text-xs font-medium text-[var(--color-gold-dark)] uppercase tracking-wide">
            Only used for your optional astrology profile
          </span>
        </div>

        <div className="space-y-4">
          {/* City of Birth */}
          <div>
            <label
              htmlFor="cityOfBirth"
              className="block text-sm font-medium text-[var(--color-ink)] mb-2"
            >
              City of Birth
            </label>
            <input
              type="text"
              id="cityOfBirth"
              value={value.cityOfBirth}
              onChange={handleCityChange}
              onBlur={handleCityBlur}
              placeholder="e.g., District, State"
              className="input"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label
              htmlFor="timeOfBirth"
              className="block text-sm font-medium text-[var(--color-ink)] mb-2"
            >
              Time of Birth
            </label>
            <input
              type="time"
              id="timeOfBirth"
              value={value.timeOfBirth}
              onChange={handleTimeChange}
              onBlur={handleTimeBlur}
              className="input"
            />
            <p className="mt-1.5 text-xs text-[var(--color-stone)]">
              Not sure? A close guess works fine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ZodiacData };
