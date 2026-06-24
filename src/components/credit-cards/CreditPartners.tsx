import { TrustedPartnerBanksSection } from "@/components/partners/TrustedPartnerBanksSection";

export function CreditPartners() {
  return (
    <TrustedPartnerBanksSection
      mode="grid"
      className="md:px-8 lg:px-16"
      viewAllHref="/partners/all"
    />
  );
}
