import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CreditCardCategoryPage } from "@/components/credit-cards/CreditCardCategoryPage";

const fallbackMetadata: Metadata = {
  title: "Best Fuel Surcharge Credit Cards in India - 1% Surcharge Waiver & Points",
  description:
    "Explore fuel credit cards in India with 1% fuel surcharge waivers across HPCL, BPCL, and IOCL pumps, free fuel redemption, and road trip benefits on Fintaraa.",
  alternates: {
    canonical: "/credit-cards/fuel",
  },
  openGraph: {
    title: "Best Fuel Surcharge Credit Cards in India | Fintaraa",
    description:
      "Explore fuel credit cards in India with 1% fuel surcharge waivers across HPCL, BPCL, and IOCL pumps on Fintaraa.",
    url: "/credit-cards/fuel",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/credit-cards/fuel", fallbackMetadata);
}

export default function FuelCreditCardsPage() {
  return <CreditCardCategoryPage slug="fuel" />;
}
