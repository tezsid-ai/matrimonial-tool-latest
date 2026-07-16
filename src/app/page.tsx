import { Lock, Scale, FileCheck, Sparkles } from "lucide-react";
import { BRAND_TAGLINE, BRAND_DESCRIPTION, URLs } from "@/config/brand";

const trustIndicators = [
  { icon: Lock, text: "Private & local-only storage" },
  { icon: Scale, text: "No pass/fail verdict" },
  { icon: FileCheck, text: "Privacy-first data handling" },
  { icon: Sparkles, text: "Opt-in AI insights" },
];

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--color-ink)] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {BRAND_TAGLINE}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-slate)] mb-10 max-w-xl mx-auto leading-relaxed">
            {BRAND_DESCRIPTION}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10 max-w-lg mx-auto">
            {trustIndicators.map((indicator, index) => (
              <div
                key={indicator.text}
                className={`flex items-center gap-2 text-left trust-float-${index + 1}`}
              >
                <indicator.icon className="w-5 h-5 text-[var(--color-gold)] shrink-0" />
                <span className="text-sm text-[var(--color-slate)]">{indicator.text}</span>
              </div>
            ))}
          </div>

          <a
            href="/step-1"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-white font-semibold rounded-[var(--radius-button)] transition-all duration-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-lg)] hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            Begin My Reflection
          </a>

          <p className="mt-6 text-sm">
            <a
              href={URLs.privacy}
              className="text-[var(--color-stone)] hover:text-[var(--color-ink)] underline underline-offset-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded px-1"
            >
              Read our Privacy Policy
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
