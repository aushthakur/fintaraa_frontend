import type { Metadata } from "next";
import { OffersPage } from "@/components/offers/OffersPage";

export const metadata: Metadata = {
  title: "Offers & Rewards",
  description:
    "Explore exclusive bank offers, cashback rewards, and product deals on Fintaraa.",
};

export default function Page() {
  return <OffersPage />;
}
