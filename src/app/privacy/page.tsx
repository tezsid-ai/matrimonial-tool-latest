import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BRAND_NAME, AI_PROVIDER } from "@/config/brand";

export const metadata = {
  title: `Privacy Policy — ${BRAND_NAME}`,
};

export default function PrivacyPage() {
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

        <h1
          className="text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Privacy Policy
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-[var(--color-slate)] mb-6">
            This Privacy Policy explains how {BRAND_NAME} collects, uses, and protects 
            your personal information in accordance with applicable data protection laws 
            and your privacy rights.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              1. Information We Collect
            </h2>
            <p className="text-[var(--color-slate)] mb-3">
              We collect the following personal information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[var(--color-slate)]">
              <li>
                <strong>Profile Information:</strong> Your name, gender, and date of birth 
                (used to personalize your report and verify age)
              </li>
              <li>
                <strong>Optional Information:</strong> City and time of birth (only if you 
                opt in for the astrology profile)
              </li>
              <li>
                <strong>Reflection Responses:</strong> Your answers to the readiness 
                assessment questions
              </li>
              <li>
                <strong>Consent Records:</strong> Records of your consent choices
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-[var(--color-slate)] mb-3">
              We use your information solely for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[var(--color-slate)]">
              <li>To generate your personalized marriage readiness insights</li>
              <li>To create your optional astrology and personality profile</li>
              <li>To issue your completion certificate</li>
              <li>To maintain transparency through our real-time data ledger</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              3. Data Storage and Security
            </h2>
            <p className="text-[var(--color-slate)] mb-3">
              <strong>Important:</strong> All your data is stored locally in your browser 
              using localStorage. We do not store any of your personal information or 
              responses on our servers.
            </p>
            <p className="text-[var(--color-slate)]">
              Your data remains on your device until you either delete it using the 
              &ldquo;Delete everything now&rdquo; button or clear your browser data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              4. Cross-Border Data Transfer
            </h2>
            <p className="text-[var(--color-slate)] mb-3">
              If you consent to AI processing, your responses may be sent to {AI_PROVIDER.name} 
              in {AI_PROVIDER.location} for analysis. This transfer is necessary to generate 
              your personalized insights.
            </p>
            <p className="text-[var(--color-slate)]">
              {AI_PROVIDER.name} processes data in accordance with their privacy policy, 
              available at{" "}
              <a
                href={AI_PROVIDER.privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-gold)] hover:underline"
              >
                {AI_PROVIDER.privacyUrl}
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              5. Your Privacy Rights
            </h2>
            <p className="text-[var(--color-slate)] mb-3">
              Under applicable data protection laws, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[var(--color-slate)]">
              <li>Access your personal information</li>
              <li>Correct or update your information</li>
              <li>Delete your information (right to be forgotten)</li>
              <li>Object to processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-[var(--color-slate)] mt-3">
              You can exercise these rights at any time by using the &ldquo;Delete everything 
              now&rdquo; button, which removes all data from your device immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              6. Retention Period
            </h2>
            <p className="text-[var(--color-slate)]">
              Since we do not store your data on our servers, retention is entirely 
              controlled by you. Your data remains in your browser until you delete it 
              or clear your browser storage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              7. Changes to This Policy
            </h2>
            <p className="text-[var(--color-slate)]">
              We may update this Privacy Policy from time to time. Any changes will be 
              posted on this page with an updated effective date.
            </p>
          </section>

          <p className="text-sm text-[var(--color-stone)] mt-8 pt-8 border-t border-[var(--color-sand-dark)]">
            Last updated: {new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
