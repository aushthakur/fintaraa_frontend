import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { FranchiseHero } from "./FranchiseHero";
import { FranchiseModel } from "./FranchiseModel";
import { FranchiseBenefits } from "./FranchiseBenefits";
import { FranchiseWhyChoose } from "./FranchiseWhyChoose";

export function FranchisePage() {
  return (
    <main className="bg-white">
      <FranchiseHero />
      <FranchiseModel />
      <FranchiseBenefits />
      <FranchiseWhyChoose />
       <FaqAccordion/>
      <AppDownloadBanner />
    </main>
  );
}
