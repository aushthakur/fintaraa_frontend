import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FranchiseFaq } from "./FranchiseFaq";
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
      <FranchiseFaq />
      <AppDownloadBanner />
    </main>
  );
}
