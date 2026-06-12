import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { DsaFaq } from "./DsaFaq";
import { DsaHero } from "./DsaHero";
import { DsaJourney } from "./DsaJourney";
import { DsaWhyChoose } from "./DsaWhyChoose";
import { DsaHowItWorks } from "./DsaHowItWorks";
import { DsaPartnerBenefits } from "./DsaPartnerBenefits";

export function DsaPage() {
  return (
    <main className="bg-white">
      <DsaHero />
      <DsaHowItWorks />
      <DsaPartnerBenefits />
      <DsaWhyChoose />
      <DsaFaq />
      <DsaJourney />
      <AppDownloadBanner />
    </main>
  );
}
