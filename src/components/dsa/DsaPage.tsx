import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FaqAccordion } from "@/components/common/FaqAccordion";
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
      <DsaWhyChoose />
      <FaqAccordion
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about career opportunities at Fintaraa"
      />
      <AppDownloadBanner />
    </main>
  );
}
