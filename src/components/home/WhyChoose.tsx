import React from "react";
import {
  UserCheck,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
  Tags,
} from "lucide-react";

// Structured array matching the unique items across the columns in the image
const corporateReasons = [
  { id: "legal", label: "Expert Legal Expert", icon: UserCheck },
  { id: "transparency", label: "Transparent Process", icon: RefreshCw },
  { id: "compliance", label: "100% Compliances Assured", icon: ShieldCheck },
  { id: "support", label: "End to End Support", icon: HelpCircle },
  { id: "pricing", label: "Affordable Pricing", icon: Tags },
];

export function WhyChoose() {
  return (
    <section className="bg-[#00529c] px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-9xl">
        {/* Top Branding Flex Row Banner */}
        <div className="flex items-center justify-between gap-6 pb-8">
          <h2 className="text-[22px] font-bold tracking-tight text-white sm:text-[32px]">
            Why Choose Fintaraa?
          </h2>

          {/* Right Floating Trust Shield Graphic Cluster Mock */}
          <div className="relative hidden sm:flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-liner-to-b from-emerald-400 to-teal-600 p-3 text-white shadow-[0_0_24px_rgba(16,185,129,0.4)] ring-4 ring-white/10">
              <ShieldCheck className="h-9 w-9 stroke-[2.5]" />
            </div>
            <span className="absolute -left-6 bottom-1 text-[18px] opacity-40 select-none">
              🏛️
            </span>
            <span className="absolute -right-6 top-1 text-[18px] opacity-40 select-none">
              📄
            </span>
          </div>
        </div>

        {/* Dense Grid/Flex Block Matching the Screenshot Rows */}
        <div className="flex flex-col gap-4">
          {/* Row 1 Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {corporateReasons.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={`row1-${item.id}`}
                  className="flex items-center gap-2 sm:gap-3.5 rounded-[14px] bg-white p-3 sm:p-4 text-[#00529c] shadow-md transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="shrink-0 text-[#00529c]">
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.75]" />
                  </div>
                  <h3 className="text-[12px] sm:text-[13px] font-bold leading-snug tracking-tight text-[#00529c] ">
                    {item.label}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Row 2 Grid (Duplicates row layout logic as displayed inside screenshot) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {corporateReasons.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={`row2-${item.id}`}
                  className="flex items-center gap-2 sm:gap-3.5 rounded-[14px] bg-white p-3 sm:p-4 text-[#00529c] shadow-md transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="shrink-0 text-[#00529c]">
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.75]" />
                  </div>
                  <h3 className="text-[12px] sm:text-[14px] font-bold leading-snug tracking-tight text-[#00529c]">
                    {item.label}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
