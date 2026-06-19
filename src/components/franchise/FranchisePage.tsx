import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
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
      <ServiceRequestTracker
        title="Track Your Franchise Status"
        idLabel="Franchise Query ID"
        serviceType="franchise_partner"
      />
      <FranchiseWhyChoose />
      <FaqAccordion />
      <AppDownloadBanner />
    </main>
  );
}
