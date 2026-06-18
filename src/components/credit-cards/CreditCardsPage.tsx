import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CreditCardsExplorer } from "./CreditCardsExplorer";
import { CreditCardsHero } from "./CreditCardsHero";
import { CreditCardsStats } from "./CreditCardsStats";
import { CreditEligibility } from "./CreditEligibility";
import { CreditPartners } from "./CreditPartners";
import { FaqAccordion } from "../common/FaqAccordion";

export function CreditCardsPage() {
  return (
    <main className="bg-white">
      <CreditCardsHero />
      <CreditCardsStats />
      <CreditCardsExplorer />
      <CreditEligibility />
      <CreditPartners />
      <FaqAccordion />
      <AppDownloadBanner />
    </main>
  );
}
