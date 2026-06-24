import type { Metadata } from "next";
import { KnowledgeListingPage } from "@/components/knowledge/KnowledgeListingPage";
import { clientTestimonialsConfig } from "@/components/knowledge/knowledgePageConfig";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Client Testimonials",
  description:
    "Read Fintaraa client testimonials across assisted loans, credit cards, insurance, eligibility, and documentation support.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Client Testimonials | Fintaraa",
    description:
      "Customer experiences from Fintaraa assisted financial journeys.",
    url: "/testimonials",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/testimonials", fallbackMetadata);
}

export default function TestimonialsPage() {
  return <KnowledgeListingPage config={clientTestimonialsConfig} />;
}
