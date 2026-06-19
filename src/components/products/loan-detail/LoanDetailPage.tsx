"use client";

import { LoanTabs } from "./LoanTabs";
import { useMemo, useState } from "react";
import { LoanStatsBar } from "./LoanStatsBar";
import { LoanFAQSection } from "./LoanFAQSection";
import { LoanHeroSection } from "./LoanHeroSection";
import { LoanOtherProducts } from "./LoanOtherProducts";
import { LoanEMICalculator } from "./LoanEMICalculator";
import { LoanBankComparison } from "./LoanBankComparison";
import { LoanFeaturesSection } from "./LoanFeaturesSection";
import { Testimonials } from "@/components/home/Testimonials";
import { LoanFeaturesBenefits } from "./LoanFeaturesBenefits";
import type { LoanSeoPageData } from "@/services/loanSeoPages";
import { LoanDocumentsRequired } from "./LoanDocumentsRequired";
import { LoanVerificationSteps } from "./LoanVerificationSteps";
import { LoanEligibilityCriteria } from "./LoanEligibilityCriteria";
import { AppDownloadBanner } from "@/components/common/layout/Footer";

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
    active?.bullets?.length
      ? active.bullets
      : tabs.flatMap((tab) => tab.bullets || [])
  ).slice(0, 6);

  const tabIdentity = [
    active?.key,
    active?.label,
    ...(active?.filterKeys || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const sections = (() => {
    if (tabIdentity.includes("eligib")) return ["benefits", "eligibility"];
    if (tabIdentity.includes("document")) return ["documents"];
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
    if (tabIdentity.includes("overview")) return ["features", "benefits"];
    return ["benefits"];
  })();

  const showSection = (section: string) => sections.includes(section);

  return (
    <main className="bg-white text-[#1f2329]">
      <LoanHeroSection page={page} fields={fields} />
      <LoanStatsBar />
      <LoanTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {showSection("features") && (
        <LoanFeaturesSection
          loanType={page.loanType}
          featureItems={featureItems}
        />
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
              {showSection("documents") && (
                <LoanDocumentsRequired page={page} />
              )}
            </div>
          </div>
        </section>
      )}

      {showSection("emi_calculator") && <LoanEMICalculator page={page} />}
      {showSection("bank_comparison") && <LoanBankComparison page={page} />}
      {showSection("verification") && <LoanVerificationSteps page={page} />}

      {showSection("other_products") && <LoanOtherProducts />}
      {showSection("faq") && (
        <LoanFAQSection faqs={active?.faqs} title={active?.title} />
      )}
      {showSection("testimonials") && <Testimonials />}
      <AppDownloadBanner />
    </main>
  );
}
