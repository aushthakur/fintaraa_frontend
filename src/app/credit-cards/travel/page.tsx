import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CreditCardCategoryPage } from "@/components/credit-cards/CreditCardCategoryPage";

const fallbackMetadata: Metadata = {
  title: "Best Travel & Airport Lounge Credit Cards in India - Forex & Miles",
  description:
    "Compare top travel credit cards in India offering complimentary domestic and international airport lounge access, low forex markup, and air miles on Fintaraa.",
  alternates: {
    canonical: "/credit-cards/travel",
  },
  openGraph: {
    title: "Best Travel & Airport Lounge Credit Cards in India | Fintaraa",
    description:
      "Compare top travel credit cards in India offering complimentary domestic and international airport lounge access and low forex markup.",
    url: "/credit-cards/travel",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/credit-cards/travel", fallbackMetadata);
}

export default function TravelCreditCardsPage() {
  return <CreditCardCategoryPage slug="travel" />;
}
