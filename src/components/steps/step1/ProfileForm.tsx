"use client";

import { useCallback } from "react";
import { Check } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";

interface ProfileData {
  name: string;
  gender: "" | "male" | "female" | "other";
  dateOfBirth: string;
}

interface ProfileFormProps {
  value: ProfileData;
  onChange: (data: ProfileData) => void;
  errors: Record<string, string>;
}

export default function ProfileForm({ value, onChange, errors }: ProfileFormProps) {
  const { logEntry } = useLedger();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, name: e.target.value });
  };

  const handleNameBlur = useCallback(() => {
    if (value.name.trim()) {
      logEntry("COLLECTED", "name");
      logEntry("PURPOSE", "name", { purpose: "personalize your report" });
    }
  }, [value.name, logEntry]);

  const handleGenderSelect = useCallback((gender: ProfileData["gender"]) => {
    onChange({ ...value, gender });
    logEntry("COLLECTED", "gender");
    logEntry("PURPOSE", "gender", { purpose: "demographic insights" });
  }, [value, onChange, logEntry]);

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, dateOfBirth: e.target.value });
  };

  const handleDateOfBirthBlur = useCallback(() => {
    if (value.dateOfBirth && !errors.dateOfBirth) {
      logEntry("COLLECTED", "dateOfBirth");
      logEntry("PURPOSE", "dateOfBirth", { purpose: "age verification and optional astrology profile" });
    }
  }, [value.dateOfBirth, errors.dateOfBirth, logEntry]);

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[var(--color-ink)] mb-2"
        >
          Your Name
        </label>
        <input
          type="text"
          id="name"
          value={value.name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          placeholder="Enter your name"
          className="input"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-sm text-[var(--color-rooibos)]">
            {errors.name}
          </p>
        )}
      </div>

      {/* Gender Selection */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-ink)] mb-3">
          Gender
        </label>
        <div className="flex flex-wrap gap-3">
          {(["male", "female", "other"] as const).map((option) => {
            const selected = value.gender === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleGenderSelect(option)}
                className={`pill transition-all duration-200 ${
                  selected
                    ? "bg-[var(--color-gold)] border-[var(--color-gold-dark)] text-[var(--color-ink)] font-semibold shadow-sm"
                    : "bg-white border-[var(--color-sand-dark)] text-[var(--color-slate)] hover:border-[var(--color-gold)]"
                }`}
                style={selected ? { animation: "pill-select 300ms ease-out" } : undefined}
                aria-pressed={selected}
              >
                {selected && <Check className="w-3.5 h-3.5 mr-1.5" />}
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label
          htmlFor="dob"
          className="block text-sm font-medium text-[var(--color-ink)] mb-2"
        >
          Date of Birth
        </label>
        <input
          type="date"
          id="dob"
          value={value.dateOfBirth}
          onChange={handleDateOfBirthChange}
          onBlur={handleDateOfBirthBlur}
          className="input"
          aria-invalid={!!errors.dateOfBirth}
          aria-describedby={errors.dateOfBirth ? "dob-error" : undefined}
        />
        {errors.dateOfBirth && (
          <p id="dob-error" className="mt-1.5 text-sm text-[var(--color-rooibos)]">
            {errors.dateOfBirth}
          </p>
        )}
      </div>
    </div>
  );
}

export type { ProfileData };
