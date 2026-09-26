import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CreditCardCategoryPage } from "@/components/credit-cards/CreditCardCategoryPage";

const fallbackMetadata: Metadata = {
  title: "Best Cashback Credit Cards in India - Online Shopping & Utility Bill Savings",
  description:
    "Compare the best cashback credit cards in India with up to 5% unlimited cashback on Amazon, Flipkart, Swiggy, and utility bill payments on Fintaraa.",
  alternates: {
    canonical: "/credit-cards/cashback",
  },
  openGraph: {
    title: "Best Cashback Credit Cards in India | Fintaraa",
    description:
      "Compare the best cashback credit cards in India with up to 5% unlimited cashback on online shopping and bill payments.",
    url: "/credit-cards/cashback",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/credit-cards/cashback", fallbackMetadata);
}

export default function CashbackCreditCardsPage() {
  return <CreditCardCategoryPage slug="cashback" />;
}
