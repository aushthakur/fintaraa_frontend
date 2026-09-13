"use client";

import { LoanGuidePanel, LoanTabs } from "./LoanTabs";
import { useEffect, useMemo, useState } from "react";
import { LoanStatsBar } from "./LoanStatsBar";
import { LoanFAQSection } from "./LoanFAQSection";
import { LoanHeroSection } from "./LoanHeroSection";
import { LoanOtherProducts } from "./LoanOtherProducts";
import { LoanBankComparison } from "./LoanBankComparison";
import { Testimonials } from "@/components/home/Testimonials";
import { CreditScoreSection } from "@/components/home/CreditScoreSection";
import { LoanUseCasesSection } from "./LoanUseCasesSection";
import { LoanProcessRoadmap } from "./LoanProcessRoadmap";
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
import type { BankProductLender } from "@/services/bankSeoPages";
import {
  PRODUCT_SECTION_NAVIGATION_EVENT,
  type ProductSectionNavigationDetail,
  scrollToProductSection,
} from "@/lib/productSectionNavigation";

export function LoanDetailPage({
  page,
  locationPages = [],
  bankLenders = [],
}: {
  page: LoanSeoPageData;
  locationPages?: LoanSeoLocationPage[];
  bankLenders?: BankProductLender[];
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
    const matchingSectionTab = (sectionId: string) => {
      const matches = (tab: (typeof tabs)[number], terms: string[]) => {
        const identity = [tab.key, tab.label, ...(tab.filterKeys || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return terms.some((term) => identity.includes(term));
      };

      if (sectionId === "loan-documents") {
        return tabs.find((tab) => matches(tab, ["document", "kyc"]));
      }
      if (sectionId === "loan-emi-calculator") {
        return tabs.find((tab) =>
          matches(tab, [
            "emi",
            "calculator",
            "repayment",
            "rate",
            "fee",
            "charge",
          ]),
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

      {(isOverviewTab || (!showGuidePanel && showSection("bank_comparison"))) &&
        page.loanTypeSlug !== "instant-loan" && (
        <div id="loan-bank-comparison">
          <LoanBankComparison page={page} />
        </div>
      )}

      {/* Marketing showcase sections for Personal Loan and core loan pages */}
      {isOverviewTab && (
        <>
          <LoanUseCasesSection
            productSlug={page.loanTypeSlug}
            applyHref={applyHref}
          />
          <LoanProcessRoadmap
            productName={page.loanType}
            applyHref={applyHref}
          />
        </>
      )}

      {page.loanTypeSlug === "instant-loan" && (
        <LoanBankComparison
          page={page}
          lenders={bankLenders}
          showAll
          title="Instant Loan Offers From All Partner Banks"
          description="Compare indicative lender terms, open the bank details, and apply through Fintaraa."
        />
      )}

      {/* Revamped Credit Score (CIBIL) Section matching Homepage */}
      <CreditScoreSection />

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
