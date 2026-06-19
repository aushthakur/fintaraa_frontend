import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { DsaHero } from "./DsaHero";
import { DsaWhyChoose } from "./DsaWhyChoose";
import { DsaHowItWorks } from "./DsaHowItWorks";
import { DsaPartnerBenefits } from "./DsaPartnerBenefits";

export function DsaPage() {
  return (
    <main className="bg-[#fbfdff] text-[#2a2f36]">
      <DsaHero />
      <DsaHowItWorks />
      <DsaPartnerBenefits />
      <ServiceRequestTracker
        title="Track Your DSA Partner Status"
        idLabel="DSA Query ID"
        serviceType="dsa_partner"
      />
      <DsaWhyChoose />
      <FaqAccordion />
      <AppDownloadBanner />
    </main>
  );
}
