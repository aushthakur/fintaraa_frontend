import type { Metadata } from "next";
import { BusinessServicePage } from "@/components/services/business/BusinessServicePage";
import { rocFilingConfig } from "@/components/services/business/businessServiceData";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "ROC Filing & Company Compliance Services | Fintaraa",
  description:
    "Get assisted AOC-4, MGT-7, DIR-3 KYC, annual and event-based ROC filing support with document review and request tracking.",
  alternates: { canonical: "/roc-filing" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/roc-filing", fallbackMetadata);
}

export default function RocFilingPage() {
  return <BusinessServicePage config={rocFilingConfig} />;
}
