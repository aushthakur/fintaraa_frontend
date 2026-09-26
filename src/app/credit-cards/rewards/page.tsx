import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CreditCardCategoryPage } from "@/components/credit-cards/CreditCardCategoryPage";

const fallbackMetadata: Metadata = {
  title: "Best Rewards Credit Cards in India - Compare Points & Benefits",
  description:
    "Explore and compare top rewards credit cards in India. Earn accelerated reward points, milestone shopping vouchers, and travel privileges on Fintaraa.",
  alternates: {
    canonical: "/credit-cards/rewards",
  },
  openGraph: {
    title: "Best Rewards Credit Cards in India | Fintaraa",
    description:
      "Explore and compare top rewards credit cards in India. Earn accelerated reward points and milestone benefits.",
    url: "/credit-cards/rewards",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/credit-cards/rewards", fallbackMetadata);
}

export default function RewardsCreditCardsPage() {
  return <CreditCardCategoryPage slug="rewards" />;
}
