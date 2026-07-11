"use client";

import { AboutHero } from "./AboutHero";
import { AboutVision } from "./AboutVision";
import { MotionConfig } from "framer-motion";
import { AboutDetails } from "./AboutDetails";

export function AboutPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="about-page bg-white text-[#101828]">
        <AboutHero />
        <AboutDetails />
        <AboutVision />
      </main>
    </MotionConfig>
  );
}
