"use client";

import { getApplyHref } from "@/components/application/flowRegistry";
import { EmiCalculator } from "@/components/home/EmiCalculator";
import type { BankSeoPageData } from "@/services/bankSeoPages";

export function BankEmiCalculatorSection({
  page,
}: {
  page: BankSeoPageData;
}) {
  const productSlug = page.productSlug || "loan";
  const applyHref = getApplyHref({
    category: "loan",
    bankSlug: page.bankSlug,
    productSlug,
    referrer:
      page.canonicalPath || `/banks/${page.bankSlug}/${page.productSlug}`,
  });

  return (
    <div
      id="bank-loan-emi-calculator"
      className="scroll-mt-24 bg-white pb-10"
    >
      <EmiCalculator
        key={`${page.bankSlug}-${productSlug}`}
        defaultLoanType={productSlug}
        displayLoanLabel={`${page.bankName} ${page.productName}`}
        lockedLoanType
        applyHrefOverride={applyHref}
        applyProductSlug={productSlug}
      />
    </div>
  );
}
