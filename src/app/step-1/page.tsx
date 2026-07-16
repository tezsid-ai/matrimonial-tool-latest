"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepSidebar from "@/components/layout/StepSidebar";
import MobileStepDrawer from "@/components/layout/MobileStepDrawer";
import ProfileForm, { ProfileData } from "@/components/steps/step1/ProfileForm";
import ConsentPanel, { ConsentState } from "@/components/steps/step1/ConsentPanel";
import ZodiacFields, { ZodiacData } from "@/components/steps/step1/ZodiacFields";
import Step1Footer from "@/components/steps/step1/Step1Footer";
import { PHASE_LABELS } from "@/config/brand";

interface ValidationErrors {
  name?: string;
  dateOfBirth?: string;
}

function validateDateOfBirth(dateString: string): string | undefined {
  if (!dateString) return "Date of birth is required";
  const date = new Date(dateString);
  const today = new Date();
  if (date > today) return "Date of birth cannot be in the future";
  
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age--;
  if (age < 18 || age > 100) return "You must be between 18 and 100 years old";
  return undefined;
}

export default function Step1Page() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({ name: "", gender: "", dateOfBirth: "" });
  const [consent, setConsent] = useState<ConsentState>({ processing: false, aiProvider: false, astrology: false });
  const [zodiac, setZodiac] = useState<ZodiacData>({ cityOfBirth: "", timeOfBirth: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("marriage-readiness-step1");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed.profile || profile);
        setConsent(parsed.consent || consent);
        setZodiac(parsed.zodiac || zodiac);
      }
    } catch { /* ignore */ }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("marriage-readiness-step1", JSON.stringify({ profile, consent, zodiac }));
    }
  }, [profile, consent, zodiac, isHydrated]);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!profile.name.trim()) newErrors.name = "Name is required";
    const dobError = validateDateOfBirth(profile.dateOfBirth);
    if (dobError) newErrors.dateOfBirth = dobError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canContinue = useMemo(() => {
    return profile.name.trim().length > 0 && 
           profile.gender !== "" && 
           !validateDateOfBirth(profile.dateOfBirth) && 
           consent.processing && consent.aiProvider;
  }, [profile, consent]);

  const handleContinue = () => {
    if (validate()) router.push("/step-2");
  };

  const handleNavigate = (phase: string) => {
    if (phase === "reflection") router.push("/step-2");
    if (phase === "insights") router.push("/step-3");
    setIsMobileDrawerOpen(false);
  };

  const completedSubSteps = [];
  if (profile.name && profile.gender && profile.dateOfBirth) completedSubSteps.push("personal-info");
  if (consent.processing && consent.aiProvider) completedSubSteps.push("consent");

  if (!isHydrated) return null;

  return (
    <>
      <StepSidebar
        currentPhase="profile"
        currentSubStep={completedSubSteps.includes("personal-info") ? "consent" : "personal-info"}
        completedSubSteps={completedSubSteps}
        onNavigate={handleNavigate}
      />
      
      <MobileStepDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentPhase="profile"
        currentSubStep={completedSubSteps.includes("personal-info") ? "consent" : "personal-info"}
        completedSubSteps={completedSubSteps}
        onNavigate={handleNavigate}
      />

      <div className="lg:ml-[280px] min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
              {PHASE_LABELS.profile}
            </h1>
            <p className="text-[var(--color-slate)]">Let&apos;s start with some basic information about you.</p>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-4">Personal Information</h2>
              <ProfileForm value={profile} onChange={setProfile} errors={errors as Record<string, string>} />
            </div>
            <ConsentPanel value={consent} onChange={setConsent} />
            {consent.astrology && <ZodiacFields value={zodiac} onChange={setZodiac} />}
            <Step1Footer canContinue={canContinue} onContinue={handleContinue} />
          </div>
        </div>
      </div>
    </>
  );
}
