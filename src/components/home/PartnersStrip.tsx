import { TrustedPartnerBanksSection } from "@/components/partners/TrustedPartnerBanksSection";

export function PartnersStrip() {
  return (
    <TrustedPartnerBanksSection
      mode="grid"
      title="Trusted by India's Leading Financial Institutions"
      description="Compare offers from 30+ verified banks, NBFCs and credit bureaus in one secure platform."
      viewAllHref="/partners/all"
      flushX
      mobileScroller
    />
  );
}
