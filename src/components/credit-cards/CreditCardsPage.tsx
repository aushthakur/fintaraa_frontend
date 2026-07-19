"use client";

import { useState } from "react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CreditCardsExplorer } from "./CreditCardsExplorer";
import {
  CreditCardRecommendation,
  CreditCardsHero,
} from "./CreditCardsHero";
import { CreditCardsStats } from "./CreditCardsStats";
import { CreditEligibility } from "./CreditEligibility";
import { CreditPartners } from "./CreditPartners";
import { FaqAccordion } from "../common/FaqAccordion";
import { ExploreCategories } from "./CategoryCardsGrid";
import {
  PageMotionProvider,
  SectionReveal,
} from "@/components/common/motion/SectionReveal";

export function CreditCardsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [recommendation, setRecommendation] =
    useState<CreditCardRecommendation | null>(null);

  const revealResults = () => {
    window.setTimeout(() => {
      document
        .getElementById("credit-card-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategories((current) =>
      current.length === 1 && current[0] === category ? [] : [category],
    );
    revealResults();
  };

  const handleRecommendation = (value: CreditCardRecommendation) => {
    setRecommendation(value);
    revealResults();
  };

  return (
    <PageMotionProvider>
      <main className="bg-white">
        <SectionReveal distance={12}>
          <CreditCardsHero onOffersRequested={handleRecommendation} />
        </SectionReveal>
        <SectionReveal distance={12}>
          <CreditCardsStats />
        </SectionReveal>
        <SectionReveal>
          <ExploreCategories
            selectedCategories={selectedCategories}
            onSelect={handleCategorySelect}
            onViewAll={() => {
              setSelectedCategories([]);
              revealResults();
            }}
          />
        </SectionReveal>
        <SectionReveal>
          <div id="credit-card-results" className="scroll-mt-24">
            <CreditCardsExplorer
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              recommendation={recommendation}
              onClearRecommendation={() => setRecommendation(null)}
            />
          </div>
        </SectionReveal>
        <SectionReveal>
          <CreditEligibility
            onOffersRequested={handleRecommendation}
            onCategorySelect={(category) => setSelectedCategories([category])}
          />
        </SectionReveal>
        <SectionReveal>
          <CreditPartners />
        </SectionReveal>
        <SectionReveal>
          <FaqAccordion />
        </SectionReveal>
        <SectionReveal>
          <AppDownloadBanner />
        </SectionReveal>
      </main>
    </PageMotionProvider>
  );
}
