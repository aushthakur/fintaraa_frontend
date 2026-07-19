import type { Metadata } from "next";
import { BusinessServicePage } from "@/components/services/business/BusinessServicePage";
import { taxComplianceConfig } from "@/components/services/business/businessServiceData";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Tax Compliance, Filing & Notice Support | Fintaraa",
  description:
    "Get guided support for TDS filing, tax notices, advance tax, tax audit coordination and business tax compliance.",
  alternates: { canonical: "/tax-compliance" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/tax-compliance", fallbackMetadata);
}

export default function TaxCompliancePage() {
  return <BusinessServicePage config={taxComplianceConfig} />;
}
