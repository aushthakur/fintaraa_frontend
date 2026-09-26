import type { Metadata } from "next";
import { DedicatedCalculatorPage } from "@/components/calculators/DedicatedCalculatorPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteName } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Home Loan EMI Calculator - Calculate Housing Loan EMIs",
  description:
    "Calculate your Home Loan EMI, interest payable, and tax benefits under Section 24b and 80C with Fintaraa's interactive Home Loan EMI Calculator.",
  alternates: { canonical: "/calculators/home-loan-calculator" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata(
    "/calculators/home-loan-calculator",
    fallbackMetadata,
  );
}

export default function HomeLoanCalculatorRoute() {
  return (
    <>
      <JsonLd
        id="home-loan-calc-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Home Loan EMI Calculator | Fintaraa",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          description:
            "Plan your home loan tenure, EMI, and tax savings online.",
          url: absoluteUrl("/calculators/home-loan-calculator"),
          provider: {
            "@type": "Organization",
            name: siteName,
            url: absoluteUrl("/"),
          },
        }}
      />
      <DedicatedCalculatorPage type="home-loan" />
    </>
  );
}
