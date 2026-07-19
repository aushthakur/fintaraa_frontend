import type { Metadata } from "next";
import { BusinessServicePage } from "@/components/services/business/BusinessServicePage";
import { msmeRegistrationConfig } from "@/components/services/business/businessServiceData";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "MSME & Udyam Registration Online | Fintaraa",
  description:
    "Get assisted MSME and Udyam registration, certificate verification, detail updates and business classification support.",
  alternates: { canonical: "/msme-registration" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/msme-registration", fallbackMetadata);
}

export default function MsmeRegistrationPage() {
  return <BusinessServicePage config={msmeRegistrationConfig} />;
}
