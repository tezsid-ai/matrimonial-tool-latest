"use client";

import { CheckCircle2, TrendingUp, MessageCircle, AlertTriangle, ListTodo, Circle } from "lucide-react";

interface InsightsData {
  strengths: string[];
  growthAreas: string[];
  discussionAreas: string[];
  risks: { level: "low" | "medium" | "high"; items: string[] };
  recommendations: { text: string; checked: boolean }[];
}

interface InsightsTableProps {
  insights: InsightsData;
  onRecommendationToggle: (index: number) => void;
}

const config = {
  strength: {
    borderClass: "border-l-4 border-l-[var(--color-fynbos)]",
  },
  growth: {
    borderClass: "border-l-4 border-l-[var(--color-gold)]",
  },
  discussion: {
    borderClass: "border-l-4 border-l-[var(--color-ink)]",
  },
  risk: {
    borderClass: "border-l-4 border-l-[var(--color-rooibos)]",
  },
  recommendation: {
    borderClass: "border-l-4 border-l-[var(--color-stone)]",
  },
};

const severityLabels = {
  low: { text: "Low", class: "bg-[var(--color-fynbos)]/10 text-[var(--color-fynbos)] border border-[var(--color-fynbos)]/20" },
  medium: { text: "Medium", class: "bg-[var(--color-gold)]/10 text-[var(--color-gold-dark)] border border-[var(--color-gold)]/20" },
  high: { text: "High", class: "bg-[var(--color-rooibos)]/10 text-[var(--color-rooibos)] border border-[var(--color-rooibos)]/20" },
};

export default function InsightsTable({ insights, onRecommendationToggle }: InsightsTableProps) {
  const totalRecs = insights.recommendations.length;
  const completedRecs = insights.recommendations.filter((r) => r.checked).length;
  const progress = totalRecs > 0 ? Math.round((completedRecs / totalRecs) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* 1. Strengths */}
      {insights.strengths.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-slate)]">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-fynbos)]" />
            <span>Foundations to Build On</span>
          </div>
          <div className="bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] overflow-hidden shadow-sm divide-y divide-[var(--color-sand-dark)]/30">
            {insights.strengths.map((item, i) => (
              <div key={i} className={`flex items-start gap-3.5 p-4 hover:bg-[var(--color-sand-light)]/20 transition-colors ${config.strength.borderClass}`}>
                <div className="p-1 bg-[var(--color-fynbos)]/10 text-[var(--color-fynbos)] rounded-full shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-[var(--color-slate)] leading-relaxed mt-0.5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Growth */}
      {insights.growthAreas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-slate)]">
            <TrendingUp className="w-5 h-5 text-[var(--color-gold-dark)]" />
            <span>Areas for Growth</span>
          </div>
          <div className="bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] overflow-hidden shadow-sm divide-y divide-[var(--color-sand-dark)]/30">
            {insights.growthAreas.map((item, i) => (
              <div key={i} className={`flex items-start gap-3.5 p-4 hover:bg-[var(--color-sand-light)]/20 transition-colors ${config.growth.borderClass}`}>
                <div className="p-1 bg-[var(--color-gold)]/10 text-[var(--color-gold-dark)] rounded-full shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-sm text-[var(--color-slate)] leading-relaxed mt-0.5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Discussion */}
      {insights.discussionAreas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-slate)]">
            <MessageCircle className="w-5 h-5 text-[var(--color-ink)]" />
            <span>Topics to Explore Together</span>
          </div>
          <div className="bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] overflow-hidden shadow-sm divide-y divide-[var(--color-sand-dark)]/30">
            {insights.discussionAreas.map((item, i) => (
              <div key={i} className={`flex items-start gap-3.5 p-4 hover:bg-[var(--color-sand-light)]/20 transition-colors ${config.discussion.borderClass}`}>
                <div className="p-1 bg-[var(--color-ink)]/10 text-[var(--color-ink)] rounded-full shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <p className="text-sm text-[var(--color-slate)] leading-relaxed mt-0.5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Risks */}
      {insights.risks.items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-slate)]">
              <AlertTriangle className="w-5 h-5 text-[var(--color-rooibos)]" />
              <span>Things to Watch</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-semibold rounded-full uppercase tracking-wider ${severityLabels[insights.risks.level].class}`}>
              {severityLabels[insights.risks.level].text} Priority
            </span>
          </div>
          <div className="bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] overflow-hidden shadow-sm divide-y divide-[var(--color-sand-dark)]/30">
            {insights.risks.items.map((item, i) => (
              <div key={i} className={`flex items-start gap-3.5 p-4 hover:bg-[var(--color-sand-light)]/20 transition-colors ${config.risk.borderClass}`}>
                <div className="p-1 bg-[var(--color-rooibos)]/10 text-[var(--color-rooibos)] rounded-full shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <p className="text-sm text-[var(--color-slate)] leading-relaxed mt-0.5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Actions */}
      {insights.recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-slate)]">
            <ListTodo className="w-5 h-5 text-[var(--color-gold-dark)]" />
            <span>Your Action Plan</span>
          </div>
          
          <div className="p-4 bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] shadow-sm">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[var(--color-slate)] font-semibold uppercase tracking-wider">Plan Progress</span>
              <span className="font-semibold text-[var(--color-ink)]">{progress}%</span>
            </div>
            <div className="h-2 bg-[var(--color-sand-dark)] rounded-full overflow-hidden border border-[var(--color-sand-dark)]/10">
              <div
                className="h-full bg-[var(--color-gold)] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] overflow-hidden shadow-sm divide-y divide-[var(--color-sand-dark)]/30">
            {insights.recommendations.map((rec, i) => (
              <div key={i} className={`p-4 hover:bg-[var(--color-sand-light)]/20 transition-colors ${config.recommendation.borderClass}`}>
                <button
                  onClick={() => onRecommendationToggle(i)}
                  className="flex items-start gap-3.5 text-left w-full text-sm text-[var(--color-slate)] cursor-pointer focus:outline-none"
                >
                  <span className="mt-0.5 shrink-0 transition-transform duration-200">
                    {rec.checked ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-gold)]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--color-stone)]" />
                    )}
                  </span>
                  <span className={`leading-relaxed ${rec.checked ? "text-[var(--color-stone)] line-through" : ""}`}>
                    {rec.text}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
