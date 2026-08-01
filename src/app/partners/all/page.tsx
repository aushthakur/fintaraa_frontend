import type { Metadata } from "next";
import { TrustedPartnerBanksSection } from "@/components/partners/TrustedPartnerBanksSection";
import { fetchPublicPartners } from "@/services/partners";

export const metadata: Metadata = {
  title: "All Partner Banks, NBFCs & Insurers | Fintaraa",
  description:
    "Browse Fintaraa partner banks, NBFCs and insurers for loan, insurance and credit-card assisted journeys.",
};

export default async function AllPartnersPage() {
  const livePartners = await fetchPublicPartners().catch(() => undefined);

  return (
    <main className="bg-white">
      <TrustedPartnerBanksSection
        mode="grid"
        defaultShowAll
        showViewAllAction={false}
        title="All Partner Banks, NBFCs & Insurers"
        description="Filter the live partner directory by product category and open an institution's available journey."
        className="pt-10"
        initialPartners={livePartners}
      />
    </main>
  );
}
