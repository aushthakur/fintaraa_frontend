import type { Metadata } from "next";
import { KnowledgeListingPage } from "@/components/knowledge/KnowledgeListingPage";
import { videoTestimonialsConfig } from "@/components/knowledge/knowledgePageConfig";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Video Testimonials",
  description:
    "Watch Fintaraa customer video testimonials across loans, credit cards, insurance, and assisted financial journeys.",
  alternates: { canonical: "/video-testimonials" },
  openGraph: {
    title: "Video Testimonials | Fintaraa",
    description:
      "Customer stories from Fintaraa loan, credit card, and insurance journeys.",
    url: "/video-testimonials",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/video-testimonials", fallbackMetadata);
}

export default function VideoTestimonialsPage() {
  return <KnowledgeListingPage config={videoTestimonialsConfig} />;
}
