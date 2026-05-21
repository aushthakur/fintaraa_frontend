import type { Metadata } from "next";
import { LegalPolicyPage } from "@/components/legal/LegalPolicyPage";
import { legalPages } from "@/data/legalPages";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the Fintaraa terms for using loan, credit card, insurance, KYC, bureau, and partner fulfilment services.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPolicyPage
      content={legalPages.terms}
      eyebrow="Terms of Service"
      canonicalPath="/terms-and-conditions"
    />
  );
}
