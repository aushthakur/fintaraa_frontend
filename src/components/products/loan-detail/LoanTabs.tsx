"use client";

import type { LoanSeoTab } from "@/services/loanSeoPages";

export function LoanTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: LoanSeoTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}) {
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  return (
    <section className="w-full bg-[#e3f0fc] px-4 py-4 my-10 antialiased sm:px-6 md:px-8">
      {/* 
        Scroll container matching the design blueprint. 
        no-scrollbar class can be added here if you want to mask the horizontal browser scroll line indicators.
      */}
      <div className="mx-auto flex max-w-9xl  items-center gap-3 overflow-x-auto py-1">
        {tabs.map((tab) => {
          const isSelected = active?.key === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`h-10 shrink-0 rounded-full px-6 text-xs font-bold tracking-wide transition-all select-none duration-150 ${
                isSelected
                  ? "bg-[#00529b] text-white shadow-sm"
                  : "bg-white text-[#2d3748] hover:bg-gray-50/80 active:scale-[0.98]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
