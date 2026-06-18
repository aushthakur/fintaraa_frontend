import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CibilReportPage } from "@/components/cibil-report/CibilReportPage";

const fallbackMetadata: Metadata = {
  title: "CIBIL Score Report",
  description:
    "Review your credit score report, bureau comparison, eligible offers, and improvement tips.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/cibil-score/report", fallbackMetadata);
}

export default function Page() {
  return <CibilReportPage />;
}
