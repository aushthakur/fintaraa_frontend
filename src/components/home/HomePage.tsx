import { RecentBlogs } from "./Blogs";
import { WhyChoose } from "./WhyChoose";
import { HeroSection } from "./HeroSection";
import { Testimonials } from "./Testimonials";
import { EmiCalculator } from "./EmiCalculator";
import { PartnersStrip } from "./PartnersStrip";
import { HomeLoanOffers } from "./HomeLoanOffers";
import { ProductExplorer } from "./ProductExplorer";
import { MediaPressRelease } from "./MediaPressRelease";
import { CreditScoreBanner } from "./CreditScoreBanner";
import { LoanExpertPopupHost } from "./LoanExpertPopup";
import { VideoTestimonials } from "./VideoTestimonials";
import { AppDownloadBanner } from "../common/layout/Footer";
import { MajorBankCreditCards } from "./MajorBanksCreditCards";

export function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />

      <div className="py-6 md:py-8 lg:py-10">
        {/* Sequential Dynamic Horizontal Rows */}
        <div className="flex flex-col">
          {/* Row 1: Get Instant Loan - Banks */}
          <ProductExplorer
            sectionTitles={[
              "Get Instant Loan (Get Money in 5 Minutes -Complete Digital Process)",
            ]}
          />

          {/* Row 2: All Loans */}
          <ProductExplorer
            compactSpacing
            sectionTitles={["Explore Loan Options"]}
          />

          <CreditScoreBanner />

          {/* Row 3: Insurance Plans */}
          <ProductExplorer
            compactSpacing
            sectionTitles={["Explore Insurance Plans"]}
          />

          {/* Row 4: Credit Card Options */}
          <ProductExplorer
            compactSpacing
            sectionTitles={["Explore Credit Card Options"]}
          />
        </div>
      </div>

      <MajorBankCreditCards />

      <ProductExplorer
        compactSpacing
        sectionTitles={["Other financial services"]}
      />

      <PartnersStrip />
      <EmiCalculator />
      <WhyChoose />
      <Testimonials />
      <RecentBlogs />
      <MediaPressRelease />
      <VideoTestimonials />
      <HomeLoanOffers />
      <AppDownloadBanner />
      <LoanExpertPopupHost />
    </main>
  );
}
