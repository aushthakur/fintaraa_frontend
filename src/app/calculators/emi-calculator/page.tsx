import type { Metadata } from "next";
import { DedicatedCalculatorPage } from "@/components/calculators/DedicatedCalculatorPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteName } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Loan EMI Calculator - Calculate Monthly Installments Online",
  description:
    "Free loan EMI calculator to estimate monthly installments, total interest, and amortization schedule for personal, home, car, and business loans on Fintaraa.",
  alternates: { canonical: "/calculators/emi-calculator" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/calculators/emi-calculator", fallbackMetadata);
}

export default function EmiCalculatorRoute() {
  return (
    <>
      <JsonLd
        id="emi-calc-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Loan EMI Calculator | Fintaraa",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          description:
            "Calculate monthly EMI and total interest for loans online in India.",
          url: absoluteUrl("/calculators/emi-calculator"),
          provider: {
            "@type": "Organization",
            name: siteName,
            url: absoluteUrl("/"),
          },
        }}
      />
      <DedicatedCalculatorPage type="emi" />
    </>
  );
}
