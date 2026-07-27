"use client";

import { getApplyHref } from "@/components/application/flowRegistry";
import { EmiCalculator } from "@/components/home/EmiCalculator";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

export function LoanEMICalculator({ page }: { page: LoanSeoPageData }) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  return (
    <div
      id="loan-emi-calculator"
      style={{
        scrollMarginTop:
          "calc(var(--site-header-height, 8.25rem) + 5.5rem)",
      }}
    >
      <EmiCalculator
        key={page.loanTypeSlug}
        defaultLoanType={page.loanTypeSlug}
        displayLoanLabel={page.loanType}
        lockedLoanType
        applyHrefOverride={applyHref}
        applyProductSlug={page.loanTypeSlug}
      />
    </div>
  );
}
