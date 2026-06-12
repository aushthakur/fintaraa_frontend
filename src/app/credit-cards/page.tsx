import type { Metadata } from "next";
import { CreditCardsPage } from "@/components/credit-cards/CreditCardsPage";

export const metadata: Metadata = {
  title: "Credit Cards",
  description:
    "Compare credit cards, check eligibility, and apply for the best card offers on Fintaraa.",
};

export default function Page() {
  return <CreditCardsPage />;
}
