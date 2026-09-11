"use client";

import {
  FinancialCalculatorsSection,
  type CalcTab,
} from "@/components/home/FinancialCalculatorsSection";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

function mapSlugToTab(slug: string): CalcTab {
  if (
    slug.includes("personal") ||
    slug.includes("doctor") ||
    slug.includes("ca-loan") ||
    slug.includes("instant")
  ) {
    return "personal";
  }
  if (slug.includes("home")) {
    return "home";
  }
  return "emi";
}

export function LoanEMICalculator({ page }: { page: LoanSeoPageData }) {
  const calcTab = mapSlugToTab(page.loanTypeSlug || "");

  return (
    <div
      id="loan-emi-calculator"
      className="scroll-mt-36"
    >
      <FinancialCalculatorsSection
        initialTab={calcTab}
        titleOverride={`Calculate Your ${page.loanType} EMI`}
        subtitleOverride={`Estimate your monthly installments, total interest, and total payable amount for ${page.loanType}.`}
      />
    </div>
  );
}
