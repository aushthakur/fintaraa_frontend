import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { DsaHero } from "./DsaHero";
import { DsaWhyChoose } from "./DsaWhyChoose";
import { DsaHowItWorks } from "./DsaHowItWorks";
import { DsaOfferings } from "./DsaOfferings";
import { DsaPartnerBenefits } from "./DsaPartnerBenefits";
import { DsaTestimonials } from "./DsaTestimonials";

export function DsaPage() {
  return (
    <main className="bg-[#fbfdff] text-[#2a2f36]">
      <DsaHero />
      <DsaHowItWorks />
      <DsaOfferings />
      <DsaPartnerBenefits />
      <ServiceRequestTracker
        title="Track Your DSA Partner Status"
        idLabel="DSA Query ID"
        serviceType="dsa_partner"
        requireLogin
      />
      <DsaWhyChoose />
      <DsaTestimonials />
      <FaqAccordion />
      <AppDownloadBanner />
    </main>
  );
}
