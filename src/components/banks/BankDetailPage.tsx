"use client";

import { AppDownloadBanner } from "@/components/common/layout/Footer";
import type { BankSeoPageData } from "@/services/bankSeoPages";
import { BankHeroSection } from "./BankHeroSection";
import { BankAboutSection } from "./BankAboutSection";
import { BankInterestRatesSection } from "./BankInterestRatesSection";

export function BankDetailPage({ page }: { page: BankSeoPageData }) {
  const tabs = (page.tabs || [])
    .filter((tab) => tab.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <main className="bg-white text-[#111827]">
      <BankHeroSection page={page} />

      <section className="bg-[#e8f4ff] px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-9xl gap-7 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              className={`h-12 min-w-32 shrink-0 rounded-full px-8 text-[15px] font-semibold ${
                index === 0
                  ? "bg-[#005ca8] text-white"
                  : "bg-white text-[#2a2f36]"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <BankAboutSection page={page} />
      <BankInterestRatesSection page={page} />

      <AppDownloadBanner />
    </main>
  );
}
