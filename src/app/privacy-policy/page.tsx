import type { Metadata } from "next";
import { LegalPolicyPage } from "@/components/legal/LegalPolicyPage";
import { legalPages } from "@/data/legalPages";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how Fintaraa collects, uses, shares, and safeguards information across loan, credit card, and insurance journeys.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPolicyPage
      content={legalPages.privacy}
      eyebrow="Privacy & Data Protection"
      canonicalPath="/privacy-policy"
    />
  );
}
