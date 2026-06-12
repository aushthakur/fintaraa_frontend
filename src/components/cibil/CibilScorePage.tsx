import { CibilHero } from "./CibilHero";
import { CibilInfo } from "./CibilInfo";
import { CibilPromo } from "./CibilPromo";
import { CibilBandsSteps } from "./CibilBandsSteps";
import { CibilBenefitsFactors } from "./CibilBenefitsFactors";
import { AppDownloadBanner } from "@/components/common/layout/Footer";

export function CibilScorePage() {
  return (
    <main className="bg-white">
      <CibilHero />
      <CibilInfo />
      <CibilBandsSteps />
      <CibilBenefitsFactors />
      <CibilPromo />
      <AppDownloadBanner />
    </main>
  );
}
