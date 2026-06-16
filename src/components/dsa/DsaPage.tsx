import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { DsaFaq } from "./DsaFaq";
import { DsaHero } from "./DsaHero";
import { DsaWhyChoose } from "./DsaWhyChoose";
import { DsaHowItWorks } from "./DsaHowItWorks";
import { DsaPartnerBenefits } from "./DsaPartnerBenefits";

export function DsaPage() {
  return (
    <main className="block text-[44px] font-[800] text-[#2B2F38]">
      <DsaHero />
      <DsaHowItWorks />
      <DsaPartnerBenefits />
      <DsaWhyChoose />
      <DsaFaq />
      <AppDownloadBanner />
    </main>
  );
}