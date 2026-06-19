"use client";

import { FileText, Building2, MapPin, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

// Structured to map the explicit icons, text values, and colors directly from image_0750a9.png
const displayStats = [
  {
    value: "12,45,678+",
    label: "Loans Processed",
    icon: FileText,
    bgClass: "bg-[#eefbf7]",
    iconColor: "text-[#1d4f6c]",
  },
  {
    value: "30+",
    label: "Partner Banks",
    icon: Building2,
    bgClass: "bg-[#eff6ff]",
    iconColor: "text-[#1d4f6c]",
  },
  {
    value: "850+",
    label: "Cities Covered",
    icon: MapPin,
    bgClass: "bg-[#fff2e6]",
    iconColor: "text-[#c2612b]",
  },
  {
    value: "9,85,000+",
    label: "Happy Customers",
    icon: Users,
    bgClass: "bg-[#fae8ff]",
    iconColor: "text-[#a21caf]",
  },
];

export function LoanStatsBar() {
  return (
    <section className="bg-[#004B93] px-6 py-6 text-white antialiased md:px-12 lg:px-16">
      <div className="mx-auto max-w-9xl grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-y-0">
        {displayStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative flex items-center justify-start gap-4 px-2 md:justify-center"
            >
              {/* Dynamic Icon with explicit matching background tints */}
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${stat.bgClass}`}
              >
                <IconComponent
                  className={`h-6 w-6 ${stat.iconColor}`}
                  strokeWidth={2.2}
                />
              </div>

              {/* Typography block stack */}
              <div className="space-y-0.5">
                <AnimatedCounter
                  value={stat.value}
                  className="block text-xl font-bold tracking-tight text-white md:text-2xl"
                />
                <span className="block text-[11px] font-semibold text-blue-100/80 tracking-wide whitespace-nowrap">
                  {stat.label}
                </span>
              </div>

              {/* Clean thin vertical dividers layout layer mapping image_0750a9.png */}
              {index < displayStats.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden h-10 w-px bg-white/20 md:block" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
