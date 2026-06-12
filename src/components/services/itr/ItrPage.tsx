import {
  ServiceAppBanner,
  ServiceStatusCard,
  ServiceTimeline,
} from "@/components/services/shared/ServiceShared";
import { ItrHero } from "./ItrHero";
import { ItrInfo } from "./ItrInfo";
import { ItrDeadline } from "./ItrDeadline";

export function ItrPage() {
  return (
    <main className="bg-white">
      <ItrHero />
      <ItrInfo />
      <ItrDeadline />
      <ServiceStatusCard
        title="Track Your Inquiry Status"
        idLabel="Inquiry ID"
      />
      <ServiceTimeline title="Track Your ITR filling Status" />
      <ServiceAppBanner />
    </main>
  );
}
