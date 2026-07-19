import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { LegalPolicyPage } from "@/components/legal/LegalPolicyPage";
import { legalPages } from "@/data/legalPages";

const fallbackMetadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how Fintaraa collects, uses, shares, secures, stores, and lets you withdraw consent for your information.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/privacy-policy", fallbackMetadata);
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPolicyPage
      content={legalPages.privacy}
      eyebrow="Privacy & Data Protection"
      canonicalPath="/privacy-policy"
      simpleHeader
    />
  );
}
