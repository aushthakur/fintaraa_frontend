import { ServiceAppBanner } from "@/components/services/shared/ServiceShared";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { ItrHero } from "./ItrHero";
import { ItrInfo } from "./ItrInfo";
import { ItrDeadline } from "./ItrDeadline";

export function ItrPage() {
  return (
    <main className="bg-white">
      <ItrHero />
      <ItrInfo />
      <ItrDeadline />
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
