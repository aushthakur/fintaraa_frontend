import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CreditArticlesFaq } from "./CreditArticlesFaq";
import { CreditCardsExplorer } from "./CreditCardsExplorer";
import { CreditCardsHero } from "./CreditCardsHero";
import { CreditCardsStats } from "./CreditCardsStats";
import { CreditEligibility } from "./CreditEligibility";
import { CreditPartners } from "./CreditPartners";

export function CreditCardsPage() {
  return (
    <main className="bg-white">
      <CreditCardsHero />
      <CreditCardsStats />
      <CreditCardsExplorer />
      <CreditEligibility />
      <CreditPartners />
      <CreditArticlesFaq />
      <AppDownloadBanner />
    </main>
  );
}
