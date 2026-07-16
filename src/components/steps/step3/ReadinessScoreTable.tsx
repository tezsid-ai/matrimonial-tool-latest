"use client";

import { useState } from "react";
import { ArrowUpDown, User, Users, Wallet, Briefcase, Heart, Scale, HeartPulse } from "lucide-react";
import { CATEGORIES } from "@/config/brand";

interface CategoryScore {
  category: string;
  score: number;
}

interface ReadinessScoreTableProps {
  scores: CategoryScore[];
  minimal?: boolean;
}

const iconMap = {
  User: User,
  Users: Users,
  Wallet: Wallet,
  Briefcase: Briefcase,
  Heart: Heart,
  Scale: Scale,
  HeartPulse: HeartPulse,
};

export default function ReadinessScoreTable({ scores, minimal = false }: ReadinessScoreTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedScores = [...scores].sort((a, b) => {
    return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
  });

  return (
    <div className={minimal ? "w-full" : "w-full bg-white border border-[var(--color-sand-dark)] rounded-[var(--radius-card)] p-4 sm:p-6 shadow-[var(--shadow-card)] overflow-hidden"}>
      {!minimal && (
        <div className="flex items-center justify-between mb-4 border-b border-[var(--color-sand-dark)]/50 pb-3">
          <h3 className="text-base font-semibold text-[var(--color-ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Category Readiness Scores
          </h3>
          <span className="text-[10px] text-[var(--color-stone)] uppercase font-semibold tracking-wider">
            0.0 – 5.0 Scale
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          {!minimal && (
            <thead>
              <tr className="border-b border-[var(--color-sand-dark)]/85 text-xs font-semibold text-[var(--color-slate)] uppercase tracking-wider">
                <th className="py-2.5 px-3 text-[var(--color-slate)] font-semibold">Category</th>
                <th className="py-2.5 px-3 hidden sm:table-cell text-[var(--color-slate)] font-semibold">Visual Level</th>
                <th
                  onClick={toggleSort}
                  className="py-2.5 px-3 text-right cursor-pointer select-none hover:text-[var(--color-gold)] transition-colors text-[var(--color-slate)] font-semibold"
                >
                  <span className="inline-flex items-center gap-1 justify-end w-full">
                    Score
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
              </tr>
            </thead>
          )}
          <tbody className={minimal ? "" : "divide-y divide-[var(--color-sand-dark)]/40"}>
            {sortedScores.map((score) => {
              const categoryConfig = CATEGORIES.find((c) => c.label === score.category);
              const IconComponent = categoryConfig
                ? iconMap[categoryConfig.icon as keyof typeof iconMap]
                : User;

              return (
                <tr
                  key={score.category}
                  className={minimal ? "" : "hover:bg-[var(--color-sand-light)]/40 transition-colors"}
                >
                  <td className={minimal ? "py-1.5 px-1.5" : "py-3 px-3"}>
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-[var(--color-gold)]/10 text-[var(--color-gold)] rounded-lg shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-[var(--color-slate)]">
                        {score.category}
                      </span>
                    </div>
                  </td>
                  <td className={minimal ? "py-1.5 px-1.5 hidden sm:table-cell min-w-[200px]" : "py-3 px-3 hidden sm:table-cell min-w-[200px]"}>
                    <div className="w-full bg-[var(--color-sand-dark)]/50 h-2 rounded-full overflow-hidden border border-[var(--color-sand-dark)]/15">
                      <div
                        className="bg-[var(--color-gold)] h-full rounded-full transition-all duration-500"
                        style={{ width: `${(score.score / 5) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className={minimal ? "py-1.5 px-1.5 text-right font-semibold text-[var(--color-ink)]" : "py-3 px-3 text-right font-semibold text-[var(--color-ink)]"}>
                    {score.score.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
