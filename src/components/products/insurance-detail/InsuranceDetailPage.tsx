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
import { ProductLocationDirectory } from "../ProductLocationDirectory";
import type { InsuranceSeoLocationPage } from "@/services/insuranceSeoPages";
import { getApplyHref } from "@/components/application/flowRegistry";
import { ProductDetailPopupBanner } from "@/components/products/ProductDetailPopupBanner";
import { ProductRelatedBlogs } from "../ProductRelatedBlogs";

export function InsuranceDetailPage({
  page,
  locationPages = [],
}: {
  page: InsuranceSeoPageData;
  locationPages?: InsuranceSeoLocationPage[];
}) {
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
  const applyHref = getApplyHref({
    category: "insurance",
    productSlug: page.insuranceTypeSlug,
    referrer: page.canonicalPath || `/products/${page.insuranceTypeSlug}`,
  });

  return (
    <main className="overflow-visible bg-white text-[#111827]">
      <ProductDetailPopupBanner
        category="insurance"
        productName={page.insuranceType}
        productSlug={page.insuranceTypeSlug}
        applyHref={applyHref}
      />
      <InsuranceHero page={page} />
      <LoanStatsBar />

      <div className="h-10" aria-hidden="true" />
      <section
        className="sticky z-[49] mb-10 w-full bg-[#e3f0fc] px-4 py-4 antialiased shadow-[0_12px_28px_rgba(0,82,156,0.08)] sm:px-6 md:px-8"
        style={{ top: "var(--site-header-height, 8.25rem)" }}
      >
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
      <ProductRelatedBlogs
        category="Insurance"
        productName={page.insuranceType}
      />
      <ProductLocationDirectory
        productName={page.insuranceType}
        productSlug={page.insuranceTypeSlug}
        currentLocation={page.location}
        pages={locationPages}
      />
      {/* <InsuranceJourney insuranceTypeSlug={page.insuranceTypeSlug} /> */}
      <AppDownloadBanner />
    </main>
  );
}
