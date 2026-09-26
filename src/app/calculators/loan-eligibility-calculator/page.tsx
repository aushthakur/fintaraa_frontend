import type { Metadata } from "next";
import { DedicatedCalculatorPage } from "@/components/calculators/DedicatedCalculatorPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteName } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Loan Eligibility Calculator - Check Your Borrowing Power",
  description:
    "Check your maximum loan eligibility based on monthly income, existing EMIs, and FOIR ratios with Fintaraa's Loan Eligibility Calculator.",
  alternates: { canonical: "/calculators/loan-eligibility-calculator" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata(
    "/calculators/loan-eligibility-calculator",
    fallbackMetadata,
  );
}

export default function LoanEligibilityCalculatorRoute() {
  return (
    <>
      <JsonLd
        id="eligibility-calc-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Loan Eligibility Calculator | Fintaraa",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          description:
            "Calculate your maximum borrowing capacity and allowable loan limits.",
          url: absoluteUrl("/calculators/loan-eligibility-calculator"),
          provider: {
            "@type": "Organization",
            name: siteName,
            url: absoluteUrl("/"),
          },
        }}
      />
      <DedicatedCalculatorPage type="eligibility" />
    </>
  );
}
