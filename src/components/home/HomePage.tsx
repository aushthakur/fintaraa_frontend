import { WhyChoose } from "./WhyChoose";
import { HeroSection } from "./HeroSection";
import { Testimonials } from "./Testimonials";
import { EmiCalculator } from "./EmiCalculator";
import { PartnersStrip } from "./PartnersStrip";
import { ProductExplorer } from "./ProductExplorer";
import { EligibilitySection } from "./EligibilitySection";
import {
  CreditScoreMinuteBanner,
  HomeLoanOffers,
  HomeMediaSections,
  MajorBankCreditCards,
} from "./HomeFigmaAdditions";
import { AppDownloadBanner } from "../common/layout/Footer";

export function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <ProductExplorer sectionTitles={["Explore Loan Options"]} />
      <CreditScoreMinuteBanner />
      <ProductExplorer
        compactSpacing
        sectionTitles={["Explore Insurance Plans"]}
      />
      <ProductExplorer
        compactSpacing
        sectionTitles={["Explore Credit Card Options"]}
      />
      <MajorBankCreditCards />
      <ProductExplorer
        compactSpacing
        sectionTitles={["Explore Additional Services"]}
      />
      <EligibilitySection />
      <PartnersStrip />
      <EmiCalculator />
      <WhyChoose />
      <Testimonials />
      <HomeMediaSections />
      <HomeLoanOffers />
      <AppDownloadBanner />
    </main>
  );
}
