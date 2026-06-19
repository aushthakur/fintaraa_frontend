"use client";

import { useMemo, useState } from "react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import type { BankSeoPageData } from "@/services/bankSeoPages";
import { slugifyProduct } from "@/lib/productRouting";
import { BankHeroSection } from "./BankHeroSection";
import { BankAboutSection } from "./BankAboutSection";
import { BankInterestRatesSection } from "./BankInterestRatesSection";
import { BankCreditCardsSection } from "./BankCreditCardsSection";
import { BankTabContentSection } from "./BankTabContentSection";

export function BankDetailPage({ page }: { page: BankSeoPageData }) {
  const tabs = useMemo(
    () =>
      (page.tabs || [])
        .filter((tab) => tab.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [page.tabs],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "overview");
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const activeKey = slugifyProduct(
    [active?.key, active?.label].filter(Boolean).join(" "),
  );
  const isCreditCardPage = ["credit-card", "credit-cards"].includes(
    slugifyProduct(page.productSlug || page.productName),
  );
  const isOverviewTab = activeKey.includes("overview");
  const isRateTab =
    activeKey.includes("interest") ||
    activeKey.includes("rate") ||
    activeKey.includes("fees");
  const isProductTab =
    activeKey.includes("product") ||
    activeKey.includes("card") ||
    activeKey.includes("offer");

  return (
    <main className="bg-white text-[#111827]">
      <BankHeroSection page={page} />

      <section className="bg-[#e8f4ff] px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-9xl gap-7 overflow-x-auto">
          {tabs.map((tab) => {
            const isSelected = active?.key === tab.key;
            return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`h-12 min-w-32 shrink-0 rounded-full px-8 text-[15px] font-semibold transition ${
                isSelected
                  ? "bg-[#005ca8] text-white"
                  : "bg-white text-[#2a2f36] hover:bg-[#f7fbff]"
              }`}
              type="button"
            >
              {tab.label}
            </button>
            );
          })}
        </div>
      </section>

      {isOverviewTab ? <BankAboutSection page={page} /> : null}

      {isProductTab && isCreditCardPage ? (
        <BankCreditCardsSection
          bankName={page.bankName}
          bankSlug={page.bankSlug}
        />
      ) : null}

      {isProductTab && !isCreditCardPage ? (
        <BankInterestRatesSection page={page} mode="products" />
      ) : null}

      {isRateTab ? <BankInterestRatesSection page={page} mode="rates" /> : null}

      {active && !isOverviewTab && !isProductTab && !isRateTab ? (
        <BankTabContentSection page={page} tab={active} />
      ) : null}

      <AppDownloadBanner />
    </main>
  );
}
