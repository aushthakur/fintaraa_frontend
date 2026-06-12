import type { Metadata } from "next";
import { CibilReportPage } from "@/components/cibil-report/CibilReportPage";

export const metadata: Metadata = {
  title: "CIBIL Score Report",
  description:
    "Review your credit score report, bureau comparison, eligible offers, and improvement tips.",
};

export default function Page() {
  return <CibilReportPage />;
}
