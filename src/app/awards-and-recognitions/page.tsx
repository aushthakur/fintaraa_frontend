import type { Metadata } from "next";
import { AwardsRecognitionsPage } from "@/components/about/AwardsRecognitionsPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { fetchWebsiteKnowledge } from "@/services/websiteKnowledge";

const fallbackMetadata: Metadata = {
  title: "Awards & Recognitions | Fintaraa",
  description:
    "Explore Fintaraa's recognition highlights, company milestones, certificate categories and credential-verification standards.",
  alternates: { canonical: "/awards-and-recognitions" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/awards-and-recognitions", fallbackMetadata);
}

export default async function AwardsPage() {
  const awards = await fetchWebsiteKnowledge({
    type: "award",
    sectionKey: "awards_recognitions",
    limit: 50,
  }).catch(() => []);
  return <AwardsRecognitionsPage awards={awards} />;
}
