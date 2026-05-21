import { WhyChoose } from "./WhyChoose";
import { HowItWorks } from "./HowItWorks";
import { HeroSection } from "./HeroSection";
import { Testimonials } from "./Testimonials";
import { EmiCalculator } from "./EmiCalculator";
import { PartnersStrip } from "./PartnersStrip";
import { ProductExplorer } from "./ProductExplorer";
import { FinancialInsights } from "./FinancialInsights";
import { EligibilitySection } from "./EligibilitySection";
import { AppDownloadBanner } from "../common/layout/Footer";

export function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <EligibilitySection />
      <ProductExplorer />
      <PartnersStrip />
      <EmiCalculator />
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <FinancialInsights />
      <AppDownloadBanner />
    </main>
  );
}
