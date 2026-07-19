import type { Metadata } from "next";
import { BusinessServicePage } from "@/components/services/business/BusinessServicePage";
import { projectReportConfig } from "@/components/services/business/businessServiceData";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Project Report for Bank Loan & Business Funding | Fintaraa",
  description:
    "Request a professional project report with financial projections for bank loans, MUDRA, PMEGP, funding and business planning.",
  alternates: { canonical: "/project-report" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/project-report", fallbackMetadata);
}

export default function ProjectReportPage() {
  return <BusinessServicePage config={projectReportConfig} />;
}
