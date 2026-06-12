import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { OfferCards } from "./OfferCards";
import { OfferDetail } from "./OfferDetail";
import { OffersHero } from "./OffersHero";

export function OffersPage() {
  return (
    <main className="bg-white">
      <OffersHero />
      <OfferCards />
      <OfferDetail />
      <AppDownloadBanner />
    </main>
  );
}
