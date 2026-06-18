import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CreditCardsExplorer } from "./CreditCardsExplorer";
import { CreditCardsHero } from "./CreditCardsHero";
import { CreditCardsStats } from "./CreditCardsStats";
import { CreditEligibility } from "./CreditEligibility";
import { CreditPartners } from "./CreditPartners";
import { FaqAccordion } from "../common/FaqAccordion";
import { ExploreCategories } from "./CategoryCardsGrid";

export function CreditCardsPage() {
  return (
    <main className="bg-white">
      <CreditCardsHero />
      <CreditCardsStats />
      <ExploreCategories />
      <CreditCardsExplorer />
      <CreditEligibility />
      <CreditPartners />
      <FaqAccordion />
      <AppDownloadBanner />
    </main>
  );
}
