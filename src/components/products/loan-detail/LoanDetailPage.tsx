"use client";

import { useMemo } from "react";
import { LoanTabs } from "./LoanTabs";
import { LoanStatsBar } from "./LoanStatsBar";
import { LoanFAQSection } from "./LoanFAQSection";
import { LoanHeroSection } from "./LoanHeroSection";
import { LoanBankComparison } from "./LoanBankComparison";
import { Testimonials } from "@/components/home/Testimonials";
import { CreditScoreSection } from "@/components/home/CreditScoreSection";
import { LoanUseCasesSection } from "./LoanUseCasesSection";
import { LoanProcessRoadmap } from "./LoanProcessRoadmap";
import { LoanFeaturesBenefits } from "./LoanFeaturesBenefits";
import { LoanEligibilityCriteria } from "./LoanEligibilityCriteria";
import { LoanDocumentsRequired } from "./LoanDocumentsRequired";
import { LoanEmiCalculatorSection } from "./LoanEmiCalculatorSection";
import { LoanFeesChargesSection } from "./LoanFeesChargesSection";
import { LoanSeoKnowledgeSection } from "./LoanSeoKnowledgeSection";
import { ProductLocationDirectory } from "../ProductLocationDirectory";
import { ProductRelatedBlogs } from "../ProductRelatedBlogs";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { getApplyHref } from "@/components/application/flowRegistry";
import type {
  LoanSeoLocationPage,
  LoanSeoPageData,
} from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

export function LoanDetailPage({
  page,
  locationPages = [],
  bankLenders = [],
}: {
  page: LoanSeoPageData;
  locationPages?: LoanSeoLocationPage[];
  bankLenders?: BankProductLender[];
}) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  // Extract all FAQs across tabs
  const faqItems = useMemo(() => {
    const allFaqs = (page.tabs || []).flatMap((tab) => tab.faqs || []);
    // Deduplicate by question
    const seen = new Set<string>();
    return allFaqs.filter((faq) => {
      if (!faq.question || seen.has(faq.question)) return false;
      seen.add(faq.question);
      return true;
    });
  }, [page.tabs]);

  const faqTitle = `Frequently Asked Questions About ${page.loanType}`;

  return (
    <main className="overflow-visible bg-white text-[#1f2329]">
      {/* 1. Hero Section with Carousel and Live Amount/Company Estimator */}
      <LoanHeroSection page={page} />

      {/* 2. Key Trust Metrics Bar */}
      <LoanStatsBar />

      {/* 3. Sticky Subnav Tab Bar with Smooth Scroll Anchors */}
      <LoanTabs />

      {/* 4. Overview / Life Goals: Detailed one-by-one with imagery (Borderless) */}
      <LoanUseCasesSection
        productSlug={page.loanTypeSlug}
        applyHref={applyHref}
      />

      {/* 5. Features & Key Benefits up to ₹1 Crore (Borderless) */}
      <LoanFeaturesBenefits page={page} />

      {/* 6. Steps to Apply: 3-Step Guided Roadmap (Borderless) */}
      <LoanProcessRoadmap
        productName={page.loanType}
        applyHref={applyHref}
      />

      {/* 7. Eligibility Criteria: Salaried vs Self-Employed & CIBIL Tiers (Borderless) */}
      <LoanEligibilityCriteria />

      {/* 8. Documents Required: DigiLocker & Soft Copy Checklist (Borderless) */}
      <LoanDocumentsRequired page={page} />

      {/* 9. Interactive EMI Calculator & Reducing vs Flat Comparison (Borderless) */}
      <LoanEmiCalculatorSection
        productSlug={page.loanTypeSlug}
        applyHref={applyHref}
      />

      {/* 10. Partner Bank Rates & Offers Comparison Table */}
      <LoanBankComparison
        page={page}
        lenders={bankLenders}
        showAll={page.loanTypeSlug === "instant-loan"}
        title={
          page.loanTypeSlug === "instant-loan"
            ? "Instant Loan Offers From All Partner Banks"
            : `Compare ${page.loanType} Offers Across Top Banks`
        }
        description="Transparent interest rates, processing fees, and maximum borrowing limits from leading RBI-approved institutions."
      />

      {/* 11. Fees & Charges Transparency Breakdown & RBI KFS (Borderless) */}
      <LoanFeesChargesSection page={page} />

      {/* 12. Free Credit Score (CIBIL) Checker */}
      <CreditScoreSection />

      {/* 13. High-Intent Google Search SEO Knowledge Base & Editorial Guide */}
      <LoanSeoKnowledgeSection
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        applyHref={applyHref}
      />

      {/* 14. Real Customer Reviews & Testimonials */}
      <section
        id="reviews"
        style={{
          scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
        }}
      >
        <Testimonials />
      </section>

      {/* 15. Comprehensive FAQs */}
      <LoanFAQSection
        faqs={faqItems}
        title={faqTitle}
      />

      {/* 16. Related Blogs & Financial Guides */}
      <ProductRelatedBlogs category="Loans" productName={page.loanType} />

      {/* 17. City & Location Directory */}
      <ProductLocationDirectory
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        currentLocation={page.location}
        pages={locationPages}
      />

      {/* 18. Mobile App Download Footer Banner */}
      <AppDownloadBanner />
    </main>
  );
}
