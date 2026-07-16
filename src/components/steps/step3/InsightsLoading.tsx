"use client";

export default function InsightsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Animated loading indicator */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-sand-dark)]" />
        {/* Animated arc */}
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-gold)] border-t-transparent animate-spin" />
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[var(--color-gold)] animate-pulse" />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-4">
        <h2
          className="text-2xl font-semibold text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Generating Your Insights
        </h2>
        
        <p className="text-[var(--color-slate)] max-w-sm mx-auto">
          We&apos;re analyzing your reflections to create a personalized readiness report. 
          This may take a moment.
        </p>

        {/* Loading steps */}
        <div className="mt-8 space-y-3">
          {[
            "Analyzing your responses...",
            "Identifying patterns...",
            "Generating recommendations...",
          ].map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 text-sm text-[var(--color-stone)]"
              style={{ animationDelay: `${index * 500}ms` }}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
