"use client";

import { FileText, Building2, MapPin, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

const displayStats = [
  {
    value: "12,45,000+",
    label: "Loans Disbursed",
    sub: "Across India",
    icon: FileText,
  },
  {
    value: "50+",
    label: "Partner Banks",
    sub: "RBI Regulated",
    icon: Building2,
  },
  {
    value: "850+",
    label: "Cities Covered",
    sub: "Pan-India Presence",
    icon: MapPin,
  },
  {
    value: "99.2%",
    label: "Happy Borrowers",
    sub: "Rated 4.8 / 5",
    icon: Users,
  },
];

export function LoanStatsBar() {
  return (
    <section className="bg-white border-y border-slate-200 py-6 sm:py-8 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {displayStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3.5 sm:gap-4 rounded-2xl bg-slate-50/70 border border-slate-100 p-3.5 sm:p-4 transition hover:border-purple-200 hover:bg-purple-50/20"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100/80 text-[#5b21b6] shadow-2xs">
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-[19px] sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight tabular-nums">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <p className="text-xs sm:text-[13px] font-bold text-slate-700 leading-snug">
                    {stat.label}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {stat.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
