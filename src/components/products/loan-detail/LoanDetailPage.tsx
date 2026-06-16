"use client";

import { useMemo, useState } from "react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { LoanHeroSection } from "./LoanHeroSection";
import { LoanStatsBar } from "./LoanStatsBar";
import { LoanTabs } from "./LoanTabs";
import { LoanFeaturesSection } from "./LoanFeaturesSection";
import { LoanFeaturesBenefits } from "./LoanFeaturesBenefits";
import { LoanEligibilityCriteria } from "./LoanEligibilityCriteria";
import { LoanDocumentsRequired } from "./LoanDocumentsRequired";
import { LoanEMICalculator } from "./LoanEMICalculator";
import { LoanBankComparison } from "./LoanBankComparison";
import { LoanVerificationSteps } from "./LoanVerificationSteps";
import { LoanOtherProducts } from "./LoanOtherProducts";
import { LoanFAQSection } from "./LoanFAQSection";
import { Testimonials } from "@/components/home/Testimonials";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

export function LoanDetailPage({ page }: { page: LoanSeoPageData }) {
  const tabs = useMemo(
    () =>
      (page.tabs || [])
        .filter((tab) => tab.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [page.tabs],
  );
  const fields = useMemo(
    () =>
      (page.formFields || [])
        .filter((field) => field.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .slice(0, 5),
    [page.formFields],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "overview");
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const featureItems = (
    active?.bullets?.length ? active.bullets : tabs.flatMap((tab) => tab.bullets || [])
  ).slice(0, 6);
  const faqs = tabs.flatMap((tab) => tab.faqs || []);

  // Map each tab key to the sections it should show
  const tabSections: Record<string, string[]> = {
    overview: [
      "features",
      "benefits",
      "eligibility",
      "documents",
      "emi_calculator",
      "bank_comparison",
      "verification",
      "faq",
    ],
    eligibility: ["benefits", "eligibility"],
    documents: ["benefits", "documents"],
    fees: ["emi_calculator", "bank_comparison"],
    how_to_apply: ["verification"],
    faqs: ["faq"],
  };

  const sections = tabSections[activeTab] || tabSections.overview;

  const showSection = (section: string) => sections.includes(section);

  return (
    <main className="bg-white text-[#1f2329]">
      <LoanHeroSection page={page} fields={fields} />
      <LoanStatsBar />
      <LoanTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {showSection("features") && (
        <LoanFeaturesSection loanType={page.loanType} featureItems={featureItems} />
      )}

      {(showSection("benefits") ||
        showSection("eligibility") ||
        showSection("documents")) && (
        <section className="px-4 pb-8 md:px-6 lg:px-8">
          <div className="mx-auto max-w-9xl">
            <div className="mt-6 grid gap-7">
              {showSection("benefits") && (
                <LoanFeaturesBenefits page={page} active={active} />
              )}
              {showSection("eligibility") && <LoanEligibilityCriteria />}
              {showSection("documents") && <LoanDocumentsRequired page={page} />}
            </div>
          </div>
        </section>
      )}

      {showSection("emi_calculator") && <LoanEMICalculator page={page} />}
      {showSection("bank_comparison") && <LoanBankComparison page={page} />}
      {showSection("verification") && <LoanVerificationSteps page={page} />}

      <LoanOtherProducts />
      <LoanFAQSection loanType={page.loanType} faqs={faqs} />
      <Testimonials />
      <AppDownloadBanner />
    </main>
  );
}