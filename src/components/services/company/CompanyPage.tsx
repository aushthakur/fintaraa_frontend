import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { DsaWhyChoose } from "@/components/dsa/DsaWhyChoose";
import { CompanyHero } from "./CompanyHero";

export function CompanyPage() {
  return (
    <main className="bg-white">
      <CompanyHero />
      <DsaWhyChoose />
      <ServiceRequestTracker
        title="Track Your Company Registration Status"
        idLabel="Company Query ID"
        serviceType="company_registration"
      />
      <AppDownloadBanner />
    </main>
  );
}
