"use client";

import { HeroSection } from "./HeroSection";
import { HomeBannerCarousel } from "./HomeBannerCarousel";
import { SmartActionBar } from "./SmartActionBar";
import { BankPartnersShowcase } from "./BankPartnersShowcase";
import { LoansMarketplace } from "./LoansMarketplace";
import { CreditCardMarketplace } from "./CreditCardMarketplace";
import { CreditScoreSection } from "./CreditScoreSection";
import { InsuranceMarketplace } from "./InsuranceMarketplace";
import { FinancialCalculatorsSection } from "./FinancialCalculatorsSection";
import { LoanRatesShowcase } from "./LoanRatesShowcase";
import { PartnersStrip } from "./PartnersStrip";
import { WhyChoose } from "./WhyChoose";
import { Testimonials } from "./Testimonials";
import { VideoTestimonials } from "./VideoTestimonials";
import { RecentBlogs } from "./Blogs";
import { AppDownloadBanner } from "../common/layout/Footer";
import { LoanExpertPopupHost } from "./LoanExpertPopup";
import {
  PageMotionProvider,
  SectionReveal,
} from "@/components/common/motion/SectionReveal";

export function HomePage() {
  return (
    <PageMotionProvider>
      <main className="bg-white text-[#0f172a]">
        {/* Top Hero & Banner Carousel with responsive ordering (Banner first on mobile, Hero first on desktop) */}
        <div className="flex flex-col">
          <div className="order-2 lg:order-1">
            <HeroSection />
          </div>
          <div className="order-1 lg:order-2">
            <HomeBannerCarousel />
          </div>
        </div>

        {/* 3. Smart Financial Action Bar: 5 horizontal 1-click tools */}
        <SectionReveal>
          <SmartActionBar />
        </SectionReveal>

        {/* 3.5. Bank Partners Showcase: Live rates marquee from 30+ banks */}
        <SectionReveal>
          <BankPartnersShowcase />
        </SectionReveal>

        {/* 4. Loans Marketplace: "Find the right loan for you" with tabs & verified rate cards */}
        <SectionReveal>
          <LoansMarketplace />
        </SectionReveal>

        {/* 5. Credit Cards: "Find a credit card that fits your lifestyle" with filter chips */}
        <SectionReveal>
          <CreditCardMarketplace />
        </SectionReveal>

        {/* 6. Credit Score Section: "Know your credit score. Know your financial power." */}
        <SectionReveal>
          <CreditScoreSection />
        </SectionReveal>

        {/* 7. Insurance: "Protect what matters" with compact category cards */}
        <SectionReveal>
          <InsuranceMarketplace />
        </SectionReveal>

        {/* 8. Financial Calculators: "Make smarter financial decisions" with interactive sliders */}
        <SectionReveal>
          <FinancialCalculatorsSection />
        </SectionReveal>

        {/* 9. Loan Rates Showcase: "Home Loans from 7.10%* Only with Fintaraa" */}
        <SectionReveal>
          <LoanRatesShowcase />
        </SectionReveal>

        {/* 10. Partner Banks & Financial Institutions Strip */}
        <SectionReveal>
          <PartnersStrip />
        </SectionReveal>

        {/* 11. Proof & Trust: Why Fintaraa numerical stats & 3-step process */}
        <SectionReveal>
          <WhyChoose />
        </SectionReveal>

        {/* 12. Customer Reviews */}
        <SectionReveal>
          <Testimonials />
        </SectionReveal>

        {/* 13. Video Stories & Real Customer Testimonials */}
        <SectionReveal>
          <VideoTestimonials />
        </SectionReveal>

        {/* 14. Financial Insights & Blogs */}
        <SectionReveal>
          <RecentBlogs />
        </SectionReveal>

        {/* 17. App Download Banner */}
        <SectionReveal>
          <AppDownloadBanner />
        </SectionReveal>

        {/* 18. Loan Expert Modal Host */}
        <LoanExpertPopupHost />
      </main>
    </PageMotionProvider>
  );
}
export default HomePage;
