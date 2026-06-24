"use client";

import { useMemo, useState } from "react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import type {
  BankSeoLocationPage,
  BankSeoPageData,
  BankSeoTab,
} from "@/services/bankSeoPages";
import { slugifyProduct } from "@/lib/productRouting";
import { BankHeroSection } from "./BankHeroSection";
import { BankAboutSection } from "./BankAboutSection";
import { BankInterestRatesSection } from "./BankInterestRatesSection";
import { BankCreditCardsSection } from "./BankCreditCardsSection";
import { BankTabContentSection } from "./BankTabContentSection";
import { BankLocationDirectory } from "./BankLocationDirectory";

const ensureAllDetailsTab = (tabs: BankSeoTab[], page: BankSeoPageData) => {
  const normalized = tabs.map((tab) => ({
    ...tab,
    key: tab.key
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""),
  }));
  if (normalized.some((tab) => tab.key === "all_details")) return normalized;
  return [
    {
      key: "all_details",
      label: "All Details",
      title: `${page.title} - complete details`,
      description:
        page.subtitle ||
        `Review rates, eligibility, documents, products, and support details for ${page.title}.`,
      content: [
        page.aboutDescription ||
          `${page.bankName} ${page.productName} details are available with Fintaraa assisted application support.`,
      ],
      bullets: [
        "Bank-wise product details",
        "Location-wise page support",
        "Eligibility and document guidance",
      ],
      sortOrder: 0,
      isActive: true,
    },
    ...normalized,
  ];
};

export function BankDetailPage({
  page,
  locationPages = [],
}: {
  page: BankSeoPageData;
  locationPages?: BankSeoLocationPage[];
}) {
  const tabs = useMemo(
    () =>
      ensureAllDetailsTab(page.tabs || [], page)
        .filter((tab) => tab.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [page],
  );
  const [activeTab, setActiveTab] = useState("all_details");
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const activeKey = slugifyProduct(
    [active?.key, active?.label].filter(Boolean).join(" "),
  );
  const isBankOverview = Boolean(page.isBankOverview);
  const productSlug = slugifyProduct(page.productSlug || page.productName);
  const isCreditCardPage = productSlug.includes("credit-card");
  const isAllDetailsTab = activeKey.includes("all-details");
  const isOverviewTab = activeKey.includes("overview") || isAllDetailsTab;
  const isRateTab =
    activeKey.includes("interest") ||
    activeKey.includes("rate") ||
    activeKey.includes("fees");
  const isCreditCardTab =
    activeKey.includes("credit-card") || activeKey.includes("credit-cards");
  const isProductTab =
    activeKey.includes("product") ||
    activeKey.includes("card") ||
    activeKey.includes("offer") ||
    isAllDetailsTab;

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

      {isProductTab && (isCreditCardPage || isCreditCardTab) ? (
        <BankCreditCardsSection
          bankName={page.bankName}
          bankSlug={page.bankSlug}
        />
      ) : null}

      {isProductTab && !isCreditCardPage ? (
        <BankInterestRatesSection page={page} mode="products" />
      ) : null}

      {(isRateTab || isAllDetailsTab) && !isCreditCardPage && !isBankOverview ? (
        <BankInterestRatesSection page={page} mode="rates" />
      ) : null}

      {active && !isOverviewTab && !isProductTab && !isRateTab ? (
        <BankTabContentSection page={page} tab={active} />
      ) : null}

      {!isBankOverview ? (
        <BankLocationDirectory
          bankName={page.bankName}
          bankSlug={page.bankSlug}
          productName={page.productName}
          productSlug={page.productSlug}
          currentLocation={page.location}
          pages={locationPages}
        />
      ) : null}

      <AppDownloadBanner />
    </main>
  );
}
