import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { OffersPage } from "@/components/offers/OffersPage";

const fallbackMetadata: Metadata = {
  title: "Offers & Rewards",
  description:
    "Explore exclusive bank offers, cashback rewards, and product deals on Fintaraa.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/offers", fallbackMetadata);
}

export default function Page() {
  return <OffersPage />;
}
