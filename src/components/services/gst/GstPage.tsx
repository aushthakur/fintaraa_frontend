import { ServiceAppBanner } from "@/components/services/shared/ServiceShared";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { GstHero } from "./GstHero";
import { GstServices } from "./GstServices";

export function GstPage() {
  return (
    <main className="bg-white">
      <GstHero />
      <GstServices />
      <ServiceRequestTracker
        title="Track Your GST Registration Status"
        idLabel="GST Query ID"
        serviceType="gst_registration"
      />
      <ServiceAppBanner />
    </main>
  );
}
