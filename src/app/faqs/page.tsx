import type { Metadata } from "next";
import { FaqPage } from "@/components/faq/FaqPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers about Fintaraa loans, credit cards, insurance, applications, support and business services.",
  alternates: { canonical: "/faqs" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/faqs", fallbackMetadata);
}

export default function FaqRoute() {
  return <FaqPage />;
}
