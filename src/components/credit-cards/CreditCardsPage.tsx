import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CreditCardsExplorer } from "./CreditCardsExplorer";
import { CreditCardsHero } from "./CreditCardsHero";
import { CreditCardsStats } from "./CreditCardsStats";
import { CreditEligibility } from "./CreditEligibility";
import { CreditPartners } from "./CreditPartners";
import { FaqAccordion } from "../common/FaqAccordion";
import { ExploreCategories } from "./CategoryCardsGrid";
import {
  PageMotionProvider,
  SectionReveal,
} from "@/components/common/motion/SectionReveal";

export function CreditCardsPage() {
  return (
    <PageMotionProvider>
      <main className="bg-white">
        <SectionReveal distance={12}>
          <CreditCardsHero />
        </SectionReveal>
        <SectionReveal distance={12}>
          <CreditCardsStats />
        </SectionReveal>
        <SectionReveal>
          <ExploreCategories />
        </SectionReveal>
        <SectionReveal>
          <CreditCardsExplorer />
        </SectionReveal>
        <SectionReveal>
          <CreditEligibility />
        </SectionReveal>
        <SectionReveal>
          <CreditPartners />
        </SectionReveal>
        <SectionReveal>
          <FaqAccordion />
        </SectionReveal>
        <SectionReveal>
          <AppDownloadBanner />
        </SectionReveal>
      </main>
    </PageMotionProvider>
  );
}
