import type { Metadata } from "next";
import { legalPages } from "@/data/legalPages";
import { LegalPolicyPage } from "@/components/legal/LegalPolicyPage";

export const metadata: Metadata = {
  title: "Grievance Redressal Policy",
  description:
    "Read Fintaraa's grievance redressal process for complaints across loans, insurance, payments, data rights, and partner journeys.",
};

export default function GrievancePage() {
  return (
    <LegalPolicyPage
      content={legalPages.grievance}
      eyebrow="Complaint Resolution"
      canonicalPath="/grievance"
    />
  );
}
