import { TrustedPartnerBanksSection } from "@/components/partners/TrustedPartnerBanksSection";

export function PartnersStrip() {
  return (
    <TrustedPartnerBanksSection
      mode="grid"
      title="Partner Financial Institutions"
      description="Browse published banks, NBFCs and insurers across loan, credit-card and insurance journeys."
      viewAllHref="/partners/all"
      flushX
      mobileScroller
    />
  );
}
