"use client";

import { LoanGuidePanel, LoanTabs } from "./LoanTabs";
import { useEffect, useMemo, useState } from "react";
import { LoanStatsBar } from "./LoanStatsBar";
import { LoanFAQSection } from "./LoanFAQSection";
import { LoanHeroSection } from "./LoanHeroSection";
import { LoanOtherProducts } from "./LoanOtherProducts";
import { LoanEMICalculator } from "./LoanEMICalculator";
import { LoanBankComparison } from "./LoanBankComparison";
import { Testimonials } from "@/components/home/Testimonials";
import { CreditScoreBanner } from "@/components/home/CreditScoreBanner";
import { LoanFeaturesBenefits } from "./LoanFeaturesBenefits";
import { ProductLocationDirectory } from "../ProductLocationDirectory";
import { ProductRelatedBlogs } from "../ProductRelatedBlogs";
import type {
  LoanSeoLocationPage,
  LoanSeoPageData,
} from "@/services/loanSeoPages";
import { LoanDocumentsRequired } from "./LoanDocumentsRequired";
import { LoanVerificationSteps } from "./LoanVerificationSteps";
import { LoanEligibilityCriteria } from "./LoanEligibilityCriteria";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { getApplyHref } from "@/components/application/flowRegistry";
import { ProductDetailPopupBanner } from "@/components/products/ProductDetailPopupBanner";

export function LoanDetailPage({
  page,
  locationPages = [],
}: {
  page: LoanSeoPageData;
  locationPages?: LoanSeoLocationPage[];
}) {
  const tabs = useMemo(
    () => {
      const activeTabs = (page.tabs || [])
        .filter((tab) => tab.isActive !== false && tab.key !== "all_details")
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      const hasApplySteps = activeTabs.some(
        (tab) => tab.key === "steps_to_apply",
      );
      const tabsWithApplySteps = (
        hasApplySteps
          ? activeTabs
          : [
              ...activeTabs,
              {
                key: "steps_to_apply",
                label: "Steps to Apply",
                eyebrow: "Application process",
                title: `Steps to apply for ${page.title}`,
                description:
                  "Follow the guided Fintaraa journey to share details, verify your mobile number, review matched options, and submit documents.",
                bullets: [
                  "Start with mobile number, PAN, income, and location details.",
                  "Verify OTP and complete the secure assisted application flow.",
                  "Review matched partner options before document submission.",
                  "Upload requested documents and track follow-up with Fintaraa support.",
                ],
                filterKeys: [
                  "steps_to_apply",
                  "apply",
                  "process",
                  "verification",
                ],
                sortOrder: 4.5,
                isActive: true,
              },
            ]
      ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      return tabsWithApplySteps;
    },
    [page.tabs, page.title],
  );
  const [activeTab, setActiveTab] = useState(
    tabs.find((tab) => tab.key === "overview")?.key ||
      tabs[0]?.key ||
      "overview",
  );

  useEffect(() => {
    const selectHashTab = () => {
      const hashKey = window.location.hash.replace(/^#/, "");
      if (tabs.some((tab) => tab.key === hashKey)) setActiveTab(hashKey);
    };
    selectHashTab();
    window.addEventListener("hashchange", selectHashTab);
    return () => window.removeEventListener("hashchange", selectHashTab);
  }, [tabs]);
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const isOverviewTab = active?.key === "overview";

  const tabIdentity = [
    active?.key,
    active?.label,
    ...(active?.filterKeys || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const sections = (() => {
    if (isOverviewTab) {
      return ["benefits"];
    }
    if (tabIdentity.includes("feature")) return ["benefits"];
    if (tabIdentity.includes("eligib")) return ["eligibility"];
    if (tabIdentity.includes("document")) return ["documents"];
    if (tabIdentity.includes("review")) return ["testimonials"];
    if (
      tabIdentity.includes("fee") ||
      tabIdentity.includes("emi") ||
      tabIdentity.includes("rate") ||
      tabIdentity.includes("repayment")
    ) {
      return ["emi_calculator", "bank_comparison"];
    }
    if (
      tabIdentity.includes("apply") ||
      tabIdentity.includes("process") ||
      tabIdentity.includes("verification")
    ) {
      return ["verification"];
    }
    if (tabIdentity.includes("faq") || tabIdentity.includes("question")) {
      return ["faq"];
    }
    if (tabIdentity.includes("product") || tabIdentity.includes("other")) {
      return ["other_products"];
    }
    if (tabIdentity.includes("review") || tabIdentity.includes("testimonial")) {
      return ["testimonials"];
    }
    return ["benefits"];
  })();

  const showSection = (section: string) => sections.includes(section);
  const showGuidePanel = [
    "benefits",
    "eligibility",
    "documents",
    "verification",
    "faq",
  ].some(showSection);
  const faqItems =
    active?.faqs?.length ? active.faqs : tabs.flatMap((tab) => tab.faqs || []);
  const faqTitle =
    tabs.find((tab) => tab.key === "faqs")?.title ||
    `FAQs about ${page.loanType}`;
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    window.history.replaceState(null, "", `#${key}`);
  };

  return (
    <main className="overflow-visible bg-white text-[#1f2329]">
      <ProductDetailPopupBanner
        category="loan"
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        applyHref={applyHref}
      />
      <LoanHeroSection page={page} />
      <LoanStatsBar />
      <LoanTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {showGuidePanel ? (
        <LoanGuidePanel
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          productName={page.loanType}
          productSlug={page.loanTypeSlug}
          applyHref={applyHref}
        >
          {showSection("benefits") && (
            <LoanFeaturesBenefits page={page} active={active} embedded />
          )}
          {showSection("eligibility") && (
            <LoanEligibilityCriteria embedded />
          )}
          {showSection("documents") && (
            <LoanDocumentsRequired page={page} embedded />
          )}
          {showSection("verification") && (
            <LoanVerificationSteps page={page} embedded />
          )}
          {showSection("faq") && (
            <LoanFAQSection
              faqs={faqItems}
              title={faqTitle}
              embedded
            />
          )}
        </LoanGuidePanel>
      ) : null}

      {!showGuidePanel && showSection("emi_calculator") && (
        <LoanEMICalculator page={page} />
      )}
      {!showGuidePanel && showSection("bank_comparison") && (
        <LoanBankComparison page={page} />
      )}
      <CreditScoreBanner />

      {!showGuidePanel && showSection("other_products") && (
        <LoanOtherProducts />
      )}
      {!showGuidePanel && showSection("testimonials") && <Testimonials />}
      <ProductRelatedBlogs category="Loans" productName={page.loanType} />
      <ProductLocationDirectory
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        currentLocation={page.location}
        pages={locationPages}
      />
      <AppDownloadBanner />
    </main>
  );
}
