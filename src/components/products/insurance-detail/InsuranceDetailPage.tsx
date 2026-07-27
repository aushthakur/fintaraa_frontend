"use client";

import { useEffect, useMemo, useState } from "react";
import type { InsuranceSeoPageData } from "@/services/insuranceSeoPages";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { InsuranceHero } from "./InsuranceHero";
import { InsuranceComparePlans } from "./InsuranceComparePlans";
import { InsuranceCoverageExplanation } from "./InsuranceCoverage";
import { InsuranceClaimsProcess } from "./InsuranceClaimsProcess";
import { InsuranceEligibilityDocuments } from "./InsuranceEligibilityDocuments";
import { InsuranceOtherProducts } from "./InsuranceOtherProducts";
import { InsuranceGuidePanel, InsuranceTabs } from "./InsuranceTabs";
// import { InsuranceJourney } from "./InsuranceJourney";
import { LoanStatsBar } from "../loan-detail/LoanStatsBar";
import { LoanFAQSection } from "../loan-detail/LoanFAQSection";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductLocationDirectory } from "../ProductLocationDirectory";
import type { InsuranceSeoLocationPage } from "@/services/insuranceSeoPages";
import { getApplyHref } from "@/components/application/flowRegistry";
import { ProductDetailPopupBanner } from "@/components/products/ProductDetailPopupBanner";
import { ProductRelatedBlogs } from "../ProductRelatedBlogs";
import {
  PRODUCT_SECTION_NAVIGATION_EVENT,
  type ProductSectionNavigationDetail,
  scrollToProductSection,
} from "@/lib/productSectionNavigation";

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

  useEffect(() => {
    const matchingSectionTab = (sectionId: string) => {
      const matches = (tab: (typeof tabs)[number], terms: string[]) => {
        const identity = [tab.key, tab.label, ...(tab.filterKeys || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return terms.some((term) => identity.includes(term));
      };

      if (sectionId === "insurance-documents") {
        return tabs.find((tab) => matches(tab, ["document", "kyc"]));
      }
      if (sectionId === "insurance-compare-plans") {
        return tabs.find((tab) =>
          matches(tab, ["premium", "plan", "compare"]),
        );
      }
      return undefined;
    };

    const selectHashTab = () => {
      const hashKey = window.location.hash.replace(/^#/, "");
      const directTab = tabs.find((tab) => tab.key === hashKey);
      const sectionTab = matchingSectionTab(hashKey);
      const nextTab = directTab || sectionTab;
      if (nextTab) setActiveTab(nextTab.key);
      if (sectionTab) scrollToProductSection(`#${hashKey}`);
    };
    const selectSectionTab = (event: Event) => {
      const { sectionId } = (
        event as CustomEvent<ProductSectionNavigationDetail>
      ).detail;
      const sectionTab = matchingSectionTab(sectionId);
      if (sectionTab) setActiveTab(sectionTab.key);
    };

    selectHashTab();
    window.addEventListener("hashchange", selectHashTab);
    window.addEventListener(
      PRODUCT_SECTION_NAVIGATION_EVENT,
      selectSectionTab,
    );
    return () => {
      window.removeEventListener("hashchange", selectHashTab);
      window.removeEventListener(
        PRODUCT_SECTION_NAVIGATION_EVENT,
        selectSectionTab,
      );
    };
  }, [tabs]);
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const tabIdentity = [
    active?.key,
    active?.label,
    ...(active?.filterKeys || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const isCoverage =
    tabIdentity.includes("coverage") ||
    tabIdentity.includes("cover") ||
    tabIdentity.includes("overview");
  const isEligibility = tabIdentity.includes("eligib");
  const isDocuments =
    tabIdentity.includes("document") || tabIdentity.includes("kyc");
  const isClaims = tabIdentity.includes("claim");
  const isPremium =
    tabIdentity.includes("premium") ||
    tabIdentity.includes("plan") ||
    tabIdentity.includes("compare");
  const isFaq =
    tabIdentity.includes("faq") || tabIdentity.includes("question");
  const isReview =
    tabIdentity.includes("review") || tabIdentity.includes("testimonial");
  const isOtherProducts =
    tabIdentity.includes("product") || tabIdentity.includes("other");
  const showGuidePanel =
    isCoverage ||
    isPremium ||
    isClaims ||
    isEligibility ||
    isDocuments ||
    isFaq;
  const faqItems =
    active?.faqs?.length ? active.faqs : tabs.flatMap((tab) => tab.faqs || []);
  const faqTitle =
    tabs.find((tab) => tab.key === "faqs")?.title ||
    `FAQs about ${page.insuranceType}`;
  const applyHref = getApplyHref({
    category: "insurance",
    productSlug: page.insuranceTypeSlug,
    referrer: page.canonicalPath || `/products/${page.insuranceTypeSlug}`,
  });
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    window.history.replaceState(null, "", `#${key}`);
  };

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
      <InsuranceTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {showGuidePanel ? (
        <InsuranceGuidePanel
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          productName={page.insuranceType}
          productSlug={page.insuranceTypeSlug}
          applyHref={applyHref}
        >
          {isCoverage ? (
            <InsuranceCoverageExplanation tab={active} embedded />
          ) : null}
          {isPremium ? (
            <InsuranceComparePlans
              insuranceType={page.insuranceType}
              insuranceTypeSlug={page.insuranceTypeSlug}
              embedded
            />
          ) : null}
          {isClaims ? <InsuranceClaimsProcess tab={active} embedded /> : null}
          {isEligibility ? (
            <InsuranceEligibilityDocuments
              tab={active}
              mode="eligibility"
              embedded
            />
          ) : null}
          {isDocuments ? (
            <InsuranceEligibilityDocuments
              tab={active}
              mode="documents"
              embedded
            />
          ) : null}
          {isFaq ? (
            <LoanFAQSection
              lookupPathname="/products/[insuranceType]"
              faqs={faqItems}
              title={faqTitle}
              embedded
            />
          ) : null}
        </InsuranceGuidePanel>
      ) : null}

      {isOtherProducts ? <InsuranceOtherProducts /> : null}
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
