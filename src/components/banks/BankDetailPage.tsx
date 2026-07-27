"use client";

import { useEffect, useMemo, useState } from "react";
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
import { BankEmiCalculatorSection } from "./BankEmiCalculatorSection";

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
  const activeIdentity = slugifyProduct(
    [active?.key, active?.label, active?.title].filter(Boolean).join(" "),
  );
  const isBankOverview = Boolean(page.isBankOverview);
  const productSlug = slugifyProduct(page.productSlug || page.productName);
  const isCreditCardPage = productSlug.includes("credit-card");
  const isAllDetailsTab = active?.key === "all_details";
  const isOverviewTab = activeIdentity.includes("overview");
  const isEmiTab =
    activeIdentity.includes("emi") ||
    activeIdentity.includes("repayment-calculator");
  const isRateTab =
    !isEmiTab &&
    (activeIdentity.includes("interest") ||
      activeIdentity.includes("rate") ||
      activeIdentity.includes("fees") ||
      activeIdentity.includes("charges"));
  const isProductTab =
    activeIdentity.includes("product") ||
    activeIdentity.includes("card-options") ||
    activeIdentity.includes("loan-options") ||
    activeIdentity.includes("offers");

  useEffect(() => {
    const selectHashTab = () => {
      const hashKey = window.location.hash.replace(/^#/, "");
      if (tabs.some((tab) => tab.key === hashKey)) setActiveTab(hashKey);
    };

    selectHashTab();
    window.addEventListener("hashchange", selectHashTab);
    return () => window.removeEventListener("hashchange", selectHashTab);
  }, [tabs]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    window.history.replaceState(null, "", `#${key}`);
  };

  return (
    <main className="bg-white text-[#111827]">
      <BankHeroSection page={page} />

      <section
        className="sticky z-[49] border-y border-[#d8e6f0] bg-[#e8f4ff]/95 px-4 py-3 backdrop-blur md:px-6 lg:px-8"
        style={{ top: "var(--site-header-height, 8.25rem)" }}
      >
        <div
          role="tablist"
          aria-label={`${page.bankName} ${page.productName} information sections`}
          className="mx-auto flex max-w-9xl gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isSelected = active?.key === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleTabChange(tab.key)}
                className={`h-10 min-w-28 shrink-0 rounded-full px-5 text-[12px] font-extrabold transition ${
                  isSelected
                    ? "bg-[#005ca8] text-white shadow-sm"
                    : "bg-white text-[#2a2f36] hover:bg-[#f7fbff]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {active ? <BankTabContentSection page={page} tab={active} /> : null}

      {isAllDetailsTab || isOverviewTab ? (
        <BankAboutSection page={page} />
      ) : null}

      {(isAllDetailsTab || isRateTab) &&
      !isCreditCardPage &&
      !isBankOverview ? (
        <BankInterestRatesSection page={page} mode="rates" />
      ) : null}

      {isEmiTab && !isCreditCardPage && !isBankOverview ? (
        <BankEmiCalculatorSection page={page} />
      ) : null}

      {(isAllDetailsTab || isProductTab) && isCreditCardPage ? (
        <BankCreditCardsSection
          bankName={page.bankName}
          bankSlug={page.bankSlug}
        />
      ) : null}

      {(isAllDetailsTab || isProductTab) && !isCreditCardPage ? (
        <BankInterestRatesSection page={page} mode="products" />
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
