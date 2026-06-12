import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { DsaWhyChoose } from "@/components/dsa/DsaWhyChoose";
import { ServiceFaqSection } from "@/components/services/shared/ServiceShared";
import { CareerJobs } from "./CareerJobs";
import { CareersCulture } from "./CareersCulture";
import { CareersHero } from "./CareersHero";
import { CareersJoin } from "./CareersJoin";
import { CareersLife } from "./CareersLife";

export function CareersPage() {
  return (
    <main className="bg-white">
      <CareersHero />
      <CareersCulture />
      <CareerJobs />
      <CareersJoin />
      <CareersLife />
      <DsaWhyChoose />
      <ServiceFaqSection subtitle="Everything you need to know about our personal loans" />
      <AppDownloadBanner />
    </main>
  );
}
