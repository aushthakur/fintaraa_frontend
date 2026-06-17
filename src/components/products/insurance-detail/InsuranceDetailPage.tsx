"use client";

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
  return (
    <main className="bg-white text-[#111827]">
      <InsuranceHero page={page} />
      <LoanStatsBar />
      <InsuranceComparePlans
        insuranceType={page.insuranceType}
        insuranceTypeSlug={page.insuranceTypeSlug}
      />
      <InsuranceCoverageExplanation />
      <InsuranceClaimsProcess />
      <InsuranceEligibilityDocuments />
      <InsuranceOtherProducts />
      <FaqAccordion />
      <Testimonials />
      {/* <InsuranceJourney insuranceTypeSlug={page.insuranceTypeSlug} /> */}
      <AppDownloadBanner />
    </main>
  );
}
