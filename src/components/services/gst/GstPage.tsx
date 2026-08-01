import { ServiceAppBanner } from "@/components/services/shared/ServiceShared";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { GstHero } from "./GstHero";
import { GstInformationGuide } from "./GstInformationGuide";
import { GstServices } from "./GstServices";

export function GstPage() {
  return (
    <main className="bg-white">
      <GstHero />
      <GstServices />
      <GstInformationGuide />
      <ServiceRequestTracker
        title="Track Your GST Registration Status"
        idLabel="GST Query ID"
        serviceType="gst_registration"
        deferCreatedRequestDisplay
      />
      <ServiceAppBanner />
    </main>
  );
}
