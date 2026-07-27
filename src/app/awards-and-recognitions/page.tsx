import type { Metadata } from "next";
import { AwardsRecognitionsPage } from "@/components/about/AwardsRecognitionsPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Awards & Recognitions | Fintaraa",
  description:
    "Explore the milestones, service standards and partner confidence that shape Fintaraa's recognition journey.",
  alternates: { canonical: "/awards-and-recognitions" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/awards-and-recognitions", fallbackMetadata);
}

export default function AwardsPage() {
  return <AwardsRecognitionsPage />;
}
