import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { LegalPolicyPage } from "@/components/legal/LegalPolicyPage";
import { legalPages } from "@/data/legalPages";

const fallbackMetadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the Fintaraa terms for using loan, credit card, insurance, KYC, bureau, and partner fulfilment services.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/terms-and-conditions", fallbackMetadata);
}

export default function TermsAndConditionsPage() {
  return (
    <LegalPolicyPage
      content={legalPages.terms}
      eyebrow="Terms of Service"
      canonicalPath="/terms-and-conditions"
      simpleHeader
    />
  );
}
