import {
  ServiceAppBanner,
  ServiceStatusCard,
  ServiceTimeline,
} from "@/components/services/shared/ServiceShared";
import { GstHero } from "./GstHero";
import { GstServices } from "./GstServices";

export function GstPage() {
  return (
    <main className="bg-white">
      <GstHero />
      <GstServices />
      <ServiceStatusCard
        title="Track Your GST Registration Status"
        idLabel="Registration Number"
      />
      <ServiceTimeline title="Track Your GST Registration Status" />
      <ServiceAppBanner />
    </main>
  );
}
