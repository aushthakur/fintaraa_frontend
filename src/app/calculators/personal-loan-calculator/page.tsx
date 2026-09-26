import type { Metadata } from "next";
import { DedicatedCalculatorPage } from "@/components/calculators/DedicatedCalculatorPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteName } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Personal Loan EMI Calculator - Estimate Monthly Repayments",
  description:
    "Calculate monthly EMI for personal loans, compare interest rates, and plan affordable tenures using Fintaraa's Personal Loan Calculator.",
  alternates: { canonical: "/calculators/personal-loan-calculator" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata(
    "/calculators/personal-loan-calculator",
    fallbackMetadata,
  );
}

export default function PersonalLoanCalculatorRoute() {
  return (
    <>
      <JsonLd
        id="personal-loan-calc-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Personal Loan EMI Calculator | Fintaraa",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          description:
            "Estimate monthly personal loan installments and repayment tenures.",
          url: absoluteUrl("/calculators/personal-loan-calculator"),
          provider: {
            "@type": "Organization",
            name: siteName,
            url: absoluteUrl("/"),
          },
        }}
      />
      <DedicatedCalculatorPage type="personal-loan" />
    </>
  );
}
