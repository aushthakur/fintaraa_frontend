import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Fintaraa | Loans, Cards, Insurance & Financial Services",
  description:
    "Compare loans, credit cards, insurance, CIBIL support, registrations, and assisted financial services with Fintaraa.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/", fallbackMetadata);
}

export default function Home() {
  return <HomePage />;
}
