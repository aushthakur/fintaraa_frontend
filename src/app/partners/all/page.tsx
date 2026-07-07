import type { Metadata } from "next";
import { TrustedPartnerBanksSection } from "@/components/partners/TrustedPartnerBanksSection";

export const metadata: Metadata = {
  title: "All Partner Banks & NBFCs | Fintaraa",
  description:
    "Browse all Fintaraa partner banks and NBFCs for loans, insurance, credit cards, and credit bureau assisted journeys.",
};

export default function AllPartnersPage() {
  return (
    <main className="bg-white">
      <TrustedPartnerBanksSection
        mode="grid"
        defaultShowAll
        showViewAllAction={false}
        title="All Trusted Partner Banks & NBFCs"
        description="Filter by product category or open any partner directly from the logo grid."
        className="pt-10"
      />
    </main>
  );
}
