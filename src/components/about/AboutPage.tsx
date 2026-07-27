"use client";

import { AboutHero } from "./AboutHero";
import { AboutVision } from "./AboutVision";
import { MotionConfig } from "framer-motion";
import { AboutDetails } from "./AboutDetails";
import { AboutLeadership } from "./AboutLeadership";

export function AboutPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="about-page bg-white text-[#101828]">
        <AboutHero />
        <AboutLeadership />
        <AboutDetails />
        <AboutVision />
      </main>
    </MotionConfig>
  );
}
