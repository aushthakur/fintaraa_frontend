"use client";

import { useMemo, useState } from "react";
import type { InsuranceSeoPageData } from "@/services/insuranceSeoPages";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { InsuranceHero } from "./InsuranceHero";
import { InsuranceComparePlans } from "./InsuranceComparePlans";
import { InsuranceCoverageExplanation } from "./InsuranceCoverage";
import { InsuranceClaimsProcess } from "./InsuranceClaimsProcess";
import { InsuranceEligibilityDocuments } from "./InsuranceEligibilityDocuments";
import { InsuranceOtherProducts } from "./InsuranceOtherProducts";
// import { InsuranceJourney } from "./InsuranceJourney";
import { LoanStatsBar } from "../loan-detail/LoanStatsBar";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { Testimonials } from "@/components/home/Testimonials";

export function InsuranceDetailPage({ page }: { page: InsuranceSeoPageData }) {
  const tabs = useMemo(
    () =>
      (page.tabs || [])
        .filter((tab) => tab.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [page.tabs],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "coverage");
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const tabIdentity = [
    active?.key,
    active?.label,
    ...(active?.filterKeys || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const isCoverage = tabIdentity.includes("coverage") || tabIdentity.includes("cover");
  const isEligibility = tabIdentity.includes("eligib");
  const isDocuments = tabIdentity.includes("document") || tabIdentity.includes("kyc");
  const isClaims = tabIdentity.includes("claim");
  const isPremium =
    tabIdentity.includes("premium") ||
    tabIdentity.includes("plan") ||
    tabIdentity.includes("compare");
  const isFaq = tabIdentity.includes("faq") || tabIdentity.includes("question");
  const isReview = tabIdentity.includes("review") || tabIdentity.includes("testimonial");

  return (
    <main className="bg-white text-[#111827]">
      <InsuranceHero page={page} />
      <LoanStatsBar />

      <section className="my-10 w-full bg-[#e3f0fc] px-4 py-4 antialiased sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const isSelected = active?.key === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`h-10 shrink-0 rounded-full px-6 text-xs font-bold tracking-wide transition-all ${
                  isSelected
                    ? "bg-[#00529b] text-white shadow-sm"
                    : "bg-white text-[#2d3748] hover:bg-gray-50/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {isCoverage ? <InsuranceCoverageExplanation tab={active} /> : null}
      {isPremium ? (
        <InsuranceComparePlans
          insuranceType={page.insuranceType}
          insuranceTypeSlug={page.insuranceTypeSlug}
        />
      ) : null}
      {isClaims ? <InsuranceClaimsProcess tab={active} /> : null}
      {isEligibility ? (
        <InsuranceEligibilityDocuments tab={active} mode="eligibility" />
      ) : null}
      {isDocuments ? (
        <InsuranceEligibilityDocuments tab={active} mode="documents" />
      ) : null}
      {tabIdentity.includes("product") || tabIdentity.includes("other") ? (
        <InsuranceOtherProducts />
      ) : null}
      {isFaq ? <FaqAccordion lookupPathname="/products/[insuranceType]" /> : null}
      {isReview ? <Testimonials /> : null}
      {/* <InsuranceJourney insuranceTypeSlug={page.insuranceTypeSlug} /> */}
      <AppDownloadBanner />
    </main>
  );
}
