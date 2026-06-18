import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CreditCardsPage } from "@/components/credit-cards/CreditCardsPage";

const fallbackMetadata: Metadata = {
  title: "Credit Cards",
  description:
    "Compare credit cards, check eligibility, and apply for the best card offers on Fintaraa.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/credit-cards", fallbackMetadata);
}

export default function Page() {
  return <CreditCardsPage />;
}
