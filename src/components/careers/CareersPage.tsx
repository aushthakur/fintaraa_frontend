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
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about career opportunities at Fintaraa"
      />
      <AppDownloadBanner />
    </main>
  );
}
