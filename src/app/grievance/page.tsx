import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { GrievanceManagementPage } from "@/components/grievance/GrievanceManagementPage";

const fallbackMetadata: Metadata = {
  title: "Grievance Redressal Policy",
  description:
    "Read Fintaraa's grievance redressal process for complaints across loans, insurance, payments, data rights, and partner journeys.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/grievance", fallbackMetadata);
}

export default function GrievancePage() {
  return (
    <Suspense fallback={null}>
      <GrievanceManagementPage />
    </Suspense>
  );
}
