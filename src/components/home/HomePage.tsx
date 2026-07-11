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
import {
  PageMotionProvider,
  SectionReveal,
} from "@/components/common/motion/SectionReveal";

export function HomePage() {
  return (
    <PageMotionProvider>
      <main className="bg-white">
        <HeroSection />

        <div className="py-6 md:py-8 lg:py-10">
          <div className="flex flex-col">
            <SectionReveal>
              <ProductExplorer
                sectionTitles={[
                  "Get Instant Loan (Get Money in 5 Minutes -Complete Digital Process)",
                ]}
              />
            </SectionReveal>

            <SectionReveal>
              <ProductExplorer
                compactSpacing
                sectionTitles={["Explore Loan Options"]}
              />
            </SectionReveal>

            <SectionReveal>
              <CreditScoreBanner />
            </SectionReveal>

            <SectionReveal>
              <ProductExplorer
                compactSpacing
                sectionTitles={["Explore Insurance Plans"]}
              />
            </SectionReveal>

            <SectionReveal>
              <ProductExplorer
                compactSpacing
                sectionTitles={["Explore Credit Card Options"]}
              />
            </SectionReveal>
          </div>
        </div>

        <SectionReveal>
          <MajorBankCreditCards />
        </SectionReveal>

        <SectionReveal>
          <ProductExplorer
            compactSpacing
            sectionTitles={["Other financial services"]}
          />
        </SectionReveal>

        <SectionReveal>
          <PartnersStrip />
        </SectionReveal>
        <SectionReveal distance={24}>
          <EmiCalculator />
        </SectionReveal>
        <SectionReveal>
          <WhyChoose />
        </SectionReveal>
        <SectionReveal>
          <Testimonials />
        </SectionReveal>
        <SectionReveal>
          <RecentBlogs />
        </SectionReveal>
        <SectionReveal>
          <MediaPressRelease />
        </SectionReveal>
        <SectionReveal>
          <VideoTestimonials />
        </SectionReveal>
        <SectionReveal>
          <HomeLoanOffers />
        </SectionReveal>
        <SectionReveal>
          <AppDownloadBanner />
        </SectionReveal>
        <LoanExpertPopupHost />
      </main>
    </PageMotionProvider>
  );
}
