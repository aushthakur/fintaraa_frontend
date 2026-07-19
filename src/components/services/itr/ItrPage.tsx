import { ServiceAppBanner } from "@/components/services/shared/ServiceShared";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { ItrHero } from "./ItrHero";
import { ItrInfo } from "./ItrInfo";
import { ItrDeadline } from "./ItrDeadline";
import { ServiceInformationGuide } from "@/components/services/shared/ServiceInformationGuide";
import { itrFilingGuide } from "@/components/services/shared/serviceGuideData";

export function ItrPage() {
  return (
    <main className="bg-white">
      <ItrHero />
      <ItrInfo />
      <ItrDeadline />
      <ServiceInformationGuide
        config={itrFilingGuide}
        formAnchor="itr-filing-service-form"
      />
      <ServiceRequestTracker
        sectionId="itr-filing-status"
        title="Track Your ITR Filing Status"
        idLabel="ITR Query ID"
        serviceType="itr_filing"
      />
      <ServiceAppBanner />
    </main>
  );
}
