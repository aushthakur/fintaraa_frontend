import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { legalPages } from "@/data/legalPages";
import { LegalPolicyPage } from "@/components/legal/LegalPolicyPage";

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
    <LegalPolicyPage
      content={legalPages.grievance}
      eyebrow="Complaint Resolution"
      canonicalPath="/grievance"
      simpleHeader
    />
  );
}
