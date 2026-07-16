import Link from "next/link";
import { BRAND_NAME, AI_PROVIDER } from "@/config/brand";
import { ShieldCheck, Lock, Eye, Trash2, Globe, ArrowLeft } from "lucide-react";

export const metadata = {
  title: `Data & Consent — ${BRAND_NAME}`,
};

const dataTypes = [
  {
    icon: Lock,
    field: "Name",
    purpose: "To personalize your report and certificate",
    storage: "Local device only",
    required: true,
  },
  {
    icon: Lock,
    field: "Gender",
    purpose: "To provide relevant demographic insights",
    storage: "Local device only",
    required: true,
  },
  {
    icon: Lock,
    field: "Date of Birth",
    purpose: "Age verification and optional astrology profile",
    storage: "Local device only",
    required: true,
  },
  {
    icon: Globe,
    field: "City of Birth",
    purpose: "Optional astrology profile calculation only",
    storage: "Local device only",
    required: false,
  },
  {
    icon: Globe,
    field: "Time of Birth",
    purpose: "Optional astrology profile calculation only",
    storage: "Local device only",
    required: false,
  },
  {
    icon: Eye,
    field: "Assessment Responses",
    purpose: "To generate personalized insights and recommendations",
    storage: "Local device only; sent to AI provider for processing",
    required: true,
  },
];

const consentTypes = [
  {
    id: "processing",
    title: "Processing Consent",
    description: `I consent to my reflection answers being processed to generate my personal insights.`,
    required: true,
  },
  {
    id: "ai-provider",
    title: "AI Provider Consent",
    description: `I consent to my answers being sent to ${AI_PROVIDER.name} in ${AI_PROVIDER.location} for processing.`,
    note: "This involves cross-border transfer of your data.",
    required: true,
  },
  {
    id: "astrology",
    title: "Astrology Profile (Optional)",
    description: "I'd like to generate an Astrology & Personality Profile.",
    note: "Requires additional birth location data.",
    required: false,
  },
];

export default function DataConsentPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <div className="max-w-3xl mx-auto bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] p-6 sm:p-10 shadow-[var(--shadow-card)]">
        {/* Back Button and Logo Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-sand-dark)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[var(--color-slate)] hover:text-[var(--color-ink)] bg-white border border-[var(--color-sand-dark)] hover:border-[var(--color-gold)] hover:shadow-sm rounded-[var(--radius-button)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--color-gold)]" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/"
            className="flex flex-col items-end cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded"
          >
            <span
              className="text-lg font-semibold text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {BRAND_NAME}
            </span>
            <span className="w-full h-0.5 bg-[var(--color-gold)] mt-0.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-[var(--color-fynbos)]" />
          <h1
            className="text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What We Collect and Why
          </h1>
        </div>

        <p className="text-[var(--color-slate)] mb-8">
          At {BRAND_NAME}, we believe in complete transparency about data collection. 
          This page mirrors the information shown in our real-time transparency ledger 
          as you use the platform.
        </p>

        {/* Data Collection Table */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
            Data We Collect
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sand-dark)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--color-ink)]">Field</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--color-ink)]">Purpose</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--color-ink)]">Storage</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--color-ink)]">Required</th>
                </tr>
              </thead>
              <tbody>
                {dataTypes.map((data) => (
                  <tr key={data.field} className="border-b border-[var(--color-sand-dark)]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <data.icon className="w-4 h-4 text-[var(--color-gold)]" />
                        <span className="font-medium text-[var(--color-slate)]">{data.field}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-slate)]">{data.purpose}</td>
                    <td className="py-3 px-4 text-[var(--color-slate)]">{data.storage}</td>
                    <td className="py-3 px-4">
                      {data.required ? (
                        <span className="px-2 py-1 bg-[var(--color-rooibos)]/10 text-[var(--color-rooibos)] text-xs font-medium rounded-full">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-[var(--color-fynbos)]/10 text-[var(--color-fynbos)] text-xs font-medium rounded-full">
                          Optional
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Consent Types */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
            Consents Required
          </h2>
          <div className="space-y-4">
            {consentTypes.map((consent) => (
              <div
                key={consent.id}
                className={`p-4 rounded-[var(--radius-card)] border ${
                  consent.required
                    ? "bg-[var(--color-gold)]/5 border-[var(--color-gold)]/20"
                    : "bg-[var(--color-fynbos)]/5 border-[var(--color-fynbos)]/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      consent.required
                        ? "border-[var(--color-gold)]"
                        : "border-[var(--color-fynbos)]"
                    }`}
                  >
                    {consent.required && (
                      <div className="w-3 h-3 rounded-sm bg-[var(--color-gold)]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--color-ink)]">
                        {consent.title}
                      </h3>
                      {consent.required ? (
                        <span className="px-2 py-0.5 bg-[var(--color-rooibos)]/10 text-[var(--color-rooibos)] text-xs font-medium rounded-full">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[var(--color-fynbos)]/10 text-[var(--color-fynbos)] text-xs font-medium rounded-full">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-slate)] mt-1">
                      {consent.description}
                    </p>
                    {consent.note && (
                      <p className="text-xs text-[var(--color-stone)] mt-1">
                        {consent.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
            Your Rights
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-sand-light)] rounded-[var(--radius-card)]">
              <Eye className="w-5 h-5 text-[var(--color-gold)] mb-2" />
              <h3 className="font-medium text-[var(--color-ink)] mb-1">Right to Access</h3>
              <p className="text-sm text-[var(--color-slate)]">
                View all data collected about you in real-time through our transparency ledger.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-sand-light)] rounded-[var(--radius-card)]">
              <Trash2 className="w-5 h-5 text-[var(--color-gold)] mb-2" />
              <h3 className="font-medium text-[var(--color-ink)] mb-1">Right to Deletion</h3>
              <p className="text-sm text-[var(--color-slate)]">
                Delete all your data instantly using the &ldquo;Delete everything now&rdquo; button.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 bg-[var(--color-ink)]/5 rounded-[var(--radius-card)]">
          <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-3">
            Questions?
          </h2>
          <p className="text-sm text-[var(--color-slate)] mb-4">
            If you have any questions about how we handle your data, please contact our 
            Information Officer.
          </p>
          <a
            href="/privacy"
            className="inline-flex items-center gap-2 text-[var(--color-gold)] hover:underline font-medium"
          >
            View Full Privacy Policy
          </a>
        </section>
      </div>
    </div>
  );
}
