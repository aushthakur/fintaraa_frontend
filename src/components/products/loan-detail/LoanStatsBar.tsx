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
    <section className="bg-[#004B93] px-2 py-2 text-white antialiased sm:px-3 md:px-4 md:py-3 lg:px-8 lg:py-4 xl:px-16 xl:py-5">
      <div className="mx-auto grid max-w-9xl grid-cols-2 gap-y-0.5 md:grid-cols-4 md:gap-y-0">
        {displayStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative flex min-h-14 items-center justify-start gap-2 px-1.5 py-1.5 sm:px-2 md:min-h-0 md:justify-center md:gap-2 md:px-1 md:py-0 lg:gap-3 lg:px-2 xl:gap-4 xl:px-4"
            >
              {/* Dynamic Icon with explicit matching background tints */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 ${stat.bgClass}`}
              >
                <IconComponent
                  className={`h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5 xl:h-6 xl:w-6 ${stat.iconColor}`}
                  strokeWidth={2.2}
                />
              </div>

              {/* Typography block stack */}
              <div className="min-w-0 space-y-0.5">
                <AnimatedCounter
                  value={stat.value}
                  className="block whitespace-nowrap text-[15px] font-bold leading-tight tracking-tight text-white sm:text-[17px] md:text-[15px] lg:text-xl xl:text-2xl"
                />
                <span className="block text-[9.5px] font-semibold leading-3 tracking-wide text-blue-100/85 sm:text-[10.5px] md:whitespace-nowrap md:text-[9px] md:leading-3 lg:text-[10px] xl:text-[11px] xl:leading-3.5">
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
