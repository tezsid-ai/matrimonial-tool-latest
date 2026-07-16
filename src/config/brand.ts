// Brand Configuration - Marriage Readiness Platform
// Single source of truth for all brand constants

export const BRAND_NAME = "New Beginnings" as const;
export const BRAND_SLUG = "new-beginnings" as const;
export const BRAND_TAGLINE = "Know yourself before you say yes." as const;
export const BRAND_TITLE = `${BRAND_NAME} — Marriage Readiness Reflection` as const;
export const BRAND_DESCRIPTION = "A private, 3-step reflection tool to help you understand your readiness for marriage. No pass or fail — just insights for your journey." as const;

// Phase Labels
export const PHASE_LABELS = {
  profile: "Profile",
  reflection: "Inner Compass",
  insights: "Insights",
} as const;

// Contact & Legal
export const PRIVACY_OFFICER = {
  name: "Privacy Officer",
  email: "privacy@newbeginnings.example",
  phone: "+27 12 345 6789",
} as const;

// AI Provider Disclosure
export const AI_PROVIDER = {
  name: "OpenAI",
  location: "United States",
  privacyUrl: "https://openai.com/privacy",
} as const;

// URLs
export const URLs = {
  privacy: "/privacy",
  dataConsent: "/data-consent",
  terms: "/terms",
} as const;

// Flow Steps
export const STEPS = [
  { id: 1, label: "Profile", path: "/step-1" },
  { id: 2, label: "Reflection", path: "/step-2" },
  { id: 3, label: "Insights", path: "/step-3" },
] as const;

// Categories for Assessment
export const CATEGORIES = [
  { id: "personal", label: "Personal", icon: "User" },
  { id: "family", label: "Family", icon: "Users" },
  { id: "financial", label: "Financial", icon: "Wallet" },
  { id: "career", label: "Career", icon: "Briefcase" },
  { id: "relationship", label: "Relationship", icon: "Heart" },
  { id: "values", label: "Values", icon: "Scale" },
  { id: "health", label: "Health", icon: "HeartPulse" },
] as const;
