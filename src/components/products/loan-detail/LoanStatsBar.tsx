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
    <section className="bg-white border-b border-gray-100 py-6 sm:py-8 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4 lg:gap-6">
          {displayStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="group flex items-center gap-3 sm:gap-4 rounded-2xl bg-white border border-gray-200/80 p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#6424C7]/30 hover:shadow-[0_12px_28px_-8px_rgba(100,36,199,0.12)] hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6424C7] transition-transform duration-300 group-hover:scale-105 border border-purple-100/60">
                  <IconComponent className="h-5 w-5 sm:h-5.5 sm:w-5.5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-[18px] sm:text-[22px] font-bold text-gray-900 tracking-tight leading-tight tabular-nums">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <p className="text-[12px] sm:text-[13px] font-semibold text-gray-800 leading-snug">
                    {stat.label}
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] font-normal text-gray-400">
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
