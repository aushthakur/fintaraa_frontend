import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { DsaWhyChoose } from "@/components/dsa/DsaWhyChoose";
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
      <FaqAccordion
      />
      <AppDownloadBanner />
    </main>
  );
}
