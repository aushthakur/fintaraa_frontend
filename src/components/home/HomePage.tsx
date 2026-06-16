import { WhyChoose } from "./WhyChoose";
import { HeroSection } from "./HeroSection";
import { Testimonials } from "./Testimonials";
import { EmiCalculator } from "./EmiCalculator";
import { PartnersStrip } from "./PartnersStrip";
import { ProductExplorer } from "./ProductExplorer";
import { EligibilitySection } from "./EligibilitySection";
import { MajorBankCreditCards } from "./MajorBanksCreditCards";
import { AppDownloadBanner } from "../common/layout/Footer";
import { CreditScoreBanner } from "./CreditScoreBanner";
import { RecentBlogs } from "./Blogs";
import { MediaPressRelease } from "./MediaPressRelease";
import { VideoTestimonials } from "./VideoTestimonials";
import { HomeLoanOffers } from "./HomeLoanOffers";

export function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />

      <div className=" py-12 md:py-16">
        {/* Global Centered Main Title Header */}
        <div className="mx-auto max-w-9xl px-6 lg:px-8 mb-10">
          <div className="text-center">
            <h1 className="text-[32px] font-bold tracking-tight text-[#212529] md:text-[38px] lg:text-[42px] leading-tight">
              Explore Our Products & Services
            </h1>
          </div>
        </div>

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

      <EligibilitySection />

      {/* <CreditScoreMinuteBanner /> */}

      <PartnersStrip />
      <EmiCalculator />
      <WhyChoose />
      <Testimonials />
      <RecentBlogs />
      <MediaPressRelease />
      <VideoTestimonials />
      <HomeLoanOffers />
      <AppDownloadBanner />
    </main>
  );
}
