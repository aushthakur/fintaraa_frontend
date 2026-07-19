import type { Metadata } from "next";
import { BusinessServicePage } from "@/components/services/business/BusinessServicePage";
import { annualComplianceConfig } from "@/components/services/business/businessServiceData";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Annual Compliance Services for Companies | Fintaraa",
  description:
    "Get assisted ROC annual filing, director KYC, statutory record and company compliance support with Fintaraa.",
  alternates: { canonical: "/annual-compliance" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/annual-compliance", fallbackMetadata);
}

export default function AnnualCompliancePage() {
  return <BusinessServicePage config={annualComplianceConfig} />;
}
