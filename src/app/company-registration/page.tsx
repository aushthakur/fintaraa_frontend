import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CompanyPage } from "@/components/services/company/CompanyPage";

const fallbackMetadata: Metadata = {
  title: "Company Formation & Trademark Registration",
  description:
    "Register your company, LLP, OPC, or trademark with assisted legal support from Fintaraa.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/company-registration", fallbackMetadata);
}

export default function Page() {
  return <CompanyPage />;
}
