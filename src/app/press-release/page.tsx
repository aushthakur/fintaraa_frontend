import type { Metadata } from "next";
import { KnowledgeListingPage } from "@/components/knowledge/KnowledgeListingPage";
import { pressReleaseConfig } from "@/components/knowledge/knowledgePageConfig";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Press Releases and Media Updates",
  description:
    "Read Fintaraa press releases, company news, product updates, and partner-led financial marketplace announcements.",
  alternates: { canonical: "/press-release" },
  openGraph: {
    title: "Press Releases and Media Updates | Fintaraa",
    description:
      "Company news, product updates, and media announcements from Fintaraa.",
    url: "/press-release",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/press-release", fallbackMetadata);
}

export default function PressReleasePage() {
  return <KnowledgeListingPage config={pressReleaseConfig} />;
}
