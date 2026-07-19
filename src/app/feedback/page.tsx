import type { Metadata } from "next";
import { FeedbackPage } from "@/components/feedback/FeedbackPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Share Feedback",
  description:
    "Share feedback about your Fintaraa website, product, support, or business-service experience.",
  alternates: { canonical: "/feedback" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/feedback", fallbackMetadata);
}

export default function FeedbackRoute() {
  return <FeedbackPage />;
}
